/**
 * Blog Article — SEO Landing Page
 * "How to Pass TELC A1 German Exam in Nigeria"
 * Primary organic traffic driver for DeutschReady
 */

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Pass TELC A1 German Exam in Nigeria (2026 Guide)',
  description:
    'Complete guide for Nigerians preparing for the TELC Deutsch A1 exam. Study plan, exam format, common mistakes and how to practice effectively on a budget.',
  keywords: [
    'TELC A1 Nigeria',
    'German exam preparation Nigeria',
    'how to pass TELC A1',
    'Goethe A1 Nigeria',
    'learn German Nigeria',
    'German language certification Africa',
    'TELC exam tips',
    'German A1 study plan',
  ],
  openGraph: {
    title: 'How to Pass TELC A1 German Exam in Nigeria (2026 Guide)',
    description:
      'Complete guide for Nigerians preparing for the TELC Deutsch A1 exam.',
    url: 'https://deutschready.xyz/blog/how-to-prepare-telc-a1-nigeria',
    type: 'article',
  },
}

export default function BlogArticle() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="font-body text-sm text-text-muted
                   hover:text-primary mb-8 inline-block
                   transition-colors"
      >
        ← Back to home
      </Link>

      {/* Article header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="badge badge-accent text-xs">
            Exam Guide
          </span>
          <span className="font-body text-xs text-text-muted">
            April 2026 · 8 min read
          </span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl
                       font-bold text-primary leading-tight
                       mb-4 text-balance">
          How to Pass the TELC A1 German Exam in Nigeria
          (2026 Complete Guide)
        </h1>

        <p className="font-body text-lg text-text-muted
                      leading-relaxed">
          Everything a Nigerian learner needs to know —
          the exam format, a realistic study plan, common
          mistakes to avoid, and how to practice effectively
          without spending a fortune.
        </p>
      </div>

      {/* Article body */}
      <div className="prose-content space-y-8 font-body
                      text-text-primary">

        {/* Section 1 */}
        <section>
          <h2 className="font-display text-2xl font-bold
                         text-primary mb-4">
            What is the TELC A1 German Exam?
          </h2>
          <p className="text-sm text-text-muted leading-relaxed
                        mb-4">
            The TELC Deutsch A1 is an internationally
            recognised German language certificate at the
            absolute beginner level. It is issued by TELC
            GmbH — one of Europe's leading language testing
            organisations — and accepted by German embassies,
            universities and immigration authorities worldwide.
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            For Nigerians, the A1 certificate is most
            commonly required for the German spouse visa
            (Ehegattennachzug), which requires the
            non-EU partner to demonstrate basic German
            communication ability before entering Germany.
            It is also the entry point for anyone beginning
            their journey toward B1 or B2 certification
            required for work and study visas.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="font-display text-2xl font-bold
                         text-primary mb-4">
            What Does the TELC A1 Exam Test?
          </h2>
          <p className="text-sm text-text-muted leading-relaxed
                        mb-4">
            The exam has four components:
          </p>

          <div className="space-y-3">
            {[
              {
                skill: 'Lesen (Reading)',
                description:
                  'Short texts, signs, notices, forms and simple messages. You need to understand the main point of everyday written German.',
                emoji: '📰',
              },
              {
                skill: 'Hören (Listening)',
                description:
                  'Short audio dialogues — announcements, phone messages, simple conversations. You answer multiple choice questions based on what you hear.',
                emoji: '🎧',
              },
              {
                skill: 'Schreiben (Writing)',
                description:
                  'Fill in simple forms and write short messages or notes in German. Tested at a very basic level at A1.',
                emoji: '✍️',
              },
              {
                skill: 'Sprechen (Speaking)',
                description:
                  'Introduce yourself, ask and answer simple questions about personal information, daily life and immediate needs.',
                emoji: '🗣️',
              },
            ].map((item) => (
              <div
                key={item.skill}
                className="card flex gap-4 py-4"
              >
                <span className="text-2xl flex-shrink-0">
                  {item.emoji}
                </span>
                <div>
                  <p className="font-body font-semibold
                                text-text-primary text-sm mb-1">
                    {item.skill}
                  </p>
                  <p className="font-body text-xs
                                text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="font-display text-2xl font-bold
                         text-primary mb-4">
            The Honest Reality for Nigerian Candidates
          </h2>
          <p className="text-sm text-text-muted leading-relaxed
                        mb-4">
            Preparing for TELC A1 in Nigeria comes with
            challenges that European learners never face.
            Quality German tutors in Lagos or Abuja charge
            between ₦15,000 and ₦50,000 per session.
            Goethe-Institut Nigeria offers courses but at
            prices that exclude most working-class Nigerians.
            Online platforms like Duolingo exist but were
            not built for exam preparation — they teach
            general language slowly through gamification,
            not the specific exam patterns you need.
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            The result is that many Nigerians arrive at
            their exam underprepared — not because they
            lack intelligence or dedication, but because
            the right tools were never built for them.
            DeutschReady exists to fix that.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="font-display text-2xl font-bold
                         text-primary mb-4">
            A Realistic 30-Day Study Plan
          </h2>
          <p className="text-sm text-text-muted leading-relaxed
                        mb-6">
            You do not need 6 months to pass A1. With
            focused, consistent practice you can be
            exam-ready in 30 days. Here is how:
          </p>

          <div className="space-y-4">
            {[
              {
                week: 'Week 1',
                title: 'Foundation — Grammatik',
                tasks: [
                  'Learn der/die/das — German articles',
                  'Master personal pronouns (ich, du, er, sie)',
                  'Practice present tense verb conjugation',
                  'Do 20 Grammatik questions daily on DeutschReady',
                ],
              },
              {
                week: 'Week 2',
                title: 'Reading — Lesen',
                tasks: [
                  'Practice reading short German texts daily',
                  'Learn to identify key information quickly',
                  'Focus on signs, notices and short messages',
                  'Do 20 Lesen questions daily on DeutschReady',
                ],
              },
              {
                week: 'Week 3',
                title: 'Listening — Hören',
                tasks: [
                  'Listen to simple German audio daily',
                  'Watch short German YouTube videos with subtitles',
                  'Practice identifying numbers, names and key words',
                  'Do 20 Hören questions daily on DeutschReady',
                ],
              },
              {
                week: 'Week 4',
                title: 'Full Revision',
                tasks: [
                  'Mixed practice across all three skills',
                  'Focus extra time on weakest skill',
                  'Aim for 80%+ accuracy consistently',
                  'Review all wrong answers with AI explanations',
                ],
              },
            ].map((week) => (
              <div key={week.week} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <span className="badge badge-accent text-xs">
                    {week.week}
                  </span>
                  <p className="font-display font-bold
                                text-text-primary">
                    {week.title}
                  </p>
                </div>
                <ul className="space-y-2">
                  {week.tasks.map((task) => (
                    <li
                      key={task}
                      className="flex items-start gap-2
                                 font-body text-sm text-text-muted"
                    >
                      <span className="text-success mt-0.5
                                       flex-shrink-0">
                        ✓
                      </span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="font-display text-2xl font-bold
                         text-primary mb-4">
            5 Common Mistakes Nigerian Candidates Make
          </h2>

          <div className="space-y-4">
            {[
              {
                mistake: 'Relying only on Duolingo',
                fix: 'Duolingo builds general vocabulary slowly. For exam preparation you need pattern-based practice that mirrors actual exam questions.',
              },
              {
                mistake: 'Ignoring der/die/das early',
                fix: 'German articles are the foundation of everything. Candidates who skip this struggle with every other grammar topic. Learn them in Week 1 and never stop practicing.',
              },
              {
                mistake: 'Not timing practice sessions',
                fix: 'The real exam has strict time limits. Practice with a timer from day one so the pressure is familiar.',
              },
              {
                mistake: 'Practicing only what is comfortable',
                fix: 'Most candidates over-practice their strong skills and avoid weak ones. Track your accuracy per skill and spend 60% of your time on the weakest.',
              },
              {
                mistake: 'Starting too late',
                fix: '30 days of consistent daily practice is enough. Starting 3 days before the exam is not. Book your exam first then work backward.',
              },
            ].map((item, i) => (
              <div key={i} className="card border-l-4
                                      border-l-error/40">
                <p className="font-body font-semibold
                               text-error text-sm mb-1">
                  ✗ {item.mistake}
                </p>
                <p className="font-body text-sm
                               text-text-muted leading-relaxed">
                  {item.fix}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="font-display text-2xl font-bold
                         text-primary mb-4">
            How to Know You Are Ready
          </h2>
          <p className="text-sm text-text-muted leading-relaxed
                        mb-4">
            You are ready to sit the TELC A1 exam when you
            consistently score 80% or above across all three
            practice skills — Grammatik, Lesen and Hören —
            in multiple separate sessions. One good session
            is luck. Three consecutive sessions above 80%
            is readiness.
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            DeutschReady tracks your best score and accuracy
            per skill automatically. When all three skill
            cards on your dashboard show green — you are
            ready. Book the exam.
          </p>
        </section>

        {/* CTA Section */}
        <section className="bg-primary rounded-2xl p-8
                            text-center">
          <p className="text-4xl mb-4">🇩🇪</p>
          <h2 className="font-display text-2xl font-bold
                         text-white mb-3">
            Start Practicing Today
          </h2>
          <p className="font-body text-white/70 text-sm
                        mb-6 max-w-md mx-auto">
            DeutschReady gives you exam-pattern A1 practice
            questions, AI explanations for wrong answers,
            and progress tracking — all built for African
            learners at African prices.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-accent text-text-primary
                       font-body font-medium px-8 py-3
                       rounded-xl transition-all duration-200
                       hover:brightness-95 active:scale-95"
          >
            Start Free — No Credit Card
          </Link>
          <p className="font-body text-xs text-white/40 mt-4">
            Premium from ₦4,500/month · Cancel anytime
          </p>
        </section>

      </div>

      {/* Article footer */}
      <div className="mt-16 pt-8 border-t border-border">
        <div className="flex items-center justify-between
                        flex-wrap gap-4">
          <div>
            <p className="font-body text-xs text-text-muted">
              Written by the DeutschReady team · April 2026
            </p>
            <p className="font-body text-xs text-text-muted/40
                          tracking-widest uppercase mt-1">
              Louis IV Studio
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-body text-sm text-primary
                         hover:underline"
            >
              ← Back to DeutschReady
            </Link>
            <Link
              href="/signup"
              className="btn-primary text-sm py-2 px-4"
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
