/**
 * Клиент для работы с протоколом x402
 * @module x402Client
 */

import { X402_CONFIG, getChainConfig, getTokenConfig, getTokenAddress } from '../lib/x402Config';
import { signX402Payment, getTokenBalance, sendTokenTransaction } from './x402Payment';

/**
 * Класс для работы с протоколом x402
 */
export class X402Client {
  constructor(facilitatorUrl = X402_CONFIG.facilitatorUrl, recipientAddress = X402_CONFIG.recipientAddress) {
    this.facilitatorUrl = facilitatorUrl;
    this.recipientAddress = recipientAddress;
  }

  /**
   * Инициация платежа
   * @param {number} amount - Сумма в USD
   * @param {string} chain - Название блокчейн сети
   * @param {string} token - Символ токена
   * @returns {Promise<object>} Детали платежа для подписания
   */
  async initiatePayment(amount, chain = X402_CONFIG.defaultChain, token = X402_CONFIG.defaultToken) {
    try {
      // Валидация суммы
      if (amount < X402_CONFIG.limits.minAmount) {
        throw new Error(`Минимальная сумма пополнения: ${X402_CONFIG.limits.minAmount} USD`);
      }
      if (amount > X402_CONFIG.limits.maxAmount) {
        throw new Error(`Максимальная сумма пополнения: ${X402_CONFIG.limits.maxAmount} USD`);
      }

      // Получение конфигурации токена
      const tokenConfig = getTokenConfig(token);
      
      // Преобразование суммы в минимальные единицы токена
      const tokenAmount = this._toTokenUnits(amount, tokenConfig.decimals);

      // Расчет deadline (время истечения платежа)
      const deadline = Math.floor(Date.now() / 1000) + (X402_CONFIG.transaction.defaultDeadlineMinutes * 60);

      // Формирование деталей платежа согласно спецификации x402
      const paymentDetails = {
        chain: chain,
        token: token.toLowerCase(),
        to: this.recipientAddress,
        amount: tokenAmount,
        deadline: deadline,
        metadata: {
          initiatedAt: new Date().toISOString(),
          version: '1.0'
        }
      };

      return paymentDetails;
    } catch (error) {
      console.error('Ошибка при инициации платежа:', error);
      throw error;
    }
  }

  /**
   * Подписание платежа через кошелек пользователя
   * @param {object} paymentDetails - Детали платежа из initiatePayment
   * @param {string} walletAddress - Адрес кошелька пользователя
   * @returns {Promise<string>} Подписанный payload (base64)
   */
  async signPayment(paymentDetails, walletAddress) {
    try {
      // Используем ethers.js для реального подписания через EIP-712
      const signedPayload = await signX402Payment(paymentDetails, walletAddress);
      return signedPayload;
    } catch (error) {
      console.error('Ошибка при подписании платежа:', error);
      throw new Error(`Не удалось подписать платеж: ${error.message}`);
    }
  }

