'use client';
import { motion } from 'framer-motion';

interface CaseStudy {
  company: string;
  industry: string;
  investment: string;
  results: {
    roi: string;
    timeline: string;
    keyMetrics: string[];
  };
}

const caseStudies: CaseStudy[] = [
  {
    company: "СберМаркет",
    industry: "Розничная торговля",
    investment: "15 млн ₽",
    results: {
      roi: "285%",
      timeline: "18 месяцев",
      keyMetrics: [
        "Конверсия +42%",
        "Средний чек +28%",
        "LTV клиентов +65%"
      ]
    }
  },
  {
    company: "Тинькофф Страхование",
    industry: "Финансовые услуги",
    investment: "25 млн ₽",
    results: {
      roi: "340%",
      timeline: "12 месяцев",
      keyMetrics: [
        "Скорость обработки заявок +300%",
        "Операционные расходы -45%",
        "NPS вырос до 72"
      ]
    }
  },
  {
    company: "Skyeng",
    industry: "Образование",
    investment: "8 млн ₽",
    results: {
      roi: "420%",
      timeline: "24 месяца",
      keyMetrics: [
        "Retention студентов +35%",
        "Автоматизация 80% процессов",
        "CAC снизился на 40%"
      ]
    }
  }
];

export default function ROIExamples() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold mb-4">
            <span style={{
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Реальные результаты наших клиентов
            </span>
          </h3>
          <p className="text-lg text-gray-400">
            Проверенные кейсы цифровой трансформации в России
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.company}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                background: 'rgba(20, 20, 40, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="case-study-card"
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              {/* Градиентный фон */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: `radial-gradient(circle, rgba(${index === 0 ? '16, 185, 129' : index === 1 ? '59, 130, 246' : '168, 85, 247'}, 0.1) 0%, transparent 70%)`,
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h4 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700',
                  color: '#e0e7ff',
                  marginBottom: '8px'
                }}>
                  {study.company}
                </h4>
                <p style={{ 
                  color: '#94a3b8',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  {study.industry}
                </p>

                <div style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <span style={{ color: '#a0a9cc', fontSize: '14px' }}>Инвестиции:</span>
                    <span style={{ color: '#e0e7ff', fontWeight: '600' }}>{study.investment}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <span style={{ color: '#a0a9cc', fontSize: '14px' }}>ROI:</span>
                    <span style={{ 
                      color: '#10b981', 
                      fontWeight: '700',
                      fontSize: '20px'
                    }}>
                      {study.results.roi}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#a0a9cc', fontSize: '14px' }}>Срок:</span>
                    <span style={{ color: '#e0e7ff' }}>{study.results.timeline}</span>
                  </div>
                </div>

                <div>
                  <h5 style={{ 
                    color: '#94a3b8',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px'
                  }}>
                    Ключевые результаты:
                  </h5>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {study.results.keyMetrics.map((metric, idx) => (
                      <li 
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px',
                          color: '#e0e7ff',
                          fontSize: '14px'
                        }}
                      >
                        <span style={{ color: '#10b981', fontSize: '16px' }}>✓</span>
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            marginTop: '48px',
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
            borderRadius: '16px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            textAlign: 'center'
          }}
        >
          <p style={{ color: '#10b981', fontSize: '16px', marginBottom: '8px' }}>
            📊 Средний ROI наших клиентов за 2023-2024 годы
          </p>
          <p style={{ 
            fontSize: '48px', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0'
          }}>
            347%
          </p>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
            на основе 50+ внедренных проектов
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .case-study-card {
            padding: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}