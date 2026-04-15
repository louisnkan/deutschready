/**
 * Health check endpoint
 * Used for uptime monitoring
 * No auth required
 */

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'deutschready-api',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  )
}
