/**
 * Main dashboard — fully wired with real progress data
 * Replaces placeholder dashboard with live Supabase data
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — DeutschReady',
  robots: { index: false, follow: false },
}

const SKILLS = [
  {
    skill: 'grammatik',
    label: 'Grammatik',
    description: 'Articles, cases, verb conjugation',
    emoji: '📖',
  },
  {
    skill: 'lesen',
    label: 'Lesen',
    description: 'Reading comprehension',
    emoji: '📰',
  },
  {
    skill: 'hoeren',
    label: 'Hören',
    description: 'Listening comprehension',
    emoji: '🎧',
  },
]

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-accent'
  return 'text-error'
}

function getScoreBadge(score: number): string {
  if (score >= 80) return 'badge-success'
  if (score >= 60) return 'badge-accent'
  return 'badge-error'
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile and progress in parallel
  const [profileResult, progressResult, sessionsResult] =
    await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single(),
      supabase
        .from('skill_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('level', 'a1'),
      supabase
        .from('practice_sessions')
        .select('id, score_percentage, completed_at, skill')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(5),
    ])

  const profile = profileResult.data
  const progress = progressResult.data ?? []
  const recentSessions = sessionsResult.data ?? []

  const firstName =
    profile?.full_name?.split(' ')[0] ?? 'there'

  const progressMap = new Map(
    progress.map((p) => [p.skill, p])
  )

  const totalAttempted = progress.reduce(
    (sum, p) => sum + p.questions_attempted, 0
  )
  const totalCorrect = progress.reduce(
    (sum, p) => sum + p.questions_correct, 0
  )
  const overallAccuracy =
    totalAttempted > 0
      ? Math.round((totalCorrect / totalAttempted) * 100)
      : 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Greeting */}
      <div className="mb-6 slide-in">
        <h1 className="font-display text-3xl font-bold
                       text-text-primary">
          Hallo, {firstName} 👋
        </h1>
        <p className="font-body text-text-muted mt-1">
          {totalAttempted === 0
            ? 'Start your first practice session below.'
            : `${totalAttempted} questions practiced · ${overallAccuracy}% accuracy`}
        </p>
      </div>

      {/* Stats row */}
      {totalAttempted > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: 'Practiced',
              value: totalAttempted,
              suffix: '',
            },
            {
              label: 'Accuracy',
              value: overallAccuracy,
              suffix: '%',
            },
            {
              label: 'Streak',
              value: profile?.streak_days ?? 0,
              suffix: '🔥',
            },
          ].map((stat) => (
            <div key={stat.label}
                 className="card text-center py-4 px-2">
              <p className="font-display text-2xl font-bold
                            text-primary">
                {stat.value}{stat.suffix}
              </p>
              <p className="font-body text-xs text-text-muted mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Level badge */}
      <div className="card mb-6 flex items-center
                      justify-between py-4">
        <div>
          <p className="font-body text-xs text-text-muted
                        uppercase tracking-wider mb-1">
            Current Level
          </p>
          <p className="font-display text-4xl font-bold
                        text-primary">
            {profile?.current_level?.toUpperCase() ?? 'A1'}
          </p>
        </div>
        <div className="text-right">
          <p className="font-body text-xs text-text-muted
                        uppercase tracking-wider mb-2">
            Progress
          </p>
          <div className="flex gap-1">
            {SKILLS.map((s) => {
              const sp = progressMap.get(s.skill)
              const best = sp?.best_score ?? 0
              return (
                <div
                  key={s.skill}
                  className={`w-8 h-8 rounded-lg flex items-center
                              justify-center text-xs font-bold
                              font-body ${
                    best >= 80
                      ? 'bg-success/20 text-success'
                      : best > 0
                      ? 'bg-accent-soft text-text-primary'
                      : 'bg-border text-text-muted'
                  }`}
                  title={`${s.label}: ${best}%`}
                >
                  {s.emoji}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Skill cards */}
      <p className="font-body text-sm font-medium text-text-muted
                    uppercase tracking-wider mb-3">
        Practice now
      </p>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {SKILLS.map((item) => {
          const sp = progressMap.get(item.skill)
          const bestScore = sp?.best_score ?? 0
          const attempted = sp?.questions_attempted ?? 0
          const hasProgress = attempted > 0

          return (
            <a
              key={item.skill}
              href={`/practice/a1/${item.skill}`}
              className="card flex items-center gap-4
                         hover:shadow-card-hover transition-all
                         duration-200 active:scale-95 cursor-pointer"
            >
              <span className="text-3xl">{item.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center
                                justify-between mb-1">
                  <p className="font-display text-lg font-bold
                                text-text-primary">
                    {item.label}
                  </p>
                  {hasProgress && (
                    <span className={`badge text-xs
                                     ${getScoreBadge(bestScore)}`}>
                      {Math.round(bestScore)}%
                    </span>
                  )}
                </div>
                <p className="font-body text-sm text-text-muted
                               mb-2">
                  {item.description}
                </p>
                {hasProgress && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${bestScore}%` }}
                    />
                  </div>
                )}
              </div>
              <svg className="w-5 h-5 text-text-muted
                              flex-shrink-0"
                   fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )
        })}
      </div>

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div>
          <p className="font-body text-sm font-medium
                        text-text-muted uppercase tracking-wider
                        mb-3">
            Recent Sessions
          </p>
          <div className="card divide-y divide-border p-0
                          overflow-hidden">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between
                           px-4 py-3"
              >
                <div>
                  <p className="font-body text-sm font-medium
                                text-text-primary capitalize">
                    {session.skill}
                  </p>
                  <p className="font-body text-xs text-text-muted">
                    {new Date(session.completed_at)
                      .toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                  </p>
                </div>
                <span className={`font-display text-lg font-bold
                                 ${getScoreColor(
                                   session.score_percentage
                                 )}`}>
                  {Math.round(session.score_percentage)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalAttempted === 0 && (
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🇩🇪</p>
          <p className="font-display text-xl font-bold
                        text-text-primary mb-2">
            Bereit? Let's start.
          </p>
          <p className="font-body text-sm text-text-muted">
            Pick a skill above and begin your first session.
          </p>
        </div>
      )}
    </div>
  )
}
