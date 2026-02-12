import React from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Zap,
  Brain,
  Wind,
  Moon,
  BookOpen,
  Trophy,
  Calendar,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';

const WellnessHome = ({ user, onSelectActivity, onNavigate, levelInfo, stats }) => {
  const activities = [
    {
      id: 'morning-checkin',
      name: 'Goedemorgen Start',
      description: 'Begin je dag met positieve energie',
      icon: Sun,
      color: 'from-yellow-400 to-orange-500',
      points: 20,
      completed: stats?.morningCheckinToday || false
    },
    {
      id: 'daily-challenge',
      name: 'Dagelijkse Uitdaging',
      description: 'Vandaag: 30 minuten bewegen',
      icon: Zap,
      color: 'from-blue-400 to-blue-600',
      points: 30,
      completed: stats?.dailyChallengeToday || false
    },
    {
      id: 'thought-dump',
      name: 'Gedachten Dump',
      description: 'Schrijf je gedachten op',
      icon: Brain,
      color: 'from-purple-400 to-purple-600',
      points: 15,
      completed: false
    },
    {
      id: 'breath-coach',
      name: 'Adem Coach',
      description: '5 minuten ademhalingsoefening',
      icon: Wind,
      color: 'from-cyan-400 to-teal-500',
      points: 15,
      completed: false
    },
    {
      id: 'evening-ritual',
      name: 'Avondritueel',
      description: 'Reflecteer op je dag',
      icon: Moon,
      color: 'from-indigo-400 to-indigo-600',
      points: 20,
      completed: false
    },
    {
      id: 'journal',
      name: 'Mijn Dagboek',
      description: 'Persoonlijke aantekeningen',
      icon: BookOpen,
      color: 'from-pink-400 to-rose-500',
      points: 10,
      completed: false
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="wellness-home">
      {/* Hero Section met Level Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="level-card mb-8"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-3"
            >
              <Trophy size={20} />
              <span className="font-semibold">Level {levelInfo?.level || 1}</span>
            </motion.div>
            <h1 className="text-display-md mb-2">{levelInfo?.title || 'Junior Talent'}</h1>
            <p className="text-lg opacity-90">
              {levelInfo?.points || 0} / {levelInfo?.nextLevelPoints || 100} punten
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="text-6xl"
          >
            {levelInfo?.emoji || '⚽'}
          </motion.div>
        </div>

        <div className="level-progress">
          <motion.div
            className="level-progress-fill"
            initial={{ width: 0 }}
            animate={{
              width: `${((levelInfo?.points || 0) / (levelInfo?.nextLevelPoints || 100)) * 100}%`
            }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <div className="text-2xl font-bold">{stats?.streak || 0}</div>
            <div className="text-sm opacity-80">Dag Streak 🔥</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <div className="text-2xl font-bold">{stats?.completedToday || 0}</div>
            <div className="text-sm opacity-80">Vandaag ✅</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <div className="text-2xl font-bold">{stats?.achievements || 0}</div>
            <div className="text-sm opacity-80">Badges 🏆</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quote Card met animatie */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="quote-card mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="text-3xl">💭</div>
          <div>
            <p className="text-lg mb-2">
              {stats?.quote || "Elk nadeel heb z'n voordeel"}
            </p>
            <p className="text-sm font-semibold text-gray-600">— {stats?.quoteAuthor || 'Johan Cruijff'}</p>
          </div>
        </div>
      </motion.div>

      {/* Wedstrijddag Teaser */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => onNavigate('matchday')}
        className="calendar-card mb-8 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white">
              <Calendar size={32} />
            </div>
            <div>
              <h3 className="text-heading-sm mb-1">Wedstrijddag Planner</h3>
              <p className="text-body-sm text-gray-600">Plan je perfecte wedstrijddag</p>
            </div>
          </div>
          <motion.div
            className="text-gray-400 group-hover:text-red-600 transition-colors"
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight size={24} />
          </motion.div>
        </div>
      </motion.div>

      {/* Activities Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-heading-lg">Jouw Wellness Activiteiten</h2>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Star className="text-yellow-500" size={24} />
        </motion.div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="activity-grid"
      >
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <motion.div
              key={activity.id}
              variants={item}
              whileHover={{
                scale: 1.05,
                transition: { type: 'spring', stiffness: 300 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectActivity(activity.id)}
              className="activity-card"
            >
              {/* Completed Badge */}
              {activity.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2"
                >
                  <Star size={16} fill="white" />
                </motion.div>
              )}

              {/* Icon met gradient */}
              <motion.div
                className="activity-icon"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <IconComponent size={32} className="text-white relative z-10" />
              </motion.div>

              {/* Content */}
              <h3 className="text-heading-sm mb-2">{activity.name}</h3>
              <p className="text-body-sm text-gray-600 mb-4">{activity.description}</p>

              {/* Points badge */}
              <div className="flex items-center justify-between">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="badge badge-gold"
                >
                  <TrendingUp size={14} />
                  +{activity.points} punten
                </motion.div>
                <motion.div
                  className="text-red-600"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Floating Action Button voor Stats */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onNavigate('stats')}
        className="fixed bottom-8 right-8 w-16 h-16 btn-primary rounded-full shadow-2xl z-50"
        aria-label="Bekijk statistieken"
      >
        <Trophy size={28} />
      </motion.button>
    </div>
  );
};

export default WellnessHome;
