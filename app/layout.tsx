import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AnalyticsProvider from './providers/AnalyticsProvider';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'NeuroExpert - AI-Powered Digital Transformation',
  description: 'Платформа цифровой трансформации с ROI 300%+. Автоматизация бизнеса с искусственным интеллектом.',
  keywords: 'AI, digital transformation, ROI, бизнес автоматизация, искусственный интеллект',
  authors: [{ name: 'NeuroExpert Team' }],
  openGraph: {
    title: 'NeuroExpert - AI-Powered Digital Transformation',
    description: 'Увеличьте продажи на 40% за 3 месяца с помощью AI-директора',
    images: ['/og-image.png'],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuroExpert',
    description: 'Платформа цифровой трансформации с AI',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}