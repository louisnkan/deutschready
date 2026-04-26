import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

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
  fullName: string | null
  streakDays: number
  skillProgress: SkillProgress[]
  lastSession: LastSession | null
  totalSessions: number
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
  fullName,
  streakDays,
  skillProgress,
  lastSession,
  totalSessions,
}: Props) {
  const router = useRouter()
  const supabase = useSupabaseClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  // Build full skill map including unpracticed skills at 0
  const skillMap = Object.fromEntries(
    skillProgress.map((s) => [s.skill, s])
  )

  const allSkillData = ALL_SKILLS.map((skill) => ({
    skill,
    questions_attempted: skillMap[skill]?.questions_attempted ?? 0,
    questions_correct: skillMap[skill]?.questions_correct ?? 0,
    best_score: skillMap[skill]?.best_score ?? 0,
    last_practiced_at: skillMap[skill]?.last_practiced_at ?? null,
  }))

  const displayName = fullName || email.split('@')[0]

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold">
              Hey, {displayName} 👋
            </h1>
            <p className="text-gray-500 text-sm">A1 · German Exam Prep</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-gray-500 text-sm hover:text-gray-300 transition"
          >
            Sign out
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-2xl font-bold text-emerald-400">{streakDays}</p>
            <p className="text-gray-500 text-xs mt-1">Day streak 🔥</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-2xl font-bold text-emerald-400">{totalSessions}</p>
            <p className="text-gray-500 text-xs mt-1">Sessions done</p>
          </div>
        </div>

        {/* Last session */}
        {lastSession && (
          <div className="bg-gray-900 border border-emerald-900 rounded-2xl p-4 mb-8">
            <p className="text-xs text-gray-500 mb-2">Last session</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {SKILL_ICONS[lastSession.skill]} {SKILL_LABELS[lastSession.skill]}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {lastSession.correct_answers}/{lastSession.total_questions} correct
                </p>
              </div>
              <p className="text-3xl font-bold text-emerald-400">
                {Math.round(lastSession.score_percentage)}%
              </p>
            </div>
          </div>
        )}

        {/* Skill progress */}
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Your Progress
        </h2>

        <div className="space-y-3 mb-8">
          {allSkillData.map((s) => {
            const accuracy = s.questions_attempted > 0
              ? Math.round((s.questions_correct / s.questions_attempted) * 100)
              : 0
            return (
              <div
                key={s.skill}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span>{SKILL_ICONS[s.skill]}</span>
                    <span className="font-medium">{SKILL_LABELS[s.skill]}</span>
                  </div>
                  <span className="text-emerald-400 font-bold text-sm">
                    {s.best_score > 0 ? `Best: ${Math.round(s.best_score)}%` : 'Not started'}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                  <div
                    className="bg-emerald-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{s.questions_attempted} attempted</span>
                  <span>{accuracy}% accuracy</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Start practice CTA */}
        <Link
          href="/quiz"
          className="block w-full bg-emerald-400 text-black font-bold py-4 rounded-2xl text-center hover:bg-emerald-300 transition text-lg"
        >
          Start Practicing →
        </Link>

      </div>
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

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, streak_days')
    .eq('id', userId)
    .single()

  // Fetch skill progress
  const { data: skillProgress } = await supabase
    .from('skill_progress')
    .select('skill, questions_attempted, questions_correct, best_score, last_practiced_at')
    .eq('user_id', userId)
    .eq('level', 'a1')

  // Fetch last completed session
  const { data: sessions } = await supabase
    .from('practice_sessions')
    .select('skill, score_percentage, correct_answers, total_questions, completed_at')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(1)

  // Fetch total session count
  const { count: totalSessions } = await supabase
    .from('practice_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .not('completed_at', 'is', null)

  return {
    props: {
      email: session.user.email ?? '',
      fullName: profile?.full_name ?? null,
      streakDays: profile?.streak_days ?? 0,
      skillProgress: skillProgress ?? [],
      lastSession: sessions?.[0] ?? null,
      totalSessions: totalSessions ?? 0,
    },
  }
}
