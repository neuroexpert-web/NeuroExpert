'use client';

import { useState } from 'react';

export default function WorkspaceDebugPage() {
  const [components, setComponents] = useState({});
  const [error, setError] = useState(null);

  const testComponent = async (name, path) => {
    try {
      console.log(`Testing ${name}...`);
      const module = await import(`../components/workspace/${path}`);
      console.log(`${name} loaded successfully:`, module);
      setComponents(prev => ({ ...prev, [name]: '✅ Loaded' }));
    } catch (err) {
      console.error(`Error loading ${name}:`, err);
      setComponents(prev => ({ ...prev, [name]: `❌ ${err.message}` }));
      setError(err);
    }
  };

  const testAllComponents = async () => {
    const componentsToTest = [
      ['WorkspaceLayout', 'WorkspaceLayout'],
      ['WorkspaceContext', 'WorkspaceContext'],
      ['WorkspaceHeader', 'WorkspaceHeader'],
      ['WorkspaceSidebar', 'WorkspaceSidebar'],
      ['WorkspaceWidgets', 'WorkspaceWidgets'],
      ['WorkspaceWindows', 'WorkspaceWindows'],
      ['NotificationCenter', 'NotificationCenter'],
      ['AIAssistant', 'AIAssistant']
    ];

    for (const [name, path] of componentsToTest) {
      await testComponent(name, path);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#0a0a0f', color: 'white', minHeight: '100vh' }}>
      <h1>Workspace Components Debug</h1>
      
      <button 
        onClick={testAllComponents}
        style={{
          padding: '10px 20px',
          background: '#8a2be2',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Test All Components
      </button>

      <h2>Component Status:</h2>
      <pre style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px' }}>
        {JSON.stringify(components, null, 2)}
      </pre>

      {error && (
        <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>
          <h3>Error Details:</h3>
          <pre>{error.toString()}</pre>
          <pre>{error.stack}</pre>
        </div>
      )}

      <h2>Test Individual Features:</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => {
          console.log('Testing localStorage...');
          localStorage.setItem('test', 'value');
          console.log('localStorage test:', localStorage.getItem('test'));
        }}>Test localStorage</button>
        
        <button onClick={() => {
          console.log('Testing window object...');
          console.log('window.innerWidth:', window.innerWidth);
          console.log('window.location:', window.location);
        }}>Test window</button>
        
        <button onClick={() => {
          console.log('Testing dynamic import...');
          import('../components/workspace/WorkspaceLayout').then(m => {
            console.log('Dynamic import success:', m);
          }).catch(err => {
            console.error('Dynamic import error:', err);
          });
        }}>Test Dynamic Import</button>
      </div>

      <h2>Console Output:</h2>
      <p>Open browser console to see detailed logs</p>
    </div>
  );
}