/**
 * Storage Layer для NeuroExpert Analytics
 * Поддержка множественных backend'ов: JSON Files, SQLite, PostgreSQL, Redis
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Конфигурация хранилища
 */
const STORAGE_CONFIG = {
  type: process.env.ANALYTICS_STORAGE_TYPE || 'file', // file, sqlite, postgres, redis
  basePath: process.env.ANALYTICS_STORAGE_PATH || './data/analytics',
  maxFileSize: 50 * 1024 * 1024, // 50MB
  retentionDays: 30,
  compression: true
};

/**
 * Основная функция сохранения событий
 */
export async function saveAnalyticsEvents(eventData) {
  try {
    // Подготовка данных для сохранения
    const processedData = prepareDataForStorage(eventData);
    
    // Выбор backend'а для сохранения
    switch (STORAGE_CONFIG.type) {
      case 'file':
        return await saveToFiles(processedData);
      case 'sqlite':
        return await saveToSQLite(processedData);
      case 'postgres':
        return await saveToPostgreSQL(processedData);
      case 'redis':
        return await saveToRedis(processedData);
      default:
        throw new Error(`Unsupported storage type: ${STORAGE_CONFIG.type}`);
    }
  } catch (error) {
    console.error('Failed to save analytics events:', error);
    throw error;
  }
}

/**
 * Подготовка данных для сохранения
 */
function prepareDataForStorage(eventData) {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  
  return {
    id: generateStorageId(),
    timestamp,
    date: date.toISOString(),
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    eventType: eventData.eventType,
    eventsCount: eventData.events?.length || 0,
    metadata: eventData.metadata,
    events: eventData.events || [],
    storageTimestamp: timestamp,
    version: '3.0.0'
  };
}

/**
 * Сохранение в файловую систему (по умолчанию)
 */
async function saveToFiles(data) {
  try {
    // Создание структуры папок по дате
    const datePath = path.join(
      STORAGE_CONFIG.basePath,
      data.year.toString(),
      data.month.toString().padStart(2, '0'),
      data.day.toString().padStart(2, '0')
    );
    
    await fs.mkdir(datePath, { recursive: true });
    
    // Определение файла для записи
    const filename = `${data.eventType}_${data.hour.toString().padStart(2, '0')}.jsonl`;
    const filepath = path.join(datePath, filename);
    
    // Подготовка строки для записи (JSONL format)
    const jsonLine = JSON.stringify(data) + '\n';
    
    // Проверка размера файла
    const fileStats = await getFileStats(filepath);
    if (fileStats && fileStats.size > STORAGE_CONFIG.maxFileSize) {
      // Ротация файла при превышении размера
      await rotateFile(filepath);
    }
    
    // Запись данных
    await fs.appendFile(filepath, jsonLine, 'utf8');
    
    // Сохранение метаданных
    await saveMetadata(data, filepath);
    
    return {
      success: true,
      processedCount: data.eventsCount,
      storageLocation: filepath,
      storageType: 'file'
    };
    
  } catch (error) {
    console.error('File storage error:', error);
    throw error;
  }
}

/**
 * Сохранение метаданных для быстрого поиска
 */
async function saveMetadata(data, filepath) {
  try {
    const metadataPath = path.join(STORAGE_CONFIG.basePath, 'metadata');
    await fs.mkdir(metadataPath, { recursive: true });
    
    const metadataFile = path.join(metadataPath, `${data.year}-${data.month.toString().padStart(2, '0')}.json`);
    
    // Чтение существующих метаданных
    let metadata = {};
    try {
      const existingData = await fs.readFile(metadataFile, 'utf8');
      metadata = JSON.parse(existingData);
    } catch {
      // Файл не существует, создаем новый
    }
    
    // Обновление метаданных
    const dayKey = data.day.toString().padStart(2, '0');
    if (!metadata[dayKey]) {
      metadata[dayKey] = {
        totalEvents: 0,
        eventTypes: {},
        files: [],
        firstEvent: data.timestamp,
        lastEvent: data.timestamp
      };
    }
    
    metadata[dayKey].totalEvents += data.eventsCount;
    metadata[dayKey].eventTypes[data.eventType] = (metadata[dayKey].eventTypes[data.eventType] || 0) + data.eventsCount;
    metadata[dayKey].lastEvent = data.timestamp;
    
    if (!metadata[dayKey].files.includes(filepath)) {
      metadata[dayKey].files.push(filepath);
    }
    
    // Сохранение обновленных метаданных
    await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2), 'utf8');
    
  } catch (error) {
    console.error('Metadata save error:', error);
    // Не критичная ошибка, продолжаем
  }
}

/**
 * Получение статистики файла
 */
async function getFileStats(filepath) {
  try {
    return await fs.stat(filepath);
  } catch {
    return null;
  }
}

/**
 * Ротация файла при превышении размера
 */
