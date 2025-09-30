/**
 * Утилиты для работы с блокчейном и Web3 кошельками
 * @module blockchain
 */

import { X402_CONFIG, getChainConfig } from '../lib/x402Config';

/**
 * Проверка доступности Web3 провайдера (MetaMask, Coinbase Wallet и т.д.)
 * @returns {boolean}
 */
export function isWeb3Available() {
  return typeof window !== 'undefined' && (window.ethereum || window.web3);
}

/**
 * Получение Web3 провайдера
 * @returns {object|null} Провайдер или null
 */
export function getWeb3Provider() {
  if (typeof window === 'undefined') return null;
  
  // Приоритет: Coinbase Wallet > MetaMask > другие провайдеры
  if (window.ethereum?.isCoinbaseWallet) {
    return window.ethereum;
  }
  
  if (window.ethereum?.isMetaMask) {
    return window.ethereum;
  }
  
  return window.ethereum || window.web3?.currentProvider || null;
}

/**
 * Подключение кошелька пользователя
 * @returns {Promise<object>} Информация о подключенном кошельке
 */
export async function connectWallet() {
  try {
    const provider = getWeb3Provider();
    
    if (!provider) {
      throw new Error('Web3 кошелек не обнаружен. Установите MetaMask или Coinbase Wallet.');
    }

    // Запрос на подключение кошелька
    const accounts = await provider.request({ 
      method: 'eth_requestAccounts' 
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('Не удалось получить адрес кошелька');
    }

    // Получение информации о сети
    const chainId = await provider.request({ method: 'eth_chainId' });
    
    return {
      address: accounts[0],
      chainId: parseInt(chainId, 16),
      provider: provider
    };
  } catch (error) {
    console.error('Ошибка при подключении кошелька:', error);
    throw error;
  }
}

/**
 * Отключение кошелька
 * @returns {Promise<void>}
 */
export async function disconnectWallet() {
  try {
    const provider = getWeb3Provider();
    
    if (provider && provider.disconnect) {
      await provider.disconnect();
    }
    
    // Очистка локального хранилища
    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAddress');
    }
  } catch (error) {
    console.error('Ошибка при отключении кошелька:', error);
  }
}

/**
 * Переключение на нужную сеть
 * @param {string} chainName - Название сети
 * @returns {Promise<boolean>} Успешность переключения
 */
export async function switchNetwork(chainName) {
  try {
    const provider = getWeb3Provider();
    
    if (!provider) {
      throw new Error('Web3 кошелек не обнаружен');
    }

    const chainConfig = getChainConfig(chainName);
    const chainIdHex = `0x${chainConfig.chainId.toString(16)}`;

    try {
      // Попытка переключиться на сеть
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      
      return true;
    } catch (switchError) {
      // Если сеть не добавлена, добавляем её
      if (switchError.code === 4902) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: chainIdHex,
            chainName: chainConfig.name,
            nativeCurrency: chainConfig.nativeCurrency,
            rpcUrls: [chainConfig.rpcUrl],
            blockExplorerUrls: [chainConfig.explorerUrl]
          }],
        });
        
        return true;
      }
      
      throw switchError;
    }
  } catch (error) {
    console.error('Ошибка при переключении сети:', error);
    return false;
  }
}

/**
 * Получение текущей сети
 * @returns {Promise<number>} Chain ID
 */
export async function getCurrentChainId() {
  try {
    const provider = getWeb3Provider();
    
    if (!provider) {
      return null;
    }

    const chainId = await provider.request({ method: 'eth_chainId' });
    return parseInt(chainId, 16);
  } catch (error) {
    console.error('Ошибка при получении chain ID:', error);
    return null;
  }
}

/**
 * Проверка, находимся ли мы в правильной сети
 * @param {string} chainName - Название требуемой сети
 * @returns {Promise<boolean>}
 */
export async function isCorrectNetwork(chainName) {
  try {
    const currentChainId = await getCurrentChainId();
    const requiredChainConfig = getChainConfig(chainName);
    
    return currentChainId === requiredChainConfig.chainId;
  } catch (error) {
    console.error('Ошибка при проверке сети:', error);
    return false;
  }
}

/**
 * Подписание сообщения
 * @param {string} message - Сообщение для подписи
 * @param {string} address - Адрес кошелька
 * @returns {Promise<string>} Подпись
 */
