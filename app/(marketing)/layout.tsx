/**
 * Marketing layout — public pages
 * Landing page, about, terms, privacy
 * Louis IV Studio watermark included
 */

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between
                         px-6 md:px-12 py-4 bg-white
                         border-b border-border sticky top-0 z-40">
        <a href="/"
           className="font-display text-xl font-bold text-primary">
          Deutsch<span className="text-accent">Ready</span>
        </a>
        <div className="flex items-center gap-3">
          <a href="/login"
             className="btn-ghost text-sm py-2 px-4">
            Sign in
          </a>
          <a href="/signup"
             className="btn-primary text-sm py-2 px-4">
            Start free
          </a>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border
                         px-6 md:px-12 py-8 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col
                        md:flex-row items-center justify-between gap-4">
          <p className="font-display text-lg font-bold text-primary">
            Deutsch<span className="text-accent">Ready</span>
          </p>
          <div className="flex items-center gap-6">
            <a href="/terms"
               className="font-body text-xs text-text-muted
                          hover:text-primary transition-colors">
              Terms
            </a>
            <a href="/privacy"
               className="font-body text-xs text-text-muted
                          hover:text-primary transition-colors">
              Privacy
            </a>
          </div>
          <p className="font-body text-xs text-text-muted/40
                        tracking-widest uppercase">
            Louis IV Studio
          </p>
        </div>
      </footer>
    </div>
  )
}
