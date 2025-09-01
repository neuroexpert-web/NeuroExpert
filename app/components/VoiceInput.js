'use client';

import { useState, useEffect, useRef } from 'react';

export default function VoiceInput({ onTranscript, onStateChange }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Проверяем поддержку Web Speech API
    if (typeof window !== 'undefined' && 
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setIsSupported(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Настройки распознавания
      recognitionRef.current.lang = 'ru-RU';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;

      // Обработчики событий
      recognitionRef.current.onstart = () => {
        console.log('Распознавание речи началось');
        setIsListening(true);
        onStateChange?.(true);
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          onTranscript?.(finalTranscript);
        } else if (interimTranscript) {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Ошибка распознавания речи:', event.error);
        setIsListening(false);
        onStateChange?.(false);
        
        // Показываем пользователю сообщение об ошибке
        if (event.error === 'no-speech') {
          alert('Речь не обнаружена. Попробуйте еще раз.');
        } else if (event.error === 'not-allowed') {
          alert('Доступ к микрофону запрещен. Разрешите доступ в настройках браузера.');
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Распознавание речи завершено');
        setIsListening(false);
        onStateChange?.(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, onStateChange]);

  const toggleListening = () => {
    if (!isSupported) {
      alert('Ваш браузер не поддерживает распознавание речи');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="voice-input">
      <button
        className={`voice-button ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
        aria-label={isListening ? 'Остановить запись' : 'Начать запись'}
      >
        {isListening ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="6" y="4" width="4" height="16" strokeWidth="2" rx="1"/>
            <rect x="14" y="4" width="4" height="16" strokeWidth="2" rx="1"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeWidth="2"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 19v4m-4 0h8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {isListening && (
        <div className="voice-visualizer">
          <div className="voice-pulse"></div>
          <div className="voice-pulse"></div>
          <div className="voice-pulse"></div>
        </div>
      )}

      {transcript && (
        <div className="voice-transcript">
          {transcript}
        </div>
      )}

      <style jsx>{`
        .voice-input {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .voice-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.1);
          border: 2px solid rgba(139, 92, 246, 0.3);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .voice-button:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .voice-button.listening {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .voice-visualizer {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .voice-pulse {
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border-radius: 2px;
          animation: sound-wave 0.6s ease-in-out infinite;
        }

        .voice-pulse:nth-child(2) {
          animation-delay: 0.2s;
          height: 30px;
        }

        .voice-pulse:nth-child(3) {
          animation-delay: 0.4s;
          height: 25px;
        }

        @keyframes sound-wave {
          0%, 100% {
            transform: scaleY(0.5);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        .voice-transcript {
          position: absolute;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(26, 26, 46, 0.95);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          padding: 8px 16px;
          color: white;
          font-size: 0.875rem;
          white-space: nowrap;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}