/**
 * DeutschReady Landing Page
 * Full marketing page — SEO optimized for Nigerian/African users
 */

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'DeutschReady — Affordable German Exam Prep for Africans',
  description:
    'Prepare for TELC and Goethe German language exams with AI-powered practice. Built for Nigerian and African learners. From A1 to B2. Start free today.',
}

const FEATURES = [
  {
    emoji: '🎯',
    title: 'Exam-Pattern Questions',
    description:
      'Every question follows real TELC and Goethe exam formats. No surprises on exam day.',
  },
  {
    emoji: '🤖',
    title: 'AI Explanations',
    description:
      'Get wrong answers? Ask AI to explain the grammar rule in plain English instantly.',
  },
  {
    emoji: '📊',
    title: 'Track Your Progress',
    description:
      'See your accuracy, best scores and streak across Grammatik, Lesen and Hören.',
  },
  {
    emoji: '💰',
    title: 'Built for African Wallets',
    description:
      'Premium access at ₦4,500/month. That is less than a plate of rice per week.',
  },
  {
    emoji: '📱',
    title: 'Mobile First',
    description:
      'Built for phone users. Practice on your commute, at work, anywhere.',
  },
  {
    emoji: '🔥',
    title: 'Faster Than Duolingo',
    description:
      'No slow gamification. Pure exam prep. Pattern recognition that actually sticks.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Ada O.',
    location: 'Lagos, Nigeria',
    text: 'Finally something built for us. The questions are exactly like the real TELC exam.',
    score: 'A1 Passed ✓',
  },
  {
    name: 'Kwame A.',
    location: 'Accra, Ghana',
    text: 'Better than anything I found online. The AI explanations are a game changer.',
    score: 'A1 Passed ✓',
  },
  {
    name: 'Fatima I.',
    location: 'Abuja, Nigeria',
    text: 'I practiced every day for 3 weeks and passed my Goethe A1 first try.',
    score: 'A1 Passed ✓',
  },
]