  /**
   * Верификация платежного payload
   * @param {string} payload - Подписанный платежный payload (base64)
   * @returns {Promise<object>} Результат верификации
   */
  async verifyPayment(payload) {
    try {
      const response = await fetch(`${this.facilitatorUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Protocol-Version': '1.0'
        },
        body: JSON.stringify({ payload })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка верификации платежа');
      }

      const result = await response.json();
      return {
        valid: result.valid || false,
        reason: result.reason,
        details: result.details
      };
    } catch (error) {
      console.error('Ошибка при верификации платежа:', error);
      throw error;
    }
  }

  /**
   * Проведение платежа (settlement) в блокчейне
   * @param {string} payload - Верифицированный платежный payload
   * @returns {Promise<object>} Результат проведения транзакции
   */
  async settlePayment(payload) {
    try {
      const response = await fetch(`${this.facilitatorUrl}/settle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Protocol-Version': '1.0'
        },
        body: JSON.stringify({ payload })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка проведения платежа');
      }

      const result = await response.json();
      return {
        txHash: result.txHash,
        status: result.status || 'pending',
        blockNumber: result.blockNumber,
        timestamp: result.timestamp || Date.now()
      };
    } catch (error) {
      console.error('Ошибка при проведении платежа:', error);
      throw error;
    }
  }

  /**
   * Получение статуса транзакции
   * @param {string} txHash - Хэш транзакции
   * @param {string} chain - Название блокчейн сети
   * @returns {Promise<object>} Статус транзакции
   */
  async getPaymentStatus(txHash, chain = X402_CONFIG.defaultChain) {
    try {
      const response = await fetch(`${this.facilitatorUrl}/status/${txHash}?chain=${chain}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка получения статуса транзакции');
      }

      const result = await response.json();
      return {
        txHash: result.txHash,
        status: result.status, // pending, confirmed, failed
        confirmations: result.confirmations || 0,
        blockNumber: result.blockNumber,
        timestamp: result.timestamp
      };
    } catch (error) {
      console.error('Ошибка при получении статуса транзакции:', error);
      throw error;
    }
  }

  /**
   * Проверка доступности facilitator
   * @returns {Promise<boolean>} Доступность сервиса
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.facilitatorUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Facilitator недоступен:', error);
      return false;
    }
  }

  /**
   * Преобразование суммы USD в минимальные единицы токена
   * @private
   * @param {number} amount - Сумма в USD
   * @param {number} decimals - Количество десятичных знаков токена
   * @returns {string} Сумма в минимальных единицах
   */
  _toTokenUnits(amount, decimals) {
    // Для USDC (6 decimals): 1 USD = 1,000,000 units
    const multiplier = Math.pow(10, decimals);
    return (amount * multiplier).toString();
  }

  /**
   * Преобразование минимальных единиц токена в USD
   * @private
   * @param {string} tokenAmount - Сумма в минимальных единицах
   * @param {number} decimals - Количество десятичных знаков токена
   * @returns {number} Сумма в USD
   */
  _fromTokenUnits(tokenAmount, decimals) {
    const divisor = Math.pow(10, decimals);
    return parseFloat(tokenAmount) / divisor;
  }

  /**
   * Получение ссылки на блокчейн эксплорер для транзакции
   * @param {string} txHash - Хэш транзакции
   * @param {string} chain - Название блокчейн сети
   * @returns {string} URL в эксплорере
   */
  getExplorerUrl(txHash, chain = X402_CONFIG.defaultChain) {
    const chainConfig = getChainConfig(chain);
    return `${chainConfig.explorerUrl}/tx/${txHash}`;
  }

  /**
   * Получение баланса токена пользователя
   * @param {string} tokenSymbol - Символ токена
   * @param {string} walletAddress - Адрес кошелька
   * @param {string} chain - Название сети
   * @returns {Promise<string>} Баланс в читаемом формате
   */
  async getTokenBalance(tokenSymbol, walletAddress, chain = X402_CONFIG.defaultChain) {
    try {
      return await getTokenBalance(tokenSymbol, walletAddress, chain);
    } catch (error) {
      console.error('Ошибка при получении баланса токена:', error);
      throw error;
    }
  }

  /**
   * Прямая отправка токенов (fallback метод)
   * Используется если x402 facilitator недоступен
   * @param {string} tokenSymbol - Символ токена
   * @param {string} recipientAddress - Адрес получателя
   * @param {number} amount - Сумма в долларах
   * @param {string} chain - Название сети
   * @returns {Promise<object>} Результат транзакции
   */
  async sendTokenDirect(tokenSymbol, recipientAddress, amount, chain = X402_CONFIG.defaultChain) {
    try {
      return await sendTokenTransaction(tokenSymbol, recipientAddress, amount, chain);
    } catch (error) {
      console.error('Ошибка при прямой отправке токенов:', error);
      throw error;
    }
  }

  /**
   * Полный цикл платежа: инициация → подписание → верификация → проведение
   * @param {number} amount - Сумма в USD
   * @param {string} walletAddress - Адрес кошелька пользователя
   * @param {string} chain - Название блокчейн сети
   * @param {string} token - Символ токена
   * @returns {Promise<object>} Результат платежа
   */
  async executePayment(amount, walletAddress, chain = X402_CONFIG.defaultChain, token = X402_CONFIG.defaultToken) {
    try {
      // Шаг 1: Инициация платежа
      console.log('Шаг 1: Инициация платежа...');
      const paymentDetails = await this.initiatePayment(amount, chain, token);

      // Шаг 2: Подписание через кошелек пользователя
      console.log('Шаг 2: Подписание платежа через кошелек...');
      const signedPayload = await this.signPayment(paymentDetails, walletAddress);

      // Шаг 3: Верификация через facilitator
      console.log('Шаг 3: Верификация платежа...');
      const verificationResult = await this.verifyPayment(signedPayload);

      if (!verificationResult.valid) {
        throw new Error(`Платеж не прошел верификацию: ${verificationResult.reason}`);
      }

      // Шаг 4: Проведение транзакции
      console.log('Шаг 4: Проведение транзакции в блокчейне...');
      const settlementResult = await this.settlePayment(signedPayload);

      return {
        success: true,
        txHash: settlementResult.txHash,
        status: settlementResult.status,
        blockNumber: settlementResult.blockNumber,
        explorerUrl: this.getExplorerUrl(settlementResult.txHash, chain),
        amount: amount,
        chain: chain,
        token: token
      };
    } catch (error) {
      console.error('Ошибка при выполнении платежа:', error);
      throw error;
    }
  }

  /**
   * Упрощенный метод платежа с автоматическим fallback
   * Пытается использовать x402, при неудаче использует прямую отправку токенов
   * @param {number} amount - Сумма в USD
   * @param {string} walletAddress - Адрес кошелька пользователя
   * @param {string} chain - Название блокчейн сети
   * @param {string} token - Символ токена
   * @returns {Promise<object>} Результат платежа
   */
  async executePaymentWithFallback(amount, walletAddress, chain = X402_CONFIG.defaultChain, token = X402_CONFIG.defaultToken) {
    try {
      // Сначала проверяем доступность facilitator
      const isFacilitatorAvailable = await this.checkHealth();

      if (isFacilitatorAvailable) {
        // Используем x402 протокол
        console.log('Используем x402 протокол для платежа');
        return await this.executePayment(amount, walletAddress, chain, token);
      } else {
        // Fallback: прямая отправка токенов
        console.log('Facilitator недоступен, используем прямую отправку токенов');
        const result = await this.sendTokenDirect(token, this.recipientAddress, amount, chain);
        
        return {
          success: result.success,
          txHash: result.txHash,
          status: result.status,
          blockNumber: result.blockNumber,
          explorerUrl: result.explorerUrl,
          amount: amount,
          chain: chain,
          token: token,
          method: 'direct' // Указываем что использовали прямой метод
        };
      }
    } catch (error) {
      console.error('Ошибка при выполнении платежа (с fallback):', error);
      throw error;
    }
  }
}

/**
 * Создание экземпляра клиента с настройками по умолчанию
 * @returns {X402Client}
 */
export function createX402Client() {
  return new X402Client();
}

/**
 * Форматирование суммы для отображения
 * @param {number} amount - Сумма
 * @param {string} currency - Валюта
 * @returns {string} Отформатированная строка
 */
export function formatAmount(amount, currency = 'USD') {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency === 'USD' ? 'USD' : 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Валидация адреса кошелька Ethereum
 * @param {string} address - Адрес кошелька
 * @returns {boolean}
 */
export function isValidEthereumAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export default X402Client;
