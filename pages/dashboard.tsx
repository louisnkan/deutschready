import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Logo from '../components/Logo'

type SkillProgress = {
  skill: string
  questions_attempted: number
  questions_correct: number
  best_score: number
  last_practiced_at: string | null
}

type LastSession = {
  skill: string
  score_percentage: number
  correct_answers: number
  total_questions: number
  completed_at: string
}

type Props = {
  email: string
  firstName: string
  streakDays: number
  skillProgress: SkillProgress[]
  lastSession: LastSession | null
  totalSessions: number
  isPremium: boolean
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

const ALL_SKILLS = ['grammatik', 'lesen', 'hoeren']

export default function Dashboard({
  email,
  firstName,
  streakDays,
  skillProgress,
  lastSession,
  totalSessions,
  isPremium,
}: Props) {
  const router = useRouter()
  const supabase = useSupabaseClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const skillMap = Object.fromEntries(skillProgress.map((s) => [s.skill, s]))

  const allSkillData = ALL_SKILLS.map((skill) => ({
    skill,
    questions_attempted: skillMap[skill]?.questions_attempted ?? 0,
    questions_correct: skillMap[skill]?.questions_correct ?? 0,
    best_score: skillMap[skill]?.best_score ?? 0,
    last_practiced_at: skillMap[skill]?.last_practiced_at ?? null,
  }))

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0F1117', color: '#E8EAED' }}
    >
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-4 py-4 border-b"
        style={{ borderColor: '#1A1D27' }}
      >
        <Logo size="md" href="/" />
        <button
          onClick={handleSignOut}
          className="text-xs font-medium transition"
          style={{ color: '#6B7280' }}
        >
          Sign out
        </button>
      </nav>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">

        {/* Greeting */}
        <div className="mb-6">
          <h1 className="font-fraunces text-2xl font-black" style={{ color: '#E8EAED' }}>
            Hey, {firstName} 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
            A1 · German Exam Prep
            {isPremium && (
              <span
                className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#FFB703', color: '#1B4332' }}
              >
                Premium
              </span>
            )}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl p-4" style={{ backgroundColor: '#1A1D27' }}>
            <p className="text-2xl font-bold" style={{ color: '#40916C' }}>{streakDays}</p>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
              {streakDays === 0 ? 'Start your streak 🔥' : `Day streak 🔥`}
            </p>
          </div>
          <div className="rounded-2xl p-4" style={{ backgroundColor: '#1A1D27' }}>
            <p className="text-2xl font-bold" style={{ color: '#40916C' }}>{totalSessions}</p>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Sessions done</p>
          </div>
        </div>

        {/* Streak milestone */}
        {streakDays >= 3 && (
          <div
            className="rounded-2xl p-4 mb-6 text-center border"
            style={{ backgroundColor: '#1A1D27', borderColor: '#40916C' }}
          >
            <p className="text-sm font-semibold" style={{ color: '#40916C' }}>
              {streakDays >= 7
                ? '🏆 7-day streak! You\'re unstoppable.'
                : `🔥 ${streakDays}-day streak! Keep it up.`}
            </p>
          </div>
        )}

        {/* Last session */}
        {lastSession && (
          <div
            className="rounded-2xl p-4 mb-6 border"
            style={{ backgroundColor: '#1A1D27', borderColor: '#2D3748' }}
          >
            <p className="text-xs mb-3" style={{ color: '#6B7280' }}>Last session</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold" style={{ color: '#E8EAED' }}>
                  {SKILL_ICONS[lastSession.skill]} {SKILL_LABELS[lastSession.skill]}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                  {lastSession.correct_answers}/{lastSession.total_questions} correct
                </p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#FFB703' }}>
                {Math.round(lastSession.score_percentage)}%
              </p>
            </div>
          </div>
        )}

        {/* Progress */}
        <h2
          className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: '#6B7280' }}
        >
          Your Progress
        </h2>

        <div className="space-y-3 mb-6">
          {allSkillData.map((s) => {
            const accuracy = s.questions_attempted > 0
              ? Math.round((s.questions_correct / s.questions_attempted) * 100)
              : 0
            return (
              <div
                key={s.skill}
                className="rounded-2xl p-4 border"
                style={{ backgroundColor: '#1A1D27', borderColor: '#2D3748' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span>{SKILL_ICONS[s.skill]}</span>
                    <span className="font-medium text-sm" style={{ color: '#E8EAED' }}>
                      {SKILL_LABELS[s.skill]}
                    </span>
                  </div>
                  <span
                    className="font-bold text-sm"
                    style={{ color: s.best_score > 0 ? '#40916C' : '#6B7280' }}
                  >
                    {s.best_score > 0 ? `Best: ${Math.round(s.best_score)}%` : 'Not started'}
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-1.5 mb-2"
                  style={{ backgroundColor: '#2D3748' }}
                >
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${accuracy}%`, backgroundColor: '#40916C' }}
                  />
                </div>
                <div className="flex justify-between text-xs" style={{ color: '#4B5563' }}>
                  <span>{s.questions_attempted} attempted</span>
                  <span>{accuracy}% accuracy</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Premium upsell for free users */}
        {!isPremium && (
          <div
            className="rounded-2xl p-4 mb-6 border text-center"
            style={{ backgroundColor: '#1A1D27', borderColor: '#FFB703' }}
          >
            <p className="font-semibold text-sm mb-1" style={{ color: '#FFB703' }}>
              Upgrade to Premium
            </p>
            <p className="text-xs mb-3" style={{ color: '#6B7280' }}>
              Unlimited questions, AI explanations, full analytics. ₦4,500/month.
            </p>
            <Link
              href="/contact"
              className="inline-block font-bold text-sm px-5 py-2 rounded-xl transition"
              style={{ backgroundColor: '#FFB703', color: '#1B4332' }}
            >
              Get Premium →
            </Link>
          </div>
        )}

        {/* CTA */}
        <Link
          href="/quiz"
          className="block w-full font-bold py-4 rounded-2xl text-center transition text-base"
          style={{ backgroundColor: '#40916C', color: '#fff' }}
        >
          Start Practising →
        </Link>

      </div>

      {/* Footer */}
      <footer
        className="border-t px-4 py-4 text-center"
        style={{ borderColor: '#1A1D27' }}
      >
        <p style={{ fontSize: '10px', opacity: 0.25, color: '#E8EAED' }}>
          © 2026 Louis IV Studio · All rights reserved
        </p>
      </footer>

    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { redirect: { destination: '/auth', permanent: false } }
  }

  const userId = session.user.id
  const today = new Date().toISOString().split('T')[0]

  // Run all queries in parallel — 3 queries max
  const [profileRes, skillRes, sessionRes, countRes] = await Promise.allSettled([
    supabase
      .from('profiles')
      .select('full_name, streak_days, last_practice_date, is_premium')
      .eq('id', userId)
      .single(),
    supabase
      .from('skill_progress')
      .select('skill, questions_attempted, questions_correct, best_score, last_practiced_at')
      .eq('user_id', userId)
      .eq('level', 'a1'),
    supabase
      .from('practice_sessions')
      .select('skill, score_percentage, correct_answers, total_questions, completed_at')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(1),
    supabase
      .from('practice_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('completed_at', 'is', null),
  ])

  const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : null
  const skillProgress = skillRes.status === 'fulfilled' ? skillRes.value.data ?? [] : []
  const lastSession = sessionRes.status === 'fulfilled' ? sessionRes.value.data?.[0] ?? null : null
  const totalSessions = countRes.status === 'fulfilled' ? countRes.value.count ?? 0 : 0

  // Streak logic
  let streakDays = profile?.streak_days ?? 0
  const lastDate = profile?.last_practice_date

  if (lastDate) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (lastDate === today) {
      // Already practiced today — unchanged
    } else if (lastDate === yesterdayStr) {
      streakDays = streakDays + 1
      await supabase
        .from('profiles')
        .update({ streak_days: streakDays, last_practice_date: today })
        .eq('id', userId)
    } else {
      streakDays = 0
      await supabase
        .from('profiles')
        .update({ streak_days: 0, last_practice_date: null })
        .eq('id', userId)
    }
  }

  // First name only
  const fullName = profile?.full_name ?? ''
  const firstName = fullName
    ? fullName.split(' ')[0].charAt(0).toUpperCase() +
      fullName.split(' ')[0].slice(1).toLowerCase()
    : session.user.email?.split('@')[0] ?? 'there'

  return {
    props: {
      email: session.user.email ?? '',
      firstName,
      streakDays,
      skillProgress,
      lastSession,
      totalSessions,
      isPremium: profile?.is_premium ?? false,
    },
  }
}
