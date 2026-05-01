import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  enabled: process.env.NODE_ENV === 'production',

  // Server-side — capture all transactions
  // API routes failing silently is the worst kind of bug
  tracesSampleRate: 0.1,
})
