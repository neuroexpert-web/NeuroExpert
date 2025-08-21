import Head from 'next/head';

export default function SEOHead({ 
  title = "NeuroExpert - AI Управляющий для вашего бизнеса",
  description = "Революционная AI платформа для автоматизации и роста бизнеса. Цифровой управляющий 24/7, увеличение прибыли до 40%",
  keywords = "AI управляющий, автоматизация бизнеса, искусственный интеллект, цифровая трансформация, NeuroExpert",
  ogImage = "https://neuroexpert.ai/og-image.jpg",
  ogType = "website",
  canonicalUrl = "https://neuroexpert.ai"
}) {
  return (
    <Head>
      {/* Основные meta теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="NeuroExpert" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Language" content="ru" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="NeuroExpert" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Дополнительные SEO теги */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="yandex" content="index, follow" />
      <meta name="theme-color" content="#667eea" />
      
      {/* Preconnect для оптимизации */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
    </Head>
  );
}
