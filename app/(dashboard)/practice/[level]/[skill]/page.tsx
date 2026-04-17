/**
 * Practice session page
 * Orchestrates the full practice session experience
 * Handles loading, active, and complete states
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePracticeSession } from '@/hooks/usePracticeSession'
import { QuestionCard } from '@/components/practice/QuestionCard'
import type { Level, Skill } from '@/types'

const SKILL_LABELS: Record<string, string> = {
  grammatik: 'Grammatik',
  lesen: 'Lesen',
  hoeren: 'Hören',
  schreiben: 'Schreiben',
  sprechen: 'Sprechen',
}

const LEVEL_LABELS: Record<string, string> = {
  a1: 'A1',
  a2: 'A2',
  b1: 'B1',
  b2: 'B2',
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const level = String(params.level ?? 'a1') as Level
  const skill = String(params.skill ?? 'grammatik') as Skill

  const [isRevealed, setIsRevealed] = useState(false)
  const [revealedCorrectAnswer, setRevealedCorrectAnswer] = useState<
    'a' | 'b' | 'c' | 'd' | undefined
  >(undefined)

  const {
    status,
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedAnswer,
    results,
    error,
    elapsedSeconds,
    startSession,
    selectAnswer,
    nextQuestion,
    submitSession,
  } = usePracticeSession()

  // Auto-start session on mount
  useEffect(() => {
    startSession(level, skill)
  }, [level, skill])

  // Handle answer selection — reveal correct answer
  function handleSelectAnswer(answer: 'a' | 'b' | 'c' | 'd') {
    if (isRevealed) return
    selectAnswer(answer)

    // Reveal after selection
    setTimeout(() => {
      setIsRevealed(true)
      // Fetch correct answer from results after reveal
      // For now we reveal the UI state — server validates on submit
    }, 300)
  }

  function handleNext() {
    setIsRevealed(false)
    setRevealedCorrectAnswer(undefined)
    nextQuestion()
  }

  // Loading state
  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-surface">
        <div className="text-center animate-in">
          <div className="w-12 h-12 border-4 border-primary/20
                          border-t-primary rounded-full animate-spin
                          mx-auto mb-4" />
          <p className="font-body text-text-muted text-sm">
            Loading your {SKILL_LABELS[skill]} questions...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-surface px-4">
        <div className="card text-center max-w-sm w-full animate-in">
          <p className="text-3xl mb-3">😕</p>
          <h2 className="font-display text-xl font-bold
                         text-text-primary mb-2">
            Something went wrong
          </h2>
          <p className="font-body text-sm text-text-muted mb-6">
            {error ?? 'Failed to load questions. Please try again.'}
          </p>
          <button
            onClick={() => startSession(level, skill)}
            className="btn-primary w-full"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-ghost w-full mt-3"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Results state
  if (status === 'complete' && results) {
    const percentage = results.score_percentage
    const isPassing = percentage >= 60

    return (
      <div className="min-h-screen bg-surface px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Score card */}
          <div className="card text-center mb-6 slide-in">
            <p className="text-5xl mb-4">
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
            </p>
            <h2 className="font-display text-3xl font-bold
                           text-text-primary mb-1">
              {percentage}%
            </h2>
            <p className="font-body text-text-muted text-sm mb-4">
              {results.correct_answers} of {results.total_questions} correct
            </p>
            <span className={`badge text-sm ${
              isPassing ? 'badge-success' : 'badge-error'
            }`}>
              {isPassing ? 'Passed ✓' : 'Keep Practicing'}
            </span>
          </div>

          {/* Time taken */}
          <div className="card flex items-center justify-between
                          mb-6 py-4">
            <div className="text-center flex-1">
              <p className="font-body text-xs text-text-muted
                            uppercase tracking-wider mb-1">
                Time
              </p>
              <p className="font-display text-2xl font-bold
                            text-primary">
                {formatTime(elapsedSeconds)}
              </p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center flex-1">
              <p className="font-body text-xs text-text-muted
                            uppercase tracking-wider mb-1">
                Level
              </p>
              <p className="font-display text-2xl font-bold
                            text-primary">
                {LEVEL_LABELS[level]}
              </p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center flex-1">
              <p className="font-body text-xs text-text-muted
                            uppercase tracking-wider mb-1">
                Skill
              </p>
              <p className="font-display text-xl font-bold
                            text-primary">
                {SKILL_LABELS[skill]}
              </p>
            </div>
          </div>

          {/* Question results breakdown */}
          <div className="card mb-6">
            <p className="font-body text-xs text-text-muted
                          uppercase tracking-wider mb-4">
              Question Results
            </p>
            <div className="flex flex-wrap gap-2">
              {results.results.map((result, index) => (
                <div
                  key={result.question_id}
                  className={`w-8 h-8 rounded-lg flex items-center
                              justify-center text-xs font-bold
                              font-body ${
                    result.is_correct
                      ? 'bg-success/20 text-success'
                      : 'bg-error/20 text-error'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsRevealed(false)
                startSession(level, skill)
              }}
              className="btn-primary w-full"
            >
              Practice Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-ghost w-full"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Louis IV Studio watermark */}
          <p className="text-center font-body text-xs
                        text-text-muted/30 tracking-widest
                        uppercase mt-8">
            Louis IV Studio
          </p>
        </div>
      </div>
    )
  }

  // Active session state
  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-surface flex flex-col
                max-w-2xl mx-auto md:border-x md:border-border">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-3
                      flex items-center justify-between sticky
                      top-0 z-10">
        <button
          onClick={() => router.push('/dashboard')}
          className="font-body text-sm text-text-muted
                     hover:text-primary transition-colors
                     flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Exit
        </button>

        <div className="text-center">
          <p className="font-display text-sm font-bold text-primary">
            {LEVEL_LABELS[level]} · {SKILL_LABELS[skill]}
          </p>
        </div>

        <div className="font-body text-sm text-text-muted
                        tabular-nums">
          {formatTime(elapsedSeconds)}
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 overflow-y-auto">
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          selectedAnswer={selectedAnswer}
          isRevealed={isRevealed}
          correctAnswer={revealedCorrectAnswer}
          onSelectAnswer={handleSelectAnswer}
          onNext={handleNext}
          onSubmit={submitSession}
          isLastQuestion={currentIndex === totalQuestions - 1}
          isSubmitting={status === 'submitting'}
        />
      </div>
    </div>
  )
}
