import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { auth } from '@/auth'
import { SiteJsonLd } from '@/shared/seo/site-json-ld'
import { Providers } from '@/shared/ui/providers'
import { SITE_URL } from '@/shared/config/site'
import './globals.css'

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Fueradecontexto — Indumentaria & Accesorios',
    template: '%s | Fueradecontexto',
  },
  description: 'Minimalismo elevado, editorial, sofisticación moderna.',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: SITE_URL,
    siteName: 'Fueradecontexto',
    title: 'Fueradecontexto — Indumentaria & Accesorios',
    description: 'Minimalismo elevado, editorial, sofisticación moderna.',
    images: [{ url: '/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fueradecontexto — Indumentaria & Accesorios',
    description: 'Minimalismo elevado, editorial, sofisticación moderna.',
    images: ['/twitter-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="es-AR" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <SiteJsonLd />
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  )
}
