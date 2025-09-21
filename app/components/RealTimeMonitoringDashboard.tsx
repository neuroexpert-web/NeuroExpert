'use client';

/**
 * Real-Time Monitoring Dashboard v3.2
 * Система мониторинга в реальном времени для NeuroExpert
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Real-time data interfaces
interface RealTimeMetrics {
  activeUsers: number;
  pageViews: number;
  conversions: number;
  revenue: number;
  avgLoadTime: number;
  errorRate: number;
  timestamp: number;
}

interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface UserActivity {
  id: string;
  action: string;
  page: string;
  timestamp: number;
  userAgent: string;
  location: string;
}

// Main Dashboard Component
export const RealTimeMonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [alerts, setAlerts] = useState<Array<{id: string; type: string; message: string; severity: 'low' | 'medium' | 'high'}>>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
      
      ws.onopen = () => {
        setIsConnected(true);
        console.log('Real-time monitoring connected');
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'metrics':
            setMetrics(prev => [...prev.slice(-99), data.payload]);
            break;
          case 'system_health':
            setSystemHealth(data.payload);
            break;
          case 'user_activity':
            setUserActivities(prev => [data.payload, ...prev.slice(0, 49)]);
            break;
          case 'alert':
            setAlerts(prev => [data.payload, ...prev.slice(0, 9)]);
            break;
        }
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        console.log('Real-time monitoring disconnected');
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      wsRef.current = ws;
    };
    
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Generate mock data for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newMetric: RealTimeMetrics = {
        activeUsers: Math.floor(Math.random() * 500) + 100,
        pageViews: Math.floor(Math.random() * 1000) + 200,
        conversions: Math.floor(Math.random() * 50) + 5,
        revenue: Math.random() * 10000 + 1000,
        avgLoadTime: Math.random() * 2000 + 500,
        errorRate: Math.random() * 5,
        timestamp: now
      };
      
      setMetrics(prev => [...prev.slice(-99), newMetric]);
      
      // Mock system health
      setSystemHealth({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: Math.random() * 100,
        status: Math.random() > 0.8 ? 'warning' : 'healthy'
      });
      
      // Mock user activity
      if (Math.random() > 0.7) {
        const activity: UserActivity = {
          id: Math.random().toString(36).substr(2, 9),
          action: ['page_view', 'click', 'form_submit', 'download'][Math.floor(Math.random() * 4)],
          page: ['/', '/analytics', '/pricing', '/contact'][Math.floor(Math.random() * 4)],
          timestamp: now,
          userAgent: 'Chrome/120.0.0.0',
          location: ['Moscow', 'SPb', 'Kiev', 'Minsk'][Math.floor(Math.random() * 4)]
        };
        
        setUserActivities(prev => [activity, ...prev.slice(0, 49)]);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Chart data preparation
  const chartData = useMemo(() => {
    const last20Metrics = metrics.slice(-20);
    
    return {
      labels: last20Metrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
      datasets: [
        {
          label: 'Активные пользователи',
          data: last20Metrics.map(m => m.activeUsers),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Просмотры страниц',
          data: last20Metrics.map(m => m.pageViews),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }, [metrics]);

  const currentMetrics = metrics[metrics.length - 1];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Real-Time Мониторинг
            </h1>
            <p className="text-gray-400 mt-1">Система мониторинга NeuroExpert v3.2</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <motion.div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                isConnected ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
              }`}
              animate={{ scale: isConnected ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: isConnected ? Infinity : 0 }}
            >
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm font-medium">
                {isConnected ? 'Подключено' : 'Отключено'}
              </span>
            </motion.div>
            
            {/* Time Range Selector */}
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="1h">1 час</option>
              <option value="6h">6 часов</option>
              <option value="24h">24 часа</option>
              <option value="7d">7 дней</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      {currentMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Активные пользователи"
            value={currentMetrics.activeUsers}
            change={metrics.length > 1 ? currentMetrics.activeUsers - metrics[metrics.length - 2].activeUsers : 0}
            icon="👥"
            color="blue"
          />
          
          <MetricCard
            title="Просмотры страниц"
            value={currentMetrics.pageViews}
            change={metrics.length > 1 ? currentMetrics.pageViews - metrics[metrics.length - 2].pageViews : 0}
            icon="📊"
            color="green"
          />
          
          <MetricCard
            title="Конверсии"
            value={currentMetrics.conversions}
            change={metrics.length > 1 ? currentMetrics.conversions - metrics[metrics.length - 2].conversions : 0}
            icon="🎯"
            color="purple"
          />
          
          <MetricCard
            title="Выручка"
            value={`₽${currentMetrics.revenue.toLocaleString()}`}
            change={metrics.length > 1 ? currentMetrics.revenue - metrics[metrics.length - 2].revenue : 0}
            icon="💰"
            color="yellow"
            prefix="₽"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Chart */}
        <div className="lg:col-span-2">
          <motion.div
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-4">Активность в реальном времени</h3>
            <div className="h-80">
              {metrics.length > 0 && (
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: 'white' }
                      }
                    },
                    scales: {
                      x: {
                        ticks: { color: 'white' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                      },
                      y: {
                        ticks: { color: 'white' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                      }
                    }
                  }}
                />
              )}
            </div>
          </motion.div>
        </div>

        {/* System Health */}
        <div className="space-y-6">
          {systemHealth && (
            <motion.div
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4">Состояние системы</h3>
              <div className="space-y-4">
                <SystemHealthBar label="CPU" value={systemHealth.cpu} />
                <SystemHealthBar label="Память" value={systemHealth.memory} />
                <SystemHealthBar label="Диск" value={systemHealth.disk} />
                <SystemHealthBar label="Сеть" value={systemHealth.network} />
              </div>
              
              <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
                systemHealth.status === 'healthy' ? 'bg-green-900/30 text-green-400' :
                systemHealth.status === 'warning' ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-red-900/30 text-red-400'
              }`}>
                {systemHealth.status === 'healthy' ? '✅ Система работает нормально' :
                 systemHealth.status === 'warning' ? '⚠️ Предупреждение' :
                 '🚨 Критическое состояние'}
              </div>
            </motion.div>
          )}

          {/* Recent Alerts */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">Последние уведомления</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'high' ? 'border-red-500 bg-red-900/20' :
                      alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-900/20' :
                      'border-blue-500 bg-blue-900/20'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="text-sm font-medium">{alert.type}</div>
                    <div className="text-xs text-gray-400 mt-1">{alert.message}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {alerts.length === 0 && (
                <div className="text-gray-400 text-center py-4">
                  Нет активных уведомлений
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* User Activity Stream */}
      <motion.div
        className="mt-6 bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-4">Активность пользователей</h3>
        <div className="overflow-x-auto">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {userActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-gray-400">на {activity.page}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <span>{activity.location}</span>
                    <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: number | string;
  change: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  prefix?: string;
}> = ({ title, value, change, icon, color, prefix = '' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600'
  };

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        
        {change !== 0 && (
          <div className={`text-sm font-medium ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? '↗' : '↘'} {prefix}{Math.abs(change).toLocaleString()}
          </div>
        )}
      </div>
      
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </motion.div>
  );
};

// System Health Bar Component
const SystemHealthBar: React.FC<{
  label: string;
  value: number;
}> = ({ label, value }) => {
  const getColor = (val: number) => {
    if (val < 60) return 'bg-green-500';
    if (val < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${getColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default RealTimeMonitoringDashboard;