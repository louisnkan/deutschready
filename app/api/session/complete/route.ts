/**
 * Session complete API route
 * Server validates ALL answers — client never scores itself
 * Updates skill_progress and streak after completion
 */

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { validateAnswer, validateUUID } from '@/lib/utils/sanitize'
import { checkRateLimit } from '@/lib/utils/rateLimit'
import type { CompleteSessionResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Step 1 — Verify authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Step 2 — Rate limit check
    const rateLimit = await checkRateLimit(user.id, 'session_complete')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded.' },
        { status: 429 }
      )
    }

    // Step 3 — Validate request body
    const body = await request.json()
    const sessionId = validateUUID(body.session_id)

    if (!sessionId || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      )
    }

    const serviceClient = await createServiceClient()

    // Step 4 — Verify session belongs to this user
    const { data: session, error: sessionError } = await serviceClient
      .from('practice_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found.' },
        { status: 404 }
      )
    }

    // Step 5 — Fetch correct answers from database
    const questionIds = body.answers
      .map((a: unknown) => {
        if (typeof a === 'object' && a !== null && 'question_id' in a) {
          return validateUUID((a as Record<string, unknown>).question_id)
        }
        return null
      })
      .filter(Boolean)

    const { data: questions, error: questionsError } = await serviceClient
      .from('questions')
      .select('id, correct_answer, explanation, grammar_rule')
      .in('id', questionIds)

    if (questionsError || !questions) {
      return NextResponse.json(
        { error: 'Failed to validate answers.' },
        { status: 500 }
      )
    }

    // Step 6 — Score answers server-side
    const correctAnswerMap = new Map(
      questions.map((q) => [q.id, q])
    )

    let correctCount = 0
    const results: CompleteSessionResponse['results'] = []
    const answerInserts = []

    for (const answer of body.answers) {
      const questionId = validateUUID(answer.question_id)
      const userAnswer = validateAnswer(answer.user_answer)

      if (!questionId || !userAnswer) continue

      const question = correctAnswerMap.get(questionId)
      if (!question) continue

      const isCorrect = userAnswer === question.correct_answer
      if (isCorrect) correctCount++

      results.push({
        question_id: questionId,
        is_correct: isCorrect,
        correct_answer: question.correct_answer,
        explanation: question.explanation,
      })

      answerInserts.push({
        session_id: sessionId,
        user_id: user.id,
        question_id: questionId,
        user_answer: userAnswer,
        is_correct: isCorrect,
        time_taken_seconds: answer.time_taken_seconds ?? null,
      })
    }

    const scorePercentage = Math.round(
      (correctCount / results.length) * 100
    )

    // Step 7 — Save all answers and update session
    await Promise.all([
      serviceClient.from('session_answers').insert(answerInserts),
      serviceClient
        .from('practice_sessions')
        .update({
          correct_answers: correctCount,
          score_percentage: scorePercentage,
        })
        .eq('id', sessionId),
    ])

    // Step 8 — Upsert skill progress
    await serviceClient.from('skill_progress').upsert(
      {
        user_id: user.id,
        level: session.level,
        skill: session.skill,
        questions_attempted: results.length,
        questions_correct: correctCount,
        best_score: scorePercentage,
        last_practiced_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,level,skill',
        ignoreDuplicates: false,
      }
    )

    // Step 9 — Update streak
    const today = new Date().toISOString().split('T')[0]
    await serviceClient
      .from('profiles')
      .update({
        last_practice_date: today,
      })
      .eq('id', user.id)

    const response: CompleteSessionResponse = {
      score_percentage: scorePercentage,
      correct_answers: correctCount,
      total_questions: results.length,
      results,
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Session complete error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
