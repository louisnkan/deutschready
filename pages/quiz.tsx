import { useState } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import Logo from '../components/Logo'

type ClientQuestion = {
  id: string
  level: string
  skill: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  explanation: string
  grammar_rule: string | null
  difficulty: number
}

type QuizResult = {
  question_id: string
  user_answer: string
  correct_answer: string
  is_correct: boolean
  explanation: string
}

const SKILL_LABELS: Record<string, string> = {
  grammatik: 'Grammatik',
  lesen: 'Lesen',
  hoeren: 'Hören',
}

const SKILL_ICONS: Record<string, string> = {
  grammatik: '📝',
  lesen: '📖',
  hoeren: '🎧',
}

const SKILL_DESC: Record<string, string> = {
  grammatik: 'Grammar rules and sentence structure',
  lesen: 'Reading comprehension and vocabulary',
  hoeren: 'Listening scenarios and dialogue',
}

export default function QuizPage() {
  const router = useRouter()
  const { skill: querySkill } = router.query as { skill: string }

  const [phase, setPhase] = useState<'select' | 'loading' | 'quiz' | 'results' | 'exit_confirm'>('select')
  const [prevPhase, setPrevPhase] = useState<'quiz'>('quiz')
  const [questions, setQuestions] = useState<ClientQuestion[]>([])
  const [sessionId, setSessionId] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [revealAnswer, setRevealAnswer] = useState(false)
  const [answers, setAnswers] = useState<{ question_id: string; user_answer: string }[]>([])
  const [results, setResults] = useState<QuizResult[]>([])
  const [score, setScore] = useState(0)
  const [error, setError] = useState('')
  const [selectedSkill, setSelectedSkill] = useState(querySkill || '')
  const [submitting, setSubmitting] = useState(false)

  const skills = ['grammatik', 'lesen', 'hoeren']

  const startSession = async (chosenSkill: string) => {
    setPhase('loading')
    setError('')
    try {
      const res = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: 'a1', skill: chosenSkill }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to start session')
        setPhase('select')
        return
      }
      setQuestions(data.questions)
      setSessionId(data.session_id)
      setCurrentIndex(0)
      setAnswers([])
      setSelectedAnswer(null)
      setRevealAnswer(false)
      setPhase('quiz')
    } catch {
      setError('Network error. Please try again.')
      setPhase('select')
    }
  }

  const handleAnswer = (key: string) => {
    if (selectedAnswer) return
    setSelectedAnswer(key)
    setRevealAnswer(true)
  }

  const handleNext = () => {
    if (!selectedAnswer) return
    const updated = [...answers, {
      question_id: questions[currentIndex].id,
      user_answer: selectedAnswer,
    }]
    setAnswers(updated)
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setRevealAnswer(false)
    } else {
      completeSession(updated)
    }
  }

  const handleExitRequest = () => {
    setPrevPhase('quiz')
    setPhase('exit_confirm')
  }

  const handleExitConfirm = () => {
    // Orphaned session row stays with completed_at = null — acceptable, cleaned in V2
    router.push('/dashboard')
  }

  const completeSession = async (finalAnswers: { question_id: string; user_answer: string }[]) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/session/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          answers: finalAnswers,
          level: 'a1',
          skill: selectedSkill,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to submit')
        setSubmitting(false)
        return
      }
      setResults(data.results)
      setScore(data.score_percentage)
      setPhase('results')
    } catch {
      setError('Network error submitting answers.')
    }
    setSubmitting(false)
  }

  const currentQuestion = questions[currentIndex]
  const options = currentQuestion ? [
    { key: 'a', text: currentQuestion.option_a },
    { key: 'b', text: currentQuestion.option_b },
    { key: 'c', text: currentQuestion.option_c },
    { key: 'd', text: currentQuestion.option_d },
  ] : []

  const appBg = '#0F1117'
  const surface = '#1A1D27'
  const border = '#2D3748'
  const textPrimary = '#E8EAED'
  const textMuted = '#6B7280'
  const green = '#40916C'
  const amber = '#FFB703'

  // EXIT CONFIRM
  if (phase === 'exit_confirm') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: appBg }}>
        <div className="w-full max-w-sm text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="font-fraunces text-2xl font-black mb-2" style={{ color: textPrimary }}>
            Exit session?
          </h2>
          <p className="text-sm mb-8" style={{ color: textMuted }}>
            Your progress won't be saved. You've answered {answers.length} of {questions.length} questions.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setPhase('quiz')}
              className="w-full font-bold py-4 rounded-2xl transition"
              style={{ backgroundColor: green, color: '#fff' }}
            >
              Continue session
            </button>
            <button
              onClick={handleExitConfirm}
              className="w-full font-semibold py-4 rounded-2xl border transition"
              style={{ borderColor: border, color: textMuted }}
            >
              Exit without saving
            </button>
          </div>
        </div>
      </main>
    )
  }

  // SKILL SELECT
  if (phase === 'select') {
    return (
      <main className="min-h-screen flex flex-col" style={{ backgroundColor: appBg }}>
        <nav className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: surface }}>
          <Logo size="md" href="/" />
          <Link href="/dashboard" className="text-xs font-medium" style={{ color: textMuted }}>
            ← Dashboard
          </Link>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <h1 className="font-fraunces text-2xl font-black mb-1" style={{ color: textPrimary }}>
              Choose a Skill
            </h1>
            <p className="text-sm mb-8" style={{ color: textMuted }}>Level A1 · 20 questions</p>
            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}
            <div className="space-y-3">
              {skills.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSelectedSkill(s); startSession(s) }}
                  className="w-full rounded-2xl px-4 py-4 text-left transition border hover:border-opacity-100"
                  style={{ backgroundColor: surface, borderColor: border, color: textPrimary }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = green)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = border)}
                >
                  <div className="font-semibold">{SKILL_ICONS[s]} {SKILL_LABELS[s]}</div>
                  <div className="text-xs mt-0.5" style={{ color: textMuted }}>{SKILL_DESC[s]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  // LOADING
  if (phase === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: appBg }}>
        <p style={{ color: textMuted }}>Loading questions...</p>
      </main>
    )
  }

  // QUIZ
  if (phase === 'quiz' && currentQuestion) {
    return (
      <main className="min-h-screen flex flex-col" style={{ backgroundColor: appBg, color: textPrimary }}>
        <div className="max-w-lg mx-auto w-full px-4 py-6">

          {/* Header with exit */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleExitRequest}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border transition"
              style={{ borderColor: border, color: textMuted }}
            >
              ✕ Exit
            </button>
            <span className="text-sm" style={{ color: textMuted }}>
              {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-sm font-medium" style={{ color: green }}>
              {SKILL_ICONS[selectedSkill]} {SKILL_LABELS[selectedSkill]}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full rounded-full h-1.5 mb-8" style={{ backgroundColor: surface }}>
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${(currentIndex / questions.length) * 100}%`,
                backgroundColor: green,
              }}
            />
          </div>

          {/* Question */}
          <p className="text-lg font-medium mb-6 leading-relaxed">
            {currentQuestion.question_text}
          </p>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {options.map((opt) => {
              const isSelected = selectedAnswer === opt.key
              return (
                <button
                  key={opt.key}
                  onClick={() => handleAnswer(opt.key)}
                  disabled={!!selectedAnswer}
                  className="w-full text-left border rounded-xl px-4 py-4 font-medium transition"
                  style={{
                    backgroundColor: isSelected ? green : surface,
                    borderColor: isSelected ? green : border,
                    color: isSelected ? '#fff' : textPrimary,
                  }}
                >
                  <span className="mr-3 opacity-60">{opt.key.toUpperCase()}.</span>
                  {opt.text}
                </button>
              )
            })}
          </div>

          {/* Immediate explanation feedback */}
          {revealAnswer && currentQuestion.explanation && (
            <div
              className="rounded-xl px-4 py-3 mb-6 border"
              style={{ backgroundColor: surface, borderColor: border }}
            >
              <p className="text-xs mb-1 font-semibold" style={{ color: green }}>Explanation</p>
              <p className="text-sm" style={{ color: '#CBD5E0' }}>{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={!selectedAnswer || submitting}
            className="w-full font-bold py-4 rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: amber, color: '#1B4332' }}
          >
            {submitting
              ? 'Submitting...'
              : currentIndex + 1 === questions.length
              ? 'Finish Quiz'
              : 'Next Question →'}
          </button>

        </div>
      </main>
    )
  }

  // RESULTS
  if (phase === 'results') {
    const correct = results.filter((r) => r.is_correct).length
    return (
      <main className="min-h-screen flex flex-col px-4 py-8" style={{ backgroundColor: appBg, color: textPrimary }}>
        <div className="max-w-lg mx-auto w-full">
          <h1 className="font-fraunces text-2xl font-black text-center mb-1">Session Complete</h1>
          <p className="text-center text-sm mb-8" style={{ color: textMuted }}>
            {SKILL_ICONS[selectedSkill]} {SKILL_LABELS[selectedSkill]} · A1
          </p>

          <div className="rounded-2xl p-6 text-center mb-8 border" style={{ backgroundColor: surface, borderColor: border }}>
            <p className="text-5xl font-bold mb-1" style={{ color: amber }}>{score}%</p>
            <p className="text-sm mb-2" style={{ color: textMuted }}>{correct} of {results.length} correct</p>
            <p className="text-xs" style={{ color: green }}>
              {score >= 80 ? '🏆 Excellent work!' : score >= 60 ? '💪 Good progress!' : '📚 Keep practising!'}
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {results.map((r, i) => (
              <div
                key={r.question_id}
                className="rounded-xl border p-4"
                style={{
                  backgroundColor: surface,
                  borderColor: r.is_correct ? '#276749' : '#7F1D1D',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: textMuted }}>Q{i + 1}</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: r.is_correct ? green : '#FC8181' }}
                  >
                    {r.is_correct ? '✓ Correct' : `✗ Correct: ${r.correct_answer.toUpperCase()}`}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#CBD5E0' }}>{r.explanation}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setPhase('select')
                setAnswers([])
                setResults([])
                setSelectedAnswer(null)
                setRevealAnswer(false)
              }}
              className="w-full font-bold py-4 rounded-2xl transition"
              style={{ backgroundColor: amber, color: '#1B4332' }}
            >
              Practice Again
            </button>
            <Link
              href="/dashboard"
              className="block w-full text-center py-3 transition text-sm"
              style={{ color: textMuted }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx)
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return { redirect: { destination: '/auth', permanent: false } }
  }
  return { props: {} }
}
