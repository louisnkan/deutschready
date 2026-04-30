import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
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
  examDate: string | null
  isNewUser: boolean
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

const appBg = '#0F1117'
const surface = '#1A1D27'
const border = '#2D3748'
const textPrimary = '#E8EAED'
const textMuted = '#6B7280'
const green = '#40916C'
const amber = '#FFB703'
const forest = '#1B4332'

function getDaysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getDailyTarget(daysLeft: number, totalSessions: number): number {
  if (daysLeft <= 0) return 3
  // Recommend 1 session per day minimum, more if behind
  const idealSessions = daysLeft * 1
  const behindBy = Math.max(0, idealSessions - totalSessions * 2)
  return behindBy > 10 ? 2 : 1
}

// Exam date onboarding modal
function ExamDateModal({
  onSave,
  onSkip,
}: {
  onSave: (date: string) => void
  onSkip: () => void
}) {
  const [date, setDate] = useState('')
  const [saving, setSaving] = useState(false)

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minStr = minDate.toISOString().split('T')[0]

  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 2)
  const maxStr = maxDate.toISOString().split('T')[0]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{ backgroundColor: surface, border: `1px solid ${border}` }}
      >
        <p className="text-4xl mb-4">🗓️</p>
        <h2
          className="font-fraunces text-2xl font-black mb-2"
          style={{ color: textPrimary }}
        >
          When is your exam?
        </h2>
        <p className="text-sm mb-6" style={{ color: textMuted }}>
          We'll build your personal countdown and tell you exactly how many sessions you need each day to be ready.
        </p>

        <input
          type="date"
          value={date}
          min={minStr}
          max={maxStr}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-base mb-4 text-center font-semibold focus:outline-none"
          style={{
            backgroundColor: appBg,
            border: `1px solid ${border}`,
            color: textPrimary,
          }}
        />

        {date && (
          <p className="text-sm font-semibold mb-4" style={{ color: amber }}>
            {getDaysUntil(date)} days until your exam
          </p>
        )}

        <button
          onClick={async () => {
            if (!date) return
            setSaving(true)
            await onSave(date)
            setSaving(false)
          }}
          disabled={!date || saving}
          className="w-full font-bold py-4 rounded-xl mb-3 transition disabled:opacity-40"
          style={{ backgroundColor: amber, color: forest }}
        >
          {saving ? 'Saving...' : 'Set my exam date →'}
        </button>

        <button
          onClick={onSkip}
          className="w-full text-sm py-2 transition"
          style={{ color: textMuted }}
        >
          I'll do this later
        </button>
      </div>
    </div>
  )
}

// Premium upsell modal
function PremiumModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{ backgroundColor: forest, border: `2px solid ${amber}` }}
      >
        <p className="text-4xl mb-4">⏸️</p>
        <h2 className="font-fraunces text-2xl font-black text-white mb-2">
          You've hit your daily limit
        </h2>
        <p className="text-sm mb-2" style={{ color: '#40916C' }}>
          Free users get 10 questions per skill per day.
        </p>
        <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
          Premium users practice without limits — right now, any time they need.
          Your exam won't wait for tomorrow.
        </p>

        <div
          className="rounded-2xl p-4 mb-6 text-left"
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: amber }}>
            Premium — ₦4,500/month
          </p>
          {[
            'Unlimited questions per session',
            'AI wrong-answer explanations',
            'Full progress analytics',
            'Early access to A2 level',
          ].map((f) => (
            <p key={f} className="text-xs text-white mb-1">
              <span style={{ color: amber }}>✓ </span>{f}
            </p>
          ))}
        </div>

        <p className="text-xs mb-4" style={{ color: '#6B7280' }}>
          A failed exam resit costs ₦30,000–₦50,000.
          Premium costs ₦4,500. One month of preparation
          costs less than one retake fee.
        </p>

        <Link
          href="/contact"
          className="block w-full font-bold py-4 rounded-xl mb-3 transition hover:opacity-90"
          style={{ backgroundColor: amber, color: forest }}
          onClick={onClose}
        >
          Get Premium →
        </Link>

        <button
          onClick={onClose}
          className="w-full text-sm py-2"
          style={{ color: textMuted }}
        >
          Continue with free plan
        </button>
      </div>
    </div>
  )
}