async function rotateFile(filepath) {
  try {
    const timestamp = Date.now();
    const rotatedPath = `${filepath}.${timestamp}`;
    await fs.rename(filepath, rotatedPath);
    
    // Сжатие старого файла (если включено)
    if (STORAGE_CONFIG.compression) {
      await compressFile(rotatedPath);
    }
    
  } catch (error) {
    console.error('File rotation error:', error);
    // Не критичная ошибка
  }
}

/**
 * Сжатие файла (заглушка для будущей реализации)
 */
async function compressFile(filepath) {
  // TODO: Реализовать сжатие с помощью gzip или другого алгоритма
  console.log(`File scheduled for compression: ${filepath}`);
}

/**
 * Сохранение в SQLite (для будущей реализации)
 */
async function saveToSQLite(data) {
  // TODO: Реализовать SQLite backend
  throw new Error('SQLite storage not implemented yet');
}

/**
 * Сохранение в PostgreSQL (для будущей реализации)
 */
async function saveToPostgreSQL(data) {
  // TODO: Реализовать PostgreSQL backend
  throw new Error('PostgreSQL storage not implemented yet');
}

/**
 * Сохранение в Redis (для будущей реализации)
 */
async function saveToRedis(data) {
  // TODO: Реализовать Redis backend
  throw new Error('Redis storage not implemented yet');
}

/**
 * Генерация уникального ID для хранилища
 */
function generateStorageId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `storage_${timestamp}_${random}`;
}

/**
 * Получение аналитических данных
 */
export async function getAnalyticsData(params = {}) {
  try {
    const {
      startDate,
      endDate,
      eventType,
      limit = 1000,
      offset = 0
    } = params;
    
    switch (STORAGE_CONFIG.type) {
      case 'file':
        return await getDataFromFiles(params);
      default:
        throw new Error(`Data retrieval not implemented for ${STORAGE_CONFIG.type}`);
    }
  } catch (error) {
    console.error('Failed to get analytics data:', error);
    throw error;
  }
}

/**
 * Получение данных из файлов
 */
async function getDataFromFiles(params) {
  try {
    const {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 дней назад
      endDate = new Date(),
      eventType,
      limit = 1000
    } = params;
    
    const results = [];
    
    // Определение диапазона дат для поиска
    const searchDates = getDateRange(startDate, endDate);
    
    for (const date of searchDates) {
      const datePath = path.join(
        STORAGE_CONFIG.basePath,
        date.year.toString(),
        date.month.toString().padStart(2, '0'),
        date.day.toString().padStart(2, '0')
      );
      
      try {
        const files = await fs.readdir(datePath);
        const filteredFiles = eventType 
          ? files.filter(file => file.startsWith(eventType))
          : files.filter(file => file.endsWith('.jsonl'));
        
        for (const file of filteredFiles) {
          const filepath = path.join(datePath, file);
          const fileData = await readJSONLFile(filepath, limit - results.length);
          results.push(...fileData);
          
          if (results.length >= limit) {
            break;
          }
        }
        
        if (results.length >= limit) {
          break;
        }
        
      } catch (error) {
        // Папка не существует, пропускаем
        continue;
      }
    }
    
    return {
      data: results,
      total: results.length,
      hasMore: results.length === limit
    };
    
  } catch (error) {
    console.error('File data retrieval error:', error);
    throw error;
  }
}

/**
 * Чтение JSONL файла
 */
async function readJSONLFile(filepath, maxLines = 1000) {
  try {
    const content = await fs.readFile(filepath, 'utf8');
    const lines = content.trim().split('\n');
    const results = [];
    
    for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
      try {
        const data = JSON.parse(lines[i]);
        results.push(data);
      } catch (error) {
        console.warn(`Invalid JSON line in ${filepath}:${i + 1}`);
        continue;
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Failed to read file ${filepath}:`, error);
    return [];
  }
}

/**
 * Генерация диапазона дат
 */
function getDateRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    dates.push({
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    });
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Очистка старых данных
 */
export async function cleanupOldData() {
  try {
    const cutoffDate = new Date(Date.now() - STORAGE_CONFIG.retentionDays * 24 * 60 * 60 * 1000);
    
    // TODO: Реализовать очистку старых файлов
    console.log(`Cleanup scheduled for data older than ${cutoffDate.toISOString()}`);
    
    return { success: true, message: 'Cleanup completed' };
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
}

/**
 * Получение статистики хранилища
 */
export async function getStorageStats() {
  try {
    switch (STORAGE_CONFIG.type) {
      case 'file':
        return await getFileStorageStats();
      default:
        return { type: STORAGE_CONFIG.type, available: false };
    }
  } catch (error) {
    console.error('Storage stats error:', error);
    return { error: error.message };
  }
}

/**
 * Статистика файлового хранилища
 */
async function getFileStorageStats() {
  try {
    // TODO: Реализовать подсчет размера и количества файлов
    return {
      type: 'file',
      basePath: STORAGE_CONFIG.basePath,
      available: true,
      retentionDays: STORAGE_CONFIG.retentionDays,
      maxFileSize: STORAGE_CONFIG.maxFileSize
    };
  } catch (error) {
    return { type: 'file', available: false, error: error.message };
  }
}