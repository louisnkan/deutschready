// ─── User & Auth ────────────────────────────────────────────────

export type Level = 'a1' | 'a2' | 'b1' | 'b2'
export type Skill = 'grammatik' | 'lesen' | 'hoeren' | 'schreiben' | 'sprechen'
export type Difficulty = 1 | 2 | 3

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  current_level: Level
  is_premium: boolean
  premium_expires_at: string | null
  streak_days: number
  last_practice_date: string | null
  created_at: string
  updated_at: string
}

// ─── Questions ──────────────────────────────────────────────────

export interface Question {
  id: string
  level: Level
  skill: Skill
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'a' | 'b' | 'c' | 'd'
  explanation: string
  grammar_rule: string | null
  audio_url: string | null
  difficulty: Difficulty
  is_active: boolean
  created_at: string
}

// Client-safe question — correct answer stripped out
// Never send correct_answer to the browser
export type ClientQuestion = Omit<Question,
  'correct_answer' | 'is_active' | 'created_at'
>

// ─── Practice Sessions ──────────────────────────────────────────

export interface PracticeSession {
  id: string
  user_id: string
  level: Level
  skill: Skill
  total_questions: number
  correct_answers: number
  score_percentage: number
  time_taken_seconds: number | null
  completed_at: string
}

export interface SessionAnswer {
  id: string
  session_id: string
  user_id: string
  question_id: string
  user_answer: string
  is_correct: boolean
  time_taken_seconds: number | null
  created_at: string
}

// ─── Progress ───────────────────────────────────────────────────

export interface SkillProgress {
  id: string
  user_id: string
  level: Level
  skill: Skill
  questions_attempted: number
  questions_correct: number
  best_score: number
  last_practiced_at: string | null
}

// ─── API Payloads ───────────────────────────────────────────────

export interface StartSessionPayload {
  level: Level
  skill: Skill
}

export interface StartSessionResponse {
  session_id: string
  questions: ClientQuestion[]
}

export interface CompleteSessionPayload {
  session_id: string
  answers: {
    question_id: string
    user_answer: 'a' | 'b' | 'c' | 'd'
    time_taken_seconds: number
  }[]
  time_taken_seconds: number
}

export interface CompleteSessionResponse {
  score_percentage: number
  correct_answers: number
  total_questions: number
  results: {
    question_id: string
    is_correct: boolean
    correct_answer: 'a' | 'b' | 'c' | 'd'
    explanation: string
  }[]
}

export interface ExplainPayload {
  question_id: string
  user_answer: 'a' | 'b' | 'c' | 'd'
}

export interface ExplainResponse {
  explanation: string
  grammar_rule: string | null
  tip: string
}

// ─── UI State ───────────────────────────────────────────────────

export interface SessionState {
  currentIndex: number
  answers: Record<string, 'a' | 'b' | 'c' | 'd'>
  timePerQuestion: Record<string, number>
  isComplete: boolean
}

export type AnswerStatus = 'unanswered' | 'correct' | 'incorrect'
