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

  const { level = 'a1', skill } = req.body

  if (!skill) {
    return res.status(400).json({ error: 'skill is required' })
  }

  const validSkills = ['grammatik', 'lesen', 'hoeren', 'schreiben', 'sprechen']
  const validLevels = ['a1', 'a2', 'b1', 'b2']

  if (!validSkills.includes(skill) || !validLevels.includes(level)) {
    return res.status(400).json({ error: 'Invalid skill or level' })
  }

  // Fetch questions — correct_answer deliberately excluded
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, level, skill, question_text, option_a, option_b, option_c, option_d, explanation, grammar_rule, difficulty')
    .eq('level', level)
    .eq('skill', skill)
    .eq('is_active', true)
    .order('difficulty', { ascending: true })
    .limit(20)

  if (qError || !questions || questions.length === 0) {
    return res.status(500).json({ error: 'Failed to fetch questions' })
  }

  // Create practice session record
  const { data: sessionRecord, error: sError } = await supabase
    .from('practice_sessions')
    .insert({
      user_id: session.user.id,
      level,
      skill,
      total_questions: questions.length,
      correct_answers: 0,
      score_percentage: 0,
    })
    .select('id')
    .single()

  if (sError || !sessionRecord) {
    return res.status(500).json({ error: 'Failed to create session' })
  }

  return res.status(200).json({
    session_id: sessionRecord.id,
    questions,
  })
}
