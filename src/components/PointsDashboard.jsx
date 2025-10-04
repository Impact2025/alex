import React from 'react';
import { Trophy, Star, Award, TrendingUp, Target, Zap, Home } from 'lucide-react';
import { usePoints } from '../PointsContext';

const PointsDashboard = ({ onBack }) => {
  const {
    totalPoints,
    weeklyPoints,
    currentStreak,
    currentLevel,
    progressToNextLevel,
    unlockedAchievements,
    LEVELS,
    ACHIEVEMENTS
  } = usePoints();

  const nextLevel = LEVELS.find(l => l.id === currentLevel.id + 1);

  return (
    <div className="bg-gradient-to-b from-red-700 to-red-900 min-h-screen text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="bg-white bg-opacity-20 p-2 rounded-full">
            <Home className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Mijn Punten</h1>
          <div className="w-10"></div>
        </div>

        {/* Current Level Card */}
        <div className="bg-white text-gray-800 rounded-3xl p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Huidige Level</p>
              <h2 className="text-2xl font-bold">{currentLevel.name}</h2>
            </div>
            <div className={`text-6xl bg-gradient-to-br ${currentLevel.color} w-20 h-20 rounded-full flex items-center justify-center`}>
              {currentLevel.badge}
            </div>
          </div>

          {/* Progress Bar */}
          {nextLevel && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">Voortgang naar {nextLevel.name}</span>
                <span className="text-gray-600">{Math.round(progressToNextLevel)}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${nextLevel.color} h-full transition-all duration-500`}
                  style={{ width: `${progressToNextLevel}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {nextLevel.minPoints - totalPoints} punten tot volgende level
              </p>
            </div>
          )}

          {!nextLevel && (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold">Maximum Level Bereikt!</p>
              <p className="text-sm">Je bent een echte Ajax Legende! 🏆</p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalPoints}</p>
            <p className="text-xs opacity-75">Totaal</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{weeklyPoints}</p>
            <p className="text-xs opacity-75">Deze Week</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center">
            <Zap className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{currentStreak}</p>
            <p className="text-xs opacity-75">Streak</p>
          </div>
        </div>

        {/* All Levels Overview */}
        <div className="bg-white text-gray-800 rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-red-600" />
            Alle Levels
          </h3>
          <div className="space-y-3">
            {LEVELS.map(level => {
              const isUnlocked = totalPoints >= level.minPoints;
              const isCurrent = level.id === currentLevel.id;

              return (
                <div
                  key={level.id}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    isCurrent ? 'bg-red-100 border-2 border-red-500' :
                    isUnlocked ? 'bg-green-50' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-3xl ${!isUnlocked && 'grayscale opacity-50'}`}>
                      {level.badge}
                    </div>
                    <div>
                      <p className={`font-bold ${isCurrent && 'text-red-600'}`}>
                        {level.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {level.minPoints} - {level.maxPoints === 99999 ? '∞' : level.maxPoints} punten
                      </p>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Huidig
                    </span>
                  )}
                  {isUnlocked && !isCurrent && (
                    <span className="text-green-600">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white text-gray-800 rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-red-600" />
            Achievements ({unlockedAchievements.length}/{Object.keys(ACHIEVEMENTS).length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(ACHIEVEMENTS).map(achievement => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);

              return (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-xl text-center ${
                    isUnlocked ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100'
                  }`}
                >
                  <div className={`text-3xl mb-1 ${!isUnlocked && 'grayscale opacity-40'}`}>
                    {achievement.icon}
                  </div>
                  <p className={`text-xs font-bold mb-1 ${!isUnlocked && 'text-gray-400'}`}>
                    {achievement.name}
                  </p>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                  {isUnlocked && (
                    <div className="mt-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Behaald! +{achievement.points}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsDashboard;
