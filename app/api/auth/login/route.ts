import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = String(formData.get('email') ?? '').toLowerCase().trim()
    const password = String(formData.get('password') ?? '')

    if (!email || !password) {
      return NextResponse.redirect(
        new URL('/login?error=missing_fields', request.url),
        { status: 303 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.session) {
      console.error('Login error:', error?.message)
      return NextResponse.redirect(
        new URL('/login?error=invalid_credentials', request.url),
        { status: 303 }
      )
    }

    // Session established — redirect to dashboard
    const response = NextResponse.redirect(
      new URL('/dashboard', request.url),
      { status: 303 }
    )

    return response

  } catch (err) {
    console.error('Login route error:', err)
    return NextResponse.redirect(
      new URL('/login?error=server_error', request.url),
      { status: 303 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
