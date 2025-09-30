'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Динамический импорт WorkspaceLayout
const WorkspaceLayout = dynamic(() => import('../components/workspace/WorkspaceLayout'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      background: '#0a0a0f',
      color: 'white'
    }}>
      <div>Загрузка личного кабинета...</div>
    </div>
  )
});

export default function TestWorkspacePage() {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <WorkspaceLayout />
      </Suspense>
    </div>
  );
}