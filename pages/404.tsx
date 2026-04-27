import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <p className="text-8xl font-bold text-emerald-400 mb-4">404</p>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-gray-400 text-sm mb-8 text-center">
        This page doesn't exist or you don't have access.
      </p>
      <Link
        href="/dashboard"
        className="bg-emerald-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-emerald-300 transition"
      >
        Back to Dashboard
      </Link>
    </main>
  )
}
