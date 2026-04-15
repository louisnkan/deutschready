/**
 * Auth layout — wraps login and signup pages
 * Clean, distraction-free design
 * No navbar, no footer — just the auth form
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in or create your DeutschReady account.',
  robots: {
    index: false,   // Auth pages should not be indexed by Google
    follow: false,
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary-dark flex items-center justify-center p-4">
      {/* Background pattern — subtle German flag colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Auth card */}
      <div className="relative w-full max-w-md">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-white">
            Deutsch<span className="text-accent">Ready</span>
          </h1>
          <p className="font-body text-white/60 text-sm mt-1">
            German Exam Prep for Africans
          </p>
        </div>

        {/* Page content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {children}
        </div>

        {/* Footer note */}
        <p className="text-center text-white/40 text-xs font-body mt-6">
          Built by Louis IV Studio · deutschready.xyz
        </p>
      </div>
    </div>
  )
}
