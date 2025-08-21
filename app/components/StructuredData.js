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
