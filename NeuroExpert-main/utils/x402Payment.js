/**
 * Утилиты для работы с платежами через протокол x402
 * Использует ethers.js v6 для подписания транзакций
 * @module x402Payment
 */

import { ethers } from 'ethers';
import { X402_CONFIG, getChainConfig, getTokenConfig } from '../lib/x402Config';
import { getWeb3Provider } from './blockchain';

/**
 * Создание провайдера ethers из Web3 провайдера
 * @param {object} web3Provider - Web3 провайдер (MetaMask, Coinbase Wallet)
 * @returns {ethers.BrowserProvider}
 */
export function createEthersProvider(web3Provider) {
  if (!web3Provider) {
    throw new Error('Web3 провайдер не найден');
  }
  return new ethers.BrowserProvider(web3Provider);
}

/**
 * Получение signer для подписания транзакций
 * @returns {Promise<ethers.Signer>}
 */
export async function getSigner() {
  const web3Provider = getWeb3Provider();
  if (!web3Provider) {
    throw new Error('Web3 кошелек не обнаружен. Установите MetaMask или Coinbase Wallet.');
  }

  const provider = createEthersProvider(web3Provider);
  const signer = await provider.getSigner();
  return signer;
}

/**
 * Создание EIP-712 типизированных данных для x402 платежа
 * @param {object} paymentDetails - Детали платежа
 * @param {string} paymentDetails.chain - Название блокчейн сети
 * @param {string} paymentDetails.token - Символ токена
 * @param {string} paymentDetails.to - Адрес получателя
 * @param {string} paymentDetails.amount - Сумма в минимальных единицах токена
 * @param {number} paymentDetails.deadline - Unix timestamp крайнего срока
 * @param {string} chainId - ID сети
 * @param {string} verifyingContract - Адрес контракта верификации
 * @returns {object} EIP-712 типизированные данные
 */
export function createX402TypedData(paymentDetails, chainId, verifyingContract) {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' }
      ],
      Payment: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'token', type: 'address' },
        { name: 'deadline', type: 'uint256' },
        { name: 'nonce', type: 'uint256' }
      ]
    },
    domain: {
      name: 'x402 Payment Protocol',
      version: '1',
      chainId: chainId,
      verifyingContract: verifyingContract
    },
    primaryType: 'Payment',
    message: {
      to: paymentDetails.to,
      amount: paymentDetails.amount,
      token: paymentDetails.tokenAddress,
      deadline: paymentDetails.deadline,
      nonce: paymentDetails.nonce || Date.now()
    }
  };
}

/**
 * Подписание x402 платежа через EIP-712
 * @param {object} paymentDetails - Детали платежа из API
 * @param {string} walletAddress - Адрес кошелька пользователя
 * @returns {Promise<string>} Подписанная транзакция (base64)
 */
export async function signX402Payment(paymentDetails, walletAddress) {
  try {
    const signer = await getSigner();
    
    // Получаем конфигурацию сети
    const chainConfig = getChainConfig(paymentDetails.chain);
    const tokenConfig = getTokenConfig(paymentDetails.token);
    
    // Адрес контракта верификации (из facilitator config)
    const verifyingContract = X402_CONFIG.facilitator.contractAddress || 
                              '0x0000000000000000000000000000000000000000';
    
    // Создаем типизированные данные
    const typedData = createX402TypedData(
      {
        ...paymentDetails,
        tokenAddress: tokenConfig.address,
        nonce: Date.now()
      },
      chainConfig.chainId,
      verifyingContract
    );
    
    // Подписываем с помощью EIP-712
    const signature = await signer.signTypedData(
      typedData.domain,
      { Payment: typedData.types.Payment },
      typedData.message
    );
    
    // Создаем payload для отправки на facilitator
    const payload = {
      payment: typedData.message,
      signature: signature,
      chainId: chainConfig.chainId,
      timestamp: Date.now()
    };
    
    // Кодируем в base64
    const payloadString = JSON.stringify(payload);
    const payloadBase64 = Buffer.from(payloadString).toString('base64');
    
    return payloadBase64;
  } catch (error) {
    console.error('Ошибка при подписании x402 платежа:', error);
    throw new Error(`Не удалось подписать платеж: ${error.message}`);
  }
}

