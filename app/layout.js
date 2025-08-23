
import { Inter } from 'next/font/google'
import './globals.css'
import './styles/premium-design-system.css'
import './styles/premium-glass-sections.css'
import './styles/mobile-fixes.css'
import Script from 'next/script'
import Navigation from './components/Navigation'
import WowEffects from './components/WowEffects'

// Оптимизированная загрузка шрифта
const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
})

export const metadata = {
  title: 'NeuroExpert - AI-платформа для цифровизации бизнеса',
  description: 'Увеличьте прибыль на 40% с помощью AI. Автоматизация процессов, умная аналитика и персонализированные решения для вашего бизнеса.',
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
  themeColor: '#0a0e1a',
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
    description: 'Цифровизация и автоматизация с искусственным интеллектом',
    images: ['/twitter-image.png'],
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NeuroExpert',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': 'NeuroExpert',
    'apple-mobile-web-app-title': 'NeuroExpert',
    'msapplication-TileColor': '#6366f1',
    'msapplication-tap-highlight': 'no',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        {/* Premium styles fallback */}
        <link rel="stylesheet" href="/premium-styles.css" />
        
        {/* Preconnect для оптимизации загрузки */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://mc.yandex.ru" />
        
        {/* PWA метатеги */}
        <meta name="theme-color" content="#6366f1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        
        {/* Оптимизация для iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Критические стили для предотвращения FOUC */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              margin: 0;
              background: #0f172a;
              color: #f8fafc;
              font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .loading-spinner {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: #0a0e27;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
              transition: opacity 0.3s ease;
            }
            .loading-spinner.hide {
              opacity: 0;
              pointer-events: none;
            }
            /* Автоматическое скрытие через CSS как запасной вариант */
            @keyframes hideLoader {
              0% { opacity: 1; }
              90% { opacity: 1; }
              100% { opacity: 0; pointer-events: none; }
            }
            .loading-spinner {
              animation: hideLoader 3s forwards;
            }
            .spinner {
              width: 50px;
              height: 50px;
              border: 3px solid rgba(255, 255, 255, 0.1);
              border-top-color: #6366f1;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `
        }} />
      </head>
      <body className={`${inter.variable} premium-body`} style={{ background: '#000000', color: '#ffffff' }}>
        <div className="loading-spinner" id="global-loader">
          <div className="spinner"></div>
        </div>
        <WowEffects />
        <Navigation />
        {children}
        
        {/* Google Analytics с отложенной загрузкой */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure'
                });
              `}
            </Script>
          </>
        )}
        
        {/* Яндекс.Метрика с отложенной загрузкой */}
        {process.env.NEXT_PUBLIC_YM_ID && (
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              
              ym(${process.env.NEXT_PUBLIC_YM_ID}, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true,
                defer: true
              });
            `}
          </Script>
        )}
        
        {/* Service Worker Registration */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Регистрация Service Worker
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(
                    (registration) => console.log('SW registered:', registration),
                    (err) => console.log('SW registration failed:', err)
                  );
                });
              }
            `
          }}
        />
        
        {/* Hide loader immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Скрываем загрузчик сразу после загрузки DOM
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  const loader = document.getElementById('global-loader');
                  if (loader) {
                    setTimeout(() => {
                      loader.classList.add('hide');
                      setTimeout(() => {
                        loader.style.display = 'none';
                      }, 300);
                    }, 500);
                  }
                });
              } else {
                // DOM уже загружен
                const loader = document.getElementById('global-loader');
                if (loader) {
                  setTimeout(() => {
                    loader.classList.add('hide');
                    setTimeout(() => {
                      loader.style.display = 'none';
                    }, 300);
                  }, 500);
                }
              }
            `
          }}
        />
      </body>
    </html>
  )
}
