'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { getVault } from '../lib/jsonVault.js';

// Типы для оконных объектов
declare global {
  interface Window {
    gtag: any;
    ym: any;
    _fbq: any;
    VK: any;
    Sentry: any;
    AppMetrica: any;
    OpenReplay: any;
    hj: any;
  }
}

interface AnalyticsConfig {
  googleAnalyticsId?: string;
  yandexMetricaId?: string;
  facebookPixelId?: string;
  vkPixelId?: string;
  sentryDsn?: string;
  appMetricaApiKey?: string;
  openReplayProjectKey?: string;
  hotjarId?: string;
  hotjarSnippetVersion?: number;
}

export default function AnalyticsEnhanced() {
  const vault = getVault();
  
  // Конфигурация из переменных окружения
  const config: AnalyticsConfig = {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    yandexMetricaId: process.env.NEXT_PUBLIC_YM_ID,
    facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
    vkPixelId: process.env.NEXT_PUBLIC_VK_PIXEL_ID,
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    appMetricaApiKey: process.env.NEXT_PUBLIC_APPMETRICA_API_KEY,
    openReplayProjectKey: process.env.NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
    hotjarSnippetVersion: parseInt(process.env.NEXT_PUBLIC_HOTJAR_SNIPPET_VERSION || '6')
  };

  // Универсальная функция для отправки событий
  const trackEvent = (eventName: string, eventData?: any) => {
    // Google Analytics
    if (window.gtag && config.googleAnalyticsId) {
      window.gtag('event', eventName, eventData);
    }

    // Яндекс.Метрика
    if (window.ym && config.yandexMetricaId) {
      window.ym(config.yandexMetricaId, 'reachGoal', eventName, eventData);
    }

    // Facebook Pixel
    if (window._fbq && config.facebookPixelId) {
      window._fbq('track', eventName, eventData);
    }

    // VK Pixel
    if (window.VK && config.vkPixelId) {
      window.VK.Retargeting.Event(eventName);
    }

    // AppMetrica
    if (window.AppMetrica && config.appMetricaApiKey) {
      window.AppMetrica.reportEvent(eventName, eventData);
    }

    // Hotjar
    if (window.hj && config.hotjarId) {
      window.hj('event', eventName);
    }

    // Сохраняем в JSON Vault
    vault.recordAnalyticsEvent(eventName, eventData);
  };

  // Глобальная функция для использования в других компонентах
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).trackEvent = trackEvent;
    }
  }, []);

  // Отслеживание производительности
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      // Отправляем метрики производительности
      if (pageLoadTime > 0) {
        trackEvent('performance_metrics', {
          page_load_time: pageLoadTime,
          dom_ready_time: perfData.domContentLoadedEventEnd - perfData.navigationStart,
          first_paint: performance.getEntriesByType('paint')[0]?.startTime || 0
        });
      }
    }
  }, []);

  return (
    <>
      {/* Google Analytics 4 */}
      {config.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${config.googleAnalyticsId}', {
                page_path: window.location.pathname,
                send_page_view: true
              });
            `}
          </Script>
        </>
      )}

      {/* Яндекс.Метрика */}
      {config.yandexMetricaId && (
        <Script id="yandex-metrica" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            
            ym(${config.yandexMetricaId}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true,
              ecommerce:"dataLayer"
            });
          `}
        </Script>
      )}

      {/* Facebook Pixel */}
      {config.facebookPixelId && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${config.facebookPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* VK Pixel */}
      {config.vkPixelId && (
        <Script id="vk-pixel" strategy="afterInteractive">
          {`
            !function(){var t=document.createElement("script");
            t.type="text/javascript",t.async=!0,
            t.src="https://vk.com/js/api/openapi.js?169",
            t.onload=function(){VK.Retargeting.Init("${config.vkPixelId}"),
            VK.Retargeting.Hit()},
            document.head.appendChild(t)}();
          `}
        </Script>
      )}

      {/* AppMetrica */}
      {config.appMetricaApiKey && (
        <Script id="appmetrica" strategy="afterInteractive">
          {`
            (function(a,c){a.appMetricaCheckCallbacks=a.appMetricaCheckCallbacks||[],
            a.appMetricaYaCounterName=a.appMetricaYaCounterName||"appMetrica";
            var d=function(){var b=a.appMetricaCheckCallbacks;
            "function"==typeof b&&(a.appMetricaCheckCallbacks=[b]);
            for(var c=0;c<b.length;c++)try{b[c]()}catch(f){}};
            d();var e=c.createElement("script");e.type="text/javascript";
            e.async=!0;e.src="https://cdn.appmetrica.yandex.net/tag/tag.js";
            c.getElementsByTagName("head")[0].appendChild(e);
            e.onload=function(){a.appMetrica({apiKey:"${config.appMetricaApiKey}",
            accurateTrackBounce:!0,trackLinks:!0,clickmap:!0,webvisor:!0}),d()}})(window,document);
          `}
        </Script>
      )}

      {/* OpenReplay */}
      {config.openReplayProjectKey && (
        <Script id="openreplay" strategy="afterInteractive">
          {`
            var initOpts = {
              projectKey: "${config.openReplayProjectKey}",
              defaultInputMode: 0,
              obscureTextNumbers: false,
              obscureTextEmails: true,
            };
            var startOpts = { userID: "" };
            (function(A,s,a,y,e,r){
              r=window.OpenReplay=[e,r,y,[s-1, e]];
              s=document.createElement('script');s.src=A;s.async=!a;
              s.onload=y;s.onerror=r;
              document.head.appendChild(s);
            })("https://cdn.openreplay.com/latest/openreplay.js", 1, 0, function(){
              OpenReplay.init(initOpts);
              OpenReplay.start(startOpts);
            }, function(e){console.error("OpenReplay error:", e)}, function(){});
          `}
        </Script>
      )}

      {/* Hotjar */}
      {config.hotjarId && config.hotjarSnippetVersion && (
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${config.hotjarId},hjsv:${config.hotjarSnippetVersion}};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      )}

      {/* Дашборд аналитики */}
      {process.env.NODE_ENV === 'development' && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '12px',
            color: '#fff',
            zIndex: 9999,
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Analytics Active:</div>
          <div>GA: {config.googleAnalyticsId ? '✅' : '❌'}</div>
          <div>YM: {config.yandexMetricaId ? '✅' : '❌'}</div>
          <div>Sentry: {config.sentryDsn ? '✅' : '❌'}</div>
          <div>AppMetrica: {config.appMetricaApiKey ? '✅' : '❌'}</div>
          <div>OpenReplay: {config.openReplayProjectKey ? '✅' : '❌'}</div>
          <div>Hotjar: {config.hotjarId ? '✅' : '❌'}</div>
        </div>
      )}
    </>
  );
}