import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-lg mx-auto w-full">
        <span className="font-bold text-lg">
          Deutsch<span className="text-emerald-400">Ready</span>
        </span>
        <Link
          href="/auth"
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-lg mx-auto w-full">
        <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-medium mb-6">
          🇩🇪 Built for Africans preparing for German exams
        </div>

        <h1 className="text-4xl font-bold leading-tight mb-4">
          Pass Your German Exam.<br />
          <span className="text-emerald-400">First Try.</span>
        </h1>

        <p className="text-gray-400 text-base leading-relaxed mb-8">
          Affordable TELC and Goethe A1 exam prep built specifically
          for Nigerian and African learners. Practice the exact skills
          that appear on your exam.
        </p>

        <Link
          href="/auth"
          className="w-full bg-emerald-400 text-black font-bold py-4 rounded-2xl text-center hover:bg-emerald-300 transition text-lg mb-4"
        >
          Start Practising Free →
        </Link>

        <p className="text-gray-600 text-xs">
          No credit card required · Free to start
        </p>
      </section>

      {/* Skills section */}
      <section className="px-6 pb-12 max-w-lg mx-auto w-full">
        <p className="text-gray-500 text-xs uppercase tracking-wider text-center mb-4">
          What you'll practice
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📝', label: 'Grammatik', desc: 'Grammar rules' },
            { icon: '📖', label: 'Lesen', desc: 'Reading' },
            { icon: '🎧', label: 'Hören', desc: 'Listening' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center"
            >
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-xs font-semibold">{s.label}</p>
              <p className="text-xs text-gray-600 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx)
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    return { redirect: { destination: '/dashboard', permanent: false } }
  }
  return { props: {} }
}
