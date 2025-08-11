
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
      </head>
      <body>
        <main className="app">
          {children}
        </main>
      </body>
    </html>
  );
}
