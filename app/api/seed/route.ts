/**
 * ONE-TIME QUESTION GENERATION SEED ROUTE
 * 
 * CRITICAL SECURITY NOTES:
 * 1. Protected by SEED_SECRET environment variable
 * 2. DELETE THIS FILE after seeding is complete
 * 3. Never expose this route in production permanently
 * 4. Call once, verify questions, then delete
 */

import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

const BATCH_SIZE = 10

const A1_TOPICS = {
  grammatik: [
    'definite articles (der, die, das) in nominative case',
    'indefinite articles (ein, eine) in nominative case',
    'personal pronouns (ich, du, er, sie, es, wir, ihr, sie)',
    'present tense verb conjugation (sein, haben)',
    'present tense regular verb conjugation',
    'present tense irregular verbs (fahren, laufen, essen)',
    'negation with nicht and kein',
    'accusative case with definite articles',
    'accusative case with indefinite articles',
    'modal verbs können and möchten',
    'word order in statements and questions',
    'W-questions (wer, was, wo, wann, wie)',
    'possessive articles (mein, dein, sein, ihr)',
    'plural forms of common nouns',
  ],
  lesen: [
    'reading short personal introductions',
    'reading simple notices and signs',
    'reading short informal messages and texts',
    'reading simple forms and schedules',
    'reading basic shopping and menu items',
    'reading simple directions and instructions',
    'reading short dialogues in everyday situations',
    'reading basic information about people and places',
    'reading simple advertisements',
    'reading short descriptions of daily routines',
    'reading basic weather descriptions',
    'reading simple email or message greetings',
  ],
  hoeren: [
    'understanding simple greetings and introductions',
    'understanding numbers and prices in conversation',
    'understanding questions about personal information',
    'understanding simple directions',
    'understanding days of week and time expressions',
    'understanding basic shopping conversations',
    'understanding simple restaurant or cafe orders',
    'understanding short announcements',
    'understanding basic family and relationship descriptions',
    'understanding simple telephone conversations',
    'understanding basic weather in conversation',
  ],
}

async function generateQuestionBatch(
  skill: string,
  topic: string,
  batchNumber: number
): Promise<object[]> {
  const skillContext = {
    grammatik: 'German grammar practice for A1 learners. Questions test understanding of grammar rules with sentence-based examples.',
    lesen: 'German reading comprehension for A1 learners. Provide a short German text (2-4 sentences) then ask a comprehension question about it.',
    hoeren: 'German listening comprehension simulation for A1 learners. Describe a short dialogue scenario in the question, then ask what was said or meant.',
  }

  const prompt = `You are an expert German language examiner creating A1 level practice questions for the TELC/Goethe exam format.

Generate exactly ${BATCH_SIZE} multiple choice questions about: ${topic}
Skill type: ${skill} — ${skillContext[skill as keyof typeof skillContext]}

STRICT REQUIREMENTS:
- All questions must be genuinely A1 level difficulty
- Questions and answer options should mix German and English naturally as appropriate for A1 learners
- Each question must have exactly 4 options (a, b, c, d)
- Correct answers must be distributed across a, b, c, d (not all the same letter)
- Explanation must cite the specific grammar rule or reading strategy
- Grammar rule field: specific rule name like "Nominativ - definite article" or null for lesen/hoeren
- Difficulty: 1 (basic), 2 (standard), 3 (challenging) — distribute across the batch

Respond ONLY with a valid JSON array. No markdown, no preamble, no explanation outside the JSON:

[
  {
    "question_text": "string",
    "option_a": "string",
    "option_b": "string", 
    "option_c": "string",
    "option_d": "string",
    "correct_answer": "a" | "b" | "c" | "d",
    "explanation": "string explaining why correct answer is right",
    "grammar_rule": "string or null",
    "difficulty": 1 | 2 | 3
  }
]`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  // Strip any markdown fences if present
  const clean = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  const questions = JSON.parse(clean)

  if (!Array.isArray(questions)) {
    throw new Error('Response is not an array')
  }

  return questions.map((q: Record<string, unknown>) => ({
    level: 'a1',
    skill,
    question_text: String(q.question_text ?? ''),
    option_a: String(q.option_a ?? ''),
    option_b: String(q.option_b ?? ''),
    option_c: String(q.option_c ?? ''),
    option_d: String(q.option_d ?? ''),
    correct_answer: String(q.correct_answer ?? 'a'),
    explanation: String(q.explanation ?? ''),
    grammar_rule: q.grammar_rule ? String(q.grammar_rule) : null,
    difficulty: Number(q.difficulty ?? 1),
    is_active: true,
  }))
}

export async function POST(request: NextRequest) {
  try {
    // Security check — requires secret header
    const secret = request.headers.get('x-seed-secret')
    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get skill from request body
    const body = await request.json()
    const skill = body.skill as keyof typeof A1_TOPICS

    if (!skill || !A1_TOPICS[skill]) {
      return NextResponse.json(
        { error: 'Invalid skill. Use: grammatik, lesen, or hoeren' },
        { status: 400 }
      )
    }

    const topics = A1_TOPICS[skill]
    const supabase = await createServiceClient()
    const results = {
      skill,
      total_generated: 0,
      total_inserted: 0,
      errors: [] as string[],
    }

    // Generate questions for each topic
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i]

      try {
        const questions = await generateQuestionBatch(skill, topic, i)

        const { error: insertError } = await supabase
          .from('questions')
          .insert(questions)

        if (insertError) {
          results.errors.push(`Topic "${topic}": ${insertError.message}`)
        } else {
          results.total_inserted += questions.length
        }

        results.total_generated += questions.length

        // Small delay between batches to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 500))

      } catch (err) {
        results.errors.push(
          `Topic "${topic}": ${err instanceof Error ? err.message : 'Unknown error'}`
        )
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      message: `Generated ${results.total_inserted} questions for ${skill}`,
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Seed failed', details: String(error) },
      { status: 500 }
    )
  }
}
