/**
 * Main dashboard — user home after login
 * Shows level, skill cards, streak
 * Placeholder until hooks and progress data are wired
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — DeutschReady',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-8 slide-in">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          Hallo, {firstName} 👋
        </h1>
        <p className="font-body text-text-muted mt-1">
          Ready to practice your German today?
        </p>
      </div>

      {/* Current level badge */}
      <div className="card mb-6 flex items-center justify-between">
        <div>
          <p className="font-body text-xs text-text-muted
                        uppercase tracking-wider mb-1">
            Current Level
          </p>
          <p className="font-display text-4xl font-bold text-primary">
            {profile?.current_level?.toUpperCase() ?? 'A1'}
          </p>
        </div>
        <div className="text-right">
          <p className="font-body text-xs text-text-muted
                        uppercase tracking-wider mb-1">
            Streak
          </p>
          <p className="font-display text-4xl font-bold text-accent">
            {profile?.streak_days ?? 0}
            <span className="text-2xl ml-1">🔥</span>
          </p>
        </div>
      </div>

      {/* Skill cards — A1 only for now */}
      <p className="font-body text-sm font-medium text-text-muted
                    uppercase tracking-wider mb-3">
        Choose a skill to practice
      </p>

      <div className="grid grid-cols-1 gap-4">
        {[
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
        ].map((item) => (
          <a
            key={item.skill}
            href={`/practice/a1/${item.skill}`}
            className="card flex items-center gap-4
                       hover:shadow-card-hover transition-all
                       duration-200 active:scale-95 cursor-pointer"
          >
            <span className="text-3xl">{item.emoji}</span>
            <div className="flex-1">
              <p className="font-display text-lg font-bold
                            text-text-primary">
                {item.label}
              </p>
              <p className="font-body text-sm text-text-muted">
                {item.description}
              </p>
            </div>
            <svg className="w-5 h-5 text-text-muted flex-shrink-0"
                 fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}
