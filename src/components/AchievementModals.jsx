import React from 'react';
import { Trophy, Star, Award } from 'lucide-react';

// Level Up Modal
export const LevelUpModal = ({ show, level, onClose }) => {
  if (!show || !level) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full animate-bounce">
        <div className="text-8xl mb-4">{level.badge}</div>
        <h2 className="text-3xl font-bold text-red-600 mb-2">LEVEL UP!</h2>
        <p className="text-2xl font-bold text-gray-800 mb-4">{level.name}</p>
        <div className={`bg-gradient-to-r ${level.color} text-white px-6 py-3 rounded-full font-bold mb-6`}>
          Level {level.id}
        </div>
        <p className="text-gray-600 mb-6">Je bent nu een echte {level.name}!</p>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
        >
          Geweldig! 🎉
        </button>
      </div>
    </div>
  );
};

// Achievement Unlocked Modal
export const AchievementModal = ({ show, achievement, onClose }) => {
  if (!show || !achievement) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full">
        <div className="mb-4">
          <Award className="w-16 h-16 mx-auto text-yellow-500 mb-2" />
          <div className="text-6xl mb-2">{achievement.icon}</div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Achievement Unlocked!</h2>
        <p className="text-xl font-bold text-red-600 mb-2">{achievement.name}</p>
        <p className="text-gray-600 mb-4">{achievement.description}</p>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold mb-6">
          +{achievement.points} punten! 🎯
        </div>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
        >
          Super! 🌟
        </button>
      </div>
    </div>
  );
};

// Points Earned Notification (small toast)
export const PointsToast = ({ points, reason, show, onClose }) => {
  if (!show) return null;

  setTimeout(onClose, 3000); // Auto close after 3s

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce">
      <div className="flex items-center space-x-2">
        <Star className="w-5 h-5" fill="white" />
        <span className="font-bold">+{points} punten!</span>
      </div>
      {reason && <p className="text-xs mt-1">{reason}</p>}
    </div>
  );
};
