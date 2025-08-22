import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { setupProductionLogging } from './utils/logger'
import Script from 'next/script'
import dynamic from 'next/dynamic'

// Динамический импорт AI Manager Integration
const AIManagerIntegration = dynamic(
  () => import('./components/AIManagerIntegration'),
  { ssr: false }
)

// Setup production logging
if (typeof window === 'undefined') {
  setupProductionLogging();
}

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "NeuroExpert - Цифровая AI Платформа для Бизнеса",
  description: "Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов с помощью передовых AI-технологий",
  keywords: 'AI, искусственный интеллект, цифровизация, автоматизация бизнеса, CRM, аналитика',
  authors: [{ name: 'NeuroExpert Team' }],
  creator: 'NeuroExpert',
  publisher: 'NeuroExpert',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://neuroexpert.ai'),
  alternates: {
    canonical: '/',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
  openGraph: {
    title: 'NeuroExpert - AI-платформа для цифровизации бизнеса',
    description: 'Увеличьте прибыль на 40% с помощью AI',
    url: 'https://neuroexpert.ai',
    siteName: 'NeuroExpert',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeuroExpert Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuroExpert - AI для бизнеса',
    description: 'Революционная AI-платформа для цифровизации',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-sans: ${inter.variable};
}
        `}</style>
        {/* Google Analytics */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <AIManagerIntegration />
        </ThemeProvider>
      </body>
    </html>
  )
}