/**
 * Отправка токенов USDC/USDT через обычную транзакцию
 * Используется как fallback если x402 недоступен
 * @param {string} tokenSymbol - Символ токена (usdc, usdt)
 * @param {string} recipientAddress - Адрес получателя
 * @param {string} amount - Сумма в долларах (будет конвертирована)
 * @param {string} chain - Название сети
 * @returns {Promise<object>} Результат транзакции
 */
export async function sendTokenTransaction(tokenSymbol, recipientAddress, amount, chain) {
  try {
    const signer = await getSigner();
    const tokenConfig = getTokenConfig(tokenSymbol.toLowerCase());
    const chainConfig = getChainConfig(chain);
    
    // Конвертируем сумму в минимальные единицы токена
    const amountInUnits = ethers.parseUnits(amount.toString(), tokenConfig.decimals);
    
    // ERC-20 ABI для transfer функции
    const erc20Abi = [
      'function transfer(address to, uint256 amount) returns (bool)',
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)'
    ];
    
    // Создаем контракт токена
    const tokenContract = new ethers.Contract(
      tokenConfig.address,
      erc20Abi,
      signer
    );
    
    // Проверяем баланс перед отправкой
    const signerAddress = await signer.getAddress();
    const balance = await tokenContract.balanceOf(signerAddress);
    
    if (balance < amountInUnits) {
      throw new Error(`Недостаточно ${tokenSymbol.toUpperCase()} токенов. Баланс: ${ethers.formatUnits(balance, tokenConfig.decimals)}`);
    }
    
    // Отправляем транзакцию
    const tx = await tokenContract.transfer(recipientAddress, amountInUnits);
    
    console.log('Транзакция отправлена:', tx.hash);
    
    // Ждем подтверждения
    const receipt = await tx.wait();
    
    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? 'confirmed' : 'failed',
      explorerUrl: `${chainConfig.explorerUrl}/tx/${receipt.hash}`
    };
  } catch (error) {
    console.error('Ошибка при отправке токенов:', error);
    throw new Error(`Не удалось отправить токены: ${error.message}`);
  }
}

/**
 * Проверка баланса токена
 * @param {string} tokenSymbol - Символ токена
 * @param {string} walletAddress - Адрес кошелька
 * @param {string} chain - Название сети
 * @returns {Promise<string>} Баланс в читаемом формате
 */
export async function getTokenBalance(tokenSymbol, walletAddress, chain) {
  try {
    const web3Provider = getWeb3Provider();
    const provider = createEthersProvider(web3Provider);
    const tokenConfig = getTokenConfig(tokenSymbol.toLowerCase());
    
    const erc20Abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)'
    ];
    
    const tokenContract = new ethers.Contract(
      tokenConfig.address,
      erc20Abi,
      provider
    );
    
    const balance = await tokenContract.balanceOf(walletAddress);
    const decimals = await tokenContract.decimals();
    
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error('Ошибка при получении баланса токена:', error);
    throw error;
  }
}

/**
 * Проверка allowance токена для facilitator
 * @param {string} tokenSymbol - Символ токена
 * @param {string} ownerAddress - Адрес владельца
 * @param {string} spenderAddress - Адрес кому разрешено тратить
 * @returns {Promise<string>} Разрешенная сумма
 */
