import Link from 'next/link'
import Head from 'next/head'
import Logo from '../../components/Logo'

export default function BlogIndex() {
  return (
    <>
      <Head>
        <title>Blog — DeutschReady | German Exam Prep for Nigerians</title>
        <meta name="description" content="Guides and tips for passing TELC A1 and Goethe German exams in Nigeria and Africa." />
      </Head>
      <main style={{ backgroundColor: '#F8F9FA' }} className="min-h-screen">
        <nav className="border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Logo size="md" href="/" />
            <Link href="/auth" className="text-sm font-semibold" style={{ color: '#1B4332' }}>
              Sign in →
            </Link>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="font-fraunces text-4xl font-black mb-2" style={{ color: '#1B4332' }}>
            Blog
          </h1>
          <p className="text-gray-500 mb-10">Guides for passing German exams in Nigeria and Africa.</p>

          <article className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-300 transition">
            <Link href="/blog/how-to-prepare-telc-a1-nigeria">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#40916C' }}>
                Study Guide · A1
              </p>
              <h2 className="font-fraunces text-2xl font-bold mb-3" style={{ color: '#1B4332' }}>
                How to Pass the TELC A1 German Exam in Nigeria (2026 Guide)
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Everything you need to know about the TELC A1 exam format, a proven 30-day study plan,
                the most common mistakes Nigerian candidates make, and how to avoid them.
              </p>
              <span className="text-sm font-semibold" style={{ color: '#FFB703' }}>
                Read the guide →
              </span>
            </Link>
          </article>
        </div>

        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
            <Logo size="sm" href="/" />
            <span style={{ fontSize: '10px', opacity: 0.4 }} className="text-gray-400">louis iv studio</span>
          </div>
        </footer>
      </main>
    </>
  )
}
