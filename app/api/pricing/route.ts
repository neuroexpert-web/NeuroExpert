import { NextResponse } from 'next/server';
import { analytics } from '../../utils/analytics';

// Базовые ставки по ролям (руб/час) на 2025 год
const BASE_RATES = {
  junior_developer: 1500,
  middle_developer: 3000,
  senior_developer: 5000,
  ai_specialist: 6000,
  project_manager: 4000,
  business_analyst: 3500,
  designer: 3000,
  devops: 4500,
  qa_engineer: 2500,
  data_scientist: 5500
};

// Множители по регионам
const REGION_MULTIPLIERS: { [key: string]: number } = {
  moscow: 1.2,
  spb: 1.1,
  regions: 0.9,
  remote: 1.0
};

// Множители по отраслям
const INDUSTRY_MULTIPLIERS: { [key: string]: number } = {
  finance: 1.3,
  retail: 1.0,
  manufacturing: 1.1,
  tech: 1.2,
  healthcare: 1.15,
  education: 0.9
};

// Множители по размеру компании
const COMPANY_SIZE_MULTIPLIERS: { [key: string]: number } = {
  small: 0.9,    // < 50 сотрудников
  medium: 1.0,   // 50-250 сотрудников
  large: 1.1,    // 250-1000 сотрудников
  enterprise: 1.2 // > 1000 сотрудников
};

// Типы услуг и их состав
const SERVICE_PACKAGES = {
  ai_director_basic: {
    name: 'AI Директор - Базовый',
    duration_months: 3,
    team: {
      ai_specialist: 0.5,
      middle_developer: 1,
      project_manager: 0.25
    },
    fixed_costs: 150000 // Лицензии, инфраструктура
  },
  ai_director_pro: {
    name: 'AI Директор - Профессиональный',
    duration_months: 6,
    team: {
      ai_specialist: 1,
      senior_developer: 1,
      middle_developer: 2,
      project_manager: 0.5,
      business_analyst: 0.5
    },
    fixed_costs: 350000
  },
  ai_director_enterprise: {
    name: 'AI Директор - Корпоративный',
    duration_months: 12,
    team: {
      ai_specialist: 2,
      senior_developer: 2,
      middle_developer: 3,
      project_manager: 1,
      business_analyst: 1,
      devops: 0.5,
      qa_engineer: 1
    },
    fixed_costs: 800000
  },
  automation_basic: {
    name: 'Автоматизация процессов - Старт',
    duration_months: 2,
    team: {
      middle_developer: 1,
      business_analyst: 0.5,
      project_manager: 0.25
    },
    fixed_costs: 80000
  },
  automation_advanced: {
    name: 'Автоматизация процессов - Продвинутая',
    duration_months: 4,
    team: {
      senior_developer: 1,
      middle_developer: 1,
      business_analyst: 1,
      project_manager: 0.5,
      qa_engineer: 0.5
    },
    fixed_costs: 200000
  },
  data_analytics: {
    name: 'Аналитика данных и BI',
    duration_months: 3,
    team: {
      data_scientist: 1,
      middle_developer: 1,
      business_analyst: 0.5,
      project_manager: 0.25
    },
    fixed_costs: 250000
  },
  custom_ai_solution: {
    name: 'Индивидуальное AI решение',
    duration_months: 6,
    team: {
      ai_specialist: 1.5,
      data_scientist: 1,
      senior_developer: 2,
      middle_developer: 2,
      designer: 0.5,
      project_manager: 1,
      devops: 0.5
    },
    fixed_costs: 500000
  }
};

// Инфляционный коэффициент (годовой)
const ANNUAL_INFLATION_RATE = 0.08; // 8%

// Расчет инфляции с базового года (2025)
function getInflationMultiplier(): number {
  const baseYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearsDiff = currentYear - baseYear;
  return Math.pow(1 + ANNUAL_INFLATION_RATE, yearsDiff);
}

// Получение актуальных ставок с учетом рынка
async function getMarketRates(): Promise<typeof BASE_RATES> {
  // В реальном приложении здесь был бы запрос к API HH.ru
  // Сейчас используем базовые ставки с инфляцией
  const inflationMultiplier = getInflationMultiplier();
  
  const marketRates: any = {};
  for (const [role, rate] of Object.entries(BASE_RATES)) {
    marketRates[role] = Math.round(rate * inflationMultiplier);
  }
  
  return marketRates;
}

