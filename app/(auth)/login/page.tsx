'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for error in URL
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const urlError = params.get('error')
    if (urlError === 'invalid_credentials' && !error) {
      setError('Invalid email or password. Please try again.')
    }
  }

  async function handleGoogleLogin() {
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
      setError('Google sign in failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="animate-in">
      <h2 className="font-display text-2xl font-bold
                     text-text-primary mb-1">
        Welcome back
      </h2>
      <p className="font-body text-text-muted text-sm mb-6">
        Continue your German journey
      </p>

      {error && (
        <div className="bg-error/10 border border-error/20
                        text-error text-sm font-body
                        rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full flex items-center justify-center
                   gap-3 border border-border rounded-xl
                   px-4 py-3 mb-4 font-body text-text-primary
                   text-sm font-medium transition-all duration-200
                   hover:bg-surface active:scale-95
                   disabled:opacity-50"
      >
        {googleLoading ? (
          <span className="w-4 h-4 border-2 border-text-muted
                           border-t-transparent rounded-full
                           animate-spin" />
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

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-text-muted text-xs font-body">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form action="/api/auth/login" method="POST"
            className="space-y-4">
        <div>
          <label className="block text-sm font-medium font-body
                            text-text-primary mb-1.5">
            Email address
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            className="input-base"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium font-body
                              text-text-primary">
              Password
            </label>
            <Link href="/forgot-password"
                  className="text-xs font-body text-primary
                             hover:text-primary-light
                             transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className="input-base"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Sign in
        </button>
      </form>

      <p className="text-center text-sm font-body
                    text-text-muted mt-6">
        No account yet?{' '}
        <Link href="/signup"
              className="text-primary font-medium
                         hover:text-primary-light transition-colors">
          Create one free
        </Link>
      </p>
    </div>
  )
}
