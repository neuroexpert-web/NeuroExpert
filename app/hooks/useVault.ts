import { useState, useCallback, useEffect } from 'react';

interface VaultData {
  [key: string]: any;
}

const VAULT_KEY = 'neuroexpert-vault';
const VAULT_VERSION = '1.0';

export function useVault() {
  const [vault, setVault] = useState<VaultData>({});

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VAULT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === VAULT_VERSION) {
          setVault(parsed.data);
        }
      }
    } catch (error) {
      console.error('Error loading vault:', error);
    }
  }, []);

  // Сохранение контекста
  const saveContext = useCallback((context: VaultData) => {
    try {
      const newVault = {
        ...vault,
        ...context,
        lastUpdated: new Date().toISOString()
      };
      
      setVault(newVault);
      
      // Сохранение в localStorage
      localStorage.setItem(VAULT_KEY, JSON.stringify({
        version: VAULT_VERSION,
        data: newVault
      }));
      
      // Отправка на сервер для синхронизации (если нужно)
      if (process.env.NEXT_PUBLIC_VAULT_SYNC_ENABLED === 'true') {
        fetch('/api/vault', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVault)
        }).catch(console.error);
      }
    } catch (error) {
      console.error('Error saving to vault:', error);
    }
  }, [vault]);

  // Загрузка контекста
  const loadContext = useCallback(() => {
    return vault;
  }, [vault]);

  // Очистка vault
  const clearVault = useCallback(() => {
    setVault({});
    localStorage.removeItem(VAULT_KEY);
  }, []);

  // Экспорт vault
  const exportVault = useCallback(() => {
    const dataStr = JSON.stringify(vault, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `neuroexpert-vault-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [vault]);

  return {
    saveContext,
    loadContext,
    clearVault,
    exportVault,
    vault
  };
}