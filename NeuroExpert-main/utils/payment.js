/**
 * Утилиты для работы с платежами через x402
 * @module payment
 */

import { ethers } from 'ethers';
import { getWeb3Provider } from './blockchain';
import { getTokenConfig } from '../lib/x402Config';

/**
 * Подписание платежной транзакции кошельком пользователя
 * @param {object} paymentDetails - Детали платежа из x402Client.initiatePayment()
 * @param {object} walletInfo - Информация о подключенном кошельке
 * @returns {Promise<string>} Base64 encoded подписанная транзакция
 */
export async function signPaymentWithWallet(paymentDetails, walletInfo) {
  try {
    const web3Provider = getWeb3Provider();
    
    if (!web3Provider) {
      throw new Error('Web3 provider не найден');
    }

    // Создаем провайдер ethers из Web3 provider
    const provider = new ethers.BrowserProvider(web3Provider);
    const signer = await provider.getSigner();

    // Получаем конфигурацию токена
    const tokenConfig = getTokenConfig(paymentDetails.token);

    // Формируем транзакцию для USDC transfer
    const transaction = {
      to: paymentDetails.to,
      value: 0, // Для ERC20 токенов value = 0
      data: encodeTransferData(paymentDetails.to, paymentDetails.amount),
      // gasLimit будет рассчитан автоматически
    };

    // Подписываем транзакцию
    const signedTx = await signer.signTransaction(transaction);
    
    // Кодируем в base64
    const base64Payload = Buffer.from(signedTx.substring(2), 'hex').toString('base64');
    
    return base64Payload;

  } catch (error) {
    console.error('Ошибка при подписании платежа:', error);
    throw new Error(`Не удалось подписать транзакцию: ${error.message}`);
  }
}

/**
 * Кодирование данных для ERC20 transfer
 * @private
 * @param {string} to - Адрес получателя
 * @param {string} amount - Сумма в минимальных единицах
 * @returns {string} Закодированные данные
 */
function encodeTransferData(to, amount) {
  // ERC20 transfer function signature: transfer(address,uint256)
  const iface = new ethers.Interface([
    'function transfer(address to, uint256 amount)'
  ]);
  
  return iface.encodeFunctionData('transfer', [to, amount]);
}

/**
 * Проверка баланса токенов пользователя
 * @param {string} userAddress - Адрес пользователя
 * @param {string} tokenAddress - Адрес контракта токена
 * @param {number} decimals - Количество decimals токена
 * @returns {Promise<number>} Баланс в USD
 */
export async function checkTokenBalance(userAddress, tokenAddress, decimals = 6) {
  try {
    const web3Provider = getWeb3Provider();
    
    if (!web3Provider) {
      throw new Error('Web3 provider не найден');
    }

    const provider = new ethers.BrowserProvider(web3Provider);

    // ERC20 ABI для функции balanceOf
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ['function balanceOf(address) view returns (uint256)'],
      provider
    );

    const balance = await tokenContract.balanceOf(userAddress);
    
    // Преобразуем из минимальных единиц в USD
    const balanceInUSD = Number(balance) / Math.pow(10, decimals);
    
    return balanceInUSD;

  } catch (error) {
    console.error('Ошибка при проверке баланса токенов:', error);
    return 0;
  }
}

/**
 * Оценка gas для транзакции
 * @param {object} transaction - Объект транзакции
 * @returns {Promise<object>} Оценка gas и стоимости
 */
export async function estimateGas(transaction) {
  try {
    const web3Provider = getWeb3Provider();
    
    if (!web3Provider) {
      throw new Error('Web3 provider не найден');
    }

    const provider = new ethers.BrowserProvider(web3Provider);

    // Оценка gas limit
    const gasLimit = await provider.estimateGas(transaction);
    
    // Получение текущей цены gas
    const feeData = await provider.getFeeData();
    
    // Расчет стоимости в ETH
    const gasCostWei = gasLimit * (feeData.gasPrice || feeData.maxFeePerGas);
    const gasCostEth = ethers.formatEther(gasCostWei);

    return {
      gasLimit: gasLimit.toString(),
      gasPrice: ethers.formatUnits(feeData.gasPrice || feeData.maxFeePerGas, 'gwei'),
      estimatedCost: gasCostEth,
      estimatedCostUSD: 0 // Требуется дополнительный API для конвертации ETH->USD
    };

  } catch (error) {
    console.error('Ошибка при оценке gas:', error);
    return {
      gasLimit: '100000',
      gasPrice: '0',
      estimatedCost: '0',
      estimatedCostUSD: 0
    };
  }
}