export async function signMessage(message, address) {
  try {
    const provider = getWeb3Provider();
    
    if (!provider) {
      throw new Error('Web3 кошелек не обнаружен');
    }

    const signature = await provider.request({
      method: 'personal_sign',
      params: [message, address],
    });

    return signature;
  } catch (error) {
    console.error('Ошибка при подписании сообщения:', error);
    throw error;
  }
}

/**
 * Подписание типизированных данных (EIP-712)
 * @param {object} typedData - Типизированные данные
 * @param {string} address - Адрес кошелька
 * @returns {Promise<string>} Подпись
 */
export async function signTypedData(typedData, address) {
  try {
    const provider = getWeb3Provider();
    
    if (!provider) {
      throw new Error('Web3 кошелек не обнаружен');
    }

    const signature = await provider.request({
      method: 'eth_signTypedData_v4',
      params: [address, JSON.stringify(typedData)],
    });

    return signature;
  } catch (error) {
    console.error('Ошибка при подписании типизированных данных:', error);
    throw error;
  }
}

/**
 * Получение баланса кошелька
 * @param {string} address - Адрес кошелька
 * @returns {Promise<string>} Баланс в ETH
 */
export async function getBalance(address) {
  try {
    const provider = getWeb3Provider();
    
    if (!provider) {
      throw new Error('Web3 кошелек не обнаружен');
    }

    const balance = await provider.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });

    // Преобразование из wei в ETH
    const balanceInEth = parseInt(balance, 16) / 1e18;
    return balanceInEth.toFixed(4);
  } catch (error) {
    console.error('Ошибка при получении баланса:', error);
    throw error;
  }
}

/**
 * Форматирование адреса кошелька для отображения
 * @param {string} address - Полный адрес
 * @param {number} chars - Количество символов с каждой стороны
 * @returns {string} Укороченный адрес
 */
export function formatAddress(address, chars = 4) {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Слушатель изменения аккаунта
 * @param {function} callback - Функция обратного вызова
 * @returns {function} Функция для отписки
 */
export function onAccountsChanged(callback) {
  const provider = getWeb3Provider();
  
  if (!provider) {
    return () => {};
  }

  const handler = (accounts) => {
    callback(accounts[0] || null);
  };

  provider.on('accountsChanged', handler);

  // Возвращаем функцию для отписки
  return () => {
    provider.removeListener('accountsChanged', handler);
  };
}

/**
 * Слушатель изменения сети
 * @param {function} callback - Функция обратного вызова
 * @returns {function} Функция для отписки
 */
export function onChainChanged(callback) {
  const provider = getWeb3Provider();
  
  if (!provider) {
    return () => {};
  }

  const handler = (chainId) => {
    callback(parseInt(chainId, 16));
  };

  provider.on('chainChanged', handler);

  // Возвращаем функцию для отписки
  return () => {
    provider.removeListener('chainChanged', handler);
  };
}

/**
 * Проверка поддержки EIP-1193
 * @returns {boolean}
 */
export function isEIP1193Supported() {
  const provider = getWeb3Provider();
  return provider && typeof provider.request === 'function';
}

/**
 * Сохранение состояния подключения в localStorage
 * @param {string} address - Адрес кошелька
 * @param {number} chainId - ID сети
 */
export function saveWalletConnection(address, chainId) {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('walletConnected', 'true');
  localStorage.setItem('walletAddress', address);
  localStorage.setItem('walletChainId', chainId.toString());
}

/**
 * Получение сохраненного состояния подключения
 * @returns {object|null} Сохраненные данные или null
 */
export function getSavedWalletConnection() {
  if (typeof window === 'undefined') return null;
  
  const connected = localStorage.getItem('walletConnected');
  const address = localStorage.getItem('walletAddress');
  const chainId = localStorage.getItem('walletChainId');
  
  if (connected === 'true' && address) {
    return {
      address,
      chainId: chainId ? parseInt(chainId) : null
    };
  }
  
  return null;
}

/**
 * Очистка сохраненного состояния подключения
 */
export function clearSavedWalletConnection() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('walletConnected');
  localStorage.removeItem('walletAddress');
  localStorage.removeItem('walletChainId');
}

export default {
  isWeb3Available,
  getWeb3Provider,
  connectWallet,
  disconnectWallet,
  switchNetwork,
  getCurrentChainId,
  isCorrectNetwork,
  signMessage,
  signTypedData,
  getBalance,
  formatAddress,
  onAccountsChanged,
  onChainChanged,
  isEIP1193Supported,
  saveWalletConnection,
  getSavedWalletConnection,
  clearSavedWalletConnection
};