// Расчет стоимости услуги
async function calculateServicePrice(
  serviceType: string,
  region: string,
  industry: string,
  companySize: string,
  urgency: 'normal' | 'urgent' | 'asap' = 'normal'
): Promise<{
  basePrice: number;
  finalPrice: number;
  discount: number;
  breakdown: any;
  savings: number;
}> {
  const service = SERVICE_PACKAGES[serviceType as keyof typeof SERVICE_PACKAGES];
  if (!service) {
    throw new Error('Unknown service type');
  }

  const marketRates = await getMarketRates();
  
  // Расчет стоимости команды
  let teamCost = 0;
  const teamBreakdown: any = {};
  
  for (const [role, fte] of Object.entries(service.team)) {
    const rate = marketRates[role as keyof typeof BASE_RATES] || 3000;
    const monthlyHours = 168; // Среднее количество рабочих часов в месяц
    const monthlyCost = rate * monthlyHours * fte;
    teamCost += monthlyCost * service.duration_months;
    
    teamBreakdown[role] = {
      fte,
      hourlyRate: rate,
      monthlyCost: Math.round(monthlyCost),
      totalCost: Math.round(monthlyCost * service.duration_months)
    };
  }
  
  // Применение множителей
  const regionMultiplier = REGION_MULTIPLIERS[region] || 1;
  const industryMultiplier = INDUSTRY_MULTIPLIERS[industry] || 1;
  const sizeMultiplier = COMPANY_SIZE_MULTIPLIERS[companySize] || 1;
  
  // Множитель срочности
  const urgencyMultiplier = urgency === 'asap' ? 1.5 : urgency === 'urgent' ? 1.25 : 1;
  
  // Базовая цена
  const basePrice = teamCost + service.fixed_costs;
  
  // Итоговая цена с множителями
  let finalPrice = basePrice * regionMultiplier * industryMultiplier * sizeMultiplier * urgencyMultiplier;
  
  // Скидки
  let discount = 0;
  if (service.duration_months >= 6) {
    discount = 0.1; // 10% скидка для долгосрочных проектов
  } else if (service.duration_months >= 12) {
    discount = 0.15; // 15% скидка для годовых проектов
  }
  
  finalPrice = finalPrice * (1 - discount);
  
  // Расчет экономии по сравнению с наймом штата
  const inHouseCost = calculateInHouseCost(service.team, marketRates, service.duration_months);
  const savings = inHouseCost - finalPrice;
  
  return {
    basePrice: Math.round(basePrice),
    finalPrice: Math.round(finalPrice),
    discount: discount * 100,
    breakdown: {
      team: teamBreakdown,
      fixedCosts: service.fixed_costs,
      duration: service.duration_months,
      multipliers: {
        region: regionMultiplier,
        industry: industryMultiplier,
        companySize: sizeMultiplier,
        urgency: urgencyMultiplier
      }
    },
    savings: Math.round(savings)
  };
}

