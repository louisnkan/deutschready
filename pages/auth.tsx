import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Logo from '../components/Logo'

export default function AuthPage() {
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleSendOtp = async () => {
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: undefined }
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setStep('otp')
    setResendTimer(60)
    setMessage(`Code sent to ${email}`)
  }

  const handleVerifyOtp = async () => {
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    router.push('/dashboard')
  }

  return (
    <main style={{ backgroundColor: '#F8F9FA' }} className="min-h-screen flex flex-col">

      {/* Nav */}
      <nav className="border-b border-gray-200 px-6 py-4">
        <Logo size="md" href="/" />
      </nav>

      {/* Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <h1
            className="font-fraunces text-3xl font-black mb-1"
            style={{ color: '#1B4332' }}
          >
            {step === 'email' ? 'Sign in' : 'Check your email'}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {step === 'email'
              ? 'Enter your email to get a login code. No password needed.'
              : `We sent an 8-digit code to ${email}`}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {message && (
            <div
              className="border text-sm px-4 py-3 rounded-xl mb-4"
              style={{ backgroundColor: '#f0fdf4', borderColor: '#40916C', color: '#1B4332' }}
            >
              {message}
            </div>
          )}

          {step === 'email' ? (
            <>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && email && handleSendOtp()}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none mb-4 text-base"
                style={{ '--tw-ring-color': '#1B4332' } as React.CSSProperties}
              />
              <button
                onClick={handleSendOtp}
                disabled={loading || !email}
                className="w-full font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-base"
                style={{ backgroundColor: '#1B4332', color: '#fff' }}
              >
                {loading ? 'Sending...' : 'Send login code →'}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 8-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={8}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none mb-4 tracking-widest text-center text-xl font-bold"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 8}
                className="w-full font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-base mb-4"
                style={{ backgroundColor: '#FFB703', color: '#1B4332' }}
              >
                {loading ? 'Verifying...' : 'Verify code →'}
              </button>

              <div className="text-center mb-3">
                {resendTimer > 0 ? (
                  <p className="text-gray-400 text-sm">Resend code in {resendTimer}s</p>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    className="text-sm font-semibold hover:underline"
                    style={{ color: '#1B4332' }}
                  >
                    Resend code
                  </button>
                )}
              </div>

              <button
                onClick={() => { setStep('email'); setOtp(''); setError(''); setMessage('') }}
                className="w-full text-gray-400 text-sm hover:text-gray-600 transition"
              >
                ← Use a different email
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-4 text-center">
        <p style={{ fontSize: '11px', opacity: 0.35 }} className="text-gray-500">
          © 2026 Louis IV Studio · All rights reserved
        </p>
      </footer>

    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx)
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    return { redirect: { destination: '/dashboard', permanent: false } }
  }
  return { props: {} }
}
