'use client';

import React from 'react';

export default function TestDashboard() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center'
      }}>
        🎛️ Визуальная Студия Мониторинга
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        width: '100%'
      }}>
        {/* SLO Widget Demo */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          backdropFilter: 'blur(12px)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>🚦 SLO & Аптайм</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              fontWeight: 'bold'
            }}>
              99.92%
            </div>
            <div>
              <div style={{ color: '#f8fafc', fontWeight: '600' }}>Service Level Objective</div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Цель: 99.9%</div>
            </div>
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#6ee7b7',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            ✅ Здоровое состояние
          </div>
        </div>

        {/* System Health Demo */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          backdropFilter: 'blur(12px)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>🖥️ Здоровье Сервисов</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>CPU</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>62.3%</span>
              </div>
              <div style={{
                height: '6px',
                background: 'rgba(148, 163, 184, 0.2)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: '62%',
                  background: '#10b981',
                  borderRadius: '3px'
                }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>RAM</span>
                <span style={{ color: '#f59e0b', fontWeight: '600' }}>71.5%</span>
              </div>
              <div style={{
                height: '6px',
                background: 'rgba(148, 163, 184, 0.2)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: '71%',
                  background: '#f59e0b',
                  borderRadius: '3px'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Demo */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          backdropFilter: 'blur(12px)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>📊 Трафик Live</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#3b82f6'
            }}>147</div>
            <div>
              <div style={{ color: '#f8fafc', fontWeight: '600' }}>Онлайн сейчас</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: '#10b981',
                fontSize: '0.75rem'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'pulse 2s infinite'
                }}></span>
                Live
              </div>
            </div>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            2,834 сессий сегодня • 3.8% конверсия
          </div>
        </div>

        {/* Errors Demo */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          backdropFilter: 'blur(12px)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>🐛 Ошибки & Performance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#94a3b8' }}>Error Rate</span>
              <span style={{ color: '#10b981', fontWeight: '600' }}>0.24%</span>
            </div>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.625rem',
                  fontWeight: '600'
                }}>ERROR</span>
                <span style={{ color: '#93c5fd', fontSize: '0.75rem', fontFamily: 'monospace' }}>AUTH-401</span>
              </div>
              <div style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>
                Unauthorized on /api/auth
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                32 событий • 25 пользователей
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '3rem',
        textAlign: 'center'
      }}>
        <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
          📡 Real-time обновления каждые 15 секунд
        </div>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: '#93c5fd',
            fontSize: '0.875rem'
          }}>
            /api/systemmetrics ✅
          </div>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: '#93c5fd',
            fontSize: '0.875rem'
          }}>
            /api/metrics/overview ✅
          </div>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: '#93c5fd',
            fontSize: '0.875rem'
          }}>
            /api/events ✅
          </div>
        </div>
        
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          color: '#6ee7b7'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            ✅ Визуальная Студия Мониторинга готова!
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            Полный дашборд: <a href="/dashboard" style={{ color: '#38bdf8' }}>/dashboard</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}