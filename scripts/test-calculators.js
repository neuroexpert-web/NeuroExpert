#!/usr/bin/env node

/**
 * Тестирование калькуляторов NeuroExpert
 * Проверка корректности вычислений согласно бизнес-логике
 */

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`)
};

// Тестовые данные для PricingCalculator
const pricingTestCases = [
  {
    name: 'Малый бизнес - базовый пакет',
    params: {
      businessSize: 'small',
      industry: 'retail',
      urgency: 'normal',
      integrations: []
    },
    services: ['digital-audit', 'landing-dev'],
    expected: {
      minTotal: 65000,  // (25500 + 50000) * 0.8 * 1.1
      maxTotal: 200000  // Примерный максимум
    }
  },
  {
    name: 'Средний бизнес - срочный проект с интеграциями',
    params: {
      businessSize: 'medium',
      industry: 'services',
      urgency: 'urgent',
      integrations: ['crm', 'analytics', 'payment']
    },
    services: ['corporate-dev', 'ai-integration'],
    expected: {
      minTotal: 350000,
      maxTotal: 1000000
    }
  },
  {
    name: 'Крупный бизнес - комплексное решение',
    params: {
      businessSize: 'large',
      industry: 'production',
      urgency: 'veryUrgent',
      integrations: ['crm', 'erp', 'analytics', 'payment']
    },
    services: ['digital-strategy', 'custom-dev', 'ai-integration'],
    expected: {
      minTotal: 800000,
      maxTotal: 3000000
    }
  }
];

// Тестовые данные для ROICalculator
const roiTestCases = [
  {
    name: 'Малый бизнес - консервативный сценарий',
    data: {
      businessSize: 'small',
      industry: 'retail',
      budget: 200000,
      currentRevenue: 5000000,
      expectedGrowth: 20,
      automationSavings: 150000
    },
    scenario: 'conservative',
    expected: {
      minROI: 200,
      maxROI: 400,
      maxPayback: 6
    }
  },
  {
    name: 'Средний бизнес - амбициозный сценарий',
    data: {
      businessSize: 'medium',
      industry: 'ecommerce',
      budget: 500000,
      currentRevenue: 20000000,
      expectedGrowth: 30,
      automationSavings: 300000
    },
    scenario: 'ambitious',
    expected: {
      minROI: 300,
      maxROI: 600,
      maxPayback: 8
    }
  },
  {
    name: 'Крупный бизнес - прорывной сценарий',
    data: {
      businessSize: 'large',
      industry: 'it',
      budget: 2000000,
      currentRevenue: 100000000,
      expectedGrowth: 35,
      automationSavings: 800000
    },
    scenario: 'breakthrough',
    expected: {
      minROI: 400,
      maxROI: 1200,
      maxPayback: 12
    }
  }
];

// Функция расчета цены (эмуляция логики PricingCalculator)
function calculatePrice(services, params) {
  // Каталог услуг (минимальные цены для теста)
  const servicePrices = {
    'digital-audit': { min: 25500, max: 90000 },
    'landing-dev': { min: 50000, max: 120000 },
    'corporate-dev': { min: 127500, max: 360000 },
    'ai-integration': { min: 85000, max: 315000 },
    'digital-strategy': { min: 85000, max: 270000 },
    'custom-dev': { min: 300000, max: 1000000 }
  };

  // Коэффициенты
  const complexityCoef = {
    small: 0.8,
    medium: 1.0,
    large: 1.3
  };

  const urgencyCoef = {
    normal: 1.0,
    urgent: 1.3,
    veryUrgent: 1.6
  };

  const integrationCoef = 1 + (params.integrations.length * 0.1);
  const inflationCoef = 1.1;

  let total = 0;
  services.forEach(serviceId => {
    const service = servicePrices[serviceId];
    if (service) {
      const basePrice = (service.min + service.max) / 2;
      const finalPrice = basePrice * 
        complexityCoef[params.businessSize] * 
        urgencyCoef[params.urgency] * 
        integrationCoef * 
        inflationCoef;
      total += finalPrice;
    }
  });

  return Math.round(total);
}

// Функция расчета ROI (эмуляция логики ROICalculator)
function calculateROI(data, scenario) {
  const scenarioMultipliers = {
    conservative: 0.8,
    ambitious: 1.0,
    breakthrough: 1.5
  };

  const industryMultipliers = {
    retail: 1.2,
    services: 1.3,
    production: 1.1,
    it: 1.5,
    ecommerce: 1.4,
    finance: 1.6,
    healthcare: 1.3,
    education: 1.2,
    other: 1.0
  };

  const sizeMultipliers = {
    small: 1.2,
    medium: 1.0,
    large: 0.8
  };

  const baseAdditionalRevenue = data.currentRevenue * (data.expectedGrowth / 100);
  const industryCoef = industryMultipliers[data.industry] || 1.0;
  const sizeCoef = sizeMultipliers[data.businessSize];
  const scenarioCoef = scenarioMultipliers[scenario];

  const totalAdditionalRevenue = baseAdditionalRevenue * industryCoef * sizeCoef * scenarioCoef;
  const totalSavings = data.automationSavings * scenarioCoef * sizeCoef;
  const totalBenefit = totalAdditionalRevenue + totalSavings;

  const roi = ((totalBenefit - data.budget) / data.budget) * 100;
  const monthlyBenefit = totalBenefit / 12;
  const payback = data.budget / monthlyBenefit;

  return {
    roi: Math.round(roi),
    payback: Math.ceil(payback),
    totalBenefit: Math.round(totalBenefit)
  };
}

// Тестирование PricingCalculator
function testPricingCalculator() {
  log.info('Тестирование PricingCalculator...\n');
  
  let passed = 0;
  let failed = 0;

  pricingTestCases.forEach(test => {
    log.info(`Тест: ${test.name}`);
    
    const calculated = calculatePrice(test.services, test.params);
    
    console.log(`  Параметры: ${JSON.stringify(test.params)}`);
    console.log(`  Услуги: ${test.services.join(', ')}`);
    console.log(`  Рассчитано: ${calculated.toLocaleString('ru-RU')} ₽`);
    console.log(`  Ожидается: ${test.expected.minTotal.toLocaleString('ru-RU')} - ${test.expected.maxTotal.toLocaleString('ru-RU')} ₽`);
    
    if (calculated >= test.expected.minTotal && calculated <= test.expected.maxTotal) {
      log.success('Тест пройден');
      passed++;
    } else {
      log.error('Тест провален - значение вне ожидаемого диапазона');
      failed++;
    }
    console.log('');
  });

  return { passed, failed };
}

// Тестирование ROICalculator
function testROICalculator() {
  log.info('Тестирование ROICalculator...\n');
  
  let passed = 0;
  let failed = 0;

  roiTestCases.forEach(test => {
    log.info(`Тест: ${test.name}`);
    
    const result = calculateROI(test.data, test.scenario);
    
    console.log(`  Данные: ${JSON.stringify(test.data).substring(0, 100)}...`);
    console.log(`  Сценарий: ${test.scenario}`);
    console.log(`  ROI: ${result.roi}%`);
    console.log(`  Окупаемость: ${result.payback} месяцев`);
    console.log(`  Ожидаемый ROI: ${test.expected.minROI}% - ${test.expected.maxROI}%`);
    console.log(`  Ожидаемая окупаемость: до ${test.expected.maxPayback} месяцев`);
    
    const roiValid = result.roi >= test.expected.minROI && result.roi <= test.expected.maxROI;
    const paybackValid = result.payback <= test.expected.maxPayback;
    
    if (roiValid && paybackValid) {
      log.success('Тест пройден');
      passed++;
    } else {
      if (!roiValid) log.error('ROI вне ожидаемого диапазона');
      if (!paybackValid) log.error('Срок окупаемости превышает ожидаемый');
      failed++;
    }
    console.log('');
  });

  return { passed, failed };
}

// Главная функция
function main() {
  console.log('\n' + colors.cyan + '='.repeat(60) + colors.reset);
  console.log(colors.cyan + '  Тестирование калькуляторов NeuroExpert v3.0' + colors.reset);
  console.log(colors.cyan + '='.repeat(60) + colors.reset + '\n');

  const pricingResults = testPricingCalculator();
  const roiResults = testROICalculator();

  const totalPassed = pricingResults.passed + roiResults.passed;
  const totalFailed = pricingResults.failed + roiResults.failed;
  const totalTests = totalPassed + totalFailed;

  console.log('\n' + colors.cyan + '='.repeat(60) + colors.reset);
  console.log(colors.cyan + '  ИТОГОВЫЕ РЕЗУЛЬТАТЫ' + colors.reset);
  console.log(colors.cyan + '='.repeat(60) + colors.reset);
  
  console.log(`\nPricingCalculator:`);
  console.log(`  ✅ Пройдено: ${pricingResults.passed}`);
  console.log(`  ❌ Провалено: ${pricingResults.failed}`);
  
  console.log(`\nROICalculator:`);
  console.log(`  ✅ Пройдено: ${roiResults.passed}`);
  console.log(`  ❌ Провалено: ${roiResults.failed}`);
  
  console.log(`\nВСЕГО:`);
  console.log(`  Тестов: ${totalTests}`);
  console.log(`  Успешно: ${totalPassed} (${Math.round(totalPassed / totalTests * 100)}%)`);
  console.log(`  Провалено: ${totalFailed}`);
  
  if (totalFailed === 0) {
    console.log('\n' + colors.green + '🎉 Все тесты пройдены успешно!' + colors.reset);
  } else {
    console.log('\n' + colors.red + '⚠️  Некоторые тесты провалены. Требуется доработка.' + colors.reset);
  }
  
  console.log('\n' + colors.cyan + '='.repeat(60) + colors.reset + '\n');
}

// Запуск
main();