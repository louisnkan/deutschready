import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Logo from '../components/Logo'

export default function Home() {
  return (
    <main style={{ backgroundColor: '#F8F9FA' }} className="min-h-screen text-gray-900">

      {/* Nav */}
      <nav style={{ backgroundColor: '#F8F9FA' }} className="sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" href="/" />
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              Blog
            </Link>
            <Link
              href="/auth"
              className="text-sm font-semibold px-4 py-2 rounded-lg transition"
              style={{ backgroundColor: '#1B4332', color: '#fff' }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
          style={{ backgroundColor: '#1B4332', color: '#FFB703' }}
        >
          🇩🇪 Built for Nigerians and Africans preparing for German exams
        </div>

        <h1
          className="font-fraunces text-5xl font-black leading-tight mb-6"
          style={{ color: '#1B4332' }}
        >
          Pass Your German Exam.<br />
          <span style={{ color: '#FFB703' }}>First Try.</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-10 leading-relaxed">
          Affordable TELC and Goethe A1 exam preparation built specifically
          for Nigerian and African learners. Practice the exact skills that
          appear on your exam — in your own time, on your phone.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link
            href="/auth"
            className="font-bold px-8 py-4 rounded-xl text-base transition hover:opacity-90"
            style={{ backgroundColor: '#FFB703', color: '#1B4332' }}
          >
            Start Practising Free →
          </Link>
          <Link
            href="/blog/how-to-prepare-telc-a1-nigeria"
            className="font-semibold px-8 py-4 rounded-xl text-base transition border-2"
            style={{ borderColor: '#1B4332', color: '#1B4332' }}
          >
            Read the Study Guide
          </Link>
        </div>
        <p className="text-xs text-gray-400">No credit card required · Free to start</p>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-center text-gray-400 mb-8">
          How it works
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { step: '01', title: 'Create your account', desc: 'Sign up with just your email — no password needed. OTP sent instantly.' },
            { step: '02', title: 'Choose your skill', desc: 'Pick Grammatik, Lesen, or Hören. Questions ordered by difficulty.' },
            { step: '03', title: 'Practice and improve', desc: 'Get instant feedback after every answer. Track your progress over time.' },
          ].map((s) => (
            <div key={s.step} className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="font-fraunces text-3xl font-black mb-3" style={{ color: '#FFB703' }}>
                {s.step}
              </p>
              <p className="font-semibold mb-2" style={{ color: '#1B4332' }}>{s.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-center text-gray-400 mb-8">
          What you'll practise
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '📝', label: 'Grammatik', desc: 'Grammar rules and sentence structure. Cases, verb conjugation, articles.' },
            { icon: '📖', label: 'Lesen', desc: 'Reading comprehension. Short texts, signs, messages, and notices.' },
            { icon: '🎧', label: 'Hören', desc: 'Listening scenarios. Dialogues and announcements described in text.' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
              <p className="text-3xl mb-3">{s.icon}</p>
              <p className="font-semibold text-sm mb-2" style={{ color: '#1B4332' }}>{s.label}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-center text-gray-400 mb-2">
          Pricing
        </p>
        <h2 className="font-fraunces text-3xl font-black text-center mb-10" style={{ color: '#1B4332' }}>
          Simple, affordable pricing
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <p className="font-semibold text-gray-500 text-sm mb-1">Free</p>
            <p className="font-fraunces text-4xl font-black mb-1" style={{ color: '#1B4332' }}>₦0</p>
            <p className="text-xs text-gray-400 mb-6">Forever free</p>
            <ul className="space-y-3 mb-8 text-sm text-gray-600">
              {[
                '10 questions per skill per day',
                'Basic progress tracking',
                'All 3 skills accessible',
                'OTP email login',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span style={{ color: '#40916C' }} className="mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth"
              className="block w-full text-center font-semibold py-3 rounded-xl border-2 transition text-sm"
              style={{ borderColor: '#1B4332', color: '#1B4332' }}
            >
              Get started free
            </Link>
          </div>

          {/* Premium */}
          <div
            className="rounded-2xl p-6 border-2 relative"
            style={{ backgroundColor: '#1B4332', borderColor: '#FFB703' }}
          >
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: '#FFB703', color: '#1B4332' }}
            >
              Most Popular
            </div>
            <p className="font-semibold text-sm mb-1" style={{ color: '#FFB703' }}>Premium</p>
            <p className="font-fraunces text-4xl font-black text-white mb-1">₦4,500</p>
            <p className="text-xs mb-6" style={{ color: '#40916C' }}>per month</p>
            <ul className="space-y-3 mb-8 text-sm text-white">
              {[
                'Unlimited questions per session',
                'AI wrong-answer explanations',
                'Full progress analytics',
                'Streak tracking and daily goals',
                'Priority support',
                'Early access to A2, B1, B2 levels',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span style={{ color: '#FFB703' }} className="mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth"
              className="block w-full text-center font-bold py-3 rounded-xl transition text-sm"
              style={{ backgroundColor: '#FFB703', color: '#1B4332' }}
            >
              Get Premium →
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Weekly (₦1,500) and quarterly (₦11,000) plans coming soon
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="font-fraunces text-3xl font-black text-center mb-10" style={{ color: '#1B4332' }}>
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Is DeutschReady suitable for complete beginners?',
              a: 'Yes. All current questions are A1 level — the very start of German. No prior knowledge needed.',
            },
            {
              q: 'Which exams does DeutschReady prepare for?',
              a: 'TELC A1 and Goethe-Zertifikat A1. Both exams share the same CEFR A1 standard. Our question bank covers all tested skills.',
            },
            {
              q: 'Why is the price in Naira?',
              a: 'We built this for Nigerians. Pricing in Naira means no conversion surprises. Students in Ghana, Kenya, and internationally can also use the platform.',
            },
            {
              q: 'When will A2, B1, and B2 levels be available?',
              a: 'A2 is planned for release within 60 days of V1 launch. Premium subscribers get early access when each level drops.',
            },
            {
              q: 'How is this different from Duolingo?',
              a: 'DeutschReady is built specifically for exam preparation, not general language learning. Every question is modelled on the actual TELC and Goethe exam format.',
            },
          ].map((item) => (
            <div key={item.q} className="bg-white rounded-2xl p-5 border border-gray-100">
              <p className="font-semibold text-sm mb-2" style={{ color: '#1B4332' }}>{item.q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" href="/" />
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/blog" className="hover:text-gray-600 transition">Blog</Link>
            <Link href="/auth" className="hover:text-gray-600 transition">Sign in</Link>
            <span>·</span>
            <span style={{ fontSize: '10px', opacity: 0.4 }}>louis iv studio</span>
          </div>
        </div>
      </footer>

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
