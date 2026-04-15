import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'DeutschReady — German Exam Prep for Africans',
    template: '%s | DeutschReady',
  },
  description:
    'Prepare for TELC and Goethe German language exams with AI-powered practice. Affordable, fast, and built for Nigerian and African learners. From A1 to B2.',
  keywords: [
    'learn German Nigeria',
    'German exam prep Africa',
    'TELC practice',
    'Goethe exam preparation',
    'German A1 practice',
    'cheap German learning',
    'deutsch lernen Nigeria',
    'German language certification',
  ],
  authors: [{ name: 'Louis IV Studio' }],
  creator: 'Louis IV Studio',
  metadataBase: new URL('https://deutschready.xyz'),
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://deutschready.xyz',
    siteName: 'DeutschReady',
    title: 'DeutschReady — German Exam Prep for Africans',
    description:
      'Affordable German exam preparation built for Nigerian and African learners. Practice A1 to B2 with AI-powered feedback.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeutschReady — German Exam Prep for Africans',
    description:
      'Affordable German exam preparation built for Nigerian and African learners.',
    creator: '@louisnkan',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
