'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Google Analytics 4
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Яндекс.Метрика
export const YM_COUNTER_ID = process.env.NEXT_PUBLIC_YM_COUNTER_ID;

// Facebook Pixel
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

// VK Pixel
export const VK_PIXEL_ID = process.env.NEXT_PUBLIC_VK_PIXEL_ID;

// Отправка события в Google Analytics
export const gtag = (...args) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

// Отправка события в Яндекс.Метрику
export const ym = (...args) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(...args);
  }
};

// Отправка события в Facebook Pixel
export const fbq = (...args) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args);
  }
};

// Отправка события в VK Pixel
export const vkPixel = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.VK && window.VK.Retargeting) {
    window.VK.Retargeting.Event(eventName, eventParams);
  }
};

// Универсальная функция для отправки событий во все системы
export const trackEvent = (eventName, eventParams = {}) => {
  // Google Analytics
  gtag('event', eventName, eventParams);
  
  // Яндекс.Метрика
  if (YM_COUNTER_ID) {
    ym(YM_COUNTER_ID, 'reachGoal', eventName, eventParams);
  }
  
  // Facebook Pixel
  if (FB_PIXEL_ID) {
    fbq('track', eventName, eventParams);
  }
  
  // VK Pixel
  if (VK_PIXEL_ID) {
    vkPixel(eventName, eventParams);
  }
};

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Отслеживание изменения страниц
  useEffect(() => {
    const url = pathname + searchParams.toString();
    
    // Google Analytics
    if (GA_MEASUREMENT_ID) {
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
    
    // Яндекс.Метрика
    if (YM_COUNTER_ID) {
      ym(YM_COUNTER_ID, 'hit', url);
    }
    
    // Facebook Pixel
    if (FB_PIXEL_ID) {
      fbq('track', 'PageView');
    }
  }, [pathname, searchParams]);

  return null;
}

// Скрипты для загрузки в head
export function AnalyticsScripts() {
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
      {YM_COUNTER_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              
              ym(${YM_COUNTER_ID}, "init", {
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
              (window.VK = window.VK || {}), 
              VK.Retargeting = VK.Retargeting || function() {
                var a = VK.Retargeting.Init = function(b) {
                  a.pixelCode = b
                };
                a.Event = function(b) {
                  var c = "https://vk.com/rtrg?p=" + a.pixelCode + "&event=" + b;
                  (new Image).src = c
                };
                return a
              }();
              VK.Retargeting.Init('${VK_PIXEL_ID}');
              VK.Retargeting.Event('pageView');
            `,
          }}
        />
      )}
    </>
  );
}