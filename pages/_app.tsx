import type { AppProps } from 'next/app'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  useEffect(() => {
    // Microsoft Clarity — session recording and heatmaps
    // Only runs client-side, never on server
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "wk93fpqvgd");
      `
      document.head.appendChild(script)
    }
  }, [])

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1B4332" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon-192.png" />

        {/* Default SEO — individual pages override */}
        <meta
          name="description"
          content="Pass your TELC A1 or Goethe A1 German exam first try. Affordable exam preparation built for Nigerian and African learners."
        />
        <meta property="og:site_name" content="DeutschReady" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://deutschready.xyz/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://deutschready.xyz/og-image.png"
        />

        {/* Font preconnect */}
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
