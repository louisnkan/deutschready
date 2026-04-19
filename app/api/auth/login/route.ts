import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.redirect(
      new URL('/login?error=invalid_credentials', request.url),
      { status: 303 }
    )
  }

  return NextResponse.redirect(
    new URL('/dashboard', request.url),
    { status: 303 }
  )
}
