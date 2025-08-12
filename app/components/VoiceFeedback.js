// Голосовой модуль обратной связи для NeuroExpert
'use client';
import { useState, useRef } from 'react';

function VoiceFeedback() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Проверка поддержки браузером
  useState(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Автоматическая расшифровка (имитация)
        setTimeout(() => {
          setTranscription("Хочу узнать больше о ваших услугах для среднего бизнеса");
        }, 1000);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
      alert('Не удалось получить доступ к микрофону. Проверьте настройки браузера.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const submitFeedback = async () => {
    if (!phone.trim() || (!transcription && !audioURL)) {
      alert('Пожалуйста, укажите номер телефона и запишите сообщение');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Имитация отправки данных
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Спасибо! Ваше сообщение получено. Мы свяжемся с вами по номеру ${phone} в течение 2 часов.`);
      
      // Очистка формы
      setAudioURL(null);
      setTranscription('');
      setPhone('');
    } catch (error) {
      alert('Ошибка отправки. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearRecording = () => {
    setAudioURL(null);
    setTranscription('');
  };

  if (!isSupported) {
    return (
      <div className="voice-feedback unsupported">
        <h3>📱 Голосовая обратная связь</h3>
        <p>Ваш браузер не поддерживает запись голоса.</p>
        <p>Используйте форму обратной связи или свяжитесь с нами по телефону.</p>
        
        <style jsx>{`
          .voice-feedback.unsupported {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid rgba(255, 193, 7, 0.3);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            color: var(--muted);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="voice-feedback">
      <h3>🎤 Отправить голосовое сообщение</h3>
      <p className="voice-subtitle">
        Расскажите о ваших потребностях голосом — это быстро и удобно!
      </p>
      
      <div className="recording-section">
        {!audioURL ? (
          <div className="record-controls">
            <button
              className={`record-btn ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isSubmitting}
            >
              {isRecording ? (
                <>
                  <span className="pulse-icon">⏹️</span>
                  Остановить запись
                </>
              ) : (
                <>
                  🎤 Начать запись
                </>
              )}
            </button>
            
            {isRecording && (
              <div className="recording-indicator">
                <span className="recording-dot"></span>
                Идет запись...
              </div>
            )}
          </div>
        ) : (
          <div className="playback-section">
            <div className="audio-player">
              <audio controls src={audioURL}>
                Ваш браузер не поддерживает воспроизведение аудио.
              </audio>
            </div>
            
            {transcription && (
              <div className="transcription">
                <h4>📝 Расшифровка:</h4>
                <p>"{transcription}"</p>
              </div>
            )}
            
            <button className="clear-btn" onClick={clearRecording}>
              🗑️ Записать заново
            </button>
          </div>
        )}
      </div>
      
      <div className="contact-section">
        <input
          type="tel"
          placeholder="📞 Ваш номер телефона"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isSubmitting}
          className="phone-input"
        />
        
        <button 
          className="submit-btn"
          onClick={submitFeedback}
          disabled={isSubmitting || !phone.trim() || (!transcription && !audioURL)}
        >
          {isSubmitting ? '📤 Отправляем...' : '🚀 Отправить заявку'}
        </button>
      </div>
      
      <div className="privacy-note">
        <small>
          🔒 Ваши данные защищены и используются только для связи с вами
        </small>
      </div>
      
      <style jsx>{`
        .voice-feedback {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: var(--card);
          border: 2px solid var(--accent);
          border-radius: 16px;
          padding: 24px;
          width: 350px;
          max-width: calc(100vw - 40px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(125, 211, 252, 0.3);
          z-index: 1000;
          animation: slideInUp 0.5s ease-out;
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .voice-feedback h3 {
          margin: 0 0 8px 0;
          color: var(--accent);
          text-align: center;
        }
        
        .voice-subtitle {
          text-align: center;
          color: var(--muted);
          font-size: 14px;
          margin-bottom: 20px;
        }
        
        .recording-section {
          margin-bottom: 20px;
        }
        
        .record-controls {
          text-align: center;
        }
        
        .record-btn {
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          color: #03101a;
          border: none;
          padding: 16px 24px;
          border-radius: 50px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .record-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(125, 211, 252, 0.4);
        }
        
        .record-btn.recording {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          animation: recordingPulse 1s ease-in-out infinite;
        }
        
        @keyframes recordingPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .pulse-icon {
          animation: pulse 1s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .recording-indicator {
          margin-top: 12px;
          color: #ef4444;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .recording-dot {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 1s ease-in-out infinite;
        }
        
        .playback-section {
          text-align: center;
        }
        
        .audio-player {
          margin-bottom: 16px;
        }
        
        .audio-player audio {
          width: 100%;
          max-width: 300px;
        }
        
        .transcription {
          background: rgba(125, 211, 252, 0.1);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
        }
        
        .transcription h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: var(--accent);
        }
        
        .transcription p {
          margin: 0;
          color: var(--text);
          font-style: italic;
        }
        
        .clear-btn {
          background: transparent;
          color: var(--muted);
          border: 1px solid rgba(125, 211, 252, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        
        .clear-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        
        .contact-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .phone-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid rgba(125, 211, 252, 0.3);
          border-radius: 8px;
          background: var(--card);
          color: var(--text);
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        .phone-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(125, 211, 252, 0.1);
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .privacy-note {
          margin-top: 16px;
          text-align: center;
          color: var(--muted);
        }
        
        @media (max-width: 768px) {
          .voice-feedback {
            bottom: 10px;
            right: 10px;
            left: 10px;
            width: auto;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}

export default VoiceFeedback;