// Расчет стоимости найма собственной команды
function calculateInHouseCost(
  team: any,
  rates: any,
  months: number
): number {
  let totalCost = 0;
  
  for (const [role, fte] of Object.entries(team)) {
    const rate = rates[role as keyof typeof BASE_RATES] || 3000;
    const monthlyHours = 168;
    const monthlySalary = rate * monthlyHours * 1.5; // +50% на налоги и накладные расходы
    const hiringCost = monthlySalary * 2; // Стоимость найма = 2 месячных оклада
    
    totalCost += (monthlySalary * months + hiringCost) * (fte as number);
  }
  
  // Дополнительные расходы на инфраструктуру
  totalCost += months * 50000; // 50к/месяц на инфраструктуру
  
  return totalCost;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceType,
      region = 'moscow',
      industry = 'retail',
      companySize = 'medium',
      urgency = 'normal',
      customRequirements = []
    } = body;

    if (!serviceType) {
      return NextResponse.json(
        { error: 'Service type is required' },
        { status: 400 }
      );
    }

    // Основной расчет
    const pricing = await calculateServicePrice(
      serviceType,
      region,
      industry,
      companySize,
      urgency
    );
    
    // Кастомизация под требования
    let customPrice = pricing.finalPrice;
    const customizations: any[] = [];
    
    for (const req of customRequirements) {
      switch (req) {
        case 'extra_support':
          customPrice += pricing.finalPrice * 0.2;
          customizations.push({
            name: 'Расширенная поддержка 24/7',
            price: Math.round(pricing.finalPrice * 0.2)
          });
          break;
        case 'faster_delivery':
          customPrice += pricing.finalPrice * 0.15;
          customizations.push({
            name: 'Ускоренная поставка',
            price: Math.round(pricing.finalPrice * 0.15)
          });
          break;
        case 'additional_integrations':
          customPrice += 300000;
          customizations.push({
            name: 'Дополнительные интеграции',
            price: 300000
          });
          break;
      }
    }
    
    // Рекомендуемые пакеты
    const recommendations = [];
    if (companySize === 'enterprise' && serviceType !== 'ai_director_enterprise') {
      recommendations.push({
        package: 'ai_director_enterprise',
        reason: 'Для крупных компаний рекомендуем корпоративное решение',
        additionalValue: 'Масштабируемость и полная поддержка'
      });
    }
    
    // Расчет ROI
    const estimatedROI = calculateEstimatedROI(serviceType, customPrice, companySize);
    
    // Трекинг аналитики
    analytics.trackEvent('pricing_calculated', {
      serviceType,
      region,
      industry,
      companySize,
      finalPrice: customPrice,
      savings: pricing.savings
    });
    
    // Подготовка ответа
    const response = {
      success: true,
      pricing: {
        ...pricing,
        customPrice: Math.round(customPrice),
        customizations
      },
      recommendations,
      estimatedROI,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
      currency: 'RUB',
      paymentTerms: {
        prepayment: 30,
        stages: serviceType.includes('enterprise') ? 4 : 2
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Pricing calculation error:', error);
    analytics.trackError(error as Error, 'pricing_calculation');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate pricing' 
      },
      { status: 500 }
    );
  }
}

// Расчет ожидаемого ROI
function calculateEstimatedROI(
  serviceType: string,
  investment: number,
  companySize: string
): any {
  // Базовые множители ROI по типам услуг
  const roiMultipliers: { [key: string]: number } = {
    ai_director_basic: 2.5,
    ai_director_pro: 3.5,
    ai_director_enterprise: 4.0,
    automation_basic: 2.0,
    automation_advanced: 3.0,
    data_analytics: 2.8,
    custom_ai_solution: 3.8
  };
  
  const baseMultiplier = roiMultipliers[serviceType] || 2.5;
  
  // Корректировка по размеру компании
  const sizeBonus = companySize === 'enterprise' ? 0.5 : 
                    companySize === 'large' ? 0.3 : 0;
  
  const totalMultiplier = baseMultiplier + sizeBonus;
  const estimatedReturn = investment * totalMultiplier;
  const netProfit = estimatedReturn - investment;
  const roiPercent = (netProfit / investment) * 100;
  
  return {
    investment: Math.round(investment),
    estimatedReturn: Math.round(estimatedReturn),
    netProfit: Math.round(netProfit),
    roiPercent: Math.round(roiPercent),
    paybackPeriod: Math.round(12 / totalMultiplier), // месяцев
    confidenceLevel: 85 // процент уверенности
  };
}

export async function GET() {
  // Возвращаем доступные услуги и базовую информацию
  const services = Object.entries(SERVICE_PACKAGES).map(([key, service]) => ({
    id: key,
    name: service.name,
    duration: service.duration_months,
    teamSize: Object.values(service.team).reduce((sum, fte) => sum + fte, 0)
  }));
  
  return NextResponse.json({
    services,
    regions: Object.keys(REGION_MULTIPLIERS),
    industries: Object.keys(INDUSTRY_MULTIPLIERS),
    companySizes: Object.keys(COMPANY_SIZE_MULTIPLIERS),
    currency: 'RUB',
    lastUpdated: new Date().toISOString()
  });
}