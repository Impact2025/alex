import React, { createContext, useContext, useState, useEffect } from 'react';

const PointsContext = createContext();

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within PointsProvider');
  }
  return context;
};

// Level definitions
const LEVELS = [
  { id: 1, name: 'Junior Talent', minPoints: 0, maxPoints: 100, badge: '⚽', color: 'from-gray-400 to-gray-600' },
  { id: 2, name: 'Jeugdspeler', minPoints: 100, maxPoints: 300, badge: '🎯', color: 'from-blue-400 to-blue-600' },
  { id: 3, name: 'Jong Ajax', minPoints: 300, maxPoints: 600, badge: '⚡', color: 'from-purple-400 to-purple-600' },
  { id: 4, name: 'Eerste Elftal', minPoints: 600, maxPoints: 1000, badge: '👕', color: 'from-red-400 to-red-600' },
  { id: 5, name: 'Aanvoerder', minPoints: 1000, maxPoints: 1500, badge: '💪', color: 'from-yellow-400 to-yellow-600' },
  { id: 6, name: 'Ajax Legende', minPoints: 1500, maxPoints: 99999, badge: '🏆', color: 'from-amber-400 to-amber-600' },
];

// Achievement definitions
const ACHIEVEMENTS = {
  early_bird: { id: 'early_bird', name: 'Vroege Vogel', description: 'Voor 20:00 naar bed 5x', icon: '🐦', points: 50, target: 5 },
  cruijff_fan: { id: 'cruijff_fan', name: 'Cruijff Fan', description: 'Alle quotes gelezen', icon: '💬', points: 30, target: 8 },
  reflection_master: { id: 'reflection_master', name: 'Reflectie Meester', description: '10x wedstrijd ritueel', icon: '🎯', points: 100, target: 10 },
  zen_master: { id: 'zen_master', name: 'Zen Master', description: '20x ademhalings-oefening', icon: '🧘', points: 75, target: 20 },
  match_day_hero: { id: 'match_day_hero', name: 'Wedstrijddag Held', description: 'Voltooi 5x wedstrijddag rituelen', icon: '⚽', points: 150, target: 5 },
  perfect_prep: { id: 'perfect_prep', name: 'Perfecte Voorbereiding', description: 'Alle pre-match rituelen 1x', icon: '🏆', points: 200, target: 1 },
  daily_warrior: { id: 'daily_warrior', name: 'Dagelijkse Strijder', description: 'Gebruik app 10 dagen op rij', icon: '💪', points: 100, target: 10 },
  toolbox_master: { id: 'toolbox_master', name: 'Toolbox Master', description: '25x wellness tools gebruikt', icon: '🛠️', points: 125, target: 25 },
  streak_3: { id: 'streak_3', name: 'Warme Start', description: '3 dagen streak', icon: '🔥', points: 25, target: 3 },
  streak_7: { id: 'streak_7', name: 'Week Kampioen', description: '7 dagen streak', icon: '⭐', points: 75, target: 7 },
  streak_14: { id: 'streak_14', name: 'Twee Weken Koning', description: '14 dagen streak', icon: '💎', points: 150, target: 14 },
  streak_30: { id: 'streak_30', name: 'Maand Legende', description: '30 dagen streak', icon: '👑', points: 300, target: 30 },
};

