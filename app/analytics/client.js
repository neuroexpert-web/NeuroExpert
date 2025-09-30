/**
 * Client-side analytics integration
 * This integrates with the existing SwipeContainer
 */

class ClientAnalytics {
  constructor() {
    this.queue = [];
    this.sessionId = this.generateSessionId();
    this.config = {
      apiEndpoint: '/api/analytics/track',
      batchEndpoint: '/api/analytics/batch',
      flushInterval: 5000,
      maxQueueSize: 50,
      debounceTime: 300,
      throttleTime: 1000
    };
    
    this.initializeServices();
    this.startBatchProcessor();
  }

  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  initializeServices() {
    // Initialize only if in browser
    if (typeof window === 'undefined') return;

    // Google Analytics
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
    }

    // Yandex Metrica
    if (process.env.NEXT_PUBLIC_YM_COUNTER_ID) {
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        k=e.createElement(t),a=e.getElementsByTagName(t)[0];
        k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      
      ym(process.env.NEXT_PUBLIC_YM_COUNTER_ID, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
      });
    }
  }

  track(eventName, eventData, options = {}) {
    const event = {
      type: 'custom',
      name: eventName,
      metadata: eventData,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      priority: options.priority || 'medium'
    };

    // Add to queue
    this.queue.push(event);

    // Process immediately if high priority
    if (options.priority === 'high') {
      this.flush();
    }

    // Send to integrated services immediately for critical events
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, eventData);
      }

      // Yandex Metrica
      if (window.ym) {
        window.ym(process.env.NEXT_PUBLIC_YM_COUNTER_ID, 'reachGoal', eventName, eventData);
      }
    }
  }

  async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch(this.config.batchEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
          'X-CSRF-Token': this.getCSRFToken()
        },
        body: JSON.stringify({ events })
      });

      if (!response.ok) {
        // Return events to queue on failure
        this.queue.unshift(...events);
      }
    } catch (error) {
      console.error('Analytics flush error:', error);
      // Return events to queue
      this.queue.unshift(...events);
    }
  }

  startBatchProcessor() {
    setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  getCSRFToken() {
    // Get CSRF token from meta tag or cookie
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
  }
}

// Create singleton instance
const clientAnalytics = new ClientAnalytics();

// Export functions that match existing SwipeContainer usage
export function trackSwipe(direction, fromSection, toSection, method) {
  clientAnalytics.track('swipe', {
    direction,
    from_section: fromSection,
    to_section: toSection,
    method,
    timestamp: Date.now()
  }, { priority: 'medium' });
}

export function trackSectionView(sectionName, sectionIndex) {
  clientAnalytics.track('section_view', {
    section_name: sectionName,
    section_index: sectionIndex,
    timestamp: Date.now()
  }, { priority: 'low' });
}

export { clientAnalytics };

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    clientAnalytics.track('page_load', {
      url: window.location.href,
      referrer: document.referrer,
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    });
  });

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    clientAnalytics.track('visibility_change', {
      hidden: document.hidden,
      timestamp: Date.now()
    });
  });

  // Flush on page unload
  window.addEventListener('beforeunload', () => {
    clientAnalytics.flush();
  });
}