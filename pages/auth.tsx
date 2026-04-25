import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

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
      options: { shouldCreateUser: true }
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setStep('otp')
    setResendTimer(60)
    setMessage(`OTP sent to ${email}`)
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
    if (error) {
      setError(error.message)
      return
    }
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1 text-center">DeutschReady</h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          {step === 'email' ? 'Enter your email to continue' : 'Check your email for the OTP'}
        </p>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-300 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-900/40 border border-green-500 text-green-300 text-sm px-4 py-3 rounded-lg mb-4">
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
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 mb-4"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading || !email}
              className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter 8-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={8}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 mb-4 tracking-widest text-center text-lg"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 8}
              className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center mt-4">
              {resendTimer > 0 ? (
                <p className="text-gray-500 text-sm">
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <button
                  onClick={handleSendOtp}
                  className="text-yellow-400 text-sm hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              onClick={() => { setStep('email'); setOtp(''); setError(''); setMessage('') }}
              className="w-full text-gray-500 text-sm mt-3 hover:text-gray-300 transition"
            >
              ← Change email
            </button>
          </>
        )}
      </div>
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
