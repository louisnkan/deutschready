import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — DeutschReady German Exam Guides',
  description:
    'German exam preparation guides for Nigerian and African learners. TELC, Goethe and DTZ exam tips, study plans and strategies.',
}

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="font-body text-sm text-text-muted
                   hover:text-primary mb-8 inline-block"
      >
        ← Back to home
      </Link>

      <h1 className="font-display text-4xl font-bold
                     text-primary mb-3">
        Exam Guides
      </h1>
      <p className="font-body text-text-muted mb-12">
        German exam preparation resources built for
        Nigerian and African learners.
      </p>

      {/* Article list */}
      <div className="space-y-6">
        <Link
          href="/blog/how-to-prepare-telc-a1-nigeria"
          className="card flex gap-5 hover:shadow-card-hover
                     transition-all duration-200 active:scale-95
                     cursor-pointer"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl
                          flex items-center justify-center
                          flex-shrink-0 text-2xl">
            🇩🇪
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-accent text-xs">
                Exam Guide
              </span>
              <span className="font-body text-xs text-text-muted">
                8 min read
              </span>
            </div>
            <h2 className="font-display text-lg font-bold
                           text-text-primary mb-1 leading-snug">
              How to Pass the TELC A1 German Exam in Nigeria
              (2026 Guide)
            </h2>
            <p className="font-body text-sm text-text-muted
                           leading-relaxed">
              Study plan, exam format breakdown, common
              mistakes and how to practice on a budget.
            </p>
          </div>
        </Link>
      </div>

      <p className="font-body text-xs text-text-muted/30
                    tracking-widest uppercase mt-16
                    text-center">
        Louis IV Studio
      </p>
    </div>
  )
}
