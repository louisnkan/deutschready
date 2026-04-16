/**
 * AI explanation API route
 * Called only when user gets wrong answer and taps "Explain"
 * Rate limited to 10 per hour per user
 */

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { validateUUID, validateAnswer } from '@/lib/utils/sanitize'
import { checkRateLimit } from '@/lib/utils/rateLimit'
import { generateExplanation } from '@/lib/claude/explain'

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
    const rateLimit = await checkRateLimit(user.id, 'explain')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Explanation limit reached. Resets in ${rateLimit.resetInMinutes} minutes.`,
          remaining: 0,
        },
        { status: 429 }
      )
    }

    // Step 3 — Validate inputs
    const body = await request.json()
    const questionId = validateUUID(body.question_id)
    const userAnswer = validateAnswer(body.user_answer)

    if (!questionId || !userAnswer) {
      return NextResponse.json(
        { error: 'Invalid request.' },
        { status: 400 }
      )
    }

    // Step 4 — Fetch question from database
    const serviceClient = await createServiceClient()
    const { data: question, error: questionError } = await serviceClient
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .eq('is_active', true)
      .single()

    if (questionError || !question) {
      return NextResponse.json(
        { error: 'Question not found.' },
        { status: 404 }
      )
    }

    // Step 5 — Generate explanation via Claude
    const explanation = await generateExplanation({
      questionText: question.question_text,
      optionA: question.option_a,
      optionB: question.option_b,
      optionC: question.option_c,
      optionD: question.option_d,
      correctAnswer: question.correct_answer,
      userAnswer,
      grammarRule: question.grammar_rule,
      level: question.level,
      skill: question.skill,
    })

    return NextResponse.json(
      {
        ...explanation,
        remaining: rateLimit.remaining - 1,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Explain route error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
