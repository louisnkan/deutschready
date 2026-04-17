/**
 * TEMPORARY SEED TRIGGER — DELETE AFTER SEEDING
 * Browser-accessible trigger for mobile workflow
 * Protected by SEED_SECRET query parameter
 */

import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const secret = searchParams.get('secret')
  const skill = searchParams.get('skill')

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  if (!skill || !['grammatik', 'lesen', 'hoeren'].includes(skill)) {
    return NextResponse.json(
      { error: 'Invalid skill. Use: grammatik, lesen, or hoeren' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`${origin}/api/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-seed-secret': process.env.SEED_SECRET!,
      },
      body: JSON.stringify({ skill }),
    })

    const result = await response.json()
    return NextResponse.json(result)

  } catch (error) {
    return NextResponse.json(
      { error: 'Trigger failed', details: String(error) },
      { status: 500 }
    )
  }
}
