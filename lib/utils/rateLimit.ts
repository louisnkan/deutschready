/**
 * Rate limiting utility
 * Uses Supabase to track request counts — no Redis needed
 * All limits enforced server-side only
 */

import { createServiceClient } from '@/lib/supabase/server'

export type RateLimitAction =
  | 'explain'        // AI explanation requests
  | 'session_start'  // Starting a practice session
  | 'session_complete' // Completing a practice session

const RATE_LIMITS: Record<RateLimitAction, {
  maxRequests: number
  windowMinutes: number
}> = {
  explain: {
    maxRequests: 10,
    windowMinutes: 60,      // 10 AI explanations per hour
  },
  session_start: {
    maxRequests: 20,
    windowMinutes: 1440,    // 20 sessions per day
  },
  session_complete: {
    maxRequests: 20,
    windowMinutes: 1440,    // Matches session_start
  },
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetInMinutes: number
}

export async function checkRateLimit(
  userId: string,
  action: RateLimitAction
): Promise<RateLimitResult> {
  const supabase = await createServiceClient()
  const limit = RATE_LIMITS[action]
  const windowStart = new Date(
    Date.now() - limit.windowMinutes * 60 * 1000
  ).toISOString()

  try {
    // Count requests in current window
    const { count, error } = await supabase
      .from('rate_limit_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', action)
      .gte('created_at', windowStart)

    if (error) {
      // Fail open — don't block users if rate limit check fails
      console.error('Rate limit check error:', error)
      return { allowed: true, remaining: limit.maxRequests, resetInMinutes: 0 }
    }

    const requestCount = count ?? 0
    const remaining = Math.max(0, limit.maxRequests - requestCount)
    const allowed = requestCount < limit.maxRequests

    if (allowed) {
      // Log this request
      await supabase.from('rate_limit_log').insert({
        user_id: userId,
        action,
      })
    }

    return {
      allowed,
      remaining,
      resetInMinutes: allowed ? 0 : limit.windowMinutes,
    }
  } catch {
    // Fail open on unexpected errors
    return { allowed: true, remaining: limit.maxRequests, resetInMinutes: 0 }
  }
}
