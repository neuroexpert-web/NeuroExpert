/**
 * Клиент для работы с протоколом x402
 * @module x402Client
 */

import { X402_CONFIG, getChainConfig, getTokenConfig, getTokenAddress } from '../lib/x402Config';

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
