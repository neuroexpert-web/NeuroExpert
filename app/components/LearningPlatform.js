// Интерактивная обучающая платформа с мини-тестами для NeuroExpert
'use client';
import { useState } from 'react';

const learningModules = [
  {
    id: 'basics',
    title: '🎯 Основы цифровизации',
    description: 'Узнайте, что такое цифровизация и как она поможет вашему бизнесу',
    duration: '5 мин',
    difficulty: 'Начальный',
    content: {
      video: '/videos/basics.mp4', // В реальном проекте
      text: `
## Что такое цифровизация?

Цифровизация — это процесс интеграции цифровых технологий во все сферы бизнеса, который кардинально меняет способ работы и создания ценности для клиентов.

### Ключевые компоненты:
- **Автоматизация процессов** — избавление от рутинных задач
- **Данные и аналитика** — принятие решений на основе фактов
- **Клиентский опыт** — улучшение взаимодействия с клиентами
- **AI и машинное обучение** — умные решения и прогнозы

### Выгоды для бизнеса:
- 📈 Увеличение выручки на 20-50%
- ⚡ Сокращение времени на операции в 3-5 раз
- 💰 Снижение операционных расходов на 15-30%
- 🎯 Повышение точности прогнозов до 90%
      `,
      quiz: [
        {
          question: 'Что является основной целью цифровизации?',
          options: [
            'Покупка дорогого оборудования',
            'Интеграция цифровых технологий в бизнес-процессы',
            'Увольнение сотрудников',
            'Создание сайта'
          ],
          correct: 1,
          explanation: 'Цифровизация — это комплексная интеграция технологий для повышения эффективности бизнеса.'
        },
        {
          question: 'На сколько в среднем может увеличиться выручка после цифровизации?',
          options: ['5-10%', '20-50%', '100-200%', '1000%'],
          correct: 1,
          explanation: 'Правильно внедренная цифровизация увеличивает выручку на 20-50% в первый год.'
        }
      ]
    }
  },
  {
    id: 'roi',
    title: '💰 Расчет ROI цифровизации',
    description: 'Научитесь правильно рассчитывать окупаемость инвестиций в цифровые решения',
    duration: '7 мин',
    difficulty: 'Средний',
    content: {
      text: `
## Как рассчитать ROI от цифровизации?

ROI (Return on Investment) показывает, сколько прибыли приносит каждый рубль, вложенный в цифровизацию.

### Формула расчета:
\`\`\`
ROI = (Прибыль от цифровизации - Затраты на цифровизацию) / Затраты на цифровизацию × 100%
\`\`\`

### Что включить в расчет:

**Затраты:**
- Разработка и внедрение систем
- Обучение персонала
- Поддержка и обслуживание
- Лицензии на ПО

**Прибыль:**
- Увеличение продаж
- Сокращение расходов
- Экономия времени сотрудников
- Снижение ошибок

### Пример расчета:
Компания потратила 500,000₽ на CRM-систему.
За год получила дополнительную прибыль 1,200,000₽.

ROI = (1,200,000 - 500,000) / 500,000 × 100% = 140%
      `,
      quiz: [
        {
          question: 'Компания потратила 300,000₽ и получила прибыль 900,000₽. Какой ROI?',
          options: ['100%', '200%', '300%', '400%'],
          correct: 1,
          explanation: 'ROI = (900,000 - 300,000) / 300,000 × 100% = 200%'
        },
        {
          question: 'Что НЕ включается в расчет затрат на цифровизацию?',
          options: [
            'Обучение персонала',
            'Лицензии на ПО',
            'Аренда офиса',
            'Поддержка системы'
          ],
          correct: 2,
          explanation: 'Аренда офиса — это общие расходы компании, не связанные с цифровизацией.'
        }
      ]
    }
  },
  {
    id: 'packages',
    title: '📦 Выбор пакета услуг',
    description: 'Разберитесь, какой пакет услуг подходит именно вашему бизнесу',
    duration: '6 мин',
    difficulty: 'Начальный',
    content: {
      text: `
## Как выбрать подходящий пакет услуг?

Выбор зависит от размера бизнеса, отрасли и текущего уровня цифровизации.

### 👥 Малый бизнес (до 50 сотрудников):
- **Бюджет:** 50,000-300,000₽
- **Фокус:** Автоматизация базовых процессов
- **Решения:** CRM, сайт, реклама
- **Срок окупаемости:** 3-6 месяцев

### 🏢 Средний бизнес (50-500 сотрудников):
- **Бюджет:** 300,000-1,000,000₽
- **Фокус:** Комплексная цифровизация
- **Решения:** ERP, BI-аналитика, eCommerce
- **Срок окупаемости:** 6-12 месяцев

### 🏭 Крупный бизнес (500+ сотрудников):
- **Бюджет:** от 1,000,000₽
- **Фокус:** Цифровая трансформация
- **Решения:** Enterprise-системы, AI, Big Data
- **Срок окупаемости:** 12-24 месяца

### Как определить свой сегмент:
1. Подсчитайте количество сотрудников
2. Оцените годовой оборот
3. Проанализируйте текущий уровень автоматизации
4. Определите приоритетные задачи
      `,
      quiz: [
        {
          question: 'Какой бюджет рекомендуется для малого бизнеса?',
          options: [
            '10,000-50,000₽',
            '50,000-300,000₽',
            '300,000-1,000,000₽',
            'От 1,000,000₽'
          ],
          correct: 1,
          explanation: 'Для малого бизнеса оптимальный бюджет на цифровизацию — 50,000-300,000₽.'
        },
        {
          question: 'Что является приоритетом для среднего бизнеса?',
          options: [
            'Только CRM-система',
            'Комплексная цифровизация',
            'Только сайт',
            'Только реклама'
          ],
          correct: 1,
          explanation: 'Средний бизнес готов к комплексной цифровизации с интеграцией различных систем.'
        }
      ]
    }
  }
];

