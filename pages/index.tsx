import Link from 'next/link'
import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Head from 'next/head'
import Logo from '../components/Logo'

type Props = { isLoggedIn: boolean; firstName?: string }

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null)
  const items = [
    {
      q: 'Is DeutschReady suitable for complete beginners?',
      a: 'Yes. All current questions are A1 level — the very start of German. No prior knowledge needed. You will be guided from zero.',
    },
    {
      q: 'Which exams does DeutschReady prepare for?',
      a: 'TELC A1 and Goethe-Zertifikat A1. Both share the same CEFR A1 standard. Our question bank covers all tested skills for both exams.',
    },
    {
      q: 'Why is the price in Naira?',
      a: 'We built this for Nigerians. Pricing in Naira means no conversion surprises. A failed exam costs ₦30,000–₦50,000 to resit. Premium is ₦4,500. The math is simple.',
    },
    {
      q: 'When will A2, B1, and B2 levels be available?',
      a: 'A2 is planned within 60 days of V1 launch. Premium subscribers get early access when each level drops.',
    },
    {
      q: 'How is this different from Duolingo?',
      a: 'Duolingo teaches casual German. DeutschReady prepares you to pass a specific exam. Every question is modelled on real TELC and Goethe A1 exam format. We know what Nigerian candidates struggle with — we built for that.',
    },
    {
      q: 'What if I fail my exam?',
      a: 'We cannot guarantee a pass — no product honestly can. What we guarantee is that you will have practised the exact question types that appear on your exam, with explanations for every wrong answer.',
    },
  ]

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-semibold text-sm" style={{ color: '#1B4332' }}>{item.q}</span>
            <span
              className="text-lg font-bold flex-shrink-0"
              style={{
                color: '#1B4332',
                transition: 'transform 0.2s',
                display: 'inline-block',
                transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
              }}
            >
              +
            </span>
          </button>
          {open === i && (
            <div className="px-5 pb-4">
              <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Home({ isLoggedIn, firstName }: Props) {
  return (
    <>
      <Head>
        <title>DeutschReady — German Exam Prep for Nigerians | TELC A1 & Goethe A1</title>
        <meta name="description" content="Pass your TELC A1 or Goethe A1 German exam first try. Affordable exam preparation built specifically for Nigerian and African learners. Start free today." />
        <meta property="og:title" content="DeutschReady — German Exam Prep for Nigerians" />
        <meta property="og:description" content="Pass your TELC A1 or Goethe A1 German exam first try. Built for Nigerian and African learners." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://deutschready.xyz" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is DeutschReady suitable for complete beginners?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. All current questions are A1 level. No prior knowledge needed."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Which exams does DeutschReady prepare for?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "TELC A1 and Goethe-Zertifikat A1. Both share the same CEFR A1 standard."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How is DeutschReady different from Duolingo?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Duolingo teaches casual German. DeutschReady prepares you to pass a specific exam with real TELC and Goethe A1 question formats."
                  }
                }
              ]
            })
          }}
        />
      </Head>

      <main style={{ backgroundColor: '#F8F9FA' }} className="min-h-screen text-gray-900">

        {/* Nav */}
        <nav style={{ backgroundColor: '#F8F9FA' }} className="sticky top-0 z-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Logo size="md" href="/" />
            <div className="flex items-center gap-4">
              <Link href="/blog" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                Blog
              </Link>
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="text-sm font-bold px-4 py-2 rounded-lg transition"
                  style={{ backgroundColor: '#1B4332', color: '#fff' }}
                >
                  {firstName ? `Hey, ${firstName} →` : 'Dashboard →'}
                </Link>
              ) : (
                <Link
                  href="/auth"
                  className="text-sm font-bold px-4 py-2 rounded-lg transition"
                  style={{ backgroundColor: '#1B4332', color: '#fff' }}
                >
                  Sign in
                </Link>
              )}
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
            className="font-fraunces font-black leading-tight mb-6"
            style={{ color: '#1B4332', fontSize: 'clamp(2.5rem, 8vw, 4rem)' }}
          >
            Pass Your German Exam.<br />
            <span style={{ color: '#FFB703' }}>First Try.</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-4 leading-relaxed">
            Affordable TELC and Goethe A1 exam preparation built specifically
            for Nigerian and African learners. Practice the exact skills that
            appear on your exam — in your own time, on your phone.
          </p>

          <p className="text-sm font-semibold mb-8" style={{ color: '#1B4332' }}>
            A failed exam costs ₦30,000+ to resit. Premium costs ₦4,500/month.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Link
              href={isLoggedIn ? '/dashboard' : '/auth'}
              className="font-bold px-8 py-4 rounded-xl text-base transition hover:opacity-90"
              style={{ backgroundColor: '#FFB703', color: '#1B4332' }}
            >
              {isLoggedIn ? 'Go to Dashboard →' : 'Start Practising Free →'}
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

        {/* Social proof bar */}
        <section style={{ backgroundColor: '#1B4332' }} className="py-4">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-center text-sm font-medium" style={{ color: '#FFB703' }}>
              360 A1 exam questions · Grammatik · Lesen · Hören · Built for your exam date
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-center text-gray-400 mb-10">
            How it works
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Tell us your exam date',
                desc: 'We calculate your daily practice target and show your countdown. No guesswork — just a clear plan.',
              },
              {
                step: '02',
                title: 'Practice the right skills',
                desc: 'Grammatik, Lesen, Hören — the exact three written skills tested on TELC and Goethe A1.',
              },
              {
                step: '03',
                title: 'See your gaps close',
                desc: 'Every session updates your progress. Watch your accuracy climb week by week until you\'re ready.',
              },
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
        <section style={{ backgroundColor: '#fff' }} className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-center text-gray-400 mb-10">
              What you'll practise
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: '📝',
                  label: 'Grammatik',
                  desc: 'Cases, verb conjugation, articles, sentence structure.',
                  count: '120 questions',
                },
                {
                  icon: '📖',
                  label: 'Lesen',
                  desc: 'Short texts, signs, notices, messages.',
                  count: '120 questions',
                },
                {
                  icon: '🎧',
                  label: 'Hören',
                  desc: 'Dialogue scenarios and everyday conversations.',
                  count: '120 questions',
                },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl p-5 border border-gray-100 text-center">
                  <p className="text-3xl mb-3">{s.icon}</p>
                  <p className="font-semibold text-sm mb-1" style={{ color: '#1B4332' }}>{s.label}</p>
                  <p className="text-xs text-gray-400 leading-relaxed mb-2">{s.desc}</p>
                  <p className="text-xs font-semibold" style={{ color: '#40916C' }}>{s.count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-center text-gray-400 mb-4">
            Pricing
          </p>
          <h2 className="font-fraunces text-3xl font-black text-center mb-3" style={{ color: '#1B4332' }}>
            Less than the cost of failing
          </h2>
          <p className="text-center text-gray-500 text-sm mb-10 max-w-md mx-auto">
            A TELC exam resit in Nigeria costs ₦30,000–₦50,000. Premium is ₦4,500/month.
            The math is obvious.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <p className="font-semibold text-gray-500 text-sm mb-1">Free</p>
              <p className="font-fraunces text-4xl font-black mb-1" style={{ color: '#1B4332' }}>₦0</p>
              <p className="text-xs text-gray-400 mb-6">Forever free · No card needed</p>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                {[
                  '10 questions per skill per day',
                  'Basic progress tracking',
                  'All 3 skills accessible',
                  'OTP email login — no password',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span style={{ color: '#40916C' }} className="mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                {[
                  'AI wrong-answer explanations',
                  'Unlimited daily practice',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 opacity-40">
                    <span className="mt-0.5 flex-shrink-0">✗</span>
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
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                style={{ backgroundColor: '#FFB703', color: '#1B4332' }}
              >
                Most Popular
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: '#FFB703' }}>Premium</p>
              <p className="font-fraunces text-4xl font-black text-white mb-1">₦4,500</p>
              <p className="text-xs mb-6" style={{ color: '#40916C' }}>
                per month · Cancel anytime
              </p>
              <ul className="space-y-3 mb-8 text-sm text-white">
                {[
                  'Unlimited questions per session',
                  'AI wrong-answer explanations',
                  'Full progress analytics',
                  'Streak tracking and daily goals',
                  'Exam countdown and daily targets',
                  'Priority support',
                  'Early access to A2, B1, B2 levels',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span style={{ color: '#FFB703' }} className="mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className="block w-full text-center font-bold py-3 rounded-xl transition text-sm hover:opacity-90"
                style={{ backgroundColor: '#FFB703', color: '#1B4332' }}
              >
                Get Premium — ₦4,500/month →
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Weekly (₦1,500) and quarterly (₦11,000 — saves ₦2,500) plans coming soon
          </p>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto px-6 py-12">
          <h2 className="font-fraunces text-3xl font-black text-center mb-10" style={{ color: '#1B4332' }}>
            Frequently asked questions
          </h2>
          <FAQAccordion />
        </section>

        {/* Final CTA */}
        <section
          className="py-16 text-center px-6"
          style={{ backgroundColor: '#1B4332' }}
        >
          <h2 className="font-fraunces text-3xl font-black text-white mb-3">
            Your exam won't wait.<br />
            <span style={{ color: '#FFB703' }}>Start practising today.</span>
          </h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: '#40916C' }}>
            360 real exam questions. Instant feedback. Built for your timeline.
          </p>
          <Link
            href={isLoggedIn ? '/dashboard' : '/auth'}
            className="inline-block font-bold px-8 py-4 rounded-xl transition hover:opacity-90"
            style={{ backgroundColor: '#FFB703', color: '#1B4332' }}
          >
            {isLoggedIn ? 'Go to Dashboard →' : 'Start Practising Free →'}
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <Logo size="sm" href="/" />
              <div className="flex items-center gap-6 text-xs text-gray-400">
                <Link href="/blog" className="hover:text-gray-600 transition">Blog</Link>
                <Link href="/contact" className="hover:text-gray-600 transition">Contact</Link>
                <Link href="/auth" className="hover:text-gray-600 transition">Sign in</Link>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p style={{ fontSize: '11px', opacity: 0.35 }} className="text-gray-500">
                © 2026 Louis IV Studio · All rights reserved
              </p>
              <p style={{ fontSize: '11px', opacity: 0.35 }} className="text-gray-500">
                Built for Nigerians preparing for German exams
              </p>
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { props: { isLoggedIn: false } }
  }

  // Fetch first name for personalised nav
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', session.user.id)
    .single()

  const fullName = profile?.full_name ?? ''
  const firstName = fullName
    ? fullName.split(' ')[0].charAt(0).toUpperCase() +
      fullName.split(' ')[0].slice(1).toLowerCase()
    : session.user.email?.split('@')[0] ?? ''

  return {
    props: {
      isLoggedIn: true,
      firstName,
    },
  }
}
