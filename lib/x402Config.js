/**
 * Конфигурация протокола x402
 * @module x402Config
 */

export const X402_CONFIG = {
  // URL facilitator (Coinbase CDP)
  facilitatorUrl: process.env.NEXT_PUBLIC_X402_FACILITATOR_URL || 'https://facilitator.coinbase.com',
  
  // Адрес кошелька для приема платежей
  recipientAddress: process.env.NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS || '0x0000000000000000000000000000000000000000',
  
  // Сеть по умолчанию
  defaultChain: process.env.NEXT_PUBLIC_DEFAULT_CHAIN || 'base',
  
  // Токен по умолчанию
  defaultToken: process.env.NEXT_PUBLIC_DEFAULT_TOKEN || 'usdc',
  
  // Поддерживаемые сети
  supportedChains: {
    base: {
      name: 'Base',
      chainId: 8453,
      rpcUrl: 'https://mainnet.base.org',
      explorerUrl: 'https://basescan.org',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      }
    },
    ethereum: {
      name: 'Ethereum',
      chainId: 1,
      rpcUrl: 'https://eth.llamarpc.com',
      explorerUrl: 'https://etherscan.io',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      }
    },
    baseTestnet: {
      name: 'Base Sepolia',
      chainId: 84532,
      rpcUrl: 'https://sepolia.base.org',
      explorerUrl: 'https://sepolia.basescan.org',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      }
    }
  },
  
  // Поддерживаемые токены
  supportedTokens: {
    usdc: {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      addresses: {
        base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        ethereum: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        baseTestnet: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
      }
    },
    usdt: {
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      addresses: {
        ethereum: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
      }
    }
  },
  
  // Настройки транзакций
  transaction: {
    defaultDeadlineMinutes: 60, // 1 час
    maxRetries: 3,
    retryDelayMs: 1000
  },
  
  // Лимиты
  limits: {
    minAmount: 1, // Минимальная сумма пополнения в USD
    maxAmount: 10000, // Максимальная сумма пополнения в USD
    dailyLimit: 50000 // Дневной лимит в USD
  }
};

/**
 * Получить конфигурацию для конкретной сети
 * @param {string} chainName - Название сети
 * @returns {object} Конфигурация сети
 */
export function getChainConfig(chainName) {
  const config = X402_CONFIG.supportedChains[chainName];
  if (!config) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }
  return config;
}

/**
 * Получить конфигурацию для конкретного токена
 * @param {string} tokenSymbol - Символ токена
 * @returns {object} Конфигурация токена
 */
export function getTokenConfig(tokenSymbol) {
  const config = X402_CONFIG.supportedTokens[tokenSymbol.toLowerCase()];
  if (!config) {
    throw new Error(`Unsupported token: ${tokenSymbol}`);
  }
  return config;
}

/**
 * Получить адрес токена для конкретной сети
 * @param {string} tokenSymbol - Символ токена
 * @param {string} chainName - Название сети
 * @returns {string} Адрес контракта токена
 */
export function getTokenAddress(tokenSymbol, chainName) {
  const tokenConfig = getTokenConfig(tokenSymbol);
  const address = tokenConfig.addresses[chainName];
  if (!address) {
    throw new Error(`Token ${tokenSymbol} not available on ${chainName}`);
  }
  return address;
}

/**
 * Проверить, поддерживается ли сеть
 * @param {string} chainName - Название сети
 * @returns {boolean}
 */
export function isChainSupported(chainName) {
  return chainName in X402_CONFIG.supportedChains;
}

/**
 * Проверить, поддерживается ли токен
 * @param {string} tokenSymbol - Символ токена
 * @returns {boolean}
 */
export function isTokenSupported(tokenSymbol) {
  return tokenSymbol.toLowerCase() in X402_CONFIG.supportedTokens;
}

export default X402_CONFIG;