export default function Dashboard({
  email,
  firstName,
  streakDays,
  skillProgress,
  lastSession,
  totalSessions,
  isPremium,
  examDate,
  isNewUser,
}: Props) {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [showExamModal, setShowExamModal] = useState(isNewUser && !examDate)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [currentExamDate, setCurrentExamDate] = useState(examDate)
  const [daysLeft, setDaysLeft] = useState(examDate ? getDaysUntil(examDate) : null)

  // Check for premium limit trigger from quiz
  useEffect(() => {
    if (router.query.limit === 'reached') {
      setShowPremiumModal(true)
      router.replace('/dashboard', undefined, { shallow: true })
    }
  }, [router.query])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSaveExamDate = async (date: string) => {
    await supabase
      .from('profiles')
      .update({ exam_date: date })
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
    setCurrentExamDate(date)
    setDaysLeft(getDaysUntil(date))
    setShowExamModal(false)
  }

  const skillMap = Object.fromEntries(skillProgress.map((s) => [s.skill, s]))
  const allSkillData = ALL_SKILLS.map((skill) => ({
    skill,
    questions_attempted: skillMap[skill]?.questions_attempted ?? 0,
    questions_correct: skillMap[skill]?.questions_correct ?? 0,
    best_score: skillMap[skill]?.best_score ?? 0,
    last_practiced_at: skillMap[skill]?.last_practiced_at ?? null,
  }))

  const dailyTarget = daysLeft ? getDailyTarget(daysLeft, totalSessions) : 1

  // Urgency level for countdown
  const urgencyColor = daysLeft === null
    ? green
    : daysLeft <= 7
    ? '#FC8181'
    : daysLeft <= 14
    ? amber
    : green

  return (
    <>
      <Head>
        <title>Dashboard — DeutschReady</title>
      </Head>

      {showExamModal && (
        <ExamDateModal
          onSave={handleSaveExamDate}
          onSkip={() => setShowExamModal(false)}
        />
      )}

      {showPremiumModal && (
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}

      <main
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: appBg, color: textPrimary }}
      >
        {/* Nav */}
        <nav
          className="flex items-center justify-between px-4 py-4 border-b"
          style={{ borderColor: surface }}
        >
          <Logo size="md" href="/" />
          <div className="flex items-center gap-3">
            {isPremium && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: amber, color: forest }}
              >
                Premium
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="text-xs font-medium transition"
              style={{ color: textMuted }}
            >
              Sign out
            </button>
          </div>
        </nav>

        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">

          {/* Greeting */}
          <div className="mb-6">
            <h1
              className="font-fraunces text-2xl font-black"
              style={{ color: textPrimary }}
            >
              Hey, {firstName} 👋
            </h1>
            <p className="text-sm mt-0.5" style={{ color: textMuted }}>
              A1 · German Exam Prep
            </p>
          </div>

          {/* Exam countdown — hero card */}
          {currentExamDate && daysLeft !== null ? (
            <div
              className="rounded-2xl p-5 mb-6 border"
              style={{
                backgroundColor: surface,
                borderColor: urgencyColor,
                borderWidth: '1.5px',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: textMuted }}>
                  Exam countdown
                </p>
                <button
                  onClick={() => setShowExamModal(true)}
                  className="text-xs"
                  style={{ color: textMuted }}
                >
                  Edit date
                </button>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p
                    className="font-fraunces text-5xl font-black leading-none mb-1"
                    style={{ color: urgencyColor }}
                  >
                    {daysLeft}
                  </p>
                  <p className="text-sm" style={{ color: textMuted }}>
                    {daysLeft === 1 ? 'day left' : 'days left'}
                    {' · '}{new Date(currentExamDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: amber }}
                  >
                    {dailyTarget}
                  </p>
                  <p className="text-xs" style={{ color: textMuted }}>
                    session{dailyTarget > 1 ? 's' : ''} today
                  </p>
                </div>
              </div>
              {daysLeft <= 7 && (
                <div
                  className="mt-3 rounded-xl px-3 py-2 text-xs font-semibold text-center"
                  style={{ backgroundColor: 'rgba(252,129,129,0.1)', color: '#FC8181' }}
                >
                  ⚠️ Final week — practise every skill today
                </div>
              )}
              {daysLeft > 7 && daysLeft <= 14 && (
                <div
                  className="mt-3 rounded-xl px-3 py-2 text-xs font-semibold text-center"
                  style={{ backgroundColor: 'rgba(255,183,3,0.1)', color: amber }}
                >
                  2 weeks left — increase to daily sessions now
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowExamModal(true)}
              className="w-full rounded-2xl p-5 mb-6 border text-left transition"
              style={{
                backgroundColor: surface,
                borderColor: border,
                borderStyle: 'dashed',
              }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: amber }}>
                🗓️ Set your exam date
              </p>
              <p className="text-xs" style={{ color: textMuted }}>
                Get a personal countdown and daily practice target
              </p>
            </button>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-2xl p-4" style={{ backgroundColor: surface }}>
              <p className="text-2xl font-bold" style={{ color: green }}>{streakDays}</p>
              <p className="text-xs mt-1" style={{ color: textMuted }}>
                {streakDays === 0 ? 'Start your streak 🔥' : `Day streak 🔥`}
              </p>
            </div>
            <div className="rounded-2xl p-4" style={{ backgroundColor: surface }}>
              <p className="text-2xl font-bold" style={{ color: green }}>{totalSessions}</p>
              <p className="text-xs mt-1" style={{ color: textMuted }}>Sessions done</p>
            </div>
          </div>

          {/* Streak milestone */}
          {streakDays >= 3 && (
            <div
              className="rounded-2xl p-4 mb-6 text-center border"
              style={{ backgroundColor: surface, borderColor: green }}
            >
              <p className="text-sm font-semibold" style={{ color: green }}>
                {streakDays >= 7
                  ? `🏆 ${streakDays}-day streak! You're unstoppable.`
                  : `🔥 ${streakDays}-day streak! Keep it up.`}
              </p>
            </div>
          )}

          {/* Last session */}
          {lastSession && (
            <div
              className="rounded-2xl p-4 mb-6 border"
              style={{ backgroundColor: surface, borderColor: border }}
            >
              <p className="text-xs mb-3" style={{ color: textMuted }}>Last session</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold" style={{ color: textPrimary }}>
                    {SKILL_ICONS[lastSession.skill]} {SKILL_LABELS[lastSession.skill]}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                    {lastSession.correct_answers}/{lastSession.total_questions} correct
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold" style={{ color: amber }}>
                    {Math.round(lastSession.score_percentage)}%
                  </p>
                  <p className="text-xs" style={{ color: textMuted }}>
                    {lastSession.score_percentage >= 80
                      ? '🏆 Excellent'
                      : lastSession.score_percentage >= 60
                      ? '💪 Good'
                      : '📚 Keep going'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress */}
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: textMuted }}
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
                  style={{ backgroundColor: surface, borderColor: border }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span>{SKILL_ICONS[s.skill]}</span>
                      <span className="font-medium text-sm" style={{ color: textPrimary }}>
                        {SKILL_LABELS[s.skill]}
                      </span>
                    </div>
                    <span
                      className="font-bold text-sm"
                      style={{ color: s.best_score > 0 ? green : textMuted }}
                    >
                      {s.best_score > 0
                        ? `Best: ${Math.round(s.best_score)}%`
                        : 'Not started'}
                    </span>
                  </div>
                  <div
                    className="w-full rounded-full h-1.5 mb-2"
                    style={{ backgroundColor: '#2D3748' }}
                  >
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${accuracy}%`, backgroundColor: green }}
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
              className="rounded-2xl p-5 mb-6 border"
              style={{ backgroundColor: surface, borderColor: amber }}
            >
              <p className="font-semibold text-sm mb-1" style={{ color: amber }}>
                Upgrade to Premium
              </p>
              <p className="text-xs mb-3" style={{ color: textMuted }}>
                Unlimited questions · AI explanations · Full analytics · ₦4,500/month
              </p>
              <p className="text-xs mb-4" style={{ color: '#4B5563' }}>
                A failed exam resit costs ₦30,000–₦50,000.
                One month of Premium costs less than 15% of a resit fee.
              </p>
              <Link
                href="/contact"
                className="block w-full text-center font-bold text-sm px-5 py-3 rounded-xl transition hover:opacity-90"
                style={{ backgroundColor: amber, color: forest }}
              >
                Get Premium →
              </Link>
            </div>
          )}

          {/* Start CTA */}
          <Link
            href="/quiz"
            className="block w-full font-bold py-4 rounded-2xl text-center transition text-base hover:opacity-90"
            style={{ backgroundColor: green, color: '#fff' }}
          >
            Start Practising →
          </Link>

          {/* Exam date nudge if not set */}
          {!currentExamDate && (
            <p className="text-center text-xs mt-4" style={{ color: textMuted }}>
              <button
                onClick={() => setShowExamModal(true)}
                className="underline"
                style={{ color: amber }}
              >
                Set your exam date
              </button>
              {' '}to get a personal countdown
            </p>
          )}

        </div>

        {/* Footer */}
        <footer
          className="border-t px-4 py-4 text-center"
          style={{ borderColor: surface }}
        >
          <p style={{ fontSize: '10px', opacity: 0.25, color: textPrimary }}>
            © 2026 Louis IV Studio · All rights reserved
          </p>
        </footer>

      </main>
    </>
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

  const [profileRes, skillRes, sessionRes, countRes] = await Promise.allSettled([
    supabase
      .from('profiles')
      .select('full_name, streak_days, last_practice_date, is_premium, exam_date')
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
  const lastSession = sessionRes.status === 'fulfilled'
    ? sessionRes.value.data?.[0] ?? null
    : null
  const totalSessions = countRes.status === 'fulfilled'
    ? countRes.value.count ?? 0
    : 0

  // Streak logic
  let streakDays = profile?.streak_days ?? 0
  const lastDate = profile?.last_practice_date

  if (lastDate) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    if (lastDate === today) {
      // unchanged
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

  const fullName = profile?.full_name ?? ''
  const firstName = fullName
    ? fullName.split(' ')[0].charAt(0).toUpperCase() +
      fullName.split(' ')[0].slice(1).toLowerCase()
    : session.user.email?.split('@')[0] ?? 'there'

  // New user = zero sessions and no exam date set
  const isNewUser = totalSessions === 0 && !profile?.exam_date

  return {
    props: {
      email: session.user.email ?? '',
      firstName,
      streakDays,
      skillProgress,
      lastSession,
      totalSessions,
      isPremium: profile?.is_premium ?? false,
      examDate: profile?.exam_date ?? null,
      isNewUser,
    },
  }
}
