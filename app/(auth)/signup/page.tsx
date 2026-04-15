/**
 * Signup page
 * Email/password + Google OAuth
 * Full name collected for personalized experience
 */

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sanitizeEmail, sanitizeFullName } from '@/lib/utils/sanitize'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function validatePassword(pwd: string): string | null {
    if (pwd.length < 8) return 'Password must be at least 8 characters.'
    if (!/[A-Z]/.test(pwd)) return 'Password must contain one uppercase letter.'
    if (!/[0-9]/.test(pwd)) return 'Password must contain one number.'
    return null
  }

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const cleanEmail = sanitizeEmail(email)
    const cleanName = sanitizeFullName(fullName)

    if (!cleanName || !cleanEmail || !password) {
      setError('Please fill in all fields.')
      setLoading(false)
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        setError('This email is already registered. Please sign in instead.')
      } else {
        setError('Something went wrong. Please try again.')
      }
      setLoading(false)
      return
    }

    // Show verification message
    setSuccess(true)
    setLoading(false)
  }

  async function handleGoogleSignup() {
    setError(null)
    setGoogleLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      setError('Google sign up failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  // Success state — email verification sent
  if (success) {
    return (
      <div className="animate-in text-center py-4">
        <div className="w-16 h-16 bg-success/10 rounded-full
                        flex items-center justify-center mx-auto mb-4">
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
        <p className="font-body text-text-muted text-sm mb-1">
          We sent a verification link to
        </p>
        <p className="font-body text-primary font-medium text-sm mb-6">
          {email}
        </p>
        <p className="font-body text-text-muted text-xs">
          Click the link in the email to activate your account.
          Check your spam folder if you don't see it.
        </p>
      </div>
    )
  }

  return (
    <div className="animate-in">
      <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
        Start for free
      </h2>
      <p className="font-body text-text-muted text-sm mb-6">
        Your German journey begins here
      </p>

      {/* Error message */}
      {error && (
        <div className="bg-error/10 border border-error/20 text-error
                        text-sm font-body rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Google OAuth */}
      <button
        onClick={handleGoogleSignup}
        disabled={googleLoading || loading}
        className="w-full flex items-center justify-center gap-3
                   border border-border rounded-xl px-4 py-3 mb-4
                   font-body text-text-primary text-sm font-medium
                   transition-all duration-200 hover:bg-surface
                   active:scale-95 disabled:opacity-50"
      >
        {googleLoading ? (
          <span className="w-4 h-4 border-2 border-text-muted
                           border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {googleLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-text-muted text-xs font-body">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Signup form */}
      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium font-body
                            text-text-primary mb-1.5">
            Full name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ada Okonkwo"
            className="input-base"
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium font-body
                            text-text-primary mb-1.5">
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

        <div>
          <label className="block text-sm font-medium font-body
                            text-text-primary mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            className="input-base"
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="btn-primary w-full disabled:opacity-50
                     disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40
                               border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            'Create free account'
          )}
        </button>
      </form>

      {/* Terms notice */}
      <p className="text-center text-xs font-body text-text-muted mt-4">
        By signing up you agree to our{' '}
        <Link href="/terms"
              className="text-primary hover:underline">
          Terms
        </Link>
        {' '}and{' '}
        <Link href="/privacy"
              className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </p>

      {/* Login link */}
      <p className="text-center text-sm font-body text-text-muted mt-4">
        Already have an account?{' '}
        <Link href="/login"
              className="text-primary font-medium
                         hover:text-primary-light transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
