import React, { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, Sun, Zap, Brain, Star, Wind, Moon, BarChart3, CheckCircle, Circle, Play, Pause, Award, Target, Home, Calendar, Volume2, Settings, ArrowRight, ArrowLeft, Plus, Trash2, User, Trophy, BarChart2, BookOpen, LogOut, Lightbulb, ThumbsUp, BrainCircuit, Pin, FileText, ArrowUpRight, ClipboardList } from 'lucide-react';
import LoginScreen from './LoginScreen';
import { supabase } from './supabaseClient';
import { PointsProvider, usePoints } from './PointsContext';
import { LevelUpModal, AchievementModal } from './components/AchievementModals';
import PointsDashboard from './components/PointsDashboard';
import MatchDay from './components/MatchDay';
import Journal from './components/Journal';
import * as dailyEntryService from './dailyEntryService';
import * as notificationService from './notificationService';

// === MODAL COMPONENTS ===
const RewardModal = ({ show, rewardType, onClose, weeklyRewards }) => {
  if (!show || !rewardType) return null;
  const reward = weeklyRewards[rewardType];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 animate-bounce">
        <div className="text-8xl mb-4">{reward.icon}</div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">{reward.title}</h2>
        <p className="text-gray-700 mb-6">{reward.message}</p>
        <button onClick={onClose} className="bg-red-600 text-white px-6 py-3 rounded-full font-bold">Super!</button>
      </div>
    </div>
  );
};

const DribbelInputModal = ({ show, onClose, onSubmit, dareValue, onDareChange, tryValue, onTryChange }) => {
  if (!show) return null;
  const isButtonDisabled = !dareValue.trim() || !tryValue.trim();
  return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
              <h2 className="text-xl font-bold text-red-700 mb-4">Pyjama-Dribbel ✎</h2>
              <div className="space-y-4">
                  <div>
                      <label className="block font-semibold text-gray-700 mb-1">Vandaag durfde ik...</label>
                      <textarea value={dareValue} onChange={onDareChange} rows="3" className="w-full p-2 border-2 border-gray-200 rounded-lg text-gray-900" placeholder="...iets te vragen in de klas."></textarea>
                  </div>
                  <div>
                      <label className="block font-semibold text-gray-700 mb-1">Morgen ga ik proberen...</label>
                      <textarea value={tryValue} onChange={onTryChange} rows="3" className="w-full p-2 border-2 border-gray-200 rounded-lg text-gray-900" placeholder="...een nieuw recept uit te proberen."></textarea>
                  </div>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                  <button onClick={onSubmit} disabled={isButtonDisabled} className={`w-full text-white font-bold py-3 rounded-full ${isButtonDisabled ? 'bg-gray-400' : 'bg-red-600'}`}>
                      Voltooi Missie (+1 goal)
                  </button>
                  <button onClick={onClose} className="w-full text-gray-600 font-bold py-2">
                      Annuleren
                  </button>
              </div>
          </div>
      </div>
  );
};

const GratitudeInputModal = ({ show, onClose, onSubmit, value1, onChange1, value2, onChange2, value3, onChange3 }) => {
  if (!show) return null;
  const isButtonDisabled = !value1.trim() || !value2.trim() || !value3.trim();
  return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
              <h2 className="text-xl font-bold text-red-700 mb-4">Dankbaarheid ⭐</h2>
              <p className="text-sm text-gray-600 mb-4">Schrijf 3 dingen waar je vandaag dankbaar voor bent:</p>
              <div className="space-y-3">
                  <div>
                      <label className="block font-semibold text-gray-700 mb-1">1. Ik ben dankbaar voor...</label>
                      <input type="text" value={value1} onChange={onChange1} className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900" placeholder="...mijn familie"></input>
                  </div>
                  <div>
                      <label className="block font-semibold text-gray-700 mb-1">2. Ik ben dankbaar voor...</label>
                      <input type="text" value={value2} onChange={onChange2} className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900" placeholder="...mijn vrienden"></input>
                  </div>
                  <div>
                      <label className="block font-semibold text-gray-700 mb-1">3. Ik ben dankbaar voor...</label>
                      <input type="text" value={value3} onChange={onChange3} className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900" placeholder="...voetbal kunnen spelen"></input>
                  </div>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                  <button onClick={onSubmit} disabled={isButtonDisabled} className={`w-full text-white font-bold py-3 rounded-full ${isButtonDisabled ? 'bg-gray-400' : 'bg-red-600'}`}>
                      Voltooi Missie (+1 goal)
                  </button>
                  <button onClick={onClose} className="w-full text-gray-600 font-bold py-2">
                      Annuleren
                  </button>
              </div>
          </div>
      </div>
  );
};

// === App 1: Ajax Sleep App (Standalone Version) ===