export const PointsProvider = ({ children }) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [activityCounts, setActivityCounts] = useState({
    early_bird: 0,
    quotes_read: 0,
    match_rituals: 0,
    breathing_sessions: 0,
    toolbox_uses: 0,
    perfect_preps: 0,
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState(null);
  const [newLevel, setNewLevel] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ajaxPoints');
    if (saved) {
      const data = JSON.parse(saved);
      setTotalPoints(data.totalPoints || 0);
      setWeeklyPoints(data.weeklyPoints || 0);
      setCurrentStreak(data.currentStreak || 0);
      setUnlockedAchievements(data.unlockedAchievements || []);
      setActivityCounts(data.activityCounts || {
        early_bird: 0,
        quotes_read: 0,
        match_rituals: 0,
        breathing_sessions: 0,
        toolbox_uses: 0,
        perfect_preps: 0,
      });
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const data = {
      totalPoints,
      weeklyPoints,
      currentStreak,
      unlockedAchievements,
      activityCounts,
    };
    localStorage.setItem('ajaxPoints', JSON.stringify(data));
  }, [totalPoints, weeklyPoints, currentStreak, unlockedAchievements, activityCounts]);

  // Get current level
  const getCurrentLevel = () => {
    return LEVELS.find(level => totalPoints >= level.minPoints && totalPoints < level.maxPoints) || LEVELS[LEVELS.length - 1];
  };

  // Get progress to next level
  const getProgressToNextLevel = () => {
    const currentLevel = getCurrentLevel();
    if (currentLevel.id === LEVELS.length) return 100; // Max level
    const pointsInLevel = totalPoints - currentLevel.minPoints;
    const pointsNeeded = currentLevel.maxPoints - currentLevel.minPoints;
    return (pointsInLevel / pointsNeeded) * 100;
  };

  // Add points
  const addPoints = (points, reason = '') => {
    const oldLevel = getCurrentLevel();
    const newTotal = totalPoints + points;

    setTotalPoints(newTotal);
    setWeeklyPoints(prev => prev + points);

    // Check for level up
    const newCurrentLevel = LEVELS.find(level => newTotal >= level.minPoints && newTotal < level.maxPoints) || LEVELS[LEVELS.length - 1];
    if (newCurrentLevel.id > oldLevel.id) {
      setNewLevel(newCurrentLevel);
      setShowLevelUp(true);
    }

    console.log(`+${points} punten! ${reason}`);
  };

  // Track activity
  const trackActivity = (activityType) => {
    setActivityCounts(prev => {
      const newCounts = { ...prev, [activityType]: (prev[activityType] || 0) + 1 };

      // Check achievements
      Object.values(ACHIEVEMENTS).forEach(achievement => {
        if (!unlockedAchievements.includes(achievement.id)) {
          let shouldUnlock = false;

          // Check specific achievement conditions
          if (achievement.id === 'early_bird' && newCounts.early_bird >= achievement.target) shouldUnlock = true;
          if (achievement.id === 'cruijff_fan' && newCounts.quotes_read >= achievement.target) shouldUnlock = true;
          if (achievement.id === 'reflection_master' && newCounts.match_rituals >= achievement.target) shouldUnlock = true;
          if (achievement.id === 'zen_master' && newCounts.breathing_sessions >= achievement.target) shouldUnlock = true;
          if (achievement.id === 'match_day_hero' && newCounts.match_rituals >= achievement.target) shouldUnlock = true;
          if (achievement.id === 'perfect_prep' && newCounts.perfect_preps >= achievement.target) shouldUnlock = true;
          if (achievement.id === 'toolbox_master' && newCounts.toolbox_uses >= achievement.target) shouldUnlock = true;
          if (achievement.id === 'daily_warrior' && currentStreak >= achievement.target) shouldUnlock = true;
          if (achievement.id.startsWith('streak_') && currentStreak >= achievement.target) shouldUnlock = true;

          if (shouldUnlock) {
            unlockAchievement(achievement.id);
          }
        }
      });

      return newCounts;
    });
  };

  // Unlock achievement
  const unlockAchievement = (achievementId) => {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement || unlockedAchievements.includes(achievementId)) return;

    setUnlockedAchievements(prev => [...prev, achievementId]);
    addPoints(achievement.points, `Achievement: ${achievement.name}`);
    setShowAchievement(achievement);
  };

  // Update streak
  const updateStreak = (increment = true) => {
    const newStreak = increment ? currentStreak + 1 : 0;
    setCurrentStreak(newStreak);

    // Check streak achievements
    [3, 7, 14, 30].forEach(days => {
      const achievementId = `streak_${days}`;
      if (newStreak >= days && !unlockedAchievements.includes(achievementId)) {
        unlockAchievement(achievementId);
      }
    });
  };

  const value = {
    totalPoints,
    weeklyPoints,
    currentStreak,
    currentLevel: getCurrentLevel(),
    progressToNextLevel: getProgressToNextLevel(),
    unlockedAchievements,
    activityCounts,
    addPoints,
    trackActivity,
    updateStreak,
    showLevelUp,
    setShowLevelUp,
    showAchievement,
    setShowAchievement,
    newLevel,
    LEVELS,
    ACHIEVEMENTS,
  };

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
};
