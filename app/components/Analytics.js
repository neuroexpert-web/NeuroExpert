'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Google Analytics 4
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// Яндекс.Метрика
const YM_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;

// Facebook Pixel
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

// VK Pixel
const VK_PIXEL_ID = process.env.NEXT_PUBLIC_VK_PIXEL_ID;

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Google Analytics 4
      if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
        });
      }

      // Яндекс.Метрика
      if (typeof window !== 'undefined' && window.ym && YM_ID) {
        window.ym(YM_ID, 'hit', pathname);
      }

      // Facebook Pixel
      if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
        window.fbq('track', 'PageView');
      }

      // VK Pixel
      if (typeof window !== 'undefined' && window.VK && VK_PIXEL_ID) {
        window.VK.Retargeting.Hit();
      }
    }
  }, [pathname, searchParams]);

  return null;
}

// Функции для отслеживания событий
export const trackEvent = (eventName, parameters = {}) => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, parameters);
  }

  // Яндекс.Метрика
  if (typeof window !== 'undefined' && window.ym && YM_ID) {
    window.ym(YM_ID, 'reachGoal', eventName, parameters);
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('track', eventName, parameters);
  }

  // VK Pixel
  if (typeof window !== 'undefined' && window.VK && VK_PIXEL_ID) {
    window.VK.Retargeting.Event(eventName);
  }
};

// Отслеживание конверсий
export const trackConversion = (value, currency = 'RUB') => {
  trackEvent('purchase', {
    value: value,
    currency: currency,
  });
};

// Отслеживание лидов
export const trackLead = (leadType, value = null) => {
  trackEvent('generate_lead', {
    lead_type: leadType,
    value: value,
  });
};

// Скрипты для инициализации аналитики
export const AnalyticsScripts = () => {
  return (
    <>
      {/* Google Analytics 4 */}
      {GA_MEASUREMENT_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `,
            }}
          />
        </>
      )}

      {/* Яндекс.Метрика */}
      {YM_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              ym(${YM_ID}, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
              });
            `,
          }}
        />
      )}

      {/* Facebook Pixel */}
      {FB_PIXEL_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* VK Pixel */}
      {VK_PIXEL_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src='https://vk.com/js/api/openapi.js?169',t.onload=function(){VK.Retargeting.Init("${VK_PIXEL_ID}"),VK.Retargeting.Hit()},document.head.appendChild(t)}();
            `,
          }}
        />
      )}
    </>
  );
};