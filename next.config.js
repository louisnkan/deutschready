const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const sentryWebpackPluginOptions = {
  // Suppresses Sentry webpack build logs
  silent: true,
  // Disable source map upload until you have a Sentry auth token
  // Add SENTRY_AUTH_TOKEN to Vercel env vars to enable source maps
  disableServerWebpackPlugin: true,
  disableClientWebpackPlugin: true,
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
