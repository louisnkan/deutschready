import Link from 'next/link'
import Logo from '../components/Logo'

export default function NotFound() {
  return (
    <main style={{ backgroundColor: '#F8F9FA' }} className="min-h-screen flex flex-col">
      <nav className="border-b border-gray-200 px-6 py-4">
        <Logo size="md" href="/" />
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p
          className="font-fraunces text-8xl font-black mb-4"
          style={{ color: '#FFB703' }}
        >
          404
        </p>
        <h1
          className="font-fraunces text-2xl font-black mb-2"
          style={{ color: '#1B4332' }}
        >
          Page not found
        </h1>
        <p className="text-gray-500 text-sm mb-8 max-w-xs">
          This page doesn't exist or you don't have access to it.
        </p>
        <Link
          href="/"
          className="font-bold px-6 py-3 rounded-xl transition hover:opacity-90"
          style={{ backgroundColor: '#1B4332', color: '#fff' }}
        >
          Back to homepage
        </Link>
      </div>
      <footer className="border-t border-gray-200 px-6 py-4 text-center">
        <p style={{ fontSize: '11px', opacity: 0.35 }} className="text-gray-500">
          © 2026 Louis IV Studio · All rights reserved
        </p>
      </footer>
    </main>
  )
}
