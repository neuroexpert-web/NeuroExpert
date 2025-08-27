'use client';

import { useEffect, useState } from 'react';

export default function GamificationHub() {
  const [userStats, setUserStats] = useState({
    level: 1,
    experience: 0,
    achievements: [],
    streak: 0,
    totalTasks: 0,
    weeklyGoals: {
      tasks: { current: 0, target: 20 },
      reports: { current: 0, target: 5 },
      insights: { current: 0, target: 10 }
    }
  });
  
  const [showAchievement, setShowAchievement] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState(null);
  
  useEffect(() => {
    // Load saved stats
    loadUserStats();
    
    // Set up event listeners
    setupEventTracking();
    
    // Initialize progress indicators
    updateProgressUI();
    
    // Check daily streak
    checkDailyStreak();
    
    return () => {
      saveUserStats();
    };
  }, []);
  
  const loadUserStats = () => {
    const saved = localStorage.getItem('gamificationStats');
    if (saved) {
      setUserStats(JSON.parse(saved));
    } else {
      // Initialize new user
      const initialStats = {
        ...userStats,
        joinDate: Date.now(),
        lastActive: Date.now()
      };
      setUserStats(initialStats);
      localStorage.setItem('gamificationStats', JSON.stringify(initialStats));
    }
  };
  
  const saveUserStats = () => {
    localStorage.setItem('gamificationStats', JSON.stringify(userStats));
  };
  
  const setupEventTracking = () => {
    // Track various user actions
    const events = {
      'task-completed': { xp: 10, stat: 'totalTasks' },
      'report-generated': { xp: 25, stat: 'reports' },
      'insight-discovered': { xp: 15, stat: 'insights' },
      'widget-customized': { xp: 5 },
      'data-analyzed': { xp: 20 },
      'goal-achieved': { xp: 50 }
    };
    
    Object.keys(events).forEach(eventName => {
      window.addEventListener(eventName, (e) => {
        const event = events[eventName];
        addExperience(event.xp);
        
        if (event.stat) {
          updateWeeklyGoal(event.stat);
        }
        
        checkAchievements(eventName, e.detail);
      });
    });
  };
  
  const addExperience = (xp) => {
    setUserStats(prev => {
      const newXP = prev.experience + xp;
      const newLevel = calculateLevel(newXP);
      
      if (newLevel > prev.level) {
        showLevelUp(newLevel);
      }
      
      // Show XP gain animation
      showXPGain(xp);
      
      return {
        ...prev,
        experience: newXP,
        level: newLevel
      };
    });
  };
  
  const calculateLevel = (xp) => {
    // Simple level calculation: 100 XP per level with increasing requirements
    return Math.floor(Math.sqrt(xp / 50)) + 1;
  };
  
  const showLevelUp = (newLevel) => {
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
      <div class="level-up-content">
        <div class="level-up-icon">🎉</div>
        <div class="level-up-text">
          <h3>Новый уровень!</h3>
          <p>Вы достигли уровня ${newLevel}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };
  
  const showXPGain = (xp) => {
    const indicator = document.createElement('div');
    indicator.className = 'xp-gain-indicator';
    indicator.textContent = `+${xp} XP`;
    
    // Position near user profile or XP bar
    const profileElement = document.querySelector('.user-profile');
    if (profileElement) {
      const rect = profileElement.getBoundingClientRect();
      indicator.style.left = rect.left + 'px';
      indicator.style.top = rect.bottom + 10 + 'px';
    }
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.classList.add('animate');
    }, 10);
    
    setTimeout(() => {
      indicator.remove();
    }, 2000);
  };
  
  const updateWeeklyGoal = (goalType) => {
    setUserStats(prev => {
      const goals = { ...prev.weeklyGoals };
      
      if (goals[goalType]) {
        goals[goalType].current += 1;
        
        // Check if goal completed
        if (goals[goalType].current === goals[goalType].target) {
          window.dispatchEvent(new CustomEvent('goal-achieved', { 
            detail: { goal: goalType }
          }));
        }
      }
      
      return { ...prev, weeklyGoals: goals };
    });
    
    updateProgressUI();
  };
  
  const checkAchievements = (eventType, details) => {
    const achievements = {
      firstTask: {
        id: 'first-task',
        name: 'Первые шаги',
        description: 'Завершите вашу первую задачу',
        icon: '✅',
        condition: () => userStats.totalTasks === 1
      },
      taskMaster: {
        id: 'task-master',
        name: 'Мастер задач',
        description: 'Завершите 100 задач',
        icon: '🏆',
        condition: () => userStats.totalTasks >= 100
      },
      weekStreak: {
        id: 'week-streak',
        name: 'Недельный марафон',
        description: 'Работайте 7 дней подряд',
        icon: '🔥',
        condition: () => userStats.streak >= 7
      },
      dataExplorer: {
        id: 'data-explorer',
        name: 'Исследователь данных',
        description: 'Проанализируйте данные 50 раз',
        icon: '📊',
        condition: () => eventType === 'data-analyzed' && details?.count >= 50
      },
      nightOwl: {
        id: 'night-owl',
        name: 'Ночная сова',
        description: 'Работайте после полуночи',
        icon: '🦉',
        condition: () => new Date().getHours() >= 0 && new Date().getHours() < 6
      }
    };
    
    Object.values(achievements).forEach(achievement => {
      if (!userStats.achievements.includes(achievement.id) && achievement.condition()) {
        unlockAchievement(achievement);
      }
    });
  };
  
  const unlockAchievement = (achievement) => {
    setUserStats(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievement.id]
    }));
    
    setLatestAchievement(achievement);
    setShowAchievement(true);
    
    // Play sound effect
    playAchievementSound();
    
    // Add bonus XP
    addExperience(50);
    
    // Hide after delay
    setTimeout(() => {
      setShowAchievement(false);
    }, 5000);
  };
  
  const playAchievementSound = () => {
    // Create simple achievement sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };
  
  const checkDailyStreak = () => {
    const lastActive = new Date(userStats.lastActive || Date.now());
    const today = new Date();
    const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Continue streak
      setUserStats(prev => ({
        ...prev,
        streak: prev.streak + 1,
        lastActive: Date.now()
      }));
    } else if (daysDiff > 1) {
      // Break streak
      setUserStats(prev => ({
        ...prev,
        streak: 1,
        lastActive: Date.now()
      }));
    }
  };
  
  const updateProgressUI = () => {
    // Update level progress bar
    const levelProgress = document.querySelector('.level-progress');
    if (levelProgress) {
      const currentLevelXP = Math.pow((userStats.level - 1), 2) * 50;
      const nextLevelXP = Math.pow(userStats.level, 2) * 50;
      const progress = ((userStats.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
      
      levelProgress.style.width = `${Math.min(progress, 100)}%`;
    }
    
    // Update weekly goals
    Object.entries(userStats.weeklyGoals).forEach(([goal, data]) => {
      const progressElement = document.querySelector(`.goal-${goal} .progress-bar`);
      if (progressElement) {
        const progress = (data.current / data.target) * 100;
        progressElement.style.width = `${Math.min(progress, 100)}%`;
      }
    });
  };
  
  // Add gamification UI elements
  useEffect(() => {
    // Add level indicator to user profile
    const userProfile = document.querySelector('.user-info');
    if (userProfile && !document.querySelector('.user-level')) {
      const levelBadge = document.createElement('div');
      levelBadge.className = 'user-level';
      levelBadge.innerHTML = `
        <span class="level-label">Ур.</span>
        <span class="level-number">${userStats.level}</span>
      `;
      userProfile.appendChild(levelBadge);
    }
    
    // Add progress bar
    const header = document.querySelector('.workspace-header');
    if (header && !document.querySelector('.gamification-progress')) {
      const progressBar = document.createElement('div');
      progressBar.className = 'gamification-progress';
      progressBar.innerHTML = `
        <div class="level-progress-container">
          <div class="level-progress"></div>
        </div>
      `;
      header.appendChild(progressBar);
    }
    
    // Update UI
    updateProgressUI();
  }, [userStats]);
  
  // Render achievement popup
  useEffect(() => {
    if (showAchievement && latestAchievement) {
      const popup = document.createElement('div');
      popup.className = 'achievement-popup';
      popup.innerHTML = `
        <div class="achievement-content">
          <div class="achievement-icon">${latestAchievement.icon}</div>
          <div class="achievement-info">
            <h4>Достижение разблокировано!</h4>
            <p class="achievement-name">${latestAchievement.name}</p>
            <p class="achievement-desc">${latestAchievement.description}</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(popup);
      
      setTimeout(() => {
        popup.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
      }, 4500);
    }
  }, [showAchievement, latestAchievement]);
  
  // Add CSS for gamification elements
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .user-level {
        display: flex;
        align-items: center;
        gap: 4px;
        background: var(--workspace-accent);
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        color: white;
        margin-top: 4px;
      }
      
      .gamification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.1);
      }
      
      .level-progress {
        height: 100%;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        transition: width 0.3s ease;
      }
      
      .xp-gain-indicator {
        position: fixed;
        font-size: 16px;
        font-weight: 600;
        color: #10b981;
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
        transform: translateY(0);
        transition: all 0.5s ease;
      }
      
      .xp-gain-indicator.animate {
        opacity: 1;
        transform: translateY(-30px);
      }
      
      .achievement-popup {
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--workspace-glass);
        backdrop-filter: blur(20px);
        border: 1px solid var(--workspace-glass-border);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 1000;
      }
      
      .achievement-popup.show {
        transform: translateX(0);
      }
      
      .achievement-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      
      .achievement-icon {
        font-size: 48px;
      }
      
      .achievement-info h4 {
        margin: 0 0 4px 0;
        color: var(--workspace-accent);
      }
      
      .achievement-name {
        font-weight: 600;
        margin: 0 0 4px 0;
      }
      
      .achievement-desc {
        margin: 0;
        font-size: 14px;
        color: var(--workspace-text-secondary);
      }
      
      .level-up-notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: var(--workspace-glass);
        backdrop-filter: blur(20px);
        border: 2px solid var(--workspace-accent);
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        transition: transform 0.3s ease;
        z-index: 1001;
      }
      
      .level-up-notification.show {
        transform: translate(-50%, -50%) scale(1);
      }
      
      .level-up-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }
      
      .level-up-text h3 {
        margin: 0 0 8px 0;
        font-size: 24px;
        color: var(--workspace-accent);
      }
      
      .level-up-text p {
        margin: 0;
        font-size: 18px;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null; // This component manages gamification, no UI
}