/**
 * Форматирование суммы для отображения
 * @param {number|string} amount - Сумма
 * @param {string} currency - Валюта (USD, ETH, etc.)
 * @param {number} decimals - Количество десятичных знаков
 * @returns {string}
 */
export function formatPaymentAmount(amount, currency = 'USD', decimals = 2) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '0.00';
  
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  }
  
  return `${num.toFixed(decimals)} ${currency}`;
}

/**
 * Валидация адреса Ethereum
 * @param {string} address - Адрес для проверки
 * @returns {boolean}
 */
export function validateEthereumAddress(address) {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Сокращение хэша транзакции для отображения
 * @param {string} txHash - Полный хэш транзакции
 * @param {number} startChars - Количество символов в начале
 * @param {number} endChars - Количество символов в конце
 * @returns {string}
 */
export function shortenTxHash(txHash, startChars = 6, endChars = 4) {
  if (!txHash || txHash.length < startChars + endChars) return txHash;
  return `${txHash.substring(0, startChars)}...${txHash.substring(txHash.length - endChars)}`;
}

/**
 * Получение времени до истечения deadline
 * @param {number} deadline - Unix timestamp в секундах
 * @returns {object} Оставшееся время
 */
export function getTimeUntilDeadline(deadline) {
  const now = Math.floor(Date.now() / 1000);
  const remaining = deadline - now;
  
  if (remaining <= 0) {
    return {
      expired: true,
      minutes: 0,
      seconds: 0,
      formatted: 'Истекло'
    };
  }
  
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  
  return {
    expired: false,
    minutes,
    seconds,
    formatted: `${minutes}м ${seconds}с`
  };
}

/**
 * Проверка статуса транзакции по таймауту
 * @param {Function} checkStatusFn - Функция проверки статуса
 * @param {number} timeout - Таймаут в миллисекундах
 * @param {number} interval - Интервал проверки в миллисекундах
 * @returns {Promise<object>} Статус транзакции
 */
export async function waitForTransactionStatus(
  checkStatusFn,
  timeout = 60000,
  interval = 2000
) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const status = await checkStatusFn();
      
      if (status.status === 'confirmed' || status.status === 'failed') {
        return status;
      }
      
      // Ждем перед следующей проверкой
      await new Promise(resolve => setTimeout(resolve, interval));
      
    } catch (error) {
      console.error('Ошибка при проверке статуса:', error);
    }
  }
  
  throw new Error('Таймаут ожидания подтверждения транзакции');
}

/**
 * Расчет комиссии платформы
 * @param {number} amount - Сумма платежа
 * @param {number} feePercent - Процент комиссии
 * @returns {object} Детали комиссии
 */
export function calculatePlatformFee(amount, feePercent = 0) {
  const fee = amount * (feePercent / 100);
  const total = amount + fee;
  
  return {
    amount,
    fee,
    feePercent,
    total
  };
}

/**
 * Создание сообщения для подписи (для верификации владения кошельком)
 * @param {string} address - Адрес кошелька
 * @param {number} nonce - Уникальный nonce
 * @returns {string}
 */
export function createSignatureMessage(address, nonce) {
  return `NeuroExpert Platform Authentication\n\nAddress: ${address}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;
}

/**
 * Обработка ошибок платежа
 * @param {Error} error - Объект ошибки
 * @returns {string} Понятное сообщение об ошибке
 */
export function parsePaymentError(error) {
  const message = error.message || error.toString();
  
  // Обработка типичных ошибок
  if (message.includes('user rejected')) {
    return 'Транзакция отклонена пользователем';
  }
  
  if (message.includes('insufficient funds')) {
    return 'Недостаточно средств для выполнения транзакции';
  }
  
  if (message.includes('gas')) {
    return 'Ошибка при расчете комиссии сети';
  }
  
  if (message.includes('nonce')) {
    return 'Ошибка nonce. Попробуйте снова';
  }
  
  if (message.includes('network')) {
    return 'Ошибка подключения к сети. Проверьте соединение';
  }
  
  // Возвращаем оригинальное сообщение если не нашли совпадений
  return message.length > 100 ? message.substring(0, 100) + '...' : message;
}

export default {
  signPaymentWithWallet,
  checkTokenBalance,
  estimateGas,
  formatPaymentAmount,
  validateEthereumAddress,
  shortenTxHash,
  getTimeUntilDeadline,
  waitForTransactionStatus,
  calculatePlatformFee,
  createSignatureMessage,
  parsePaymentError
};
