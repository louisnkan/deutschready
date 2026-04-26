import type { NextApiRequest, NextApiResponse } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createPagesServerClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return res.status(401).json({ error: 'Unauthorised' })
  }

  const { session_id, answers } = req.body
  // answers = [{ question_id: string, user_answer: 'a'|'b'|'c'|'d' }]

  if (!session_id || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'session_id and answers are required' })
  }

  const questionIds = answers.map((a: { question_id: string }) => a.question_id)

  // Server fetches correct answers — client never touched these
  const { data: correctAnswers, error: cError } = await supabase
    .from('questions')
    .select('id, correct_answer, explanation')
    .in('id', questionIds)

  if (cError || !correctAnswers) {
    return res.status(500).json({ error: 'Failed to validate answers' })
  }

  const correctMap = Object.fromEntries(
    correctAnswers.map((q) => [q.id, { correct_answer: q.correct_answer, explanation: q.explanation }])
  )

  // Score server-side
  const scoredAnswers = answers.map((a: { question_id: string; user_answer: string }) => ({
    session_id,
    user_id: session.user.id,
    question_id: a.question_id,
    user_answer: a.user_answer,
    is_correct: correctMap[a.question_id]?.correct_answer === a.user_answer,
  }))

  const correctCount = scoredAnswers.filter((a) => a.is_correct).length
  const scorePercentage = Math.round((correctCount / answers.length) * 100)

  // Save session answers
  const { error: saError } = await supabase
    .from('session_answers')
    .insert(scoredAnswers)

  if (saError) {
    return res.status(500).json({ error: 'Failed to save answers' })
  }

  // Update practice session
  await supabase
    .from('practice_sessions')
    .update({
      correct_answers: correctCount,
      score_percentage: scorePercentage,
      completed_at: new Date().toISOString(),
    })
    .eq('id', session_id)
    .eq('user_id', session.user.id)

  // Upsert skill_progress
  const { data: existing } = await supabase
    .from('skill_progress')
    .select('questions_attempted, questions_correct, best_score')
    .eq('user_id', session.user.id)
    .eq('level', req.body.level || 'a1')
    .eq('skill', req.body.skill)
    .single()

  await supabase
    .from('skill_progress')
    .upsert({
      user_id: session.user.id,
      level: req.body.level || 'a1',
      skill: req.body.skill,
      questions_attempted: (existing?.questions_attempted || 0) + answers.length,
      questions_correct: (existing?.questions_correct || 0) + correctCount,
      best_score: Math.max(existing?.best_score || 0, scorePercentage),
      last_practiced_at: new Date().toISOString(),
    }, { onConflict: 'user_id,level,skill' })

  // Return results with explanations
  const results = answers.map((a: { question_id: string; user_answer: string }) => ({
    question_id: a.question_id,
    user_answer: a.user_answer,
    correct_answer: correctMap[a.question_id]?.correct_answer,
    is_correct: correctMap[a.question_id]?.correct_answer === a.user_answer,
    explanation: correctMap[a.question_id]?.explanation,
  }))

  return res.status(200).json({
    score_percentage: scorePercentage,
    correct_answers: correctCount,
    total_questions: answers.length,
    results,
  })
}
