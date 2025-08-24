import { useState, useCallback } from 'react';
import { AIAnalysis } from '../types';

export function useCursorAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeWithClaude = useCallback(async (
    text: string, 
    note: string
  ): Promise<AIAnalysis | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Проанализируй следующий текст и заметку пользователя. 
            Текст: "${text}"
            Заметка: "${note}"
            
            Предоставь краткий анализ, ключевые моменты и рекомендации.`,
          context: 'cursor-annotation'
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка анализа');
      }

      const data = await response.json();
      
      // Парсим ответ от Claude
      const analysis: AIAnalysis = {
        summary: data.message || 'Анализ выполнен',
        keyPoints: extractKeyPoints(data.message),
        suggestions: extractSuggestions(data.message),
        sentiment: analyzeSentiment(text),
        category: categorizeContent(text)
      };

      return analysis;
    } catch (err) {
      console.error('Cursor API error:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analyzeWithClaude,
    isLoading,
    error
  };
}

// Вспомогательные функции для парсинга ответа
function extractKeyPoints(text: string): string[] {
  const points: string[] = [];
  const lines = text.split('\n');
  
  lines.forEach(line => {
    if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
      points.push(line.trim().substring(1).trim());
    }
  });

  return points.length > 0 ? points : ['Основная идея выделенного текста'];
}

function extractSuggestions(text: string): string[] {
  const suggestions: string[] = [];
  const recommendIndex = text.toLowerCase().indexOf('рекоменд');
  
  if (recommendIndex !== -1) {
    const recommendText = text.substring(recommendIndex);
    const lines = recommendText.split('\n').slice(1, 4);
    lines.forEach(line => {
      if (line.trim()) suggestions.push(line.trim());
    });
  }

  return suggestions.length > 0 ? suggestions : ['Изучить контекст более детально'];
}

function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['хорошо', 'отлично', 'успех', 'рост', 'улучшение', 'прогресс'];
  const negativeWords = ['плохо', 'проблема', 'ошибка', 'падение', 'снижение', 'риск'];
  
  const textLower = text.toLowerCase();
  let score = 0;
  
  positiveWords.forEach(word => {
    if (textLower.includes(word)) score++;
  });
  
  negativeWords.forEach(word => {
    if (textLower.includes(word)) score--;
  });
  
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

function categorizeContent(text: string): string {
  const categories = {
    'технический': ['код', 'функция', 'api', 'компонент', 'разработка'],
    'бизнес': ['roi', 'доход', 'клиент', 'продажи', 'маркетинг'],
    'дизайн': ['ui', 'ux', 'интерфейс', 'цвет', 'макет'],
    'аналитика': ['метрика', 'данные', 'отчет', 'статистика', 'показатель']
  };
  
  const textLower = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      return category;
    }
  }
  
  return 'общий';
}