const AjaxSleepAppContent = ({ onBack, onLogout, user }) => {
  const points = usePoints();
  const [currentView, setCurrentView] = useState('home');
  const [parentMode, setParentMode] = useState(false);
  const [dailyGoals, setDailyGoals] = useState(0);
  const [weeklyGoals, setWeeklyGoals] = useState(18); // Start value for demo
  const [completedMissions, setCompletedMissions] = useState({});
  const [showReward, setShowReward] = useState(false);
  const [rewardType, setRewardType] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('bergwijn');
  const [selectedOutfit, setSelectedOutfit] = useState('home');
  const [playerName, setPlayerName] = useState('Kampioen');
  const [dailyStreak, setDailyStreak] = useState(3);

  // State for the Pyjama-Dribbel input modal
  const [showDribbelInput, setShowDribbelInput] = useState(false);
  const [dribbelDare, setDribbelDare] = useState('');
  const [dribbelTry, setDribbelTry] = useState('');

  // State for the Gratitude input modal
  const [showGratitudeInput, setShowGratitudeInput] = useState(false);
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');

  // Johan Cruijff quotes
  const cruijffQuotes = [
    "Elk nadeel heb z'n voordeel",
    "Je moet schieten, anders kun je niet scoren",
    "Voetbal is simpel, maar het moeilijkste wat er is, is simpel voetballen",
    "Je gaat het pas zien als je het doorhebt",
    "Als wij de bal hebben, kunnen zij niet scoren",
    "Als je ergens niet bent, ben je of te vroeg, of te laat",
    "Voetbal speel je met het hoofd, want de bal is vlugger dan de benen",
    "Voordat ik een fout maak, maak ik die fout niet"
  ];

  const [dailyQuote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * cruijffQuotes.length);
    return cruijffQuotes[randomIndex];
  });
  
  const defaultMissions = [
    { id: 1, name: 'Kick-off Maaltijd', time: '18:00', goals: 0, points: 10, icon: '🍽️', description: 'Eet samen en zeg waar je trots op bent.' },
    { id: 2, name: 'Chillen', time: '18:15', goals: 3, points: 30, icon: '😎', description: 'Even relaxen als een echte Ajax-ster.' },
    { id: 3, name: 'Warming-up Johan Cruijff', time: '18:45', goals: 2, points: 20, icon: '📺', description: 'Kijk Klokhuis (max. 15 min) + 10 push-ups.' },
    { id: 4, name: 'Fris-op Vrije Trap', time: '19:15', goals: 1, points: 15, icon: '🚿', description: 'Douchen/wassen, tanden poetsen, pyjama aan.' },
    { id: 5, name: 'Pyjama-Dribbel', time: '19:30', goals: 1, points: 15, icon: '✎', description: 'Schrijf: "Vandaag durfde ik..." & "Morgen ga ik proberen..."' },
    { id: 6, name: 'Dankbaarheid', time: '19:35', goals: 1, points: 20, icon: '⭐', description: 'Schrijf 3 dingen waar je dankbaar voor bent.' },
    { id: 7, name: 'Bonuslevel voor Kampioenen', time: '19:40', goals: 0.5, points: 10, icon: '⚡', description: 'Kies 1: Puzzel, creatieve opdracht, of coachvraag.' },
    { id: 8, name: 'Finale Fluitsignaal', time: '20:00', goals: 2, points: 20, icon: '🌙', description: 'Ogen dicht, glimlach en droom over...' }
  ];

  const weeklyRewards = {
      highfive: { threshold: 20, icon: '🙌', title: 'Rood-Witte High-Five', message: '20 week-goals! Goed bezig!' },
      sticker: { threshold: 30, icon: '⚽', title: 'Ajax Stickergool!', message: '30 week-goals! Plak die sticker op je poster!' },
      moment: { threshold: 35, icon: '👨‍👩‍👧', title: 'Johan Cruijff Moment', message: '35 week-goals! Tijd voor iets leuks met papa of mama!' },
      trophy: { threshold: 45, icon: '🏆', title: 'Arena Trofee!', message: '45 week-goals! Een echte kampioen!' }
  };

  const ajaxPlayers = {
    bergwijn: { name: 'Steven Bergwijn', number: '7', emoji: '⚡' },
    tadic: { name: 'Dušan Tadić', number: '10', emoji: '🎯' },
    timber: { name: 'Jurriën Timber', number: '2', emoji: '🛡️' },
  };
  const outfits = {
    home: { name: 'Thuis', colors: 'from-red-600 to-red-800', jersey: '🔴' },
    away: { name: 'Uit', colors: 'from-blue-600 to-blue-800', jersey: '🔵' },
  };
  const badges = [
    { id: 'streak_3', name: 'Warme Start', description: '3 dagen op rij', icon: '🔥', unlocked: true },
    { id: 'early_bird', name: 'Vroege Vogel', description: 'Voor 20:00 naar bed', icon: '🐦', unlocked: true },
    { id: 'perfect_week', name: 'Perfecte Week', description: 'Alle dagen 9.5/9.5 goals', icon: '⭐', unlocked: false },
  ];
  const [missions, setMissions] = useState(defaultMissions);
  const playSound = (type) => { console.log(`🔊 Playing ${type} sound`); };
  
  const completeMission = async (missionId) => {
    if (!completedMissions[missionId]) {
      const mission = missions.find(m => m.id === missionId);
      const newWeeklyTotal = weeklyGoals + mission.goals;

      setCompletedMissions(prev => ({ ...prev, [missionId]: true }));
      setDailyGoals(prev => prev + mission.goals);
      setWeeklyGoals(newWeeklyTotal);
      playSound('goal');

      // Add points for completing mission
      if (mission.points) {
        points.addPoints(mission.points, mission.name);
      }

      // Save to database
      if (user) {
        await dailyEntryService.saveCompletedMission(user.id, missionId);
      }

      // Check for early bird achievement
      const currentHour = new Date().getHours();
      if (missionId === 8 && currentHour < 20) {
        points.trackActivity('early_bird');
      }

      for (const [key, reward] of Object.entries(weeklyRewards)) {
          if (newWeeklyTotal >= reward.threshold && weeklyGoals < reward.threshold) {
              setRewardType(key);
              setShowReward(true);
              break;
          }
      }
    }
  };
  
  const handleDribbelSubmit = async () => {
      if(dribbelDare.trim() && dribbelTry.trim()) {
          // Save to database
          if (user) {
              await dailyEntryService.saveDribbelData(user.id, dribbelDare, dribbelTry);
          }

          completeMission(5);
          setDribbelDare('');
          setDribbelTry('');
          setShowDribbelInput(false);
      }
  };

  const handleGratitudeSubmit = async () => {
      if(gratitude1.trim() && gratitude2.trim() && gratitude3.trim()) {
          // Save to database
          if (user) {
              await dailyEntryService.saveGratitudeData(user.id, gratitude1, gratitude2, gratitude3);
          }

          completeMission(6);
          setGratitude1('');
          setGratitude2('');
          setGratitude3('');
          setShowGratitudeInput(false);
      }
  };

    const HomeScreen = () => (
    <div className="bg-gradient-to-b from-red-700 to-red-900 min-h-screen text-white">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
           <button onClick={onBack} className="bg-white bg-opacity-20 p-2 rounded-full"><Home className="w-6 h-6" /></button>
          <h1 className="text-2xl font-bold">Avondritueel</h1>
          <button onClick={onLogout} className="bg-white bg-opacity-20 p-2 rounded-full"><LogOut className="w-6 h-6" /></button>
        </div>

        {/* Points & Level Display */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCurrentView('points')}
            className="flex-1 bg-white bg-opacity-10 rounded-xl p-3 flex items-center justify-between hover:bg-opacity-20 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <div className={`text-2xl bg-gradient-to-br ${points.currentLevel.color} w-10 h-10 rounded-full flex items-center justify-center`}>
                {points.currentLevel.badge}
              </div>
              <div className="text-left">
                <p className="text-xs opacity-75">Level {points.currentLevel.id}</p>
                <p className="font-bold text-sm">{points.currentLevel.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-75">Punten</p>
              <p className="font-bold text-lg">{points.totalPoints}</p>
            </div>
          </button>
        </div>

        {/* Johan Cruijff Quote */}
        <div className="bg-white bg-opacity-10 rounded-2xl p-4 mb-6 border-2 border-white border-opacity-20">
          <p className="text-xs font-semibold mb-1 opacity-75">💬 Johan Cruijff zegt:</p>
          <p className="text-sm italic font-medium">"{dailyQuote}"</p>
        </div>
        <div className="text-center mb-8">
          <div className={`w-32 h-32 bg-gradient-to-br ${outfits[selectedOutfit].colors} rounded-full mx-auto mb-4 flex items-center justify-center relative border-4 border-white shadow-2xl`}>
            <div className="text-6xl">{ajaxPlayers[selectedPlayer].emoji}</div>
            <div className="absolute -bottom-2 -right-2 bg-white text-black px-2 py-1 rounded-full text-xs font-bold">#{ajaxPlayers[selectedPlayer].number}</div>
          </div>
          <h2 className="text-xl font-bold mb-1">{playerName}</h2>
          <p className="text-sm opacity-90 mb-2">speelt als {ajaxPlayers[selectedPlayer].name}</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-3xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Vandaag</h3>
            <div className="flex items-center"><Trophy className="w-5 h-5 mr-1" /><span className="font-bold">{dailyGoals.toFixed(1)}/9.5 goals</span></div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full h-4 mb-2"><div className="bg-green-400 h-4 rounded-full" style={{ width: `${Math.min((dailyGoals / 9.5) * 100, 100)}%` }}></div></div>
        </div>
        <div className="space-y-4">
            <button onClick={() => setCurrentView('missions')} className="w-full bg-white text-red-700 py-4 px-6 rounded-full font-bold text-lg flex items-center justify-center shadow-lg"><Play className="w-6 h-6 mr-2" />Start Missies!</button>
        </div>
      </div>
    </div>
  );
  
    const MissionsScreen = () => {
      const completedCount = Object.keys(completedMissions).length;
      const hasCompletedAny = completedCount > 0;

      // Calculate today's earned points
      const todayPoints = missions
        .filter(m => completedMissions[m.id])
        .reduce((sum, m) => sum + (m.points || 0), 0);

      const dreamMessages = [
        "...een geweldige goal die je scoort! 🥅",
        "...de mooiste pass die je geeft! ⚽",
        "...een kampioenschap dat je wint! 🏆",
        "...je vrienden en jullie samen lachen! 😄",
        "...de beste wedstrijd die je ooit speelt! ⭐",
        "...een avontuur dat je beleeft! 🌟",
        "...iets moois dat je morgen gaat doen! 🌈",
        "...een moment waar je trots op bent! 💪",
        "...de Ajax Arena die voor jou juicht! 🎉",
        "...jouw allergrootste droom! ✨"
      ];

      const [todayDream] = useState(() => {
        const randomIndex = Math.floor(Math.random() * dreamMessages.length);
        return dreamMessages[randomIndex];
      });

      const handleFinish = () => {
        if (hasCompletedAny) {
          setCurrentView('finish');
        }
      };

      return (
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen text-gray-800">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setCurrentView('home')} className="p-2 bg-white shadow-md rounded-full"><Home className="w-6 h-6 text-red-600" /></button>
              <h1 className="text-2xl font-bold text-red-700">Dagelijkse Missies</h1>
              <div className="p-2"><Volume2 className="w-6 h-6" /></div>
            </div>
            <div className="space-y-3">
              {missions.map((mission) => (
                <div key={mission.id} className={`p-4 rounded-2xl transition-all duration-300 shadow-md ${completedMissions[mission.id] ? 'bg-red-700 text-white' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{mission.icon}</div>
                      <div>
                        <div className="flex items-baseline space-x-2">
                            <h3 className="font-bold text-lg">{mission.name}</h3>
                            <p className={`text-xs font-semibold ${completedMissions[mission.id] ? 'text-white' : 'text-gray-500'}`}>{mission.time}</p>
                        </div>
                        <p className={`text-sm ${completedMissions[mission.id] ? 'opacity-90' : 'text-gray-600'}`}>{mission.description}</p>
                        {mission.points && (
                          <div className={`inline-flex items-center space-x-1 mt-1 px-2 py-1 rounded-full text-xs font-bold ${completedMissions[mission.id] ? 'bg-white bg-opacity-20 text-white' : 'bg-green-100 text-green-700'}`}>
                            <Star className="w-3 h-3" fill={completedMissions[mission.id] ? 'white' : 'currentColor'} />
                            <span>{mission.points} punten</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (mission.id === 5) setShowDribbelInput(true);
                        else if (mission.id === 6) setShowGratitudeInput(true);
                        else completeMission(mission.id);
                      }}
                      disabled={completedMissions[mission.id]}
                      className={`p-3 rounded-full transition-transform transform hover:scale-110 ${completedMissions[mission.id] ? 'bg-white text-red-700' : 'bg-gray-200 text-gray-700'}`}>
                      {completedMissions[mission.id] ? <CheckCircle className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hasCompletedAny && (
              <button
                onClick={handleFinish}
                className="w-full mt-6 bg-red-600 text-white font-bold py-4 px-6 rounded-full text-lg shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <Moon className="w-6 h-6 mr-2" />
                Dag Afsluiten
              </button>
            )}
          </div>
        </div>
      );
    };

  const FinishScreen = () => {
    // Calculate today's earned points
    const todayPoints = missions
      .filter(m => completedMissions[m.id])
      .reduce((sum, m) => sum + (m.points || 0), 0);

    const dreamMessages = [
      "...een geweldige goal die je scoort! 🥅",
      "...de mooiste pass die je geeft! ⚽",
      "...een kampioenschap dat je wint! 🏆",
      "...je vrienden en jullie samen lachen! 😄",
      "...de beste wedstrijd die je ooit speelt! ⭐",
      "...een avontuur dat je beleeft! 🌟",
      "...iets moois dat je morgen gaat doen! 🌈",
      "...een moment waar je trots op bent! 💪",
      "...de Ajax Arena die voor jou juicht! 🎉",
      "...jouw allergrootste droom! ✨"
    ];

    const [todayDream] = useState(() => {
      const randomIndex = Math.floor(Math.random() * dreamMessages.length);
      return dreamMessages[randomIndex];
    });

    return (
      <div className="bg-gradient-to-b from-red-700 to-red-900 min-h-screen text-white flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6 animate-bounce">🌙✨</div>
          <h1 className="text-4xl font-bold mb-4">Goed Gedaan!</h1>
          <p className="text-xl mb-8">Je hebt vandaag missies volbracht!</p>

          <div className="bg-white text-gray-800 rounded-3xl p-8 mb-8 shadow-2xl">
            <p className="text-sm font-semibold text-gray-600 mb-2">Vandaag verdiend:</p>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Trophy className="w-12 h-12 text-yellow-500" />
              <p className="text-6xl font-bold text-red-600">+{todayPoints}</p>
            </div>
            <p className="text-lg font-bold text-gray-700">punten!</p>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-600 mb-2">Totaal punten:</p>
              <p className="text-3xl font-bold text-red-600">{points.totalPoints}</p>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 mb-8 border-2 border-white border-opacity-20">
            <p className="text-lg font-semibold mb-3">💭 Droom nu over...</p>
            <p className="text-2xl font-bold">{todayDream}</p>
          </div>

          <p className="text-lg mb-8 opacity-90">Welterusten, kampioen! 🏆</p>

          <button
            onClick={onLogout}
            className="bg-white text-red-700 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:bg-gray-100 transition-colors"
          >
            Sluiten
          </button>
        </div>
      </div>
    );
  };

  const ScorecardScreen = () => (
      <div className="bg-gray-100 min-h-screen text-gray-800 p-6">
          <div className="flex justify-between items-center mb-6">
              <button onClick={() => setCurrentView('home')} className="p-2 bg-white shadow-md rounded-full"><Home className="w-6 h-6 text-red-600" /></button>
              <h1 className="text-2xl font-bold text-red-700">Scorekaart</h1>
              <div className="w-10"></div>
          </div>
          <div className="bg-white rounded-3xl p-6 text-center shadow-lg mb-4">
              <h2 className="text-xl font-bold mb-2">Score Vandaag</h2>
              <p className="text-6xl font-bold text-red-600">{dailyGoals.toFixed(1)}<span className="text-2xl text-gray-500">/9.5</span></p>
              <p className="text-gray-600">goals behaald</p>
          </div>
           <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-center">Week Beloningen</h2>
              <div className="space-y-3">
                  {Object.values(weeklyRewards).map(reward => (
                      <div key={reward.title} className="flex items-center">
                          <div className={`p-3 rounded-full mr-4 ${weeklyGoals >= reward.threshold ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                              {weeklyGoals >= reward.threshold ? <CheckCircle/> : <Circle/>}
                          </div>
                          <div>
                              <p className="font-bold">{reward.title}</p>
                              <p className="text-sm text-gray-600">{reward.threshold} goals</p>
                          </div>
                      </div>
                  ))}
              </div>
               <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                    <p className="font-bold text-lg">Week Totaal: {weeklyGoals.toFixed(1)}<span className="font-normal text-gray-500">/35</span></p>
               </div>
          </div>
      </div>
  );

  const BadgesScreen = () => (
      <div className="bg-gray-100 min-h-screen text-gray-800 p-6">
          <div className="flex justify-between items-center mb-6">
              <button onClick={() => setCurrentView('home')} className="p-2 bg-white shadow-md rounded-full"><Home className="w-6 h-6 text-red-600" /></button>
              <h1 className="text-2xl font-bold text-red-700">Badges</h1>
              <div className="w-10"></div>
          </div>
           <div className="grid grid-cols-2 gap-4">
              {badges.map(badge => (
                  <div key={badge.id} className={`p-4 rounded-2xl text-center shadow-md ${badge.unlocked ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h3 className="font-bold">{badge.name}</h3>
                      {badge.unlocked && <p className="text-xs opacity-80">Behaald!</p>}
                  </div>
              ))}
          </div>
      </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'home': return <HomeScreen />;
      case 'missions': return <MissionsScreen />;
      case 'finish': return <FinishScreen />;
      case 'points': return <PointsDashboard onBack={() => setCurrentView('home')} />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 md:flex md:items-center md:justify-center">
      <div className="w-full md:max-w-md bg-white overflow-hidden font-sans md:shadow-2xl min-h-screen md:min-h-0">
        <RewardModal
          show={showReward}
          rewardType={rewardType}
          onClose={() => setShowReward(false)}
          weeklyRewards={weeklyRewards}
        />
        <DribbelInputModal
          show={showDribbelInput}
          onClose={() => setShowDribbelInput(false)}
          onSubmit={handleDribbelSubmit}
          dareValue={dribbelDare}
          onDareChange={(e) => setDribbelDare(e.target.value)}
          tryValue={dribbelTry}
          onTryChange={(e) => setDribbelTry(e.target.value)}
        />
        <GratitudeInputModal
          show={showGratitudeInput}
          onClose={() => setShowGratitudeInput(false)}
          onSubmit={handleGratitudeSubmit}
          value1={gratitude1}
          onChange1={(e) => setGratitude1(e.target.value)}
          value2={gratitude2}
          onChange2={(e) => setGratitude2(e.target.value)}
          value3={gratitude3}
          onChange3={(e) => setGratitude3(e.target.value)}
        />
        <LevelUpModal
          show={points.showLevelUp}
          level={points.newLevel}
          onClose={() => points.setShowLevelUp(false)}
        />
        <AchievementModal
          show={points.showAchievement !== null}
          achievement={points.showAchievement}
          onClose={() => points.setShowAchievement(null)}
        />
        {renderContent()}
      </div>
    </div>
  );
};

// Wrapper component with PointsProvider
const AjaxSleepApp = (props) => (
  <PointsProvider userId={props.user?.id}>
    <AjaxSleepAppContent {...props} />
  </PointsProvider>
);


// === App 2: Ajax Wellness Toolbox ===

const ToolHeader = ({ title, onBack }) => (
    <div className="flex items-center p-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0">
            <ArrowLeft className="text-red-600" size={20} />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-center flex-1 text-red-700 px-2">{title}</h1>
        <div className="w-9"></div>
    </div>
);
const SliderInput = ({ label, minLabel, maxLabel, value, onChange }) => (
    <div className="mb-6 bg-white p-3 rounded-2xl shadow-sm">
        <label className="block font-semibold text-gray-800 mb-2 text-base">{label}</label>
        <div className="flex items-center space-x-3">
            <span className="font-bold text-red-600 text-xl min-w-[30px]">{value}</span>
            <input type="range" min="1" max="10" value={value} onChange={onChange} className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb" />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
            <span className="text-left">{minLabel}</span>
            <span className="text-right">{maxLabel}</span>
        </div>
    </div>
);
const TextAreaInput = ({ label, placeholder, value, onChange }) => (
    <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm">
        <label className="block font-semibold text-gray-800 mb-2 text-lg">{label}</label>
        <textarea value={value} onChange={onChange} rows="4" className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-red-500 text-gray-900" placeholder={placeholder}></textarea>
    </div>
);
const PrimaryButton = ({ onClick, children, disabled=false }) => (
    <div className="p-4 bg-gray-50">
      <button 
        onClick={onClick} 
        disabled={disabled}
        className="w-full bg-red-600 text-white font-bold py-4 rounded-full shadow-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
      >
        {children}
      </button>
    </div>
);

// Tool Screens
const ToolboxScreen = ({ onSelectTool, onBack, onLogout }) => {
    const { totalPoints, currentLevel } = usePoints();
    const isMatchDay = new Date().getDay() === 6;

    // Football quotes
    const footballQuotes = [
        { player: "Johan Cruijff", quote: "Voetbal speel je met je hoofd, je voeten zijn alleen maar de hulpmiddelen.", lesson: "Slim denken is sterker dan hard rennen." },
        { player: "Xavi (Barcelona)", quote: "Snel denken is belangrijker dan snel lopen.", lesson: "Je hersenen zijn je superkracht." },
        { player: "Andrea Pirlo", quote: "Rust aan de bal is sterker dan paniekvoetbal.", lesson: "Kalm blijven is vaak de beste truc." },
        { player: "Lionel Messi", quote: "Je moet blijven vechten voor je droom, ook als het moeilijk is.", lesson: "Opgeven is nooit een optie." },
        { player: "Arjen Robben", quote: "Je moet altijd blijven gaan, ook al val je 100 keer.", lesson: "Fouten maken mag, zolang je maar weer opstaat." },
        { player: "Cristiano Ronaldo", quote: "Talent zonder hard werken is niets waard.", lesson: "Slim zijn helpt, maar oefenen maakt je echt goed." },
        { player: "Zlatan Ibrahimović", quote: "Je hoeft niet te doen wat iedereen doet. Doe het op jouw manier.", lesson: "Durf anders te zijn." },
        { player: "George Best", quote: "Probeer het gewoon, anders weet je nooit wat er had kunnen gebeuren.", lesson: "Het is beter iets te proberen dan spijt te hebben." },
        { player: "Diego Simeone", quote: "Inzet is niet te onderhandelen.", lesson: "Je moet altijd je best doen, of je nou wint of verliest." },
        { player: "Johan Cruijff", quote: "Elk nadeel heeft z'n voordeel.", lesson: "Ook als het tegenzit, zit er altijd iets goeds in." }
    ];

    const [dailyQuote] = useState(() => {
        const randomIndex = Math.floor(Math.random() * footballQuotes.length);
        return footballQuotes[randomIndex];
    });

    const tools = [
        { id: 'morning', icon: Sun, title: "Goedemorgen Start" },
        { id: 'challenge', icon: Zap, title: "Dagelijkse Uitdaging" },
        { id: 'thoughts', icon: Brain, title: "Gedachten Dump" },
        { id: 'breathing', icon: Wind, title: "Adem Coach" },
        { id: 'evening', icon: Moon, title: "Avondritueel" },
        { id: 'journal', icon: BookOpen, title: "Mijn Dagboek" },
    ];

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
             <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl md:text-3xl font-bold flex-1">AJAX 🧰</h1>
                <button onClick={onLogout} className="p-2 rounded-full bg-white shadow-md ml-2"><LogOut className="text-red-600" size={20}/></button>
            </div>

            {/* Points & Level Card - Clickable */}
            <button
                onClick={() => onSelectTool('points')}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-4 mb-4 shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
                <div className="flex items-center justify-between">
                    <div className="text-left">
                        <p className="text-sm opacity-90">Jouw Level</p>
                        <h2 className="text-2xl font-bold">{currentLevel.name}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-black">{currentLevel.badge}</p>
                        <p className="text-sm opacity-90 mt-1">{totalPoints} punten</p>
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-center space-x-1 text-xs opacity-75">
                    <Trophy size={14} />
                    <span>Tap voor meer details</span>
                </div>
            </button>

            {/* Daily Quote */}
            <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
                <p className="text-xs font-semibold mb-2 text-gray-600">⚽ {dailyQuote.player}</p>
                <p className="text-sm italic font-medium mb-2 text-gray-800">"{dailyQuote.quote}"</p>
                <div className="flex items-start space-x-2 bg-gray-50 rounded-lg p-3">
                    <span className="text-base">👉</span>
                    <p className="text-xs font-semibold text-gray-700">{dailyQuote.lesson}</p>
                </div>
            </div>

            {/* Match Day Special Button */}
            <button
                onClick={() => onSelectTool('match_day')}
                className={`w-full mb-4 p-6 rounded-3xl font-bold flex items-center justify-between shadow-xl transition-all ${
                    isMatchDay
                        ? 'bg-gradient-to-r from-red-600 to-red-800 text-white animate-pulse'
                        : 'bg-gradient-to-r from-gray-500 to-gray-700 text-white'
                }`}
            >
                <div className="flex items-center gap-4">
                    <div className="text-5xl">⚽</div>
                    <div className="text-left">
                        <div className="text-2xl font-black">
                            {isMatchDay ? 'WEDSTRIJDDAG!' : 'Wedstrijddag'}
                        </div>
                        <div className="text-sm opacity-90">
                            {isMatchDay ? '🔥 ALLE PUNTEN 2X VANDAAG!' : 'Alleen op zaterdag'}
                        </div>
                    </div>
                </div>
                <div className="text-4xl">{isMatchDay ? '🏆' : '📅'}</div>
            </button>

            {isMatchDay && (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 mb-4 text-center">
                    <p className="text-yellow-900 font-bold text-lg">🎯 BONUS ALERT!</p>
                    <p className="text-yellow-800 text-sm mt-1">Alle tools geven vandaag DUBBELE punten! 2️⃣✖️</p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                {tools.map((tool, index) => (
                    <button
                        key={tool.id}
                        onClick={() => onSelectTool(tool.id)}
                        className={`p-3 rounded-2xl font-bold flex flex-col items-center justify-center min-h-[120px] shadow-md active:scale-95 transition-transform relative ${
                            index % 3 === 0 ? 'bg-red-600 text-white' : 'bg-white text-gray-800'
                        }`}
                    >
                        {isMatchDay && (
                            <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full font-black">
                                2x
                            </div>
                        )}
                        <tool.icon size={28} className={`mb-2 ${index % 3 === 0 ? 'text-white' : 'text-red-600'}`} />
                        <span className="text-center text-xs leading-tight">{tool.title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
const MorningCheckinScreen = ({ onBack, onComplete, user }) => {
    const { addPoints, trackActivity } = usePoints();
    const [sleep, setSleep] = useState(5);
    const [goal, setGoal] = useState('');
    const [physical, setPhysical] = useState(5);
    const [mental, setMental] = useState(5);
    const [concentration, setConcentration] = useState(5);
    const [control, setControl] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [hasExistingEntry, setHasExistingEntry] = useState(false);

    // Load existing entry for today
    useEffect(() => {
        const loadTodayEntry = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            const entry = await dailyEntryService.getTodayEntry(user.id);
            if (entry && entry.morning_goal) {
                // Entry exists with morning data, load it
                setSleep(entry.morning_sleep || 5);
                setGoal(entry.morning_goal || '');
                setPhysical(entry.morning_physical || 5);
                setMental(entry.morning_mental || 5);
                setConcentration(entry.morning_concentration || 5);
                setControl(entry.morning_control || 5);
                setHasExistingEntry(true);
            }
            setIsLoading(false);
        };

        loadTodayEntry();
    }, [user]);

    const handleComplete = async () => {
        // Only award points if this is the first time completing today
        if (!hasExistingEntry) {
            const isMatchDay = new Date().getDay() === 6;
            const basePoints = 30;
            const points = isMatchDay ? basePoints * 2 : basePoints;

            addPoints(points, `Goedemorgen Start${isMatchDay ? ' (Wedstrijddag 2x!)' : ''}`);
            trackActivity('toolbox_uses');
        }

        // Save to database (always save to update data)
        if (user) {
            await dailyEntryService.saveMorningCheckin(user.id, {
                sleep, goal, physical, mental, concentration, control
            });
        }

        onComplete({sleep, goal, physical, mental, concentration, control});
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-full bg-gray-50">
                <ToolHeader title="Goedemorgen Start" onBack={onBack} />
                <div className="p-4 flex items-center justify-center flex-grow">
                    <p className="text-gray-600">Laden...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <ToolHeader title="Goedemorgen Start" onBack={onBack} />
            <div className="p-4 flex-grow overflow-y-auto">
                {!hasExistingEntry ? (
                    <div className="bg-green-100 border-2 border-green-400 rounded-xl p-3 mb-4 text-center">
                        <p className="text-green-800 font-bold">+{new Date().getDay() === 6 ? '60' : '30'} punten! {new Date().getDay() === 6 ? '🔥 2x Wedstrijddag!' : '⭐'}</p>
                    </div>
                ) : (
                    <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-3 mb-4 text-center">
                        <p className="text-blue-800 font-bold">✏️ Je hebt dit vandaag al ingevuld. Je kunt het aanpassen!</p>
                    </div>
                )}
                <SliderInput label="Hoe heb je geslapen?" minLabel="Slecht" maxLabel="Heel goed" value={sleep} onChange={(e) => setSleep(e.target.value)} />
                <TextAreaInput label="Wat is je doel voor vandaag?" placeholder="Eén klein ding..." value={goal} onChange={(e) => setGoal(e.target.value)} />
                <SliderInput label="Hoe voel je je fysiek?" minLabel="Slecht" maxLabel="Uitstekend" value={physical} onChange={e => setPhysical(e.target.value)} />
                <SliderInput label="Hoe is je mentale toestand?" minLabel="Overweldigd" maxLabel="Helder" value={mental} onChange={e => setMental(e.target.value)} />
                <SliderInput label="Hoe is je concentratie?" minLabel="Verstrooid" maxLabel="Gefocust" value={concentration} onChange={e => setConcentration(e.target.value)} />
                <SliderInput label="Hoeveel controle voel je?" minLabel="Geen" maxLabel="Volledig" value={control} onChange={e => setControl(e.target.value)} />
            </div>
            <PrimaryButton onClick={handleComplete}>
                {hasExistingEntry ? 'Wijzigingen Opslaan' : 'Start de Dag!'}
            </PrimaryButton>
        </div>
    );
};
const todayChallenge = "Drink vandaag 8 glazen water.";
const ChallengeScreen = ({ onBack, onComplete, isCompleted, user }) => {
    const { addPoints, trackActivity } = usePoints();

    const handleComplete = async () => {
        if (!isCompleted) {
            const isMatchDay = new Date().getDay() === 6;
            const basePoints = 25;
            const points = isMatchDay ? basePoints * 2 : basePoints;

            addPoints(points, `Dagelijkse Uitdaging${isMatchDay ? ' (Wedstrijddag 2x!)' : ''}`);
            trackActivity('toolbox_uses');

            // Save to database
            if (user) {
                await dailyEntryService.saveChallenge(user.id);
            }

            onComplete();
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <ToolHeader title="Dagelijkse Uitdaging" onBack={onBack} />
            <div className="p-6 text-center flex-grow flex flex-col items-center justify-center">
                {!isCompleted && (
                    <div className="bg-green-100 border-2 border-green-400 rounded-xl p-3 mb-4">
                        <p className="text-green-800 font-bold">+{new Date().getDay() === 6 ? '50' : '25'} punten! {new Date().getDay() === 6 ? '🔥 2x Wedstrijddag!' : '⭐'}</p>
                    </div>
                )}
                <div className={`p-8 rounded-full mb-6 ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isCompleted ? <CheckCircle size={48}/> : <Zap size={48} />}
                </div>
                <p className="text-lg font-semibold mb-6">{todayChallenge}</p>
            </div>
            <PrimaryButton onClick={handleComplete} disabled={isCompleted}>
                {isCompleted ? 'Voltooid!' : 'Missie Volbracht'}
            </PrimaryButton>
        </div>
    );
};
const ThoughtsScreen = ({ onBack, onSave, savedThought, user }) => {
    const { addPoints, trackActivity } = usePoints();
    const [text, setText] = useState(savedThought || '');

    const handleSave = async () => {
        if (text.trim()) {
            const isMatchDay = new Date().getDay() === 6;
            const basePoints = 15;
            const points = isMatchDay ? basePoints * 2 : basePoints;

            addPoints(points, `Gedachten Dump${isMatchDay ? ' (Wedstrijddag 2x!)' : ''}`);
            trackActivity('toolbox_uses');

            // Save to database
            if (user) {
                await dailyEntryService.saveThoughts(user.id, text);
            }

            onSave(text);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <ToolHeader title="Gedachten Dump" onBack={onBack} />
            <div className="p-4 flex-grow">
                <div className="bg-green-100 border-2 border-green-400 rounded-xl p-3 mb-4 text-center">
                    <p className="text-green-800 font-bold">+{new Date().getDay() === 6 ? '30' : '15'} punten! {new Date().getDay() === 6 ? '🔥 2x Wedstrijddag!' : '⭐'}</p>
                </div>
                <TextAreaInput label="Waar denk je aan?" placeholder="Schrijf alles op wat in je opkomt..." value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <PrimaryButton onClick={handleSave}>Opslaan</PrimaryButton>
        </div>
    );
};
const GratitudeScreen = ({ onBack, onSave, savedGratitude }) => {
    const { addPoints, trackActivity } = usePoints();
    const [gratitudeText, setGratitudeText] = useState(savedGratitude?.gratitude || '');
    const [proudText, setProudText] = useState(savedGratitude?.proud || '');
    const [learnedText, setLearnedText] = useState(savedGratitude?.learned || '');

    const handleSave = () => {
        if (gratitudeText.trim() || proudText.trim() || learnedText.trim()) {
            const isMatchDay = new Date().getDay() === 6;
            const basePoints = 30; // Increased since it combines gratitude + reflection
            const points = isMatchDay ? basePoints * 2 : basePoints;

            addPoints(points, `Dag Afsluiting${isMatchDay ? ' (Wedstrijddag 2x!)' : ''}`);
            trackActivity('toolbox_uses');
            onSave({ gratitude: gratitudeText, proud: proudText, learned: learnedText });
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <ToolHeader title="Dag Afsluiting" onBack={onBack} />
            <div className="p-4 flex-grow overflow-y-auto">
                <div className="bg-green-100 border-2 border-green-400 rounded-xl p-3 mb-4 text-center">
                    <p className="text-green-800 font-bold">+{new Date().getDay() === 6 ? '60' : '30'} punten! {new Date().getDay() === 6 ? '🔥 2x Wedstrijddag!' : '⭐'}</p>
                </div>
                <TextAreaInput label="Waar ben je dankbaar voor vandaag?" placeholder="Iets kleins of iets groots..." value={gratitudeText} onChange={(e) => setGratitudeText(e.target.value)} />
                <TextAreaInput label="Waar ben je trots op vandaag?" placeholder="Wat heb je goed gedaan..." value={proudText} onChange={(e) => setProudText(e.target.value)} />
                <TextAreaInput label="Wat heb je vandaag geleerd?" placeholder="Over jezelf, anderen of iets nieuws..." value={learnedText} onChange={(e) => setLearnedText(e.target.value)} />
            </div>
            <PrimaryButton onClick={handleSave}>Dag Afsluiten 🌙</PrimaryButton>
        </div>
    );
};
const BreathingScreen = ({ onBack }) => {
    const { addPoints, trackActivity } = usePoints();
    const [breathingState, setBreathingState] = useState('Klaar?');
    const [isActive, setIsActive] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [cycles, setCycles] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setBreathingState('Klaar?');
            if (cycles >= 5 && !sessionComplete) {
                const isMatchDay = new Date().getDay() === 6;
                const basePoints = 25;
                const points = isMatchDay ? basePoints * 2 : basePoints;

                addPoints(points, `Ademhalingsoefening${isMatchDay ? ' (Wedstrijddag 2x!)' : ''}`);
                trackActivity('breathing_sessions');
                trackActivity('toolbox_uses');
                setSessionComplete(true);
            }
            return;
        }

        setBreathingState('Adem in...');
        const sequence = ['Houd vast...', 'Adem uit...', 'Adem in...'];
        let i = 0;
        const interval = setInterval(() => {
            setBreathingState(sequence[i]);
            i = (i + 1) % sequence.length;
            if (i === 0) setCycles(prev => prev + 1);
        }, 4000);
        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <ToolHeader title="Adem Coach" onBack={onBack} />
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-green-100 border-2 border-green-400 rounded-xl p-3 mb-6 max-w-sm">
                    <p className="text-green-800 font-bold text-sm">+{new Date().getDay() === 6 ? '50' : '25'} punten na 5 cycli! {new Date().getDay() === 6 ? '🔥 2x!' : '⭐'}</p>
                </div>
                <div className="mb-6">
                    <p className="text-gray-700 font-bold text-lg">Cycli: {cycles}/5</p>
                </div>
                <div className="relative w-56 h-56 flex items-center justify-center mb-8">
                    {isActive && <div className="absolute w-full h-full bg-red-200 rounded-full animate-pulse"></div>}
                    <div className="w-48 h-48 bg-white border-4 border-red-500 rounded-full flex items-center justify-center z-10 shadow-lg">
                         <h2 className="text-xl md:text-2xl font-bold text-red-700 px-4">{breathingState}</h2>
                    </div>
                </div>
                <button onClick={() => setIsActive(!isActive)} className="bg-red-600 text-white py-4 px-12 rounded-full font-bold shadow-lg hover:bg-red-700 transition-colors">
                    {isActive ? 'Stop' : 'Start'}
                </button>
            </div>
        </div>
    );
};
const FullCheckinScreen = ({ onComplete, onBack }) => {
    const { addPoints, trackActivity } = usePoints();
    const [data, setData] = useState({ physical: 5, mental: 5, concentration: 5, control: 5 });

    const handleComplete = () => {
        const isMatchDay = new Date().getDay() === 6;
        const basePoints = 30;
        const points = isMatchDay ? basePoints * 2 : basePoints;

        addPoints(points, `Volledige Check-in${isMatchDay ? ' (Wedstrijddag 2x!)' : ''}`);
        trackActivity('toolbox_uses');
        onComplete(data);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <ToolHeader title="Volledige Check-in" onBack={onBack} />
            <div className="p-4 flex-grow overflow-y-auto">
                <div className="bg-green-100 border-2 border-green-400 rounded-xl p-3 mb-4 text-center">
                    <p className="text-green-800 font-bold">+{new Date().getDay() === 6 ? '60' : '30'} punten! {new Date().getDay() === 6 ? '🔥 2x Wedstrijddag!' : '⭐'}</p>
                </div>
                <SliderInput label="Hoe voel je je fysiek?" minLabel="Slecht" maxLabel="Uitstekend" value={data.physical} onChange={e => setData({...data, physical: e.target.value})} />
                <SliderInput label="Hoe is je mentale toestand?" minLabel="Overweldigd" maxLabel="Helder" value={data.mental} onChange={e => setData({...data, mental: e.target.value})} />
                <SliderInput label="Hoe is je concentratie?" minLabel="Verstrooid" maxLabel="Gefocust" value={data.concentration} onChange={e => setData({...data, concentration: e.target.value})} />
                <SliderInput label="Hoeveel controle voel je?" minLabel="Geen" maxLabel="Volledig" value={data.control} onChange={e => setData({...data, control: e.target.value})} />
            </div>
            <PrimaryButton onClick={handleComplete}>Check-in Voltooien</PrimaryButton>
        </div>
    );
};

const MatchRitualScreen = ({ onBack, onSave, savedData }) => {
    const [phase, setPhase] = useState('pre'); // 'pre' or 'post'
    const [feeling, setFeeling] = useState(savedData?.feeling || null);
    const [mission, setMission] = useState(savedData?.mission || '');
    const [customMission, setCustomMission] = useState('');
    const [isCustomMission, setIsCustomMission] = useState(false);
    
    const [reflectionGood, setReflectionGood] = useState(savedData?.reflectionGood || '');
    const [reflectionEnjoyed, setReflectionEnjoyed] = useState(savedData?.reflectionEnjoyed || '');
    const [reflectionTryNext, setReflectionTryNext] = useState(savedData?.reflectionTryNext || '');
    const [reflectionLearned, setReflectionLearned] = useState(savedData?.reflectionLearned || '');
    const [selectedBadge, setSelectedBadge] = useState(savedData?.selectedBadge || '');

    const missions = [
        "Ik ga vandaag 2 keer de bal goed afspelen.",
        "Ik geef een compliment aan een teamgenoot.",
        "Ik blijf rustig als ik een fout maak.",
    ];

    const badges = [
        { id: 'durver', icon: '⭐', label: "Durver van de dag" },
        { id: 'teammaat', icon: '🤝', label: "Teammaat van de dag" },
        { id: 'actieheld', icon: '⚡', label: "Actieheld van de dag" },
        { id: 'pinguin', icon: '🐧', label: "Pinguïn van de dag" },
    ];

    const handleSave = () => {
        const finalMission = isCustomMission ? customMission : mission;
        onSave({ feeling, mission: finalMission, reflectionGood, reflectionEnjoyed, reflectionTryNext, reflectionLearned, selectedBadge });
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <ToolHeader title="Wedstrijd Ritueel" onBack={onBack} />
            <div className="p-4 flex-grow overflow-y-auto">
                <div className="flex justify-center bg-gray-200 rounded-full p-1 mb-6">
                    <button onClick={() => setPhase('pre')} className={`w-1/2 py-2 rounded-full font-semibold text-gray-900 ${phase === 'pre' ? 'bg-white shadow' : ''}`}>Voor de wedstrijd</button>
                    <button onClick={() => setPhase('post')} className={`w-1/2 py-2 rounded-full font-semibold text-gray-900 ${phase === 'post' ? 'bg-white shadow' : ''}`}>Na de wedstrijd</button>
                </div>

                {phase === 'pre' && (
                    <div className="space-y-6">
                        {/* Check-in */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-gray-800 text-lg mb-3">Check-in: Hoe voel je je?</h3>
                            <div className="flex justify-around">
                                <button onClick={() => setFeeling('green')} className={`p-3 rounded-full border-4 ${feeling === 'green' ? 'border-green-500' : 'border-transparent'}`}><span className="text-4xl">🙂</span></button>
                                <button onClick={() => setFeeling('orange')} className={`p-3 rounded-full border-4 ${feeling === 'orange' ? 'border-orange-400' : 'border-transparent'}`}><span className="text-4xl">😐</span></button>
                                <button onClick={() => setFeeling('red')} className={`p-3 rounded-full border-4 ${feeling === 'red' ? 'border-red-500' : 'border-transparent'}`}><span className="text-4xl">😟</span></button>
                            </div>
                        </div>
                        {/* Missie kiezen */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-gray-800 text-lg mb-3">Kies je missie</h3>
                            <div className="space-y-2">
                                {missions.map(m => <button key={m} onClick={() => { setMission(m); setIsCustomMission(false); }} className={`w-full text-left p-3 rounded-lg ${mission === m && !isCustomMission ? 'bg-red-100' : 'bg-gray-100'}`}>{m}</button>)}
                                <button onClick={() => setIsCustomMission(true)} className={`w-full text-left p-3 rounded-lg ${isCustomMission ? 'bg-red-100' : 'bg-gray-100'}`}>Bedenk je eigen missie...</button>
                                {isCustomMission && <textarea value={customMission} onChange={(e) => setCustomMission(e.target.value)} className="w-full p-2 mt-2 bg-gray-50 border-2 rounded-lg text-gray-900" placeholder="Typ hier je eigen missie..." />}
                            </div>
                        </div>
                         {/* Visualisatie & Rust */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-gray-800 text-lg mb-2">Focus moment</h3>
                            <p className="text-gray-600 text-sm mb-2"><strong>Visualiseer (1 min):</strong> Doe je ogen dicht en stel je voor dat je een goede actie maakt.</p>
                            <p className="text-gray-600 text-sm"><strong>Ademhaling (1 min):</strong> Adem 3 keer diep in en uit. Voel je voeten op de grond.</p>
                        </div>
                    </div>
                )}

                {phase === 'post' && (
                     <div className="space-y-4">
                        <TextAreaInput label="Wat ging er goed?" value={reflectionGood} onChange={(e) => setReflectionGood(e.target.value)} />
                        <TextAreaInput label="Waar heb ik van genoten?" value={reflectionEnjoyed} onChange={(e) => setReflectionEnjoyed(e.target.value)} />
                        <TextAreaInput label="Wat wil ik volgende keer proberen?" value={reflectionTryNext} onChange={(e) => setReflectionTryNext(e.target.value)} />
                        <TextAreaInput label="Wat heb ik geleerd over mezelf?" value={reflectionLearned} onChange={(e) => setReflectionLearned(e.target.value)} />

                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-gray-800 text-lg mb-3">Compliment aan jezelf</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {badges.map(b => (
                                    <button key={b.id} onClick={() => setSelectedBadge(b.id)} className={`p-3 rounded-lg text-center ${selectedBadge === b.id ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
                                        <span className="text-2xl">{b.icon}</span>
                                        <span className="block text-xs font-semibold">{b.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <PrimaryButton onClick={handleSave}>Ritueel Opslaan in Seizoenboek</PrimaryButton>
        </div>
    );
};


// Wellness App Main Component
const WellnessAppContent = ({ onBack, onLogout, initialView = 'toolbox', user }) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [dailyData, setDailyData] = useState({});
  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const handleToolCompletion = (tool, data) => {
      const today = getTodayDateString();
      setDailyData(prev => ({
          ...prev,
          [today]: {
              ...(prev[today] || {}),
              [tool]: data
          }
      }));
      setCurrentView('toolbox');
  };

  const renderContent = () => {
    const today = getTodayDateString();
    const todayData = dailyData[today] || {};

    switch (currentView) {
      case 'points': return <PointsDashboard onBack={() => setCurrentView('toolbox')} />;
      case 'match_day': return <MatchDay onBack={() => setCurrentView('toolbox')} />;
      case 'journal': return <Journal onBack={() => setCurrentView('toolbox')} user={user} />;
      case 'morning': return <MorningCheckinScreen onBack={() => setCurrentView('toolbox')} onComplete={(data) => handleToolCompletion('morning', data)} user={user} />;
      case 'challenge': return <ChallengeScreen onBack={() => setCurrentView('toolbox')} onComplete={() => handleToolCompletion('challenge', true)} isCompleted={!!todayData.challenge} user={user} />;
      case 'thoughts': return <ThoughtsScreen onBack={() => setCurrentView('toolbox')} onSave={(data) => handleToolCompletion('thoughts', data)} savedThought={todayData.thoughts} user={user} />;
      case 'breathing': return <BreathingScreen onBack={() => setCurrentView('toolbox')} />;
      case 'evening': return <AjaxSleepApp onBack={() => setCurrentView('toolbox')} onLogout={onLogout} user={user} />;
      case 'toolbox':
      default:
        return <ToolboxScreen onSelectTool={setCurrentView} onBack={onBack} onLogout={onLogout} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 md:flex md:items-center md:justify-center">
      <div className="w-full md:max-w-md bg-white md:shadow-2xl font-sans min-h-screen md:min-h-0">
         <style>{`
            .range-thumb::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 24px;
              height: 24px;
              background: #DA291C;
              border-radius: 50%;
              cursor: pointer;
            }
          `}</style>
          {renderContent()}
      </div>
    </div>
  );
};

// Wrapper component with PointsProvider
const WellnessApp = (props) => (
  <PointsProvider userId={props.user?.id}>
    <WellnessAppContent {...props} />
  </PointsProvider>
);


// === MAIN APP SWITCHER ===
const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeApp, setActiveApp] = useState(null);
    const [initialWellnessView, setInitialWellnessView] = useState('toolbox');

    // Inspirational football quotes
    const footballQuotes = [
        { player: "Johan Cruijff", quote: "Voetbal speel je met je hoofd, je voeten zijn alleen maar de hulpmiddelen.", lesson: "Slim denken is sterker dan hard rennen." },
        { player: "Xavi (Barcelona)", quote: "Snel denken is belangrijker dan snel lopen.", lesson: "Je hersenen zijn je superkracht." },
        { player: "Andrea Pirlo", quote: "Rust aan de bal is sterker dan paniekvoetbal.", lesson: "Kalm blijven is vaak de beste truc." },
        { player: "Lionel Messi", quote: "Je moet blijven vechten voor je droom, ook als het moeilijk is.", lesson: "Opgeven is nooit een optie." },
        { player: "Arjen Robben", quote: "Je moet altijd blijven gaan, ook al val je 100 keer.", lesson: "Fouten maken mag, zolang je maar weer opstaat." },
        { player: "Cristiano Ronaldo", quote: "Talent zonder hard werken is niets waard.", lesson: "Slim zijn helpt, maar oefenen maakt je echt goed." },
        { player: "Zlatan Ibrahimović", quote: "Je hoeft niet te doen wat iedereen doet. Doe het op jouw manier.", lesson: "Durf anders te zijn." },
        { player: "George Best", quote: "Probeer het gewoon, anders weet je nooit wat er had kunnen gebeuren.", lesson: "Het is beter iets te proberen dan spijt te hebben." },
        { player: "Diego Simeone", quote: "Inzet is niet te onderhandelen.", lesson: "Je moet altijd je best doen, of je nou wint of verliest." },
        { player: "Johan Cruijff", quote: "Elk nadeel heeft z'n voordeel.", lesson: "Ook als het tegenzit, zit er altijd iets goeds in." }
    ];

    const [dailyQuote] = useState(() => {
        const randomIndex = Math.floor(Math.random() * footballQuotes.length);
        return footballQuotes[randomIndex];
    });

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);

            // Initialize notifications if user is logged in
            if (session?.user) {
                initializeNotifications();
            }
        });

        // Listen for changes on auth state (login, logout, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);

            // Initialize notifications on login
            if (session?.user) {
                initializeNotifications();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const initializeNotifications = async () => {
        // Register service worker
        await notificationService.registerServiceWorker();

        // Check if notifications are already enabled
        if (notificationService.areNotificationsEnabled()) {
            notificationService.scheduleDailyNotifications();
        } else {
            // Ask for permission after a short delay (better UX)
            setTimeout(async () => {
                const granted = await notificationService.requestNotificationPermission();
                if (granted) {
                    notificationService.scheduleDailyNotifications();
                    // Send test notification to confirm it works
                    setTimeout(() => {
                        notificationService.sendTestNotification();
                    }, 1000);
                }
            }, 2000);
        }
    };

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setActiveApp(null);
    };

    const handleSelect = (app, view = 'toolbox') => {
        if (app === 'wellness') {
            setInitialWellnessView(view);
            setActiveApp('wellness');
        } else {
            setActiveApp(app);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">AJAX</h1>
                    <p>Laden...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    if (activeApp === 'sleep') {
        return <AjaxSleepApp onBack={() => setActiveApp(null)} onLogout={handleLogout} user={user} />;
    }

    if (activeApp === 'wellness') {
        return <WellnessApp onBack={() => setActiveApp(null)} onLogout={handleLogout} initialView={initialWellnessView} user={user} />;
    }

    // Direct naar wellness toolbox (alles in 1 overzicht)
    return <WellnessApp onBack={() => setActiveApp(null)} onLogout={handleLogout} initialView="toolbox" user={user} />;
};

export default App;

