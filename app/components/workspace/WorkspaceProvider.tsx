'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WorkspaceContextType {
  addNotification: (notification: any) => void;
  userProfile: any;
  notifications: any[];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

interface WorkspaceProviderProps {
  children: React.ReactNode;
}

export default function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userProfile] = useState({
    name: 'Admin',
    avatar: '👤',
    role: 'Administrator'
  });

  const addNotification = (notification: any) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, newNotification]);

    // Автоудаление через 5 секунд
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const value = {
    addNotification,
    userProfile,
    notifications
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}