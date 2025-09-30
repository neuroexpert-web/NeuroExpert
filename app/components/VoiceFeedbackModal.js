// Модальная голосовая обратная связь для NeuroExpert
'use client';
import { useState, useRef, useEffect } from 'react';

function VoiceFeedbackModal({ isOpen, onClose }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [phone, setPhone] = useState('');
  const [transcription, setTranscription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        } 
      });
      
      // Улучшенные настройки записи
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Симуляция транскрипции
        setTimeout(() => {
          setTranscription("Привет! Меня интересует ваши услуги по автоматизации бизнеса...");
        }, 1000);
        
        // Остановка всех треков
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Записываем чанки каждые 100ms для лучшего качества
      setIsRecording(true);
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
      alert('Не удалось получить доступ к микрофону. Проверьте разрешения.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearRecording = () => {
    setAudioURL(null);
    setTranscription('');
    audioChunksRef.current = [];
  };

  const submitFeedback = async () => {
    if (!phone.trim()) {
      alert('Пожалуйста, введите номер телефона');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      if (audioURL) {
        // Создаем Blob из аудио URL
        const response = await fetch(audioURL);
        const audioBlob = await response.blob();
        formData.append('audio', audioBlob, 'voice-message.webm');
      }
      
      formData.append('phone', phone);
      formData.append('transcription', transcription);

      const submitResponse = await fetch('/.netlify/functions/voice-form', {
        method: 'POST',
        body: formData
      });

      const data = await submitResponse.json();

      if (submitResponse.ok) {
        setShowConfirmation(true);
        
        // Аналитика
        if (typeof window !== 'undefined') {
          if (window.gtag) {
            window.gtag('event', 'form_submit', {
              event_category: 'engagement',
              event_label: 'voice_form',
              form_type: 'voice'
            });
          }
          
          if (window.ym) {
            window.ym(process.env.NEXT_PUBLIC_YANDEX_METRICA_ID, 'reachGoal', 'voice_form_submit', {
              form_type: 'voice'
            });
          }
        }
        
        // Очистка формы
        clearRecording();
        setPhone('');
        
        // Закрытие через 3 секунды
        setTimeout(() => {
          setShowConfirmation(false);
          onClose();
        }, 3000);
        
      } else {
        alert(data.error || 'Произошла ошибка при отправке');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка при отправке. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="voice-modal-overlay" onClick={handleOverlayClick}>
      <div className="voice-modal">
        {showConfirmation ? (
          <div className="confirmation-content">
            <div className="success-icon">🎉</div>
            <h3>Заявка отправлена!</h3>
            <p>Спасибо за обращение! Мы свяжемся с вами в течение 15 минут.</p>
            <div className="success-details">
              <div className="detail-item">
                <span className="icon">📞</span>
                <span>Звонок в течение 15 минут</span>
              </div>
              <div className="detail-item">
                <span className="icon">💬</span>
                <span>Telegram уведомление отправлено</span>
              </div>
              <div className="detail-item">
                <span className="icon">📊</span>
                <span>Персональный ROI расчет готовится</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="voice-content">
            <div className="voice-header">
              <h3>🎤 Голосовое сообщение</h3>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>
            
            <p className="voice-subtitle">
              Расскажите о ваших потребностях голосом — это быстро и удобно!
            </p>
            
            <div className="recording-section">
              {!audioURL ? (
                <div className="record-controls">
                  <button 
                    className={`record-btn ${isRecording ? 'recording' : ''}`}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? (
                      <>
                        <span className="pulse-dot"></span>
                        🛑 Остановить запись
                      </>
                    ) : (
                      <>🎙️ Начать запись</>
                    )}
                  </button>
                  
                  {isRecording && (
                    <div className="recording-indicator">
                      <div className="wave-animation">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                      </div>
                      <p>Говорите сейчас...</p>
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
                      <h4>📝 Распознанный текст:</h4>
                      <p>"{transcription}"</p>
                    </div>
                  )}
                  
                  <button className="clear-btn" onClick={clearRecording}>
                    🔄 Записать заново
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
              <p>🔒 Ваши данные защищены и не передаются третьим лицам</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .voice-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }

        .voice-modal {
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95), 
            rgba(30, 41, 59, 0.95)
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 20px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 50px rgba(0, 212, 255, 0.1);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .voice-content, .confirmation-content {
          padding: 30px;
        }

        .voice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(0, 212, 255, 0.2);
        }

        .voice-header h3 {
          margin: 0;
          color: #00d4ff;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.5rem;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .voice-subtitle {
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          margin-bottom: 25px;
          line-height: 1.6;
        }

        .recording-section {
          margin-bottom: 25px;
        }

        .record-controls {
          text-align: center;
        }

        .record-btn {
          background: linear-gradient(135deg, #00d4ff, #06b6d4);
          border: none;
          border-radius: 15px;
          color: white;
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }

        .record-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
        }

        .record-btn.recording {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          animation: recordingPulse 2s infinite;
        }

        @keyframes recordingPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.6); }
        }

        .pulse-dot {
          position: absolute;
          left: 15px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .recording-indicator {
          margin-top: 20px;
          text-align: center;
        }

        .wave-animation {
          display: flex;
          justify-content: center;
          gap: 3px;
          margin-bottom: 10px;
        }

        .wave {
          width: 4px;
          height: 20px;
          background: #00d4ff;
          border-radius: 2px;
          animation: wave 1.2s infinite ease-in-out;
        }

        .wave:nth-child(2) { animation-delay: -1.1s; }
        .wave:nth-child(3) { animation-delay: -1.0s; }

        @keyframes wave {
          0%, 40%, 100% { transform: scaleY(0.4); }
          20% { transform: scaleY(1.0); }
        }

        .playback-section {
          text-align: center;
        }

        .audio-player {
          margin-bottom: 15px;
        }

        .audio-player audio {
          width: 100%;
          max-width: 300px;
        }

        .transcription {
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 10px;
          padding: 15px;
          margin: 15px 0;
          text-align: left;
        }

        .transcription h4 {
          margin: 0 0 10px 0;
          color: #00d4ff;
          font-size: 0.9rem;
        }

        .transcription p {
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
          font-style: italic;
        }

        .clear-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          color: white;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .contact-section {
          margin-bottom: 20px;
        }

        .phone-input {
          width: 100%;
          padding: 15px;
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 1rem;
          margin-bottom: 15px;
          transition: all 0.2s ease;
        }

        .phone-input:focus {
          outline: none;
          border-color: #00d4ff;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
        }

        .phone-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #00d4ff, #06b6d4);
          border: none;
          border-radius: 12px;
          color: white;
          padding: 15px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .privacy-note {
          text-align: center;
          margin-top: 15px;
        }

        .privacy-note p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          margin: 0;
        }

        /* Confirmation styles */
        .confirmation-content {
          text-align: center;
          padding: 40px 30px;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          animation: successBounce 0.6s ease-out;
        }

        @keyframes successBounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .confirmation-content h3 {
          color: #00d4ff;
          font-size: 1.8rem;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .confirmation-content p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          margin-bottom: 25px;
          line-height: 1.6;
        }

        .success-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.9);
        }

        .detail-item .icon {
          font-size: 1.2rem;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .voice-modal-overlay {
            padding: 10px;
          }

          .voice-modal {
            max-height: 95vh;
            border-radius: 15px;
          }

          .voice-content, .confirmation-content {
            padding: 20px;
          }

          .voice-header h3 {
            font-size: 1.3rem;
          }

          .record-btn {
            padding: 12px 25px;
            font-size: 1rem;
          }

          .success-details {
            gap: 10px;
          }

          .detail-item {
            padding: 10px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default VoiceFeedbackModal;