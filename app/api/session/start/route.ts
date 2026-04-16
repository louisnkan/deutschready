/**
 * Session start API route
 * Fetches questions server-side — correct answers never leave server
 * Validates auth, level, skill before touching database
 */

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { validateLevel, validateSkill } from '@/lib/utils/sanitize'
import { checkRateLimit } from '@/lib/utils/rateLimit'
import type { ClientQuestion, StartSessionResponse } from '@/types'

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
    const rateLimit = await checkRateLimit(user.id, 'session_start')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many sessions today. Come back tomorrow.',
          resetInMinutes: rateLimit.resetInMinutes,
        },
        { status: 429 }
      )
    }

    // Step 3 — Validate request body
    const body = await request.json()
    const level = validateLevel(body.level)
    const skill = validateSkill(body.skill)

    if (!level || !skill) {
      return NextResponse.json(
        { error: 'Invalid level or skill.' },
        { status: 400 }
      )
    }

    // Step 4 — Fetch questions server-side
    const serviceClient = await createServiceClient()
    const { data: questions, error: questionsError } = await serviceClient
      .from('questions')
      .select(
        'id, level, skill, question_text, option_a, option_b, option_c, option_d, explanation, grammar_rule, audio_url, difficulty'
      )
      .eq('level', level)
      .eq('skill', skill)
      .eq('is_active', true)
      .order('difficulty', { ascending: true })
      .limit(20)

    if (questionsError || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions available for this level and skill.' },
        { status: 404 }
      )
    }

    // Step 5 — Shuffle questions
    const shuffled = questions.sort(() => Math.random() - 0.5)

    // Step 6 — Create session record
    const { data: session, error: sessionError } = await serviceClient
      .from('practice_sessions')
      .insert({
        user_id: user.id,
        level,
        skill,
        total_questions: shuffled.length,
        correct_answers: 0,
        score_percentage: 0,
      })
      .select('id')
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Failed to create session.' },
        { status: 500 }
      )
    }

    // Step 7 — Return session ID and questions
    // correct_answer is NOT included — stripped by ClientQuestion type
    const clientQuestions: ClientQuestion[] = shuffled.map((q) => ({
      id: q.id,
      level: q.level,
      skill: q.skill,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      explanation: q.explanation,
      grammar_rule: q.grammar_rule,
      audio_url: q.audio_url,
      difficulty: q.difficulty,
    }))

    const response: StartSessionResponse = {
      session_id: session.id,
      questions: clientQuestions,
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Session start error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
