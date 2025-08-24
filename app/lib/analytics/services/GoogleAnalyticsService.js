/**
 * Google Analytics 4 Service для NeuroExpert
 * Поддержка Enhanced E-commerce, Custom Events, User Properties
 */

export default class GoogleAnalyticsService {
  constructor(config = {}) {
    this.config = config;
    this.isInitialized = false;
    this.gaId = process.env.NEXT_PUBLIC_GA_ID;
    this.debugMode = config.debug || false;
  }

  /**
   * Инициализация Google Analytics 4
   */
  async init() {
    if (!this.gaId || this.isInitialized) return;

    try {
      // Динамическая загрузка gtag
      await this.loadGtagScript();
      
      // Конфигурация GA4
      window.gtag('config', this.gaId, {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          'custom_parameter_1': 'section_name',
          'custom_parameter_2': 'swipe_direction',
          'custom_parameter_3': 'user_type'
        },
        // Enhanced E-commerce настройки
        send_page_view: true,
        anonymize_ip: true,
        allow_google_signals: false, // GDPR compliance
        cookie_flags: 'SameSite=None;Secure',
        cookie_expires: 63072000 // 2 года
      });

      // Настройка пользовательских измерений
      this.setupCustomDimensions();
      
      this.isInitialized = true;
      
      if (this.debugMode) {
        console.log('✅ Google Analytics 4 initialized');
      }
      
    } catch (error) {
      console.error('❌ Google Analytics initialization failed:', error);
      throw error;
    }
  }

  /**
   * Загрузка gtag скрипта
   */
  async loadGtagScript() {
    return new Promise((resolve, reject) => {
      if (window.gtag) {
        resolve();
        return;
      }

      // Создание глобальной функции gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());

      // Загрузка скрипта
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
      script.onload = resolve;
      script.onerror = reject;
      
      document.head.appendChild(script);
    });
  }

  /**
   * Настройка пользовательских измерений
   */
  setupCustomDimensions() {
    // Настройка пользовательских параметров
    window.gtag('config', this.gaId, {
      custom_map: {
        'custom_parameter_1': 'section_name',
        'custom_parameter_2': 'swipe_direction', 
        'custom_parameter_3': 'navigation_method',
        'custom_parameter_4': 'device_type',
        'custom_parameter_5': 'session_depth'
      }
    });
  }

  /**
   * Отправка событий в Google Analytics
   */
  async sendEvents(events) {
    if (!this.isInitialized || !window.gtag) return;

    for (const event of events) {
      try {
        await this.sendSingleEvent(event);
      } catch (error) {
        console.error('Failed to send GA4 event:', error);
      }
    }
  }

  /**
   * Отправка одного события
   */
  async sendSingleEvent(event) {
    const { name, properties, options } = event;
    
    // Маппинг специальных событий NeuroExpert
    const mappedEvent = this.mapEventForGA4(name, properties);
    
    if (this.debugMode) {
      console.log('📊 GA4 Event:', mappedEvent.eventName, mappedEvent.parameters);
    }

    // Отправка события
    window.gtag('event', mappedEvent.eventName, mappedEvent.parameters);

    // Отправка дополнительных E-commerce событий если нужно
    if (mappedEvent.ecommerceData) {
      window.gtag('event', 'purchase', mappedEvent.ecommerceData);
    }
  }

  /**
   * Маппинг событий NeuroExpert в GA4 формат
   */
  mapEventForGA4(eventName, properties) {
    const baseParameters = {
      event_category: 'engagement',
      event_label: eventName,
      session_id: properties.sessionId,
      timestamp: properties.timestamp,
      custom_parameter_4: properties.deviceInfo?.isMobile ? 'mobile' : 
                           properties.deviceInfo?.isTablet ? 'tablet' : 'desktop'
    };

    switch (eventName) {
      case 'swipe_navigation':
        return {
          eventName: 'swipe_navigation',
          parameters: {
            ...baseParameters,
            event_category: 'navigation',
            swipe_direction: properties.direction,
            from_section: properties.fromSection,
            to_section: properties.toSection,
            navigation_method: properties.method,
            custom_parameter_1: properties.toSection,
            custom_parameter_2: properties.direction,
            custom_parameter_3: properties.method
          }
        };

      case 'section_view':
        return {
          eventName: 'page_view',
          parameters: {
            ...baseParameters,
            event_category: 'page_view',
            page_title: properties.sectionName,
            page_location: `${window.location.origin}/section/${properties.sectionIndex}`,
            section_name: properties.sectionName,
            section_index: properties.sectionIndex,
            view_duration: properties.duration,
            custom_parameter_1: properties.sectionName,
            custom_parameter_5: properties.sectionIndex
          }
        };

      case 'performance_metric':
        return {
          eventName: 'timing_complete',
          parameters: {
            ...baseParameters,
            event_category: 'performance',
            name: properties.metric,
            value: Math.round(properties.duration || 0),
            metric_type: properties.type,
            start_time: properties.startTime
          }
        };

      case 'error':
        return {
          eventName: 'exception',
          parameters: {
            ...baseParameters,
            event_category: 'error',
            description: properties.message || properties.type,
            fatal: properties.type === 'javascript_error',
            error_type: properties.type,
            filename: properties.filename,
            line_number: properties.lineno
          }
        };

      case 'roi_calculation':
        return {
          eventName: 'generate_lead',
          parameters: {
            ...baseParameters,
            event_category: 'conversion',
            currency: 'RUB',
            value: properties.estimatedROI || 0,
            business_size: properties.businessSize,
            industry: properties.industry,
            budget: properties.budget
          },
          // E-commerce данные для конверсий
          ecommerceData: {
            transaction_id: properties.calculationId,
            value: properties.estimatedROI || 0,
            currency: 'RUB',
            items: [{
              item_id: 'roi_calculation',
              item_name: 'ROI Calculator Result',
              category: 'lead_generation',
              quantity: 1,
              price: properties.estimatedROI || 0
            }]
          }
        };

      case 'ai_interaction':
        return {
          eventName: 'ai_interaction',
          parameters: {
            ...baseParameters,
            event_category: 'ai_engagement',
            interaction_type: properties.type,
            ai_model: properties.model,
            response_time: properties.responseTime,
            message_length: properties.messageLength,
            satisfaction_score: properties.satisfaction
          }
        };

      case 'form_submission':
        return {
          eventName: 'form_submit',
          parameters: {
            ...baseParameters,
            event_category: 'form',
            form_name: properties.formName,
            form_section: properties.section,
            completion_time: properties.completionTime,
            field_count: properties.fieldCount
          }
        };

      default:
        return {
          eventName: eventName,
          parameters: {
            ...baseParameters,
            ...properties
          }
        };
    }
  }

  /**
   * Настройка пользовательских свойств
   */
  setUserProperties(properties) {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('config', this.gaId, {
      user_properties: {
        user_type: properties.userType || 'anonymous',
        subscription_plan: properties.plan || 'free',
        engagement_level: properties.engagementLevel || 'low',
        preferred_language: properties.language || 'ru',
        device_category: properties.deviceType || 'unknown'
      }
    });
  }

  /**
   * Отслеживание конверсионных целей
   */
  trackConversion(conversionName, value = 0, currency = 'RUB') {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'conversion', {
      send_to: `${this.gaId}/${conversionName}`,
      value: value,
      currency: currency,
      transaction_id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
  }

  /**
   * Настройка Enhanced E-commerce для B2B транзакций
   */
  trackPurchase(transactionData) {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'purchase', {
      transaction_id: transactionData.id,
      value: transactionData.value,
      currency: transactionData.currency || 'RUB',
      coupon: transactionData.coupon,
      items: transactionData.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        item_brand: 'NeuroExpert',
        item_variant: item.variant
      }))
    });
  }

  /**
   * Очистка данных (GDPR compliance)
   */
  clearData() {
    if (window.gtag) {
      // Отключение всех функций отслеживания
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });
    }
  }

  /**
   * Получение статистики сервиса
   */
  getStats() {
    return {
      name: 'Google Analytics 4',
      isInitialized: this.isInitialized,
      gaId: this.gaId,
      debugMode: this.debugMode
    };
  }
}