'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sanitizeEmail } from '@/lib/utils/sanitize'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const cleanEmail = sanitizeEmail(email)
    if (!cleanEmail) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      cleanEmail,
      {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    )

    if (resetError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="animate-in text-center py-4">
        <div className="w-16 h-16 bg-success/10 rounded-full
                        flex items-center justify-center
                        mx-auto mb-4">
          <svg className="w-8 h-8 text-success" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold
                       text-text-primary mb-2">
          Check your email
        </h2>
        <p className="font-body text-text-muted text-sm mb-2">
          We sent a password reset link to
        </p>
        <p className="font-body text-primary font-medium
                      text-sm mb-6">
          {email}
        </p>
        <p className="font-body text-text-muted text-xs">
          Check your spam folder if you don't see it.
        </p>
        <Link href="/login"
              className="font-body text-sm text-primary
                         font-medium hover:underline
                         block mt-6">
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-in">
      <h2 className="font-display text-2xl font-bold
                     text-text-primary mb-1">
        Reset password
      </h2>
      <p className="font-body text-text-muted text-sm mb-6">
        Enter your email and we'll send a reset link
      </p>

      {error && (
        <div className="bg-error/10 border border-error/20
                        text-error text-sm font-body
                        rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium
                            font-body text-text-primary mb-1.5">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-base"
            autoComplete="email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40
                               border-t-white rounded-full
                               animate-spin" />
              Sending...
            </span>
          ) : (
            'Send reset link'
          )}
        </button>
      </form>

      <p className="text-center text-sm font-body
                    text-text-muted mt-6">
        Remember your password?{' '}
        <Link href="/login"
              className="text-primary font-medium
                         hover:text-primary-light
                         transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