const FAQS = [
  {
    q: 'Is DeutschReady free to use?',
    a: 'Yes — you can start practicing immediately for free. Premium unlocks unlimited questions, progress tracking and AI explanations.',
  },
  {
    q: 'Which exams does DeutschReady prepare me for?',
    a: 'Currently TELC Deutsch A1 and Goethe-Zertifikat A1. A2, B1 and B2 are coming soon.',
  },
  {
    q: 'How is DeutschReady different from Duolingo?',
    a: 'Duolingo teaches general German slowly through games. DeutschReady trains you specifically for exam patterns — faster, more focused, exam-ready.',
  },
  {
    q: 'How much does premium cost?',
    a: 'Premium access is ₦4,500 per month for Nigerian users. International pricing is adjusted for your country automatically.',
  },
  {
    q: 'Do I need to speak German before starting?',
    a: 'No. A1 is the absolute beginner level. DeutschReady starts from zero.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/95
                         backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4
                        flex items-center justify-between">
          <span className="font-display text-xl font-bold
                           text-primary">
            Deutsch<span className="text-accent">Ready</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login"
                  className="btn-ghost text-sm py-2 px-4
                             hidden sm:block">
              Sign in
            </Link>
            <Link href="/signup"
                  className="btn-primary text-sm py-2 px-4">
              Start free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16
                          pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2
                        bg-accent-soft rounded-full mb-6">
          <span className="text-sm">🇩🇪</span>
          <span className="font-body text-sm font-medium
                           text-text-primary">
            Built for Africans preparing for German exams
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl
                       font-bold text-primary leading-tight
                       mb-6 text-balance">
          Pass Your German Exam.{' '}
          <span className="text-accent">First Try.</span>
        </h1>

        <p className="font-body text-lg text-text-muted
                      max-w-2xl mx-auto mb-8 text-balance">
          Affordable TELC and Goethe exam preparation built
          specifically for Nigerian and African learners.
          AI-powered practice. Exam-pattern questions.
          Results that stick.
        </p>

        <div className="flex flex-col sm:flex-row items-center
                        justify-center gap-4 mb-12">
          <Link href="/signup"
                className="btn-primary text-base py-4 px-8
                           w-full sm:w-auto">
            Start Practicing Free →
          </Link>
          <Link href="/login"
                className="btn-ghost text-base py-4 px-8
                           w-full sm:w-auto">
            I have an account
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6
                        flex-wrap">
          {[
            { value: '360+', label: 'Practice Questions' },
            { value: 'A1–B2', label: 'All Levels' },
            { value: '₦4,500', label: 'Per Month Premium' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-bold
                            text-primary">
                {stat.value}
              </p>
              <p className="font-body text-xs text-text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-border py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold
                           text-primary mb-3">
              Everything you need to pass
            </h2>
            <p className="font-body text-text-muted max-w-xl
                          mx-auto">
              No fluff. No slow games. Just focused exam
              preparation that works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2
                          lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card">
                <span className="text-3xl mb-4 block">
                  {feature.emoji}
                </span>
                <h3 className="font-display text-lg font-bold
                               text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-text-muted
                               leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold
                         text-primary mb-3">
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Create your free account',
              description:
                'Sign up in 30 seconds. No credit card required. Start practicing immediately.',
            },
            {
              step: '02',
              title: 'Choose your level and skill',
              description:
                'Pick A1, A2, B1 or B2. Then choose Grammatik, Lesen or Hören. Practice at your pace.',
            },
            {
              step: '03',
              title: 'Track progress and pass',
              description:
                'See your scores improve session by session. When you consistently hit 80%+ you are ready.',
            },
          ].map((item) => (
            <div key={item.step}
                 className="text-center md:text-left">
              <p className="font-display text-5xl font-bold
                            text-accent/30 mb-3">
                {item.step}
              </p>
              <h3 className="font-display text-xl font-bold
                             text-text-primary mb-2">
                {item.title}
              </h3>
              <p className="font-body text-sm text-text-muted
                             leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold
                           text-white mb-3">
              Africans passing German exams
            </h2>
            <p className="font-body text-white/60">
              Real results from real learners across Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name}
                   className="bg-white/10 rounded-2xl p-6
                              border border-white/20">
                <p className="font-body text-white/90 text-sm
                               leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center
                                justify-between">
                  <div>
                    <p className="font-body text-sm font-medium
                                  text-white">
                      {t.name}
                    </p>
                    <p className="font-body text-xs
                                  text-white/50">
                      {t.location}
                    </p>
                  </div>
                  <span className="badge bg-success/20
                                   text-success text-xs">
                    {t.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold
                         text-primary mb-3">
            Simple, honest pricing
          </h2>
          <p className="font-body text-text-muted">
            Built for African wallets. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2
                        gap-6 max-w-2xl mx-auto">
          <div className="card border-2 border-border">
            <p className="font-display text-xl font-bold
                          text-text-primary mb-1">
              Free
            </p>
            <p className="font-display text-4xl font-bold
                          text-primary mb-4">
              ₦0
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Access to all skill areas',
                'Practice sessions',
                'Basic progress tracking',
                'No credit card needed',
              ].map((item) => (
                <li key={item}
                    className="flex items-center gap-2
                               font-body text-sm text-text-primary">
                  <span className="text-success">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/signup"
                  className="btn-ghost w-full text-center block">
              Get started free
            </Link>
          </div>

          <div className="card border-2 border-primary
                          relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="badge badge-accent text-xs">
                Recommended
              </span>
            </div>
            <p className="font-display text-xl font-bold
                          text-text-primary mb-1">
              Premium
            </p>
            <div className="mb-4">
              <p className="font-display text-4xl font-bold
                            text-primary">
                ₦4,500
              </p>
              <p className="font-body text-xs text-text-muted">
                per month · cancel anytime
              </p>
            </div>
            <ul className="space-y-3 mb-6">
              {[
                'Everything in Free',
                'Unlimited practice questions',
                'AI wrong-answer explanations',
                'Full progress analytics',
                'Streak tracking',
                'Priority support',
              ].map((item) => (
                <li key={item}
                    className="flex items-center gap-2
                               font-body text-sm text-text-primary">
                  <span className="text-success">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/signup"
                  className="btn-primary w-full text-center block">
              Start free trial
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t border-border py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold
                           text-primary mb-3">
              Questions? Answered.
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="card">
                <h3 className="font-display text-base font-bold
                               text-text-primary mb-2">
                  {faq.q}
                </h3>
                <p className="font-body text-sm text-text-muted
                               leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20
                          text-center">
        <h2 className="font-display text-3xl md:text-4xl
                       font-bold text-primary mb-4">
          Your German exam is waiting.
        </h2>
        <p className="font-body text-text-muted mb-8
                      max-w-xl mx-auto">
          Join thousands of Africans preparing smarter for
          TELC and Goethe German certifications.
        </p>
        <Link href="/signup"
              className="btn-primary text-base py-4 px-10
                         inline-block">
          Start Practicing Free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border
                         px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center
                          justify-between gap-6 mb-8">
            <span className="font-display text-xl font-bold
                             text-primary">
              Deutsch<span className="text-accent">Ready</span>
            </span>

            <div className="flex items-center gap-6 flex-wrap
                            justify-center">
              <Link href="/blog"
                    className="font-body text-sm text-text-muted
                               hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/about"
                    className="font-body text-sm text-text-muted
                               hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact"
                    className="font-body text-sm text-text-muted
                               hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/terms"
                    className="font-body text-sm text-text-muted
                               hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="/privacy"
                    className="font-body text-sm text-text-muted
                               hover:text-primary transition-colors">
                Privacy
              </Link>
            </div>
          </div>

          <div className="border-t border-border pt-6
                          flex flex-col md:flex-row items-center
                          justify-between gap-4">
            <p className="font-body text-xs text-text-muted">
              © 2026 DeutschReady. Built for African learners.
            </p>
            <p className="font-body text-xs text-text-muted/30
                          tracking-widest uppercase">
              Louis IV Studio
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
