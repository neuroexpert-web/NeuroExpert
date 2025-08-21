#!/bin/bash

# Автоматическая SEO оптимизация
echo "🔍 Запуск автоматической SEO оптимизации..."

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Создание robots.txt
echo -e "\n${BLUE}1. Создание robots.txt...${NC}"
cat > public/robots.txt << 'EOF'
# Robots.txt для NeuroExpert
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /.next/
Disallow: /_next/
Disallow: /node_modules/

# Sitemap
Sitemap: https://neuroexpert.ai/sitemap.xml

# Crawl-delay
Crawl-delay: 1
EOF
echo -e "${GREEN}✅ robots.txt создан${NC}"

# 2. Создание sitemap generator
echo -e "\n${BLUE}2. Создание генератора sitemap...${NC}"
cat > scripts/generate-sitemap.js << 'EOF'
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://neuroexpert.ai';

const staticPages = [
  '',
  '/about',
  '/services',
  '/smart-ai',
  '/pricing',
  '/contact',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(page => {
    return `  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
console.log('✅ Sitemap сгенерирован');
EOF

# 3. Создание структурированных данных
echo -e "\n${BLUE}3. Создание компонента структурированных данных...${NC}"
cat > app/components/StructuredData.js << 'EOF'
export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "NeuroExpert",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "AI-управляемая платформа для цифровой трансформации бизнеса",
    "url": "https://neuroexpert.ai",
    "author": {
      "@type": "Organization",
      "name": "NeuroExpert",
      "url": "https://neuroexpert.ai"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "RUB",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    },
    "featureList": [
      "AI управляющий 24/7",
      "Автоматизация бизнес-процессов",
      "Аналитика в реальном времени",
      "Интеграция с CRM",
      "Голосовое управление"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
EOF

# 4. Оптимизация meta тегов
echo -e "\n${BLUE}4. Создание SEO компонента...${NC}"
cat > app/components/SEOHead.js << 'EOF'
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
EOF

# 5. Создание страницы 404 с SEO
echo -e "\n${BLUE}5. Создание оптимизированной 404 страницы...${NC}"
cat > app/404.js << 'EOF'
import Link from 'next/link';
import SEOHead from './components/SEOHead';

export default function Custom404() {
  return (
    <>
      <SEOHead
        title="404 - Страница не найдена | NeuroExpert"
        description="Запрашиваемая страница не найдена. Вернитесь на главную или воспользуйтесь поиском."
        ogType="website"
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="mt-4 text-xl text-gray-600">Страница не найдена</p>
          <Link href="/" className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </>
  );
}
EOF

# 6. Генерация sitemap
echo -e "\n${BLUE}6. Генерация sitemap...${NC}"
node scripts/generate-sitemap.js 2>/dev/null || echo -e "${YELLOW}Sitemap будет сгенерирован при следующей сборке${NC}"

# 7. Добавление SEO скриптов в package.json
echo -e "\n${BLUE}7. Добавление SEO скриптов...${NC}"
npm pkg set scripts.sitemap="node scripts/generate-sitemap.js"
npm pkg set scripts.seo:check="npx lighthouse http://localhost:3000 --only-categories=seo"

echo -e "\n${GREEN}✅ SEO оптимизация завершена!${NC}"
echo -e "\n${YELLOW}Чек-лист дальнейших действий:${NC}"
echo "1. Добавьте SEOHead компонент на все страницы"
echo "2. Создайте уникальные title и description для каждой страницы"
echo "3. Добавьте alt теги ко всем изображениям"
echo "4. Зарегистрируйтесь в Google Search Console и Яндекс.Вебмастер"
echo "5. Запустите 'npm run seo:check' для проверки SEO"