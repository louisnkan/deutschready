/**
 * QuestionCard — core question display component
 * Handles answer selection, feedback states,
 * and AI explanation trigger
 */

'use client'

import { useState } from 'react'
import type { ClientQuestion } from '@/types'

interface QuestionCardProps {
  question: ClientQuestion
  questionNumber: number
  totalQuestions: number
  selectedAnswer: 'a' | 'b' | 'c' | 'd' | null
  isRevealed: boolean
  correctAnswer?: 'a' | 'b' | 'c' | 'd'
  onSelectAnswer: (answer: 'a' | 'b' | 'c' | 'd') => void
  onNext: () => void
  onSubmit?: () => void
  isLastQuestion: boolean
  isSubmitting: boolean
}

const OPTIONS = ['a', 'b', 'c', 'd'] as const

function getOptionStyle(
  option: 'a' | 'b' | 'c' | 'd',
  selected: 'a' | 'b' | 'c' | 'd' | null,
  correct: 'a' | 'b' | 'c' | 'd' | undefined,
  revealed: boolean
): string {
  const base = `w-full text-left px-4 py-3 rounded-xl border-2
                font-body text-sm transition-all duration-200
                active:scale-95 flex items-center gap-3`

  if (!revealed) {
    if (selected === option) {
      return `${base} border-primary bg-primary/5 text-primary font-medium`
    }
    return `${base} border-border bg-white text-text-primary
            hover:border-primary/40 hover:bg-primary/5`
  }

  // Revealed state
  if (option === correct) {
    return `${base} border-success bg-success/10 text-success font-medium`
  }
  if (option === selected && selected !== correct) {
    return `${base} border-error bg-error/10 text-error`
  }
  return `${base} border-border bg-white text-text-muted`
}

const OPTION_LABELS = { a: 'A', b: 'B', c: 'C', d: 'D' }

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isRevealed,
  correctAnswer,
  onSelectAnswer,
  onNext,
  onSubmit,
  isLastQuestion,
  isSubmitting,
}: QuestionCardProps) {
  const [explanation, setExplanation] = useState<string | null>(null)
  const [tip, setTip] = useState<string | null>(null)
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [explanationError, setExplanationError] = useState<string | null>(null)

  const progress = (questionNumber / totalQuestions) * 100
  const isWrong =
    isRevealed && selectedAnswer && selectedAnswer !== correctAnswer

  async function handleExplain() {
    if (!selectedAnswer || !isWrong) return
    setLoadingExplanation(true)
    setExplanationError(null)

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: question.id,
          user_answer: selectedAnswer,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to get explanation')
      }

      setExplanation(data.explanation)
      setTip(data.tip)
    } catch (err) {
      setExplanationError(
        err instanceof Error ? err.message : 'Could not load explanation'
      )
    } finally {
      setLoadingExplanation(false)
    }
  }

  return (
    <div className="flex flex-col h-full animate-in">
      {/* Progress bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-xs text-text-muted">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="badge badge-accent text-xs">
            {question.skill.charAt(0).toUpperCase() +
              question.skill.slice(1)}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="px-4 py-6 flex-1">
        <div className="card mb-6">
          <p className="font-body text-base text-text-primary
                        leading-relaxed">
            {question.question_text}
          </p>
          {question.grammar_rule && (
            <span className="german-text mt-3 inline-block">
              {question.grammar_rule}
            </span>
          )}
        </div>

        {/* Answer options */}
        <div className="space-y-3">
          {OPTIONS.map((option) => {
            const optionText =
              question[`option_${option}` as keyof ClientQuestion]

            return (
              <button
                key={option}
                onClick={() => !isRevealed && onSelectAnswer(option)}
                disabled={isRevealed}
                className={getOptionStyle(
                  option,
                  selectedAnswer,
                  correctAnswer,
                  isRevealed
                )}
              >
                <span className="w-7 h-7 rounded-full border-2
                                  border-current flex items-center
                                  justify-center text-xs font-bold
                                  flex-shrink-0">
                  {OPTION_LABELS[option]}
                </span>
                <span>{String(optionText)}</span>
              </button>
            )
          })}
        </div>

        {/* Result feedback */}
        {isRevealed && (
          <div className={`mt-4 p-4 rounded-xl slide-in ${
            isWrong
              ? 'bg-error/10 border border-error/20'
              : 'bg-success/10 border border-success/20'
          }`}>
            <p className={`font-body text-sm font-medium mb-1 ${
              isWrong ? 'text-error' : 'text-success'
            }`}>
              {isWrong ? '✗ Incorrect' : '✓ Correct!'}
            </p>
            <p className="font-body text-sm text-text-primary">
              {question.explanation}
            </p>

            {/* AI Explain button — only on wrong answers */}
            {isWrong && !explanation && (
              <button
                onClick={handleExplain}
                disabled={loadingExplanation}
                className="mt-3 flex items-center gap-2 text-xs
                           font-body font-medium text-primary
                           hover:text-primary-light transition-colors
                           disabled:opacity-50"
              >
                {loadingExplanation ? (
                  <>
                    <span className="w-3 h-3 border border-primary
                                     border-t-transparent rounded-full
                                     animate-spin" />
                    Getting explanation...
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    Ask AI to explain this
                  </>
                )}
              </button>
            )}

            {explanationError && (
              <p className="mt-2 text-xs text-error font-body">
                {explanationError}
              </p>
            )}

            {/* AI Explanation panel */}
            {explanation && (
              <div className="mt-3 p-3 bg-white rounded-lg
                              border border-primary/20 slide-in">
                <p className="font-body text-xs font-medium
                               text-primary mb-1">
                  ✦ AI Explanation
                </p>
                <p className="font-body text-sm text-text-primary">
                  {explanation}
                </p>
                {tip && (
                  <p className="font-body text-xs text-text-muted
                                 mt-2 italic">
                    💡 {tip}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-8 pt-2">
        {!isRevealed ? (
          <button
            onClick={() => onSelectAnswer(
              selectedAnswer ?? 'a'
            )}
            disabled={!selectedAnswer}
            className="btn-primary w-full disabled:opacity-40
                       disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : isLastQuestion ? (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40
                                 border-t-white rounded-full
                                 animate-spin" />
                Submitting...
              </span>
            ) : (
              'See Results'
            )}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="btn-primary w-full"
          >
            Next Question →
          </button>
        )}
      </div>
    </div>
  )
}
