/**
 * Level overview page
 * Shows available skills for a given level
 * Entry point before choosing Grammatik/Lesen/Hören
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Practice — DeutschReady',
  robots: { index: false, follow: false },
}

const SKILLS = [
  {
    skill: 'grammatik',
    label: 'Grammatik',
    description: 'Articles, cases, verb conjugation, sentence structure',
    emoji: '📖',
    color: 'bg-primary/10 border-primary/20',
    textColor: 'text-primary',
  },
  {
    skill: 'lesen',
    label: 'Lesen',
    description: 'Reading comprehension — signs, messages, short texts',
    emoji: '📰',
    color: 'bg-accent-soft border-accent/20',
    textColor: 'text-text-primary',
  },
  {
    skill: 'hoeren',
    label: 'Hören',
    description: 'Listening comprehension — dialogues and announcements',
    emoji: '🎧',
    color: 'bg-success/10 border-success/20',
    textColor: 'text-success',
  },
]

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  a1: 'Beginner — Everyday expressions and basic phrases',
  a2: 'Elementary — Familiar topics and simple communication',
  b1: 'Intermediate — Main points on familiar matters',
  b2: 'Upper Intermediate — Complex texts and discussions',
}

interface PageProps {
  params: Promise<{ level: string }>
}

export default async function LevelPage({ params }: PageProps) {
  const { level } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const validLevels = ['a1', 'a2', 'b1', 'b2']
  if (!validLevels.includes(level)) redirect('/dashboard')

  // Get user progress for this level
  const { data: progress } = await supabase
    .from('skill_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('level', level)

  const progressMap = new Map(
    (progress ?? []).map((p) => [p.skill, p])
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 slide-in">
        <div className="flex items-center gap-3 mb-2">
          <a
            href="/dashboard"
            className="font-body text-sm text-text-muted
                       hover:text-primary transition-colors"
          >
            ← Dashboard
          </a>
        </div>
        <h1 className="font-display text-3xl font-bold text-primary">
          Level {level.toUpperCase()}
        </h1>
        <p className="font-body text-text-muted mt-1">
          {LEVEL_DESCRIPTIONS[level]}
        </p>
      </div>

      {/* Skill cards */}
      <p className="font-body text-sm font-medium text-text-muted
                    uppercase tracking-wider mb-4">
        Choose a skill
      </p>

      <div className="space-y-4">
        {SKILLS.map((item) => {
          const skillProgress = progressMap.get(item.skill)
          const attempted = skillProgress?.questions_attempted ?? 0
          const bestScore = skillProgress?.best_score ?? 0
          const hasProgress = attempted > 0

          return (
            <a
              key={item.skill}
              href={`/practice/${level}/${item.skill}`}
              className={`card flex items-center gap-4 border-2
                         ${item.color} hover:shadow-card-hover
                         transition-all duration-200 active:scale-95`}
            >
              <span className="text-3xl flex-shrink-0">
                {item.emoji}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`font-display text-lg font-bold
                                ${item.textColor}`}>
                    {item.label}
                  </p>
                  {hasProgress && (
                    <span className="badge badge-success text-xs">
                      {Math.round(bestScore)}% best
                    </span>
                  )}
                </div>
                <p className="font-body text-sm text-text-muted
                               truncate">
                  {item.description}
                </p>
                {hasProgress && (
                  <p className="font-body text-xs text-text-muted
                                 mt-1">
                    {attempted} questions practiced
                  </p>
                )}
              </div>

              <svg
                className="w-5 h-5 text-text-muted flex-shrink-0"
                fill="none" viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )
        })}
      </div>

      {/* Locked levels notice */}
      {level === 'a1' && (
        <div className="mt-8 p-4 bg-accent-soft rounded-xl
                        border border-accent/20">
          <p className="font-body text-sm text-text-primary">
            <span className="font-medium">💡 Pro tip:</span> Master
            all three A1 skills before moving to A2. Aim for 80%+
            on each.
          </p>
        </div>
      )}
    </div>
  )
}
