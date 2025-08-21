'use client';

import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconCheck, 
  IconX, 
  IconInfoCircle, 
  IconAlertTriangle,
  IconLoader2 
} from '@tabler/icons-react';

// Кастомные стили для уведомлений
const toastStyles = {
  style: {
    background: 'var(--noir-800, #1a1a1a)',
    color: 'var(--white, #fff)',
    border: '1px solid var(--noir-700, #2a2a2a)',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
  },
  iconTheme: {
    primary: 'var(--gold-500, #fbbf24)',
    secondary: 'var(--noir-900, #0a0a0a)',
  },
};

// Кастомные иконки для разных типов
const customIcons = {
  success: <IconCheck size={20} />,
  error: <IconX size={20} />,
  loading: <IconLoader2 size={20} className="animate-spin" />,
  info: <IconInfoCircle size={20} />,
  warning: <IconAlertTriangle size={20} />,
};

// Функции для показа разных типов уведомлений
export const showNotification = {
  success: (message, options = {}) => {
    toast.success(message, {
      ...toastStyles,
      icon: customIcons.success,
      duration: 4000,
      ...options,
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      ...toastStyles,
      icon: customIcons.error,
      duration: 5000,
      ...options,
    });
  },

  info: (message, options = {}) => {
    toast(message, {
      ...toastStyles,
      icon: customIcons.info,
      duration: 4000,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    toast(message, {
      ...toastStyles,
      icon: customIcons.warning,
      style: {
        ...toastStyles.style,
        borderColor: 'var(--warning, #f59e0b)',
      },
      duration: 4000,
      ...options,
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...toastStyles,
      icon: customIcons.loading,
      ...options,
    });
  },

  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Загрузка...',
        success: messages.success || 'Успешно!',
        error: messages.error || 'Произошла ошибка',
      },
      {
        ...toastStyles,
        ...options,
      }
    );
  },

  custom: (content, options = {}) => {
    toast.custom(
      (t) => (
        <AnimatePresence>
          {t.visible && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="custom-toast"
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      ),
      options
    );
  },
};

// Компонент для отображения уведомлений
export default function NotificationSystem() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerStyle={{
          top: 80,
        }}
        toastOptions={{
          className: 'notification-toast',
          duration: 4000,
          style: toastStyles.style,
        }}
      />
      
      <style jsx global>{`
        .notification-toast {
          font-family: var(--font-inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto);
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .custom-toast {
          background: var(--noir-800, #1a1a1a);
          color: var(--white, #fff);
          border: 1px solid var(--gold-500, #fbbf24);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </>
  );
}

// Хук для использования уведомлений
export function useNotification() {
  return showNotification;
}