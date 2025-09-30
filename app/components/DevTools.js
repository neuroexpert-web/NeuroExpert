'use client';

import { useState, useEffect, useRef } from 'react';

// Хук для подсчета рендеров
function useRenderCount() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  return renderCount.current;
}

// Хук для мониторинга FPS
function useFPS() {
  const [fps, setFps] = useState(0);
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId;
    
    const calculateFPS = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(calculateFPS);
    };
    
    animationId = requestAnimationFrame(calculateFPS);
    
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return fps;
}

// Хук для мониторинга памяти
function useMemory() {
  const [memory, setMemory] = useState({ used: 0, limit: 0 });
  
  useEffect(() => {
    const updateMemory = () => {
      if (performance.memory) {
        setMemory({
          used: Math.round(performance.memory.usedJSHeapSize / 1048576),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        });
      }
    };
    
    updateMemory();
    const interval = setInterval(updateMemory, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return memory;
}

export default function DevTools() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showNetworkTab, setShowNetworkTab] = useState(false);
  const renderCount = useRenderCount();
  const fps = useFPS();
  const memory = useMemory();
  
  // Только в режиме разработки
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-mono text-xs">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-black/90 text-white p-2 rounded-lg shadow-lg hover:bg-black transition-colors"
          title="Expand DevTools"
        >
          🛠️
        </button>
      ) : (
        <div className="bg-black/90 text-white rounded-lg shadow-2xl backdrop-blur-sm border border-white/10">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <span className="font-bold text-green-400">🛠️ DevTools</span>
            <button
              onClick={() => setIsMinimized(true)}
              className="hover:bg-white/10 rounded px-2 py-1 transition-colors"
            >
              _
            </button>
          </div>
          
          {/* Stats */}
          <div className="p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Renders:</span>
              <span className="text-yellow-400">{renderCount}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">FPS:</span>
              <span className={fps > 50 ? 'text-green-400' : fps > 30 ? 'text-yellow-400' : 'text-red-400'}>
                {fps}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Memory:</span>
              <span className="text-blue-400">
                {memory.used}MB / {memory.limit}MB
              </span>
            </div>
            
            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Env:</span>
                <span className="text-purple-400">{process.env.NODE_ENV}</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="p-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
            >
              🔄 Reload
            </button>
            
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.clear();
                  sessionStorage.clear();
                  alert('Storage cleared!');
                }
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
            >
              🗑️ Clear Storage
            </button>
            
            <button
              onClick={() => setShowNetworkTab(!showNetworkTab)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded transition-colors"
            >
              🌐 Network Tab
            </button>
          </div>
          
          {/* Network Tab */}
          {showNetworkTab && (
            <div className="p-3 border-t border-white/10">
              <div className="text-gray-400 text-xs">
                Open DevTools Network tab (F12)
              </div>
            </div>
          )}
          
          {/* Shortcuts */}
          <div className="p-3 border-t border-white/10 text-gray-400 text-xs">
            <div>Cmd+K - Generate with AI</div>
            <div>Cmd+L - AI Chat</div>
            <div>Cmd+I - Inline Edit</div>
          </div>
        </div>
      )}
    </div>
  );
}