/**
 * Константы для smoke-тестов
 */

// Статусы тестов
export const TEST_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  PASSED: 'passed',
  FAILED: 'failed',
  SKIPPED: 'skipped',
  ERROR: 'error'
};

// Приоритеты тестов
export const TEST_PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Таймауты по умолчанию (мс)
export const DEFAULT_TIMEOUTS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 10000,
  EXTRA_LONG: 15000
};

// Типы действий в тестах
export const ACTION_TYPES = {
  CHECK: 'check',
  FIND: 'find',
  VALIDATE: 'validate',
  MEASURE: 'measure',
  TEST: 'test',
  SEND: 'send'
};

// Ожидаемые результаты
export const EXPECTED_RESULTS = {
  EXISTS: 'exists',
  VISIBLE: 'visible',
  INTERACTIVE: 'interactive',
  FUNCTIONAL: 'functional',
  RESPONSIVE: 'responsive',
  NO_ERRORS: 'noErrors'
};

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  TIMEOUT: 'Тест превысил время ожидания',
  NOT_FOUND: 'Элемент не найден',
  VALIDATION_FAILED: 'Валидация не пройдена',
  UNEXPECTED_ERROR: 'Неожиданная ошибка',
  NETWORK_ERROR: 'Ошибка сети'
};

// Конфигурация отчетов
export const REPORT_CONFIG = {
  SHOW_PASSED: true,
  SHOW_FAILED: true,
  SHOW_SKIPPED: false,
  SHOW_DETAILS: true,
  SAVE_TO_FILE: false,
  MAX_ERROR_LENGTH: 500
};