export async function checkTokenAllowance(tokenSymbol, ownerAddress, spenderAddress) {
  try {
    const web3Provider = getWeb3Provider();
    const provider = createEthersProvider(web3Provider);
    const tokenConfig = getTokenConfig(tokenSymbol.toLowerCase());
    
    const erc20Abi = [
      'function allowance(address owner, address spender) view returns (uint256)',
      'function decimals() view returns (uint8)'
    ];
    
    const tokenContract = new ethers.Contract(
      tokenConfig.address,
      erc20Abi,
      provider
    );
    
    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
    const decimals = await tokenContract.decimals();
    
    return ethers.formatUnits(allowance, decimals);
  } catch (error) {
    console.error('Ошибка при проверке allowance:', error);
    throw error;
  }
}

/**
 * Установка allowance для facilitator
 * @param {string} tokenSymbol - Символ токена
 * @param {string} spenderAddress - Адрес facilitator
 * @param {string} amount - Сумма для разрешения
 * @returns {Promise<object>} Результат транзакции
 */
export async function approveToken(tokenSymbol, spenderAddress, amount) {
  try {
    const signer = await getSigner();
    const tokenConfig = getTokenConfig(tokenSymbol.toLowerCase());
    
    const erc20Abi = [
      'function approve(address spender, uint256 amount) returns (bool)',
      'function decimals() view returns (uint8)'
    ];
    
    const tokenContract = new ethers.Contract(
      tokenConfig.address,
      erc20Abi,
      signer
    );
    
    const amountInUnits = ethers.parseUnits(amount.toString(), tokenConfig.decimals);
    
    const tx = await tokenContract.approve(spenderAddress, amountInUnits);
    console.log('Транзакция approve отправлена:', tx.hash);
    
    const receipt = await tx.wait();
    
    return {
      success: receipt.status === 1,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Ошибка при approve токена:', error);
    throw error;
  }
}

/**
 * Получение статуса транзакции из блокчейна
 * @param {string} txHash - Хеш транзакции
 * @param {string} chain - Название сети
 * @returns {Promise<object>} Статус транзакции
 */
export async function getTransactionStatus(txHash, chain) {
  try {
    const web3Provider = getWeb3Provider();
    const provider = createEthersProvider(web3Provider);
    const chainConfig = getChainConfig(chain);
    
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      return {
        found: false,
        status: 'not_found'
      };
    }
    
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return {
        found: true,
        status: 'pending',
        txHash: txHash
      };
    }
    
    const currentBlock = await provider.getBlockNumber();
    const confirmations = currentBlock - receipt.blockNumber;
    
    return {
      found: true,
      status: receipt.status === 1 ? 'confirmed' : 'failed',
      txHash: txHash,
      blockNumber: receipt.blockNumber,
      confirmations: confirmations,
      explorerUrl: `${chainConfig.explorerUrl}/tx/${txHash}`
    };
  } catch (error) {
    console.error('Ошибка при получении статуса транзакции:', error);
    throw error;
  }
}

/**
 * Форматирование суммы токена для отображения
 * @param {string} amount - Сумма в минимальных единицах
 * @param {number} decimals - Количество десятичных знаков
 * @returns {string} Отформатированная сумма
 */
export function formatTokenAmount(amount, decimals) {
  try {
    return ethers.formatUnits(amount, decimals);
  } catch (error) {
    console.error('Ошибка при форматировании суммы:', error);
    return '0';
  }
}

/**
 * Парсинг суммы токена в минимальные единицы
 * @param {string} amount - Сумма в читаемом формате
 * @param {number} decimals - Количество десятичных знаков
 * @returns {bigint} Сумма в минимальных единицах
 */
export function parseTokenAmount(amount, decimals) {
  try {
    return ethers.parseUnits(amount.toString(), decimals);
  } catch (error) {
    console.error('Ошибка при парсинге суммы:', error);
    return 0n;
  }
}

export default {
  createEthersProvider,
  getSigner,
  createX402TypedData,
  signX402Payment,
  sendTokenTransaction,
  getTokenBalance,
  checkTokenAllowance,
  approveToken,
  getTransactionStatus,
  formatTokenAmount,
  parseTokenAmount
};
