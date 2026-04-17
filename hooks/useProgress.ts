/**
 * User progress hook
 * Fetches and computes progress across all skills
 * Used in dashboard and profile pages
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SkillProgress, Level } from '@/types'

interface ProgressSummary {
  level: Level
  skill: string
  questionsAttempted: number
  questionsCorrect: number
  bestScore: number
  lastPracticedAt: string | null
  accuracyPercent: number
}

interface UseProgressReturn {
  progress: ProgressSummary[]
  totalQuestionsAttempted: number
  totalCorrect: number
  overallAccuracy: number
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProgress(level?: Level): UseProgressReturn {
  const [progress, setProgress] = useState<ProgressSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchProgress() {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Not authenticated')
        return
      }

      let query = supabase
        .from('skill_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_practiced_at', { ascending: false })

      if (level) {
        query = query.eq('level', level)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      const summary: ProgressSummary[] = (data ?? []).map(
        (p: SkillProgress) => ({
          level: p.level as Level,
          skill: p.skill,
          questionsAttempted: p.questions_attempted,
          questionsCorrect: p.questions_correct,
          bestScore: p.best_score,
          lastPracticedAt: p.last_practiced_at,
          accuracyPercent:
            p.questions_attempted > 0
              ? Math.round(
                  (p.questions_correct / p.questions_attempted) * 100
                )
              : 0,
        })
      )

      setProgress(summary)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load progress'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [level])

  const totalQuestionsAttempted = progress.reduce(
    (sum, p) => sum + p.questionsAttempted, 0
  )
  const totalCorrect = progress.reduce(
    (sum, p) => sum + p.questionsCorrect, 0
  )
  const overallAccuracy =
    totalQuestionsAttempted > 0
      ? Math.round((totalCorrect / totalQuestionsAttempted) * 100)
      : 0

  return {
    progress,
    totalQuestionsAttempted,
    totalCorrect,
    overallAccuracy,
    loading,
    error,
    refetch: fetchProgress,
  }
}
