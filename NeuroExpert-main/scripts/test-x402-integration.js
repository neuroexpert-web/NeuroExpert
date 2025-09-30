#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки интеграции x402
 * Запуск: node scripts/test-x402-integration.js
 */

import { X402Client } from '../utils/x402Client.js';

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function warn(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// ============================================
// Тест 1: Проверка конфигурации
// ============================================
async function testConfiguration() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('Тест 1: Проверка конфигурации', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  try {
    // Проверяем переменные окружения
    const facilitatorUrl = process.env.NEXT_PUBLIC_X402_FACILITATOR_URL;
    const recipientAddress = process.env.NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS;
    const defaultChain = process.env.NEXT_PUBLIC_DEFAULT_CHAIN || 'base';
    const defaultToken = process.env.NEXT_PUBLIC_DEFAULT_TOKEN || 'usdc';

    info('Проверка переменных окружения...');

    if (!facilitatorUrl) {
      warn('NEXT_PUBLIC_X402_FACILITATOR_URL не установлен');
    } else {
      success(`Facilitator URL: ${facilitatorUrl}`);
    }

    if (!recipientAddress || recipientAddress === '0x0000000000000000000000000000000000000000') {
      warn('NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS не установлен или использует placeholder');
    } else {
      success(`Recipient Address: ${recipientAddress}`);
    }

    success(`Default Chain: ${defaultChain}`);
    success(`Default Token: ${defaultToken}`);

    return true;
  } catch (err) {
    error(`Ошибка проверки конфигурации: ${err.message}`);
    return false;
  }
}

// ============================================
// Тест 2: Проверка доступности facilitator
// ============================================
async function testFacilitatorHealth() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('Тест 2: Проверка facilitator', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  try {
    info('Подключение к facilitator...');
    const client = new X402Client();
    const isHealthy = await client.checkHealth();

    if (isHealthy) {
      success('Facilitator доступен и работает');
      return true;
    } else {
      warn('Facilitator недоступен (это нормально для локальной разработки)');
      info('Будет использован fallback метод прямой отправки токенов');
      return false;
    }
  } catch (err) {
    warn(`Не удалось подключиться к facilitator: ${err.message}`);
    info('Это нормально если вы еще не настроили Coinbase CDP');
    info('Платформа будет работать с прямой отправкой токенов');
    return false;
  }
}

// ============================================
// Тест 3: Инициация платежа
// ============================================
async function testPaymentInitiation() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('Тест 3: Инициация платежа', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  try {
    info('Создание тестового платежа на $10...');
    const client = new X402Client();
    
    const paymentDetails = await client.initiatePayment(
      10,                    // $10
      'base_sepolia',       // Testnet
      'usdc'                // USDC
    );

    success('Платеж инициирован успешно');
    info(`Сумма: $${10}`);
    info(`Сеть: base_sepolia`);
    info(`Токен: USDC`);
    info(`Адрес получателя: ${paymentDetails.to}`);
    info(`Сумма в токенах: ${paymentDetails.amount}`);
    info(`Deadline: ${new Date(paymentDetails.deadline * 1000).toLocaleString()}`);

    return true;
  } catch (err) {
    error(`Ошибка инициации платежа: ${err.message}`);
    return false;
  }
}

// ============================================
// Тест 4: Валидация сумм
// ============================================
async function testAmountValidation() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('Тест 4: Валидация сумм', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  const client = new X402Client();

  // Тест минимальной суммы
  try {
    info('Тест минимальной суммы ($0.50 - должно упасть)...');
    await client.initiatePayment(0.5, 'base', 'usdc');
    error('Валидация минимальной суммы НЕ работает!');
    return false;
  } catch (err) {
    success('Валидация минимальной суммы работает');
  }

  // Тест максимальной суммы
  try {
    info('Тест максимальной суммы ($15000 - должно упасть)...');
    await client.initiatePayment(15000, 'base', 'usdc');
    error('Валидация максимальной суммы НЕ работает!');
    return false;
  } catch (err) {
    success('Валидация максимальной суммы работает');
  }

  // Тест нормальной суммы
  try {
    info('Тест нормальной суммы ($100)...');
    await client.initiatePayment(100, 'base', 'usdc');
    success('Валидация нормальной суммы работает');
    return true;
  } catch (err) {
    error(`Ошибка валидации нормальной суммы: ${err.message}`);
    return false;
  }
}

// ============================================
// Тест 5: Конвертация единиц токенов
// ============================================
async function testTokenConversion() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('Тест 5: Конвертация единиц токенов', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  try {
    const client = new X402Client();
    
    // Тест конвертации для USDC (6 decimals)
    info('Тест конвертации $100 → USDC units...');
    const paymentDetails = await client.initiatePayment(100, 'base', 'usdc');
    
    // Для USDC: 100 USD = 100,000,000 units (6 decimals)
    const expected = '100000000';
    const actual = paymentDetails.amount;

    if (actual === expected) {
      success(`Конвертация корректна: $100 = ${actual} units`);
      return true;
    } else {
      error(`Конвертация некорректна: ожидалось ${expected}, получено ${actual}`);
      return false;
    }
  } catch (err) {
    error(`Ошибка конвертации: ${err.message}`);
    return false;
  }
}

// ============================================
// Тест 6: Генерация Explorer URLs
// ============================================
async function testExplorerUrls() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('Тест 6: Генерация Explorer URLs', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  try {
    const client = new X402Client();
    const testTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

    // Base mainnet
    const baseUrl = client.getExplorerUrl(testTxHash, 'base');
    info(`Base mainnet: ${baseUrl}`);
    if (baseUrl.includes('basescan.org')) {
      success('Base mainnet URL корректен');
    }

    // Base Sepolia testnet
    const sepoliaUrl = client.getExplorerUrl(testTxHash, 'base_sepolia');
    info(`Base Sepolia: ${sepoliaUrl}`);
    if (sepoliaUrl.includes('sepolia.basescan.org')) {
      success('Base Sepolia URL корректен');
    }

    return true;
  } catch (err) {
    error(`Ошибка генерации URLs: ${err.message}`);
    return false;
  }
}

// ============================================
// Основная функция
// ============================================
async function runTests() {
  log('\n╔═══════════════════════════════════════════════════╗', 'cyan');
  log('║   Тестирование интеграции x402 для NeuroExpert   ║', 'cyan');
  log('╚═══════════════════════════════════════════════════╝\n', 'cyan');

  const results = {
    configuration: false,
    facilitator: false,
    initiation: false,
    validation: false,
    conversion: false,
    explorerUrls: false
  };

  // Запускаем тесты последовательно
  results.configuration = await testConfiguration();
  results.facilitator = await testFacilitatorHealth();
  results.initiation = await testPaymentInitiation();
  results.validation = await testAmountValidation();
  results.conversion = await testTokenConversion();
  results.explorerUrls = await testExplorerUrls();

  // Итоги
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('Итоги тестирования', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  let passedCount = 0;
  let totalCount = 0;

  for (const [test, passed] of Object.entries(results)) {
    totalCount++;
    if (passed) {
      passedCount++;
      success(`${test}: PASSED`);
    } else {
      error(`${test}: FAILED`);
    }
  }

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  const percentage = Math.round((passedCount / totalCount) * 100);
  
  if (percentage === 100) {
    log(`\n🎉 Все тесты пройдены! (${passedCount}/${totalCount})`, 'green');
  } else if (percentage >= 80) {
    log(`\n✅ Большинство тестов пройдено: ${passedCount}/${totalCount} (${percentage}%)`, 'yellow');
  } else if (percentage >= 50) {
    log(`\n⚠️  Пройдена половина тестов: ${passedCount}/${totalCount} (${percentage}%)`, 'yellow');
  } else {
    log(`\n❌ Большинство тестов провалено: ${passedCount}/${totalCount} (${percentage}%)`, 'red');
  }

  // Рекомендации
  if (!results.facilitator) {
    log('\n💡 Рекомендация:', 'yellow');
    log('   Facilitator недоступен. Для полной функциональности:', 'yellow');
    log('   1. Зарегистрируйтесь на https://cdp.coinbase.com/', 'yellow');
    log('   2. Получите API ключи', 'yellow');
    log('   3. Добавьте их в .env.local', 'yellow');
    log('   4. См. COINBASE_CDP_SETUP_GUIDE.md для деталей', 'yellow');
  }

  if (!results.configuration) {
    log('\n💡 Рекомендация:', 'yellow');
    log('   Настройте переменные окружения:', 'yellow');
    log('   1. Скопируйте .env.local.example в .env.local', 'yellow');
    log('   2. Укажите адрес получателя платежей', 'yellow');
    log('   3. Настройте facilitator URL', 'yellow');
  }

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  process.exit(percentage === 100 ? 0 : 1);
}

// Запуск
runTests().catch(err => {
  error(`Критическая ошибка: ${err.message}`);
  console.error(err);
  process.exit(1);
});
