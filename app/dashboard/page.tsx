'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import type { UserRole } from '@/types/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole>('Admin');
  const [loading, setLoading] = useState(false); // Убираем загрузку для демо
  const [authenticated, setAuthenticated] = useState(true); // Сразу авторизуем для демо

  // Для демо убираем сложную аутентификацию
  // В реальной системе здесь будет проверка JWT токена
  useEffect(() => {
    // Просто устанавливаем роль Admin для демо
    setUserRole('Admin');
    setAuthenticated(true);
  }, []);

  // Показ загрузки
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(148, 163, 184, 0.2)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <div>Загрузка дашборда...</div>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Показ дашборда
  if (authenticated) {
    return (
      <DashboardLayout 
        userRole={userRole}
        initialFilters={{
          env: 'prod',
          liveMode: true
        }}
      />
    );
  }

  // Редирект на логин если не авторизован
  return null;
}