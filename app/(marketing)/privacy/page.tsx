import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — DeutschReady',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/"
            className="font-body text-sm text-text-muted
                       hover:text-primary mb-8 inline-block">
        ← Back to home
      </Link>
      <h1 className="font-display text-4xl font-bold
                     text-primary mb-4">
        Privacy Policy
      </h1>
      <p className="font-body text-text-muted text-sm mb-8">
        Last updated: April 2026
      </p>

      <div className="space-y-8 font-body text-text-primary
                      leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold mb-3">
            1. Information We Collect
          </h2>
          <p className="text-sm text-text-muted">
            We collect your name, email address and practice
            session data when you create an account.
            If you sign in with Google, we receive your
            Google profile information. We do not collect
            payment information directly — this is handled
            by our payment processor.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">
            2. How We Use Your Information
          </h2>
          <p className="text-sm text-text-muted">
            Your data is used to provide the DeutschReady
            service — tracking your progress, personalizing
            your experience and improving our question bank.
            We do not sell your personal data to third
            parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">
            3. Data Storage
          </h2>
          <p className="text-sm text-text-muted">
            Your data is stored securely on Supabase
            infrastructure hosted in the EU. We use
            row-level security to ensure your data is
            only accessible by you.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">
            4. Cookies
          </h2>
          <p className="text-sm text-text-muted">
            We use essential cookies only — for
            authentication sessions. We do not use
            advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">
            5. Your Rights
          </h2>
          <p className="text-sm text-text-muted">
            You may request deletion of your account and
            all associated data at any time by contacting
            us at louisnkan21@gmail.com. We will process
            deletion requests within 14 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">
            6. Contact
          </h2>
          <p className="text-sm text-text-muted">
            Privacy questions? Contact us at
            hello@deutschready.xyz
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
