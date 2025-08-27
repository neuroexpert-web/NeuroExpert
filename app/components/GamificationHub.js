'use client';

import { useEffect, useState } from 'react';

export default function GamificationHub() {
  const [userLevel, setUserLevel] = useState(1);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    initializeGamification();
  }, []);

  const initializeGamification = () => {
    // Load user progress
    const savedProgress = localStorage.getItem('user-gamification');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setUserLevel(progress.level || 1);
      setUserPoints(progress.points || 0);
    }

    // Track user actions for points
    trackUserActions();
  };

  const trackUserActions = () => {
    // Award points for completing tasks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-action-btn')) {
        awardPoints(10, 'Быстрое действие выполнено');
      }
      
      if (e.target.classList.contains('task-complete')) {
        awardPoints(25, 'Задача завершена');
      }
    });
  };

  const awardPoints = (points, reason) => {
    setUserPoints(prev => {
      const newPoints = prev + points;
      
      // Check for level up
      const newLevel = Math.floor(newPoints / 100) + 1;
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
        showLevelUpNotification(newLevel);
      }
      
      // Save progress
      localStorage.setItem('user-gamification', JSON.stringify({
        level: newLevel,
        points: newPoints
      }));
      
      // Show points notification
      showPointsNotification(points, reason);
      
      return newPoints;
    });
  };

  const showPointsNotification = (points, reason) => {
    const notification = document.createElement('div');
    notification.className = 'points-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `+${points} очков • ${reason}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const showLevelUpNotification = (level) => {
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 24px 40px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      z-index: 1001;
      text-align: center;
      animation: scaleIn 0.5s ease;
    `;
    notification.innerHTML = `
      <h2 style="margin: 0 0 8px 0; font-size: 24px;">Новый уровень!</h2>
      <p style="margin: 0; font-size: 18px;">Вы достигли уровня ${level}</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'scaleOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  };

  // Update UI with user level and progress
  useEffect(() => {
    const statusBar = document.querySelector('.workspace-statusbar');
    if (statusBar) {
      const progressContainer = statusBar.querySelector('.status-right');
      if (progressContainer && !progressContainer.querySelector('.user-progress')) {
        const progressElement = document.createElement('div');
        progressElement.className = 'status-item user-progress';
        progressElement.innerHTML = `
          <span class="status-icon">🏆</span>
          <span>Уровень ${userLevel}</span>
          <div class="progress-mini" style="margin-left: 8px;">
            <div class="progress-mini-fill" style="width: ${userPoints % 100}%;"></div>
          </div>
        `;
        progressContainer.insertBefore(progressElement, progressContainer.firstChild);
      }
    }
  }, [userLevel, userPoints]);

  return null;
}