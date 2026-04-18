import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — DeutschReady',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/"
            className="font-body text-sm text-text-muted
                       hover:text-primary mb-8 inline-block">
        ← Back to home
      </Link>
      <h1 className="font-display text-4xl font-bold
                     text-primary mb-4">
        Terms of Service
      </h1>
      <p className="font-body text-text-muted text-sm mb-8">
        Last updated: April 2026
      </p>

      <div className="space-y-8 font-body text-text-primary
                      leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold mb-3">
            1. Acceptance of Terms
          </h2>
          <p className="text-sm text-text-muted">
            By accessing or using DeutschReady
            (deutschready.xyz), you agree to be bound by
            these Terms of Service. If you do not agree,
            please do not use the platform.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">
            2. Use of Service
          </h2>
          <p className="text-sm text-text-muted">
            DeutschReady provides German language exam
            preparation tools. You agree to use the service
            only for lawful purposes and in accordance with
            these terms. You must not attempt to circumvent
            any security measures or access controls.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">
            3. Account Responsibility
          </h2>
          <p className="text-sm text-text-muted">
            You are responsible for maintaining the
            confidentiality of your account credentials and
            for all activities that occur under your account.
            Notify us immediately of any unauthorized use.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">
            4. Intellectual Property
          </h2>
          <p className="text-sm text-text-muted">
            All practice questions, explanations and content
            on DeutschReady are generated original content
            owned by Louis IV Studio. You may not reproduce,
            distribute or create derivative works without
            written permission.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">
            5. Disclaimer
          </h2>
          <p className="text-sm text-text-muted">
            DeutschReady is a practice tool and does not
            guarantee exam success. Results depend on
            individual effort and preparation. We are not
            affiliated with TELC, Goethe-Institut or any
            official examination body.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">
            6. Contact
          </h2>
          <p className="text-sm text-text-muted">
            Questions about these terms? Contact us at
            <a href="/contact"
   className="text-primary hover:underline">
  contact us here
</a>
          </p>
        </section>
      </div>

      <p className="font-body text-xs text-text-muted/30
                    tracking-widest uppercase mt-16">
        Louis IV Studio
      </p>
    </div>
  )
}
