import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About DeutschReady — German Exam Prep for Africans',
  description:
    'DeutschReady was built by a Nigerian engineer to solve the problem of expensive, inaccessible German exam preparation for African learners.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/"
            className="font-body text-sm text-text-muted
                       hover:text-primary mb-8 inline-block">
        ← Back to home
      </Link>

      <h1 className="font-display text-4xl font-bold
                     text-primary mb-6">
        Why DeutschReady exists
      </h1>

      <div className="space-y-6 font-body text-text-primary
                      leading-relaxed">
        <p className="text-lg text-text-muted">
          DeutschReady was built by a Nigerian mechanical
          engineer who needed to prepare for a German
          language exam and found that every existing
          platform was either too slow, too expensive,
          or not built with African learners in mind.
        </p>

        <p className="text-sm text-text-muted">
          Duolingo is too slow for someone with an exam
          deadline. Deutsch-Prüfung charges in euros.
          Physical tutors in Nigeria cost more than most
          people can afford. And yet thousands of Nigerians,
          Ghanaians, Kenyans and other Africans need German
          certification every year — for migration, for
          university admission, for work.
        </p>

        <p className="text-sm text-text-muted">
          DeutschReady is the answer to that gap.
          AI-generated exam-pattern questions. Affordable
          pricing calibrated to African incomes.
          Built entirely from a mobile phone.
          Deployed for the world.
        </p>

        <div className="card bg-accent-soft border-accent/20
                        my-8">
          <p className="font-display text-lg font-bold
                        text-text-primary mb-2">
            The mission
          </p>
          <p className="font-body text-sm text-text-muted">
            Make German language certification accessible to
            every African who needs it — regardless of
            income, location or prior access to resources.
          </p>
        </div>

        <p className="text-sm text-text-muted">
          DeutschReady is a product of Louis IV Studio —
          a one-person studio building purposeful software
          for African users, one product at a time.
        </p>

        <div className="pt-4">
          <Link href="/signup"
                className="btn-primary inline-block">
            Start practicing free →
          </Link>
        </div>
      </div>

      <p className="font-body text-xs text-text-muted/30
                    tracking-widest uppercase mt-16">
        Louis IV Studio
      </p>
    </div>
  )
}
