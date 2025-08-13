
import './globals.css';

export const metadata = {
  title: 'NeuroExpert — AI Audit',
  description: 'Платформа для экспертной автоматизации аудита и внедрения цифровых решений'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>NeuroExpert — AI Audit</title>
        <meta name="description" content="Платформа для экспертной автоматизации аудита и внедрения цифровых решений" />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: 'NeuroExpert',
                    page_location: window.location.href,
                    send_page_view: true
                  });
                `
              }}
            />
          </>
        )}
        
        {/* Яндекс.Метрика */}
        {process.env.NEXT_PUBLIC_YANDEX_METRICA_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                ym(${process.env.NEXT_PUBLIC_YANDEX_METRICA_ID}, "init", {
                     clickmap:true,
                     trackLinks:true,
                     accurateTrackBounce:true,
                     webvisor:true
                });
              `
            }}
          />
        )}
        
        {/* Яндекс.Метрика Noscript */}
        {process.env.NEXT_PUBLIC_YANDEX_METRICA_ID && (
          <noscript>
            <div>
              <img 
                src={`https://mc.yandex.ru/watch/${process.env.NEXT_PUBLIC_YANDEX_METRICA_ID}`} 
                style={{position:'absolute', left:'-9999px'}} 
                alt="" 
              />
            </div>
          </noscript>
        )}
      </head>
      <body>
        <main className="app">
          {children}
        </main>
      </body>
    </html>
  );
}
