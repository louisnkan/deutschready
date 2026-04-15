/**
 * Claude AI explanation engine
 * Called ONLY when a user gets a wrong answer and requests explanation
 * Never called for question generation — that's handled by the
 * separate generation script run locally
 */

export interface ExplanationRequest {
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: 'a' | 'b' | 'c' | 'd'
  userAnswer: 'a' | 'b' | 'c' | 'd'
  grammarRule: string | null
  level: string
  skill: string
}

export interface ExplanationResult {
  explanation: string
  grammar_rule: string | null
  tip: string
}

const OPTION_MAP = {
  a: 'option_a',
  b: 'option_b',
  c: 'option_c',
  d: 'option_d',
} as const

export async function generateExplanation(
  req: ExplanationRequest
): Promise<ExplanationResult> {
  const correctOptionText =
    req[OPTION_MAP[req.correctAnswer] as keyof ExplanationRequest]
  const userOptionText =
    req[OPTION_MAP[req.userAnswer] as keyof ExplanationRequest]

  const prompt = `You are a German language tutor helping a student prepare for their ${req.level.toUpperCase()} ${req.skill} exam.

The student answered a question incorrectly. Explain clearly and encouragingly why their answer was wrong and what the correct answer is.

Question: ${req.questionText}

Student's wrong answer: ${userOptionText}
Correct answer: ${correctOptionText}
${req.grammarRule ? `Grammar rule involved: ${req.grammarRule}` : ''}

Respond in this exact JSON format with no markdown or extra text:
{
  "explanation": "Clear explanation of why the correct answer is right and the student's answer was wrong. Maximum 3 sentences. Use simple English.",
  "grammar_rule": "The specific German grammar rule name, or null if not applicable",
  "tip": "One practical memory tip to remember this rule. Maximum 1 sentence."
}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  try {
    const parsed = JSON.parse(text) as ExplanationResult
    return {
      explanation: parsed.explanation ?? 'Please review this question again.',
      grammar_rule: parsed.grammar_rule ?? req.grammarRule,
      tip: parsed.tip ?? 'Practice this pattern regularly.',
    }
  } catch {
    // If JSON parsing fails return graceful fallback
    return {
      explanation: text.slice(0, 300) || 'Please review this question again.',
      grammar_rule: req.grammarRule,
      tip: 'Practice this pattern regularly.',
    }
  }
}