function LearningPlatform() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentStep, setCurrentStep] = useState('content'); // content, quiz, results
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [showPlatform, setShowPlatform] = useState(false);

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    setCurrentStep('content');
    setQuizAnswers({});
    setQuizResults(null);
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const calculateQuizResults = () => {
    const quiz = selectedModule.content.quiz;
    let correct = 0;
    
    quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correct++;
      }
    });
    
    const percentage = Math.round((correct / quiz.length) * 100);
    
    setQuizResults({
      correct,
      total: quiz.length,
      percentage,
      passed: percentage >= 70
    });
    
    setCurrentStep('results');
  };

  const restartQuiz = () => {
    setQuizAnswers({});
    setQuizResults(null);
    setCurrentStep('quiz');
  };

  const goBackToModules = () => {
    setSelectedModule(null);
    setCurrentStep('content');
  };

  if (!showPlatform) {
    return (
      <div className="learning-trigger">
        <button 
          className="open-learning-btn"
          onClick={() => setShowPlatform(true)}
        >
          🎓 Обучающие материалы
        </button>
        
        <style jsx>{`
          .learning-trigger {
            margin: 20px 0;
            text-align: center;
          }
          
          .open-learning-btn {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 16px;
          }
          
          .open-learning-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="learning-platform">
      <div className="platform-header">
        <h2>🎓 Обучающая платформа NeuroExpert</h2>
        <p>Изучите основы цифровизации за несколько минут</p>
        <button 
          className="close-platform"
          onClick={() => setShowPlatform(false)}
        >
          ✕
        </button>
      </div>

      {!selectedModule ? (
        <div className="modules-grid">
          {learningModules.map((module) => (
            <div 
              key={module.id}
              className="module-card"
              onClick={() => handleModuleSelect(module)}
            >
              <h3>{module.title}</h3>
              <p className="module-description">{module.description}</p>
              
              <div className="module-meta">
                <span className="duration">⏱️ {module.duration}</span>
                <span className="difficulty">📊 {module.difficulty}</span>
              </div>
              
              <button className="start-module-btn">
                ▶️ Начать обучение
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="module-content">
          <div className="module-header">
            <button 
              className="back-btn"
              onClick={goBackToModules}
            >
              ← Назад к модулям
            </button>
            <h3>{selectedModule.title}</h3>
          </div>

          <div className="progress-bar">
            <div className="progress-steps">
              <div className={`step ${currentStep === 'content' ? 'active' : 'completed'}`}>
                1. Изучение
              </div>
              <div className={`step ${currentStep === 'quiz' ? 'active' : currentStep === 'results' ? 'completed' : ''}`}>
                2. Тест
              </div>
              <div className={`step ${currentStep === 'results' ? 'active' : ''}`}>
                3. Результат
              </div>
            </div>
          </div>

          {currentStep === 'content' && (
            <div className="content-section">
              <div 
                className="module-text"
                dangerouslySetInnerHTML={{ 
                  __html: selectedModule.content.text.replace(/\n/g, '<br>') 
                }}
              />
              
              <button 
                className="proceed-btn"
                onClick={() => setCurrentStep('quiz')}
              >
                📝 Перейти к тесту
              </button>
            </div>
          )}

          {currentStep === 'quiz' && (
            <div className="quiz-section">
              <h4>📝 Мини-тест</h4>
              <p>Проверьте свои знания по изученному материалу</p>
              
              {selectedModule.content.quiz.map((question, qIndex) => (
                <div key={qIndex} className="quiz-question">
                  <h5>{qIndex + 1}. {question.question}</h5>
                  
                  <div className="quiz-options">
                    {question.options.map((option, oIndex) => (
                      <label 
                        key={oIndex}
                        className={`quiz-option ${quizAnswers[qIndex] === oIndex ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          checked={quizAnswers[qIndex] === oIndex}
                          onChange={() => handleQuizAnswer(qIndex, oIndex)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="quiz-actions">
                <button 
                  className="submit-quiz-btn"
                  onClick={calculateQuizResults}
                  disabled={Object.keys(quizAnswers).length < selectedModule.content.quiz.length}
                >
                  ✅ Проверить ответы
                </button>
              </div>
            </div>
          )}

          {currentStep === 'results' && (
            <div className="results-section">
              <div className={`results-header ${quizResults.passed ? 'passed' : 'failed'}`}>
                <div className="results-icon">
                  {quizResults.passed ? '🎉' : '😔'}
                </div>
                <h4>
                  {quizResults.passed ? 'Поздравляем!' : 'Попробуйте еще раз'}
                </h4>
                <p>
                  Вы ответили правильно на {quizResults.correct} из {quizResults.total} вопросов 
                  ({quizResults.percentage}%)
                </p>
              </div>

              <div className="detailed-results">
                {selectedModule.content.quiz.map((question, index) => {
                  const userAnswer = quizAnswers[index];
                  const isCorrect = userAnswer === question.correct;
                  
                  return (
                    <div key={index} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                      <h5>{question.question}</h5>
                      <p className="user-answer">
                        Ваш ответ: {question.options[userAnswer]} 
                        {isCorrect ? ' ✅' : ' ❌'}
                      </p>
                      {!isCorrect && (
                        <p className="correct-answer">
                          Правильный ответ: {question.options[question.correct]}
                        </p>
                      )}
                      <p className="explanation">{question.explanation}</p>
                    </div>
                  );
                })}
              </div>

              <div className="results-actions">
                {!quizResults.passed && (
                  <button className="retry-btn" onClick={restartQuiz}>
                    🔄 Пройти тест заново
                  </button>
                )}
                <button className="continue-btn" onClick={goBackToModules}>
                  📚 Выбрать другой модуль
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .learning-platform {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--card);
          border: 2px solid var(--accent);
          border-radius: 20px;
          padding: 32px;
          width: 90vw;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 1500;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(125, 211, 252, 0.3);
          animation: modalSlideIn 0.5s ease-out;
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -60%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        
        .platform-header {
          text-align: center;
          margin-bottom: 32px;
          position: relative;
        }
        
        .platform-header h2 {
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .close-platform {
          position: absolute;
          top: 0;
          right: 0;
          background: transparent;
          border: 1px solid rgba(125, 211, 252, 0.3);
          color: var(--muted);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .close-platform:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .module-card {
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .module-card:hover {
          transform: translateY(-4px);
          border-color: #8b5cf6;
          box-shadow: 0 12px 24px rgba(139, 92, 246, 0.2);
        }
        
        .module-card h3 {
          margin: 0 0 12px 0;
          color: var(--text);
        }
        
        .module-description {
          color: var(--muted);
          margin: 0 0 16px 0;
          line-height: 1.5;
        }
        
        .module-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          font-size: 14px;
        }
        
        .duration,
        .difficulty {
          color: var(--muted);
        }
        
        .start-module-btn {
          width: 100%;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .start-module-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
        }
        
        .module-content {
          max-width: 100%;
        }
        
        .module-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .back-btn {
          background: transparent;
          border: 1px solid rgba(125, 211, 252, 0.3);
          color: var(--accent);
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .back-btn:hover {
          background: rgba(125, 211, 252, 0.1);
        }
        
        .progress-bar {
          margin-bottom: 32px;
        }
        
        .progress-steps {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }
        
        .step {
          flex: 1;
          padding: 12px;
          text-align: center;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          background: rgba(125, 211, 252, 0.1);
          color: var(--muted);
          border: 1px solid rgba(125, 211, 252, 0.2);
        }
        
        .step.active {
          background: var(--accent);
          color: #03101a;
          border-color: var(--accent);
        }
        
        .step.completed {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border-color: #22c55e;
        }
        
        .content-section {
          line-height: 1.6;
        }
        
        .module-text {
          margin-bottom: 24px;
          color: var(--text);
        }
        
        .proceed-btn {
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          color: #03101a;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .proceed-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(125, 211, 252, 0.4);
        }
        
        .quiz-section {
          max-width: 100%;
        }
        
        .quiz-question {
          margin-bottom: 24px;
          padding: 20px;
          background: rgba(125, 211, 252, 0.05);
          border-radius: 12px;
        }
        
        .quiz-question h5 {
          margin: 0 0 16px 0;
          color: var(--text);
        }
        
        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .quiz-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid rgba(125, 211, 252, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .quiz-option:hover {
          border-color: var(--accent);
          background: rgba(125, 211, 252, 0.08);
        }
        
        .quiz-option.selected {
          border-color: var(--accent);
          background: rgba(125, 211, 252, 0.1);
        }
        
        .quiz-option input {
          margin: 0;
        }
        
        .quiz-actions {
          text-align: center;
          margin-top: 24px;
        }
        
        .submit-quiz-btn {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .submit-quiz-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .submit-quiz-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
        }
        
        .results-section {
          text-align: center;
        }
        
        .results-header {
          margin-bottom: 32px;
          padding: 24px;
          border-radius: 12px;
        }
        
        .results-header.passed {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid #22c55e;
        }
        
        .results-header.failed {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
        }
        
        .results-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        
        .detailed-results {
          text-align: left;
          margin-bottom: 24px;
        }
        
        .result-item {
          margin-bottom: 20px;
          padding: 16px;
          border-radius: 8px;
        }
        
        .result-item.correct {
          background: rgba(34, 197, 94, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        
        .result-item.incorrect {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .result-item h5 {
          margin: 0 0 8px 0;
          color: var(--text);
        }
        
        .user-answer {
          margin: 4px 0;
          font-weight: 600;
        }
        
        .correct-answer {
          margin: 4px 0;
          color: #22c55e;
          font-weight: 600;
        }
        
        .explanation {
          margin: 8px 0 0 0;
          color: var(--muted);
          font-style: italic;
        }
        
        .results-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        
        .retry-btn,
        .continue-btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .retry-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border: none;
        }
        
        .continue-btn {
          background: transparent;
          color: var(--accent);
          border: 2px solid var(--accent);
        }
        
        .retry-btn:hover,
        .continue-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(125, 211, 252, 0.3);
        }
        
        @media (max-width: 768px) {
          .learning-platform {
            width: 95vw;
            padding: 20px;
          }
          
          .modules-grid {
            grid-template-columns: 1fr;
          }
          
          .progress-steps {
            flex-direction: column;
          }
          
          .results-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default LearningPlatform;
