/**
 * Analytics Event Queue with debounce and throttle support
 */

import { AnalyticsEvent, QueueConfig } from './types';

export class AnalyticsQueue {
  private queue: AnalyticsEvent[] = [];
  private config: QueueConfig;
  private flushTimer: NodeJS.Timeout | null = null;
  private lastFlushTime: number = 0;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: QueueConfig) {
    this.config = config;
    this.startAutoFlush();
  }

  /**
   * Add event to queue with debounce/throttle support
   */
  add(event: AnalyticsEvent): void {
    const eventKey = `${event.type}-${event.name}`;
    
    // Apply debounce for low priority events
    if (event.priority === 'low' && this.config.debounceTime) {
      const existingTimer = this.debounceTimers.get(eventKey);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      
      const timer = setTimeout(() => {
        this.addToQueue(event);
        this.debounceTimers.delete(eventKey);
      }, this.config.debounceTime);
      
      this.debounceTimers.set(eventKey, timer);
      return;
    }

    // Apply throttle for medium priority events
    if (event.priority === 'medium' && this.config.throttleTime) {
      const now = Date.now();
      const timeSinceLastFlush = now - this.lastFlushTime;
      
      if (timeSinceLastFlush < this.config.throttleTime) {
        // Add to queue but don't flush immediately
        this.addToQueue(event);
        return;
      }
    }

    // Add to queue
    this.addToQueue(event);

    // High priority events trigger immediate flush
    if (event.priority === 'high') {
      this.flush();
    }
  }

  private addToQueue(event: AnalyticsEvent): void {
    // Enrich event with timestamp if not present
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    this.queue.push(event);

    // Check queue size limit
    if (this.queue.length >= this.config.maxSize) {
      // Remove oldest events if limit exceeded
      const overflow = this.queue.length - this.config.maxSize;
      this.queue.splice(0, overflow);
      
      console.warn(`Analytics queue overflow. Removed ${overflow} oldest events.`);
    }

    // Trigger flush if batch size reached
    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Flush events from queue
   */
  flush(): AnalyticsEvent[] {
    if (this.queue.length === 0) {
      return [];
    }

    // Get events to flush (up to batchSize)
    const eventsToFlush = this.queue.splice(0, this.config.batchSize);
    this.lastFlushTime = Date.now();

    // Reset flush timer
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.startAutoFlush();
    }

    return eventsToFlush;
  }

  /**
   * Start automatic flush interval
   */
  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  /**
   * Get current queue size
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Get queue metrics
   */
  getMetrics(): {
    queueSize: number;
    lastFlushTime: number;
    pendingDebounce: number;
    config: QueueConfig;
  } {
    return {
      queueSize: this.queue.length,
      lastFlushTime: this.lastFlushTime,
      pendingDebounce: this.debounceTimers.size,
      config: this.config
    };
  }

  /**
   * Clear all pending events and timers
   */
  clear(): void {
    this.queue = [];
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
  }

  /**
   * Destroy queue and cleanup
   */
  destroy(): void {
    this.clear();
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }
}