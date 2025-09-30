'use client';

import { useEffect, useState } from 'react';

export default function GamificationHub() {
  const [userStats, setUserStats] = useState({
    level: 1,
    experience: 0,
    achievements: [],
    streak: 0,
    totalPoints: 0,
    rank: 'Новичок'
  });
  
  const [activeQuests, setActiveQuests] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Initialize gamification system
    initializeGamification();
    
    // Load user progress
    loadUserProgress();
    
    // Set up achievement tracking
    setupAchievementTracking();
    
    // Initialize daily quests
    initializeDailyQuests();
    
    // Update leaderboard
    updateLeaderboard();
  }, []);

  // Initialize gamification
  const initializeGamification = () => {
    console.log('Initializing Gamification Hub...');
    
    // Add gamification UI elements
    addProgressBar();
    addLevelIndicator();
    addStreakCounter();
    
    // Start tracking user actions
    trackUserActions();
  };

  // Load user progress
  const loadUserProgress = () => {
    const savedProgress = localStorage.getItem('gamification-progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setUserStats(progress);
      updateUI(progress);
    }
  };

  // Save user progress
  const saveUserProgress = (stats) => {
    localStorage.setItem('gamification-progress', JSON.stringify(stats));
  };

  // Add progress bar to header
  const addProgressBar = () => {
    const header = document.querySelector('.workspace-header');
    if (!header) return;
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'user-progress-container';
    progressContainer.innerHTML = `
      <div class="progress-info">
        <span class="user-level">Уровень <span class="level-number">1</span></span>
        <span class="user-exp">0 / 100 XP</span>
      </div>
      <div class="progress-bar-wrapper">
        <div class="progress-bar-fill" style="width: 0%"></div>
      </div>
    `;
    
    // Insert after user profile
    const userProfile = header.querySelector('.user-profile');
    if (userProfile) {
      userProfile.parentNode.insertBefore(progressContainer, userProfile);
    }
  };

  // Add level indicator
  const addLevelIndicator = () => {
    const userAvatar = document.querySelector('.user-avatar');
    if (!userAvatar) return;
    
    const levelBadge = document.createElement('div');
    levelBadge.className = 'level-badge';
    levelBadge.textContent = '1';
    userAvatar.appendChild(levelBadge);
  };

  // Add streak counter
  const addStreakCounter = () => {
    const statusBar = document.querySelector('.status-left');
    if (!statusBar) return;
    
    const streakElement = document.createElement('div');
    streakElement.className = 'status-item streak-counter';
    streakElement.innerHTML = `
      <svg class="status-icon" viewBox="0 0 16 16">
        <path d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" fill="currentColor"/>
      </svg>
      <span class="streak-days">0</span> дней подряд
    `;
    
    statusBar.appendChild(streakElement);
  };

  // Track user actions for points
  const trackUserActions = () => {
    // Track widget interactions
    document.addEventListener('click', (e) => {
      if (e.target.closest('.widget')) {
        awardPoints('widget_interaction', 5);
      }
      
      if (e.target.closest('.quick-action-btn')) {
        awardPoints('quick_action', 10);
      }
      
      if (e.target.closest('.nav-item')) {
        awardPoints('navigation', 3);
      }
    });
    
    // Track task completion
    trackTaskCompletion();
    
    // Track time spent
    trackActiveTime();
  };

  // Award points and check achievements
  const awardPoints = (action, points) => {
    setUserStats(prev => {
      const newStats = {
        ...prev,
        experience: prev.experience + points,
        totalPoints: prev.totalPoints + points
      };
      
      // Check for level up
      const requiredXP = newStats.level * 100;
      if (newStats.experience >= requiredXP) {
        newStats.level += 1;
        newStats.experience -= requiredXP;
        newStats.rank = getRankByLevel(newStats.level);
        
        // Show level up notification
        showLevelUpNotification(newStats.level);
        
        // Unlock new features
        unlockFeatures(newStats.level);
      }
      
      // Update UI
      updateUI(newStats);
      
      // Save progress
      saveUserProgress(newStats);
      
      // Check achievements
      checkAchievements(action, newStats);
      
      return newStats;
    });
    
    // Show points animation
    showPointsAnimation(points);
  };

  // Get rank by level
  const getRankByLevel = (level) => {
    if (level < 5) return 'Новичок';
    if (level < 10) return 'Специалист';
    if (level < 20) return 'Эксперт';
    if (level < 30) return 'Мастер';
    if (level < 50) return 'Гуру';
    return 'Легенда';
  };

  // Update UI with current stats
  const updateUI = (stats) => {
    // Update level
    const levelNumber = document.querySelector('.level-number');
    if (levelNumber) levelNumber.textContent = stats.level;
    
    const levelBadge = document.querySelector('.level-badge');
    if (levelBadge) levelBadge.textContent = stats.level;
    
    // Update experience
    const expText = document.querySelector('.user-exp');
    const requiredXP = stats.level * 100;
    if (expText) expText.textContent = `${stats.experience} / ${requiredXP} XP`;
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar-fill');
    const progress = (stats.experience / requiredXP) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;
    
    // Update streak
    const streakDays = document.querySelector('.streak-days');
    if (streakDays) streakDays.textContent = stats.streak;
    
    // Update rank in profile
    const userRole = document.querySelector('.user-role');
    if (userRole) userRole.textContent = stats.rank;
  };

  // Show level up notification
  const showLevelUpNotification = (level) => {
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
      <div class="level-up-content">
        <div class="level-up-icon">🎉</div>
        <h3>Поздравляем!</h3>
        <p>Вы достигли уровня ${level}</p>
        <div class="level-up-rewards">
          <div class="reward-item">
            <span class="reward-icon">🏆</span>
            <span>Новое достижение разблокировано</span>
          </div>
          <div class="reward-item">
            <span class="reward-icon">✨</span>
            <span>+50 бонусных очков</span>
          </div>
        </div>
        <button class="level-up-continue">Продолжить</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Close button
    notification.querySelector('.level-up-continue').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
    
    // Award bonus points
    awardPoints('level_up_bonus', 50);
  };

  // Show points animation
  const showPointsAnimation = (points) => {
    const animation = document.createElement('div');
    animation.className = 'points-animation';
    animation.textContent = `+${points} XP`;
    
    // Position near cursor or center
    animation.style.left = '50%';
    animation.style.top = '50%';
    
    document.body.appendChild(animation);
    
    // Animate
    setTimeout(() => {
      animation.style.transform = 'translate(-50%, -50%) translateY(-50px)';
      animation.style.opacity = '0';
    }, 100);
    
    // Remove
    setTimeout(() => animation.remove(), 1000);
  };

  // Setup achievement tracking
  const setupAchievementTracking = () => {
    const achievements = [
      {
        id: 'first_login',
        name: 'Первый вход',
        description: 'Войдите в систему впервые',
        icon: '👋',
        points: 10,
        condition: (stats) => true
      },
      {
        id: 'week_streak',
        name: 'Недельная серия',
        description: 'Используйте платформу 7 дней подряд',
        icon: '🔥',
        points: 50,
        condition: (stats) => stats.streak >= 7
      },
      {
        id: 'data_explorer',
        name: 'Исследователь данных',
        description: 'Просмотрите все разделы аналитики',
        icon: '📊',
        points: 30,
        condition: (stats) => stats.sectionsViewed >= 5
      },
      {
        id: 'task_master',
        name: 'Мастер задач',
        description: 'Выполните 100 задач',
        icon: '✅',
        points: 100,
        condition: (stats) => stats.tasksCompleted >= 100
      },
      {
        id: 'power_user',
        name: 'Опытный пользователь',
        description: 'Достигните 10 уровня',
        icon: '💪',
        points: 200,
        condition: (stats) => stats.level >= 10
      }
    ];
    
    // Store achievements
    window.achievements = achievements;
  };

  // Check achievements
  const checkAchievements = (action, stats) => {
    if (!window.achievements) return;
    
    window.achievements.forEach(achievement => {
      // Skip if already earned
      if (stats.achievements?.includes(achievement.id)) return;
      
      // Check condition
      if (achievement.condition(stats)) {
        // Award achievement
        earnAchievement(achievement);
      }
    });
  };

  // Earn achievement
  const earnAchievement = (achievement) => {
    setUserStats(prev => ({
      ...prev,
      achievements: [...(prev.achievements || []), achievement.id],
      totalPoints: prev.totalPoints + achievement.points
    }));
    
    // Show achievement notification
    showAchievementNotification(achievement);
    
    // Add to recent achievements
    setRecentAchievements(prev => [achievement, ...prev.slice(0, 4)]);
  };

  // Show achievement notification
  const showAchievementNotification = (achievement) => {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-info">
        <h4>Достижение получено!</h4>
        <p>${achievement.name}</p>
        <span class="achievement-points">+${achievement.points} очков</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  };

  // Initialize daily quests
  const initializeDailyQuests = () => {
    const today = new Date().toDateString();
    const savedQuests = localStorage.getItem('daily-quests');
    
    if (savedQuests) {
      const { date, quests } = JSON.parse(savedQuests);
      if (date === today) {
        setActiveQuests(quests);
        return;
      }
    }
    
    // Generate new daily quests
    const newQuests = [
      {
        id: 'daily_analytics',
        title: 'Проверьте аналитику',
        description: 'Просмотрите основные показатели за день',
        progress: 0,
        target: 1,
        reward: 20,
        icon: '📈'
      },
      {
        id: 'complete_tasks',
        title: 'Выполните 5 задач',
        description: 'Закройте любые 5 задач из списка',
        progress: 0,
        target: 5,
        reward: 30,
        icon: '✔️'
      },
      {
        id: 'team_interaction',
        title: 'Командное взаимодействие',
        description: 'Отправьте сообщение или комментарий',
        progress: 0,
        target: 3,
        reward: 15,
        icon: '💬'
      }
    ];
    
    setActiveQuests(newQuests);
    localStorage.setItem('daily-quests', JSON.stringify({
      date: today,
      quests: newQuests
    }));
  };

  // Track task completion
  const trackTaskCompletion = () => {
    // Listen for task completion events
    document.addEventListener('task-completed', (e) => {
      awardPoints('task_completion', 15);
      
      // Update daily quest progress
      updateQuestProgress('complete_tasks', 1);
      
      // Update stats
      setUserStats(prev => ({
        ...prev,
        tasksCompleted: (prev.tasksCompleted || 0) + 1
      }));
    });
  };

  // Update quest progress
  const updateQuestProgress = (questId, increment = 1) => {
    setActiveQuests(prev => {
      const updated = prev.map(quest => {
        if (quest.id === questId && quest.progress < quest.target) {
          const newProgress = Math.min(quest.progress + increment, quest.target);
          
          // Check if completed
          if (newProgress === quest.target) {
            awardPoints('quest_completion', quest.reward);
            showQuestCompletedNotification(quest);
          }
          
          return { ...quest, progress: newProgress };
        }
        return quest;
      });
      
      // Save updated quests
      const today = new Date().toDateString();
      localStorage.setItem('daily-quests', JSON.stringify({
        date: today,
        quests: updated
      }));
      
      return updated;
    });
  };

  // Show quest completed notification
  const showQuestCompletedNotification = (quest) => {
    const notification = document.createElement('div');
    notification.className = 'quest-completed-notification';
    notification.innerHTML = `
      <div class="quest-icon">${quest.icon}</div>
      <div class="quest-info">
        <h4>Задание выполнено!</h4>
        <p>${quest.title}</p>
        <span class="quest-reward">+${quest.reward} XP</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  // Track active time
  const trackActiveTime = () => {
    let activeTime = 0;
    let lastActivity = Date.now();
    
    // Update active time every minute
    setInterval(() => {
      const now = Date.now();
      if (now - lastActivity < 60000) { // Active in last minute
        activeTime++;
        
        // Award points for active time milestones
        if (activeTime === 30) awardPoints('active_30min', 25);
        if (activeTime === 60) awardPoints('active_1hour', 50);
        if (activeTime === 120) awardPoints('active_2hours', 100);
      }
    }, 60000);
    
    // Reset on activity
    document.addEventListener('click', () => {
      lastActivity = Date.now();
    });
    
    document.addEventListener('keypress', () => {
      lastActivity = Date.now();
    });
  };

  // Update leaderboard
  const updateLeaderboard = () => {
    // Simulated leaderboard data
    const leaderboardData = [
      { name: 'Александр К.', level: 42, points: 15420, avatar: 'AK' },
      { name: 'Мария С.', level: 38, points: 14200, avatar: 'MC' },
      { name: 'Дмитрий П.', level: 35, points: 13100, avatar: 'ДП' },
      { name: 'Вы', level: userStats.level, points: userStats.totalPoints, avatar: 'ME', isCurrentUser: true },
      { name: 'Елена В.', level: 28, points: 10500, avatar: 'ЕВ' },
    ];
    
    // Sort by points
    leaderboardData.sort((a, b) => b.points - a.points);
    
    setLeaderboard(leaderboardData);
  };

  // Unlock features based on level
  const unlockFeatures = (level) => {
    const unlocks = {
      5: { feature: 'custom_dashboard', name: 'Настройка дашборда' },
      10: { feature: 'advanced_analytics', name: 'Расширенная аналитика' },
      15: { feature: 'ai_assistant', name: 'AI-ассистент' },
      20: { feature: 'team_collaboration', name: 'Командные функции' },
      25: { feature: 'api_access', name: 'API доступ' }
    };
    
    if (unlocks[level]) {
      showFeatureUnlockNotification(unlocks[level]);
    }
  };

  // Show feature unlock notification
  const showFeatureUnlockNotification = (feature) => {
    const notification = document.createElement('div');
    notification.className = 'feature-unlock-notification';
    notification.innerHTML = `
      <div class="unlock-icon">🔓</div>
      <div class="unlock-info">
        <h4>Новая функция разблокирована!</h4>
        <p>${feature.name}</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  };

  // Add gamification styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Progress Container */
      .user-progress-container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-right: 20px;
        min-width: 200px;
      }
      
      .progress-info {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--color-text-secondary);
      }
      
      .user-level {
        font-weight: 600;
        color: var(--gradient-cta-start);
      }
      
      .progress-bar-wrapper {
        height: 6px;
        background: var(--ws-bg-tertiary);
        border-radius: 3px;
        overflow: hidden;
      }
      
      .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--gradient-cta-start), var(--gradient-cta-end));
        transition: width 0.5s ease;
      }
      
      /* Level Badge */
      .level-badge {
        position: absolute;
        bottom: -4px;
        right: -4px;
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, gold, orange);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      
      /* Streak Counter */
      .streak-counter {
        color: #f59e0b;
      }
      
      /* Points Animation */
      .points-animation {
        position: fixed;
        font-size: 18px;
        font-weight: bold;
        color: var(--gradient-cta-start);
        pointer-events: none;
        z-index: 1000;
        transition: all 1s ease-out;
      }
      
      /* Level Up Notification */
      .level-up-notification {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .level-up-notification.show {
        opacity: 1;
      }
      
      .level-up-content {
        background: var(--ws-surface-glass);
        backdrop-filter: blur(20px);
        border: 2px solid var(--gradient-cta-start);
        border-radius: 16px;
        padding: 40px;
        text-align: center;
        max-width: 400px;
        transform: scale(0.9);
        transition: transform 0.3s ease;
      }
      
      .level-up-notification.show .level-up-content {
        transform: scale(1);
      }
      
      .level-up-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }
      
      .level-up-content h3 {
        font-size: 24px;
        margin-bottom: 8px;
        color: var(--color-text-light);
      }
      
      .level-up-content p {
        font-size: 18px;
        color: var(--gradient-cta-start);
        margin-bottom: 24px;
      }
      
      .level-up-rewards {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;
      }
      
      .reward-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--ws-bg-tertiary);
        border-radius: 8px;
      }
      
      .reward-icon {
        font-size: 24px;
      }
      
      .level-up-continue {
        padding: 12px 32px;
        background: linear-gradient(135deg, var(--gradient-cta-start), var(--gradient-cta-end));
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .level-up-continue:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(138, 43, 226, 0.4);
      }
      
      /* Achievement Notification */
      .achievement-notification {
        position: fixed;
        top: 80px;
        right: -400px;
        background: var(--ws-surface-glass);
        backdrop-filter: blur(20px);
        border: 1px solid var(--gradient-cta-start);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: var(--ws-shadow-lg);
        transition: right 0.3s ease;
        z-index: 1000;
      }
      
      .achievement-notification.show {
        right: 20px;
      }
      
      .achievement-icon {
        font-size: 36px;
      }
      
      .achievement-info h4 {
        font-size: 14px;
        color: var(--color-text-light);
        margin-bottom: 4px;
      }
      
      .achievement-info p {
        font-size: 16px;
        font-weight: 600;
        color: var(--gradient-cta-start);
        margin-bottom: 4px;
      }
      
      .achievement-points {
        font-size: 12px;
        color: var(--color-text-secondary);
      }
      
      /* Quest Notification */
      .quest-completed-notification {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--ws-surface-glass);
        backdrop-filter: blur(20px);
        border: 1px solid var(--ws-metric-positive);
        border-radius: 12px;
        padding: 16px 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: var(--ws-shadow-lg);
        transition: transform 0.3s ease;
        z-index: 1000;
      }
      
      .quest-completed-notification.show {
        transform: translateX(-50%) translateY(0);
      }
      
      .quest-icon {
        font-size: 28px;
      }
      
      .quest-info h4 {
        font-size: 14px;
        color: var(--ws-metric-positive);
        margin-bottom: 2px;
      }
      
      .quest-info p {
        font-size: 14px;
        color: var(--color-text-light);
        margin-bottom: 2px;
      }
      
      .quest-reward {
        font-size: 12px;
        color: var(--color-text-secondary);
      }
      
      /* Feature Unlock */
      .feature-unlock-notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: var(--ws-surface-glass);
        backdrop-filter: blur(20px);
        border: 2px solid var(--gradient-cta-end);
        border-radius: 16px;
        padding: 32px;
        text-align: center;
        box-shadow: var(--ws-shadow-lg);
        transition: transform 0.3s ease;
        z-index: 1500;
      }
      
      .feature-unlock-notification.show {
        transform: translate(-50%, -50%) scale(1);
      }
      
      .unlock-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }
      
      .unlock-info h4 {
        font-size: 18px;
        color: var(--gradient-cta-end);
        margin-bottom: 8px;
      }
      
      .unlock-info p {
        font-size: 16px;
        color: var(--color-text-light);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null; // This component manages behavior, not UI
}