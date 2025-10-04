import React, { useState, useEffect } from 'react';
import { Trophy, Target, Star, Zap, Award, ThumbsUp, Heart, Brain, CheckCircle, Circle } from 'lucide-react';
import { usePoints } from '../PointsContext';

const MatchDay = ({ onBack }) => {
  const { addPoints, trackActivity } = usePoints();
  const [isMatchDay, setIsMatchDay] = useState(false);
  const [preMatchCompleted, setPreMatchCompleted] = useState({});
  const [postMatchCompleted, setPostMatchCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Check if today is Saturday (match day)
  useEffect(() => {
    const today = new Date().getDay();
    setIsMatchDay(today === 6); // 6 = Saturday

    // Load saved state
    const saved = localStorage.getItem('matchDayProgress');
    if (saved) {
      const data = JSON.parse(saved);
      const savedDate = new Date(data.date).toDateString();
      const todayDate = new Date().toDateString();

      // Reset if it's a new day
      if (savedDate !== todayDate) {
        setPreMatchCompleted({});
        setPostMatchCompleted(false);
      } else {
        setPreMatchCompleted(data.preMatch || {});
        setPostMatchCompleted(data.postMatch || false);
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    const data = {
      date: new Date().toISOString(),
      preMatch: preMatchCompleted,
      postMatch: postMatchCompleted
    };
    localStorage.setItem('matchDayProgress', JSON.stringify(data));
  }, [preMatchCompleted, postMatchCompleted]);

  const preMatchRituals = [
    {
      id: 'breakfast',
      name: 'Kampioen Ontbijt',
      icon: '🥞',
      points: 25,
      description: 'Gezond ontbijt met fruit, brood en water'
    },
    {
      id: 'visualize',
      name: 'Visualisatie',
      icon: '🧠',
      points: 30,
      description: 'Sluit je ogen en zie jezelf scoren/winnen'
    },
    {
      id: 'warmup',
      name: 'Warming-up',
      icon: '🏃',
      points: 20,
      description: '5 minuten stretchen en bewegen'
    },
    {
      id: 'gear',
      name: 'Spullen Checklist',
      icon: '⚽',
      points: 15,
      description: 'Tas, schoenen, tenue, drinken klaar?'
    },
    {
      id: 'motivation',
      name: 'Motivatie Moment',
      icon: '💪',
      points: 25,
      description: 'Luister naar je favoriete power-song!'
    },
    {
      id: 'breathing',
      name: 'Ademhalingsoefening',
      icon: '😌',
      points: 20,
      description: '5x diep ademhalen: 4 sec in, 6 sec uit'
    }
  ];

  const handlePreMatchComplete = (ritualId) => {
    if (!preMatchCompleted[ritualId]) {
      const ritual = preMatchRituals.find(r => r.id === ritualId);
      const bonusPoints = ritual.points * 2; // 2x points on match day!

      setPreMatchCompleted(prev => ({ ...prev, [ritualId]: true }));
      addPoints(bonusPoints, `Wedstrijddag: ${ritual.name} (2x punten!)`);
      trackActivity('match_rituals');

      // Check if all pre-match rituals are complete
      const allComplete = preMatchRituals.every(r =>
        r.id === ritualId || preMatchCompleted[r.id]
      );

      if (allComplete) {
        setShowCelebration(true);
        addPoints(100, '🔥 ALLE RITUELEN VOLTOOID! BONUS!');
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  };

  const handlePostMatchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rating = formData.get('rating');
    const proud = formData.get('proud');
    const improve = formData.get('improve');
    const energy = formData.get('energy');

    if (rating && proud && improve && energy) {
      setPostMatchCompleted(true);
      const bonusPoints = 150; // Huge bonus for reflection!
      addPoints(bonusPoints, '⭐ WEDSTRIJD REFLECTIE VOLTOOID!');
      trackActivity('match_rituals');
    }
  };

  const completedCount = Object.keys(preMatchCompleted).length;
  const totalRituals = preMatchRituals.length;
  const progress = (completedCount / totalRituals) * 100;

  if (!isMatchDay) {
    return (
      <div className="bg-gradient-to-b from-gray-700 to-gray-900 min-h-screen text-white p-6">
        <button onClick={onBack} className="bg-white bg-opacity-20 p-3 rounded-full mb-6">
          ← Terug
        </button>
        <div className="text-center mt-20">
          <div className="text-8xl mb-6">📅</div>
          <h2 className="text-3xl font-bold mb-4">Geen Wedstrijd Vandaag</h2>
          <p className="text-xl text-gray-300 mb-4">De volgende wedstrijd is op zaterdag!</p>
          <p className="text-lg">Gebruik de Wellness Toolbox om te trainen 💪</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-red-700 to-red-900 min-h-screen text-white">
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center animate-bounce">
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-red-600 mb-2">PERFECT!</h2>
            <p className="text-gray-800 text-xl mb-4">Alle rituelen voltooid!</p>
            <p className="text-2xl font-bold text-green-600">+100 BONUS PUNTEN! 🎉</p>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <button onClick={onBack} className="bg-white bg-opacity-20 p-3 rounded-full mb-4">
          ← Terug
        </button>

        <div className="text-center mb-6">
          <div className="text-6xl mb-3">⚽🔥</div>
          <h1 className="text-4xl font-bold mb-2">WEDSTRIJDDAG!</h1>
          <p className="text-xl text-red-200">Alle punten tellen DUBBEL vandaag! 2️⃣✖️</p>
        </div>

        {/* Pre-Match Rituals */}
        <div className="bg-white text-gray-800 rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Target className="w-7 h-7 mr-2 text-red-600" />
              Voor de Wedstrijd
            </h2>
            <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
              {completedCount}/{totalRituals}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {progress === 100 ? '🏆 PERFECT! Alle rituelen voltooid!' : 'Voltooi alle rituelen voor 100 bonus punten!'}
            </p>
          </div>

          <div className="space-y-3">
            {preMatchRituals.map(ritual => {
              const completed = preMatchCompleted[ritual.id];
              return (
                <div
                  key={ritual.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    completed
                      ? 'bg-green-50 border-green-400'
                      : 'bg-gray-50 border-gray-200 hover:border-red-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-3xl mr-3">{ritual.icon}</span>
                        <div>
                          <h3 className="font-bold text-lg">{ritual.name}</h3>
                          <p className="text-sm text-gray-600">{ritual.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                          +{ritual.points * 2} punten
                        </span>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                          2x BONUS 🔥
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePreMatchComplete(ritual.id)}
                      disabled={completed}
                      className={`ml-3 ${
                        completed
                          ? 'text-green-600'
                          : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      {completed ? <CheckCircle size={32} fill="currentColor" /> : <Circle size={32} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Post-Match Reflection */}
        <div className="bg-white text-gray-800 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Award className="w-7 h-7 mr-2 text-red-600" />
            Na de Wedstrijd
          </h2>

          {postMatchCompleted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-2xl font-bold text-green-600 mb-2">Reflectie Voltooid!</p>
              <p className="text-gray-600">Je hebt +150 punten verdiend! 🌟</p>
            </div>
          ) : (
            <form onSubmit={handlePostMatchSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Hoe tevreden ben je? (1-5 sterren)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <label key={num} className="flex-1">
                      <input
                        type="radio"
                        name="rating"
                        value={num}
                        required
                        className="sr-only peer"
                      />
                      <div className="border-2 border-gray-300 peer-checked:border-red-600 peer-checked:bg-red-100 rounded-lg p-3 text-center cursor-pointer hover:border-red-400">
                        <Star className="w-6 h-6 mx-auto mb-1 peer-checked:text-yellow-500" fill="currentColor" />
                        <span className="text-sm font-bold">{num}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Waar ben je trots op?</label>
                <textarea
                  name="proud"
                  required
                  rows="3"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none"
                  placeholder="Bijvoorbeeld: Mijn pass naar een teamgenoot, mijn inzet, mijn positieve houding..."
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-2">Wat kan beter?</label>
                <textarea
                  name="improve"
                  required
                  rows="3"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none"
                  placeholder="Bijvoorbeeld: Meer communiceren, sneller beslissingen nemen..."
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-2">Hoe voel je je nu?</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { emoji: '😊', label: 'Blij', value: 'happy' },
                    { emoji: '💪', label: 'Sterk', value: 'strong' },
                    { emoji: '😔', label: 'Teleurgesteld', value: 'sad' },
                    { emoji: '🔥', label: 'Gemotiveerd', value: 'motivated' }
                  ].map(mood => (
                    <label key={mood.value}>
                      <input
                        type="radio"
                        name="energy"
                        value={mood.value}
                        required
                        className="sr-only peer"
                      />
                      <div className="border-2 border-gray-300 peer-checked:border-red-600 peer-checked:bg-red-100 rounded-lg p-3 text-center cursor-pointer hover:border-red-400">
                        <div className="text-3xl mb-1">{mood.emoji}</div>
                        <span className="text-xs font-bold">{mood.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white font-bold py-4 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trophy className="w-6 h-6" />
                Voltooi Reflectie (+150 punten!)
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 bg-yellow-100 text-yellow-900 rounded-2xl p-4 text-center">
          <p className="font-bold text-lg">💡 Wedstrijddag Tip</p>
          <p className="text-sm mt-1">
            Gebruik ook de Wellness Toolbox voor extra punten! Meditatie en visualisatie geven DUBBELE punten op zaterdag! 🔥
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchDay;
