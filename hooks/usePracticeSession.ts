/**
 * Practice session state management hook
 * Handles question fetching, answer tracking,
 * timer, and session completion
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type {
  ClientQuestion,
  SessionState,
  CompleteSessionResponse,
} from '@/types'

type SessionStatus =
  | 'idle'
  | 'loading'
  | 'active'
  | 'submitting'
  | 'complete'
  | 'error'

interface UsePracticeSessionReturn {
  status: SessionStatus
  questions: ClientQuestion[]
  currentQuestion: ClientQuestion | null
  currentIndex: number
  totalQuestions: number
  selectedAnswer: 'a' | 'b' | 'c' | 'd' | null
  sessionState: SessionState
  results: CompleteSessionResponse | null
  error: string | null
  elapsedSeconds: number
  startSession: (level: string, skill: string) => Promise<void>
  selectAnswer: (answer: 'a' | 'b' | 'c' | 'd') => void
  nextQuestion: () => void
  submitSession: () => Promise<void>
}

export function usePracticeSession(): UsePracticeSessionReturn {
  const [status, setStatus] = useState<SessionStatus>('idle')
  const [questions, setQuestions] = useState<ClientQuestion[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<CompleteSessionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const [sessionState, setSessionState] = useState<SessionState>({
    currentIndex: 0,
    answers: {},
    timePerQuestion: {},
    isComplete: false,
  })

  const questionStartTime = useRef<number>(Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Global session timer
  useEffect(() => {
    if (status === 'active') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [status])

  const startSession = useCallback(
    async (level: string, skill: string) => {
      setStatus('loading')
      setError(null)

      try {
        const response = await fetch('/api/session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level, skill }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error ?? 'Failed to start session')
        }

        setQuestions(data.questions)
        setSessionId(data.session_id)
        setCurrentIndex(0)
        setElapsedSeconds(0)
        setSessionState({
          currentIndex: 0,
          answers: {},
          timePerQuestion: {},
          isComplete: false,
        })
        questionStartTime.current = Date.now()
        setStatus('active')

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setStatus('error')
      }
    },
    []
  )

  const selectAnswer = useCallback(
    (answer: 'a' | 'b' | 'c' | 'd') => {
      if (status !== 'active') return

      const questionId = questions[currentIndex]?.id
      if (!questionId) return

      const timeTaken = Math.floor(
        (Date.now() - questionStartTime.current) / 1000
      )

      setSessionState((prev) => ({
        ...prev,
        answers: { ...prev.answers, [questionId]: answer },
        timePerQuestion: {
          ...prev.timePerQuestion,
          [questionId]: timeTaken,
        },
      }))
    },
    [status, questions, currentIndex]
  )

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      questionStartTime.current = Date.now()
      setSessionState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
      }))
    }
  }, [currentIndex, questions.length])

  const submitSession = useCallback(async () => {
    if (!sessionId || status !== 'active') return
    setStatus('submitting')

    const answers = Object.entries(sessionState.answers).map(
      ([question_id, user_answer]) => ({
        question_id,
        user_answer,
        time_taken_seconds:
          sessionState.timePerQuestion[question_id] ?? 0,
      })
    )

    try {
      const response = await fetch('/api/session/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          answers,
          time_taken_seconds: elapsedSeconds,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to submit session')
      }

      setResults(data)
      setSessionState((prev) => ({ ...prev, isComplete: true }))
      setStatus('complete')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
      setStatus('error')
    }
  }, [sessionId, status, sessionState, elapsedSeconds])

  const currentQuestion = questions[currentIndex] ?? null
  const selectedAnswer =
    currentQuestion
      ? (sessionState.answers[currentQuestion.id] ?? null)
      : null

  return {
    status,
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    selectedAnswer,
    sessionState,
    results,
    error,
    elapsedSeconds,
    startSession,
    selectAnswer,
    nextQuestion,
    submitSession,
  }
}
