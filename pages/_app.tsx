import type { AppProps } from 'next/app'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Head>
        {/* Default meta — overridden per page */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1B4332" />
        <link rel="icon" href="/favicon.ico" />

        {/* Default SEO — individual pages override these */}
        <meta
          name="description"
          content="Pass your TELC A1 or Goethe A1 German exam first try. Affordable exam preparation built for Nigerian and African learners."
        />
        <meta property="og:site_name" content="DeutschReady" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://deutschready.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://deutschready.xyz/og-image.png" />

        {/* Font preconnect — improves Fraunces load time */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
