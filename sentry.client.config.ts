import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable in production — don't clutter dev with errors
  enabled: process.env.NODE_ENV === 'production',

  // Capture 10% of transactions for performance monitoring
  // Increase to 1.0 when you have paying users who need SLA guarantees
  tracesSampleRate: 0.1,

  // Capture replays only on errors — saves your Sentry quota
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0,

  integrations: [],
})
