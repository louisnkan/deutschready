/**
 * Dashboard layout — wraps all protected pages
 * Contains navbar and mobile bottom navigation
 * Auth is guaranteed by middleware before reaching here
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Top navbar — desktop */}
      <header className="hidden md:flex items-center justify-between
                         px-8 py-4 bg-white border-b border-border
                         sticky top-0 z-40">
        <a href="/dashboard"
           className="font-display text-xl font-bold text-primary">
          Deutsch<span className="text-accent">Ready</span>
        </a>
        <nav className="flex items-center gap-6">
          <a href="/dashboard"
             className="font-body text-sm text-text-muted
                        hover:text-primary transition-colors">
            Dashboard
          </a>
          <a href="/practice"
             className="font-body text-sm text-text-muted
                        hover:text-primary transition-colors">
            Practice
          </a>
        </nav>
        <form action="/auth/signout" method="post">
          <button className="btn-ghost text-sm py-2 px-4">
            Sign out
          </button>
        </form>
      </header>

      {/* Main content */}
      <main className="pb-24 md:pb-8">
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40
                      bg-white border-t border-border
                      flex items-center justify-around px-2 py-3">
        <a href="/dashboard"
           className="flex flex-col items-center gap-1 px-4">
          <svg className="w-5 h-5 text-primary" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0
                     001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1
                     1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1
                     1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-body text-xs text-primary
                           font-medium">Home</span>
        </a>
        <a href="/practice"
           className="flex flex-col items-center gap-1 px-4">
          <svg className="w-5 h-5 text-text-muted" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5
                     7.5 5S4.168 5.477 3 6.253v13C4.168 18.477
                     5.754 18 7.5 18s3.332.477 4.5 1.253m0-13
                     C13.168 5.477 14.754 5 16.5 5c1.747 0
                     3.332.477 4.5 1.253v13C19.832 18.477
                     18.247 18 16.5 18c-1.746 0-3.332.477
                     -4.5 1.253" />
          </svg>
          <span className="font-body text-xs text-text-muted">
            Practice
          </span>
        </a>
        <a href="/profile"
           className="flex flex-col items-center gap-1 px-4">
          <svg className="w-5 h-5 text-text-muted" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7
                     7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-body text-xs text-text-muted">
            Profile
          </span>
        </a>
      </nav>

      {/* Louis IV Studio watermark */}
      <div className="hidden md:block fixed bottom-4 right-6
                      pointer-events-none">
        <span className="font-body text-xs text-text-muted/30
                         tracking-widest uppercase">
          Louis IV Studio
        </span>
      </div>
    </div>
  )
}
