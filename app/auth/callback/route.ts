import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
    return NextResponse.redirect(
      new URL('/dashboard', requestUrl.origin)
    )
  }

  if (token_hash && type) {
    const supabase = await createClient()
    await supabase.auth.verifyOtp({ token_hash, type: type as 'email' | 'recovery' | 'invite' | 'email_change' })
    return NextResponse.redirect(
      new URL('/dashboard', requestUrl.origin)
    )
  }

  return NextResponse.redirect(
    new URL('/dashboard', requestUrl.origin)
  )
}
