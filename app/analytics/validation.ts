/**
 * Event validation for analytics
 */

import { AnalyticsEvent } from './types';

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Validate analytics event
 */
export function validateEvent(event: any): ValidationResult {
  const errors: string[] = [];

  // Check required fields
  if (!event || typeof event !== 'object') {
    return { valid: false, errors: ['Event must be an object'] };
  }

  // Validate event type
  const validTypes = ['page_view', 'swipe', 'click', 'engagement', 'error', 'custom'];
  if (!event.type || !validTypes.includes(event.type)) {
    errors.push(`Invalid event type. Must be one of: ${validTypes.join(', ')}`);
  }

  // Validate event name
  if (!event.name || typeof event.name !== 'string') {
    errors.push('Event name is required and must be a string');
  } else if (event.name.length > 100) {
    errors.push('Event name must be less than 100 characters');
  }

  // Validate value if present
  if (event.value !== undefined && typeof event.value !== 'number') {
    errors.push('Event value must be a number');
  }

  // Validate metadata
  if (event.metadata && typeof event.metadata !== 'object') {
    errors.push('Event metadata must be an object');
  }

  // Validate priority
  const validPriorities = ['low', 'medium', 'high'];
  if (event.priority && !validPriorities.includes(event.priority)) {
    errors.push(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
  }

  // Validate timestamp
  if (event.timestamp && typeof event.timestamp !== 'number') {
    errors.push('Timestamp must be a number (milliseconds since epoch)');
  }

  // Specific validation for event types
  if (event.type === 'swipe' && event.metadata) {
    if (!event.metadata.direction || !['left', 'right', 'up', 'down'].includes(event.metadata.direction)) {
      errors.push('Swipe event must have a valid direction');
    }
    if (!event.metadata.method || !['touch', 'keyboard', 'button'].includes(event.metadata.method)) {
      errors.push('Swipe event must have a valid method');
    }
  }

  if (event.type === 'page_view' && !event.metadata?.url && typeof window !== 'undefined') {
    // Auto-fill URL if not provided
    event.metadata = event.metadata || {};
    event.metadata.url = window.location.href;
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Sanitize event data
 */
export function sanitizeEvent(event: AnalyticsEvent): AnalyticsEvent {
  const sanitized = { ...event };

  // Trim strings
  if (sanitized.name) {
    sanitized.name = sanitized.name.trim().substring(0, 100);
  }

  // Ensure metadata is an object
  if (!sanitized.metadata) {
    sanitized.metadata = {};
  }

  // Remove undefined values
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key as keyof AnalyticsEvent] === undefined) {
      delete sanitized[key as keyof AnalyticsEvent];
    }
  });

  // Add timestamp if missing
  if (!sanitized.timestamp) {
    sanitized.timestamp = Date.now();
  }

  // Set default priority
  if (!sanitized.priority) {
    sanitized.priority = 'medium';
  }

  return sanitized;
}

/**
 * Validate batch of events
 */
export function validateBatch(events: any[]): ValidationResult {
  if (!Array.isArray(events)) {
    return { valid: false, errors: ['Batch must be an array'] };
  }

  if (events.length === 0) {
    return { valid: false, errors: ['Batch cannot be empty'] };
  }

  if (events.length > 1000) {
    return { valid: false, errors: ['Batch size cannot exceed 1000 events'] };
  }

  const errors: string[] = [];
  
  events.forEach((event, index) => {
    const result = validateEvent(event);
    if (!result.valid && result.errors) {
      result.errors.forEach(error => {
        errors.push(`Event ${index}: ${error}`);
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}