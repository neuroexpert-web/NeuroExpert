import dynamic from 'next/dynamic';

export function lazyWithPreload(importFunc, options = {}) {
  const Component = dynamic(importFunc, {
    loading: () => <div className="animate-pulse bg-gray-200 rounded h-64" />,
    ...options,
  });
  
  Component.preload = importFunc;
  
  return Component;
}

// Использование:
// const HeavyComponent = lazyWithPreload(() => import('./HeavyComponent'));
// HeavyComponent.preload(); // Предзагрузка
