import type { NextApiRequest, NextApiResponse } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_HOURS = 1

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

  // Rate limiting — max 10 session starts per hour per user
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString()

  const { count } = await supabase
    .from('rate_limit_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .eq('action', 'session_start')
    .gte('created_at', windowStart)

  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: 'Too many sessions. Please wait before starting another.'
    })
  }

  // Log this session start
  await supabase
    .from('rate_limit_log')
    .insert({ user_id: session.user.id, action: 'session_start' })

  // Fetch questions — correct_answer deliberately excluded
  // Cache-Control set for edge caching — questions are static data
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, level, skill, question_text, option_a, option_b, option_c, option_d, explanation, grammar_rule, difficulty')
    .eq('level', level)
    .eq('skill', skill)
    .eq('is_active', true)
    .order('difficulty', { ascending: true })
    .limit(60)

  if (qError || !questions || questions.length === 0) {
    return res.status(500).json({ error: 'Failed to fetch questions' })
  }
  // Shuffle and take 20 — different set each session
const shuffled = questions
  .sort(() => Math.random() - 0.5)
  .slice(0, 20)

  // Create practice session record
  const { data: sessionRecord, error: sError } = await supabase
    .from('practice_sessions')
    .insert({
      user_id: session.user.id,
      level,
      skill,
      total_questions: shuffled.length,
      correct_answers: 0,
      score_percentage: 0,
    })
    .select('id')
    .single()

  if (sError || !sessionRecord) {
    return res.status(500).json({ error: 'Failed to create session' })
  }

  // Edge cache hint — questions are stable data
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')

  return res.status(200).json({
  session_id: sessionRecord.id,
  questions: shuffled,
})
}
