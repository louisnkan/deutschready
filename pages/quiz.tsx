import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

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
  schreiben: 'Schreiben',
  sprechen: 'Sprechen',
}

export default function QuizPage() {
  const router = useRouter()
  const { level = 'a1', skill } = router.query as { level: string; skill: string }

  const [phase, setPhase] = useState<'select' | 'loading' | 'quiz' | 'results'>('select')
  const [questions, setQuestions] = useState<ClientQuestion[]>([])
  const [sessionId, setSessionId] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<{ question_id: string; user_answer: string }[]>([])
  const [results, setResults] = useState<QuizResult[]>([])
  const [score, setScore] = useState(0)
  const [error, setError] = useState('')
  const [selectedSkill, setSelectedSkill] = useState(skill || '')
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
      setPhase('quiz')
    } catch {
      setError('Network error. Please try again.')
      setPhase('select')
    }
  }

  const handleAnswer = (key: string) => {
    if (selectedAnswer) return
    setSelectedAnswer(key)
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
    } else {
      completeSession(updated)
    }
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
        setError(data.error || 'Failed to submit answers')
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
  const options = currentQuestion
    ? [
        { key: 'a', text: currentQuestion.option_a },
        { key: 'b', text: currentQuestion.option_b },
        { key: 'c', text: currentQuestion.option_c },
        { key: 'd', text: currentQuestion.option_d },
      ]
    : []

  // SKILL SELECT PHASE
  if (phase === 'select') {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
        <Link href="/dashboard" className="text-gray-500 text-sm mb-8 hover:text-gray-300">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mb-2">Choose a Skill</h1>
        <p className="text-gray-400 text-sm mb-8">Level: A1</p>
        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-300 text-sm px-4 py-3 rounded-lg mb-4 w-full max-w-sm">
            {error}
          </div>
        )}
        <div className="w-full max-w-sm space-y-3">
          {skills.map((s) => (
            <button
              key={s}
              onClick={() => { setSelectedSkill(s); startSession(s) }}
              className="w-full bg-gray-800 hover:bg-yellow-400 hover:text-black border border-gray-700 text-white font-semibold py-4 rounded-xl transition"
            >
              {SKILL_LABELS[s]}
            </button>
          ))}
        </div>
      </main>
    )
  }

  // LOADING PHASE
  if (phase === 'loading') {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading questions...</p>
      </main>
    )
  }

  // QUIZ PHASE
  if (phase === 'quiz' && currentQuestion) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex flex-col px-4 py-8">
        <div className="max-w-lg mx-auto w-full">
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-500 text-sm">
              {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-yellow-400 text-sm font-medium">
              {SKILL_LABELS[selectedSkill]} · A1
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-1.5 mb-8">
            <div
              className="bg-yellow-400 h-1.5 rounded-full transition-all"
              style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <p className="text-lg font-medium mb-8 leading-relaxed">
            {currentQuestion.question_text}
          </p>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {options.map((opt) => {
              let style = 'bg-gray-800 border-gray-700 text-white hover:border-yellow-400'
              if (selectedAnswer === opt.key) {
                style = 'bg-yellow-400 border-yellow-400 text-black'
              }
              return (
                <button
                  key={opt.key}
                  onClick={() => handleAnswer(opt.key)}
                  className={`w-full text-left border rounded-xl px-4 py-4 font-medium transition ${style}`}
                >
                  <span className="opacity-60 mr-3">{opt.key.toUpperCase()}.</span>
                  {opt.text}
                </button>
              )
            })}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={!selectedAnswer || submitting}
            className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
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

  // RESULTS PHASE
  if (phase === 'results') {
    const correct = results.filter((r) => r.is_correct).length
    return (
      <main className="min-h-screen bg-gray-950 text-white flex flex-col px-4 py-8">
        <div className="max-w-lg mx-auto w-full">
          <h1 className="text-2xl font-bold text-center mb-1">Session Complete</h1>
          <p className="text-gray-400 text-center text-sm mb-8">
            {SKILL_LABELS[selectedSkill]} · A1
          </p>

          {/* Score */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center mb-8">
            <p className="text-5xl font-bold text-yellow-400 mb-1">{score}%</p>
            <p className="text-gray-400 text-sm">{correct} of {results.length} correct</p>
          </div>

          {/* Review */}
          <div className="space-y-4 mb-8">
            {results.map((r, i) => (
              <div
                key={r.question_id}
                className={`rounded-xl border p-4 ${r.is_correct ? 'border-green-700 bg-green-900/20' : 'border-red-700 bg-red-900/20'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Q{i + 1}</span>
                  <span className={`text-xs font-bold ${r.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                    {r.is_correct ? '✓ Correct' : `✗ Correct: ${r.correct_answer.toUpperCase()}`}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{r.explanation}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setPhase('select')
                setAnswers([])
                setResults([])
                setSelectedAnswer(null)
              }}
              className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition"
            >
              Practice Again
            </button>
            <Link
              href="/dashboard"
              className="block w-full text-center text-gray-400 py-3 hover:text-white transition"
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
