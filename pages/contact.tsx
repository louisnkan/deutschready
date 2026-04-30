import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Logo from '../components/Logo'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/myklwqyd', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Head>
  <title>Contact — DeutschReady</title>
  <meta name="description" content="Get in touch with the DeutschReady team. Questions about Premium, the exam, or your account." />
  <meta name="robots" content="noindex" />
</Head>
      <main style={{ backgroundColor: '#F8F9FA' }} className="min-h-screen flex flex-col">
        <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <Logo size="md" href="/" />
          <Link href="/auth" className="text-sm font-semibold" style={{ color: '#1B4332' }}>
            Sign in →
          </Link>
        </nav>

        <div className="flex-1 max-w-lg mx-auto w-full px-6 py-12">
          <h1
            className="font-fraunces text-4xl font-black mb-2"
            style={{ color: '#1B4332' }}
          >
            Get in touch
          </h1>
          <p className="text-gray-500 mb-8">
            Questions about the exam, the platform, or Premium? We'll get back to you within 24 hours.
          </p>

          {status === 'sent' ? (
            <div
              className="rounded-2xl p-6 text-center border"
              style={{ backgroundColor: '#f0fdf4', borderColor: '#40916C' }}
            >
              <p className="text-2xl mb-2">✓</p>
              <p className="font-semibold" style={{ color: '#1B4332' }}>Message sent</p>
              <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B4332' }}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B4332' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B4332' }}>
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="What can we help you with?"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none text-base resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full font-bold py-4 rounded-xl transition disabled:opacity-50"
                style={{ backgroundColor: '#1B4332', color: '#fff' }}
              >
                {status === 'sending' ? 'Sending...' : 'Send message →'}
              </button>
            </form>
          )}
        </div>

        <footer className="border-t border-gray-200 px-6 py-6">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Logo size="sm" href="/" />
            <p style={{ fontSize: '11px', opacity: 0.35 }} className="text-gray-500">
              © 2026 Louis IV Studio · All rights reserved
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}
