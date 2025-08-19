'use client';

export default function Home() {
  return (
    <main className="premium-main" style={{ background: 'var(--noir-900)', minHeight: '100vh' }}>
      <iframe
        src="/index.html"
        title="NeuroExpert Hero"
        style={{ border: 'none', width: '100%', height: '100vh' }}
      />
    </main>
  );
}