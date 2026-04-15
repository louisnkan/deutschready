/**
 * OAuth callback handler
 * Supabase redirects here after Google OAuth completes
 * Exchanges the auth code for a session
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successful OAuth — redirect to intended destination
      return NextResponse.redirect(new URL(redirectTo, origin))
    }
  }

  // Something went wrong — redirect to login with error
  return NextResponse.redirect(
    new URL('/login?error=auth_callback_failed', origin)
  )
}
