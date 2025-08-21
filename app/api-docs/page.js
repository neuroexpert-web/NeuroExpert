'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function ApiDocsPage() {
  useEffect(() => {
    // Инициализация Swagger UI после загрузки скриптов
    if (typeof window !== 'undefined' && window.SwaggerUIBundle) {
      window.SwaggerUIBundle({
        url: '/openapi.yaml',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          window.SwaggerUIBundle.presets.apis,
          window.SwaggerUIStandalonePreset
        ],
        plugins: [
          window.SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: 'StandaloneLayout',
        theme: 'dark',
        syntaxHighlight: {
          theme: 'monokai'
        }
      });
    }
  }, []);

  return (
    <div className="api-docs-page">
      <Script
        src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-bundle.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.SwaggerUIBundle) {
            window.SwaggerUIBundle({
              url: '/openapi.yaml',
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                window.SwaggerUIBundle.presets.apis,
                window.SwaggerUIStandalonePreset
              ],
              plugins: [
                window.SwaggerUIBundle.plugins.DownloadUrl
              ],
              layout: 'StandaloneLayout',
              syntaxHighlight: {
                theme: 'monokai'
              },
              defaultModelsExpandDepth: 1,
              defaultModelExpandDepth: 1,
              docExpansion: 'list',
              filter: true,
              showExtensions: true,
              showCommonExtensions: true,
              tryItOutEnabled: true,
              supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
              onComplete: () => {
                console.log('Swagger UI loaded');
              }
            });
          }
        }}
      />
      <Script
        src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-standalone-preset.js"
        strategy="afterInteractive"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui.css"
      />
      
      <div className="api-header">
        <h1>API Documentation</h1>
        <p>Interactive API documentation for NeuroExpert platform</p>
      </div>
      
      <div id="swagger-ui" className="swagger-container"></div>
      
      <style jsx>{`
        .api-docs-page {
          min-height: 100vh;
          background: var(--noir-900, #0a0a0a);
          color: var(--white, #ffffff);
        }
        
        .api-header {
          padding: 2rem;
          text-align: center;
          background: var(--noir-800, #1a1a1a);
          border-bottom: 1px solid var(--noir-700, #2a2a2a);
        }
        
        .api-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .api-header p {
          color: var(--gray-400);
          font-size: 1.1rem;
        }
        
        .swagger-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        /* Кастомизация Swagger UI для соответствия дизайну */
        :global(.swagger-ui) {
          font-family: var(--font-inter) !important;
        }
        
        :global(.swagger-ui .topbar) {
          display: none;
        }
        
        :global(.swagger-ui .info .title) {
          color: var(--gold-500);
        }
        
        :global(.swagger-ui .btn) {
          background: var(--gold-500);
          color: var(--noir-900);
          border: none;
        }
        
        :global(.swagger-ui .btn:hover) {
          background: var(--gold-600);
        }
        
        :global(.swagger-ui select) {
          background: var(--noir-800);
          color: var(--white);
          border: 1px solid var(--noir-700);
        }
        
        :global(.swagger-ui .opblock.opblock-post) {
          border-color: #49cc90;
          background: rgba(73, 204, 144, 0.1);
        }
        
        :global(.swagger-ui .opblock.opblock-get) {
          border-color: #61affe;
          background: rgba(97, 175, 254, 0.1);
        }
        
        :global(.swagger-ui .opblock.opblock-put) {
          border-color: #fca130;
          background: rgba(252, 161, 48, 0.1);
        }
        
        :global(.swagger-ui .opblock.opblock-delete) {
          border-color: #f93e3e;
          background: rgba(249, 62, 62, 0.1);
        }
      `}</style>
    </div>
  );
}