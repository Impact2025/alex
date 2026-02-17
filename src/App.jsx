import React, { useState, useEffect } from 'react';
import { Sun, Zap, Brain, Wind, Moon, BookOpen, CheckCircle, Circle, LogOut, Home, ArrowLeft, Trophy, Delete } from 'lucide-react';
import { PointsProvider, usePoints } from './PointsContext';
import { useAuth } from './contexts/AuthContext';
import Onboarding from './Onboarding';
import { LevelUpModal, AchievementModal } from './components/AchievementModals';
import { RewardModal, DribbelInputModal, GratitudeInputModal } from './components/modals';
import PointsDashboard from './components/PointsDashboard';
import MatchDay from './components/MatchDay';
import Journal from './components/Journal';
import * as dailyEntryService from './dailyEntryService';
import * as notificationService from './notificationService';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#f8f9fb',
  white: '#ffffff',
  red: '#DC2626',
  redHover: '#b91c1c',
  border: '#f0f0f0',
  borderMd: '#e5e7eb',
  text: '#111111',
  textSub: '#6b7280',
  textMuted: '#9ca3af',
  card: '#ffffff',
};

// ─── Shared Components ────────────────────────────────────────────────────────

const PageHeader = ({ title, onBack, onLogout, backLabel }) => (
  <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 10 }}>
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {onBack ? (
        <button onClick={onBack} style={styles.iconBtn} aria-label={backLabel || 'Terug'}>
          <ArrowLeft size={20} color={C.textSub} />
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, background: C.red,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 18,
          }}>
            🌱
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: C.text, letterSpacing: -0.3 }}>{title}</span>
        </div>
      )}
      {onBack && <span style={{ fontWeight: 600, fontSize: 16, color: C.text }}>{title}</span>}
      {onLogout ? (
        <button onClick={onLogout} style={styles.iconBtn} aria-label="Uitloggen">
          <LogOut size={18} color={C.textSub} />
        </button>
      ) : (
        onBack ? <div style={{ width: 40 }} /> : null
      )}
    </div>
  </div>
);

const Card = ({ children, style, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: C.white,
      borderRadius: 16,
      border: `1.5px solid ${C.border}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      padding: 20,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow 0.15s',
      ...style,
    }}
  >
    {children}
  </div>
);

const PrimaryBtn = ({ onClick, children, disabled, style }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: '100%',
      background: disabled ? C.borderMd : C.red,
      color: '#fff',
      fontWeight: 700,
      fontSize: 16,
      border: 'none',
      borderRadius: 14,
      padding: '16px 24px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 0.15s',
      ...style,
    }}
  >
    {children}
  </button>
);

const ProgressBar = ({ value, max }) => (
  <div style={{ background: C.borderMd, borderRadius: 99, height: 6, overflow: 'hidden' }}>
    <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: '100%', background: C.red, borderRadius: 99, transition: 'width 0.4s ease' }} />
  </div>
);

const SliderInput = ({ label, minLabel, maxLabel, value, onChange }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <label style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{label}</label>
      <span style={{ fontWeight: 700, fontSize: 18, color: C.red }}>{value}</span>
    </div>
    <input
      type="range" min="1" max="10" value={value} onChange={onChange}
      style={{ width: '100%', accentColor: C.red, cursor: 'pointer' }}
    />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
      <span style={{ fontSize: 11, color: C.textMuted }}>{minLabel}</span>
      <span style={{ fontSize: 11, color: C.textMuted }}>{maxLabel}</span>
    </div>
  </div>
);

const TextAreaInput = ({ label, placeholder, value, onChange }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 8 }}>{label}</label>
    <textarea
      value={value} onChange={onChange} rows={4} placeholder={placeholder}
      style={{
        width: '100%', boxSizing: 'border-box', padding: '12px 14px',
        border: `1.5px solid ${C.borderMd}`, borderRadius: 12,
        fontSize: 14, color: C.text, background: C.bg, resize: 'vertical',
        outline: 'none', fontFamily: 'inherit',
      }}
    />
  </div>
);

const ToolHeader = ({ title, onBack }) => (
  <PageHeader title={title} onBack={onBack} />
);

const PrimaryButton = ({ onClick, children, disabled }) => (
  <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, background: C.white }}>
    <PrimaryBtn onClick={onClick} disabled={disabled}>{children}</PrimaryBtn>
  </div>
);

const styles = {
  iconBtn: {
    width: 40, height: 40, borderRadius: 10, border: 'none',
    background: 'transparent', display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer',
  },
  page: { minHeight: '100vh', background: C.bg },
  inner: { maxWidth: 960, margin: '0 auto', padding: '24px 24px 40px' },
  innerNarrow: { maxWidth: 640, margin: '0 auto', padding: '24px 24px 40px' },
};

// ─── Sleep App ────────────────────────────────────────────────────────────────

const AjaxSleepAppContent = ({ onBack, onLogout, user }) => {
  const points = usePoints();
  const [currentView, setCurrentView] = useState('home');
  const [dailyGoals, setDailyGoals] = useState(0);
  const [weeklyGoals, setWeeklyGoals] = useState(18);
  const [completedMissions, setCompletedMissions] = useState({});
  const [showReward, setShowReward] = useState(false);
  const [rewardType, setRewardType] = useState('');
  const [playerName] = useState('Kampioen');
  const [showDribbelInput, setShowDribbelInput] = useState(false);
  const [dribbelDare, setDribbelDare] = useState('');
  const [dribbelTry, setDribbelTry] = useState('');
  const [showGratitudeInput, setShowGratitudeInput] = useState(false);
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');

  const cruijffQuotes = [
    "Elk nadeel heb z'n voordeel",
    "Je moet schieten, anders kun je niet scoren",
    "Je gaat het pas zien als je het doorhebt",
    "Als wij de bal hebben, kunnen zij niet scoren",
  ];
  const [dailyQuote] = useState(() => cruijffQuotes[Math.floor(Math.random() * cruijffQuotes.length)]);

  const defaultMissions = [
    { id: 1, name: 'Kick-off Maaltijd', time: '18:00', goals: 0, points: 10, description: 'Eet samen en zeg waar je trots op bent.' },
    { id: 2, name: 'Chillen', time: '18:15', goals: 3, points: 30, description: 'Even relaxen als een echte Ajax-ster.' },
    { id: 3, name: 'Warming-up Johan Cruijff', time: '18:45', goals: 2, points: 20, description: 'Kijk Klokhuis (max. 15 min) + 10 push-ups.' },
    { id: 4, name: 'Fris-op Vrije Trap', time: '19:15', goals: 1, points: 15, description: 'Douchen/wassen, tanden poetsen, pyjama aan.' },
    { id: 5, name: 'Pyjama-Dribbel', time: '19:30', goals: 1, points: 15, description: 'Schrijf: "Vandaag durfde ik..." & "Morgen ga ik proberen..."' },
    { id: 6, name: 'Dankbaarheid', time: '19:35', goals: 1, points: 20, description: 'Schrijf 3 dingen waar je dankbaar voor bent.' },
    { id: 7, name: 'Bonuslevel', time: '19:40', goals: 0.5, points: 10, description: 'Kies 1: Puzzel, creatieve opdracht, of coachvraag.' },
    { id: 8, name: 'Finale Fluitsignaal', time: '20:00', goals: 2, points: 20, description: 'Ogen dicht, glimlach en droom over...' }
  ];

  const weeklyRewards = {
    highfive: { threshold: 20, icon: '🙌', title: 'Rood-Witte High-Five', message: '20 week-goals!' },
    sticker: { threshold: 30, icon: '⚽', title: 'Ajax Stickergool!', message: '30 week-goals!' },
    moment: { threshold: 35, icon: '👨‍👩‍👧', title: 'Johan Cruijff Moment', message: '35 week-goals!' },
    trophy: { threshold: 45, icon: '🏆', title: 'Arena Trofee!', message: '45 week-goals!' }
  };

  const [missions] = useState(defaultMissions);

  const completeMission = async (missionId) => {
    if (!completedMissions[missionId]) {
      const mission = missions.find(m => m.id === missionId);
      const newWeeklyTotal = weeklyGoals + mission.goals;
      setCompletedMissions(prev => ({ ...prev, [missionId]: true }));
      setDailyGoals(prev => prev + mission.goals);
      setWeeklyGoals(newWeeklyTotal);
      if (mission.points) points.addPoints(mission.points, mission.name);
      if (user) await dailyEntryService.saveCompletedMission(user.id, missionId);
      const currentHour = new Date().getHours();
      if (missionId === 8 && currentHour < 20) points.trackActivity('early_bird');
      for (const [key, reward] of Object.entries(weeklyRewards)) {
        if (newWeeklyTotal >= reward.threshold && weeklyGoals < reward.threshold) {
          setRewardType(key); setShowReward(true); break;
        }
      }
    }
  };

  const handleDribbelSubmit = async () => {
    if (dribbelDare.trim() && dribbelTry.trim()) {
      if (user) await dailyEntryService.saveDribbelData(user.id, dribbelDare, dribbelTry);
      completeMission(5);
      setDribbelDare(''); setDribbelTry(''); setShowDribbelInput(false);
    }
  };

  const handleGratitudeSubmit = async () => {
    if (gratitude1.trim() && gratitude2.trim() && gratitude3.trim()) {
      if (user) await dailyEntryService.saveGratitudeData(user.id, gratitude1, gratitude2, gratitude3);
      completeMission(6);
      setGratitude1(''); setGratitude2(''); setGratitude3(''); setShowGratitudeInput(false);
    }
  };

  // ── Home Screen ──
  const HomeScreen = () => {
    const progress = Math.min((dailyGoals / 9.5) * 100, 100);
    return (
      <div style={styles.page}>
        <PageHeader title="Avondritueel" onLogout={onLogout} />
        <div style={styles.inner}>
          {/* Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>⚽</div>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text }}>{playerName}</h2>
              <p style={{ margin: 0, fontSize: 13, color: C.textMuted }}>{points.totalPoints} punten</p>
            </div>
          </div>

          {/* Progress */}
          <Card style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.textSub }}>Vandaag</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: C.text }}>
                {dailyGoals.toFixed(1)}<span style={{ fontSize: 16, color: C.textMuted }}>/9.5</span>
              </span>
            </div>
            <ProgressBar value={dailyGoals} max={9.5} />
          </Card>

          <PrimaryBtn onClick={() => setCurrentView('missions')}>Start Missies</PrimaryBtn>

          {/* Quote */}
          <p style={{ marginTop: 32, fontSize: 13, color: C.textMuted, fontStyle: 'italic', textAlign: 'center' }}>"{dailyQuote}" — Cruijff</p>
        </div>
      </div>
    );
  };

  // ── Missions Screen ──
  const MissionsScreen = () => {
    const completedCount = Object.keys(completedMissions).length;
    return (
      <div style={styles.page}>
        <PageHeader title="Missies" onBack={() => setCurrentView('home')} />
        <div style={styles.inner}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {missions.map((mission) => {
              const done = !!completedMissions[mission.id];
              return (
                <div key={mission.id} style={{
                  background: done ? '#fff5f5' : C.white,
                  borderRadius: 14, border: `1.5px solid ${done ? '#fecaca' : C.border}`,
                  padding: '16px 16px', display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}>
                  <button
                    onClick={() => {
                      if (mission.id === 5) setShowDribbelInput(true);
                      else if (mission.id === 6) setShowGratitudeInput(true);
                      else completeMission(mission.id);
                    }}
                    disabled={done}
                    style={{
                      flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
                      border: 'none', background: done ? C.red : C.borderMd,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: done ? 'default' : 'pointer',
                    }}
                  >
                    {done
                      ? <CheckCircle size={18} color="#fff" />
                      : <Circle size={18} color={C.textSub} />
                    }
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: done ? C.red : C.text }}>{mission.name}</span>
                      <span style={{ fontSize: 11, color: C.textMuted }}>{mission.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: done ? '#ef4444' : C.textSub }}>{mission.description}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.red, flexShrink: 0 }}>+{mission.points}p</span>
                </div>
              );
            })}
          </div>

          {completedCount > 0 && (
            <div style={{ marginTop: 24 }}>
              <PrimaryBtn onClick={() => setCurrentView('finish')}>Dag Afsluiten</PrimaryBtn>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Finish Screen ──
  const FinishScreen = () => {
    const todayPoints = missions.filter(m => completedMissions[m.id]).reduce((s, m) => s + (m.points || 0), 0);
    const dreamMessages = ["...een geweldige goal!", "...het kampioenschap!", "...de Ajax Arena die juicht!"];
    const [dream] = useState(() => dreamMessages[Math.floor(Math.random() * dreamMessages.length)]);

    return (
      <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌙</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: '0 0 8px' }}>Goed Gedaan!</h1>
          <p style={{ color: C.textSub, marginBottom: 32 }}>Je hebt vandaag missies volbracht!</p>

          <Card style={{ marginBottom: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, margin: '0 0 8px' }}>Vandaag verdiend</p>
            <p style={{ fontSize: 52, fontWeight: 900, color: C.red, margin: '0 0 4px' }}>+{todayPoints}</p>
            <p style={{ fontSize: 13, color: C.textSub, margin: '0 0 20px' }}>punten</p>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
              <p style={{ fontSize: 12, color: C.textMuted, margin: '0 0 4px' }}>Totaal</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>{points.totalPoints}</p>
            </div>
          </Card>

          <Card style={{ marginBottom: 24, background: '#fff5f5', borderColor: '#fecaca' }}>
            <p style={{ fontSize: 13, color: C.textSub, margin: '0 0 6px' }}>Droom nu over...</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{dream}</p>
          </Card>

          <PrimaryBtn onClick={onLogout}>Sluiten & Welterusten</PrimaryBtn>
        </div>
      </div>
    );
  };

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
    <>
      <RewardModal show={showReward} rewardType={rewardType} onClose={() => setShowReward(false)} weeklyRewards={weeklyRewards} />
      <DribbelInputModal show={showDribbelInput} onClose={() => setShowDribbelInput(false)} onSubmit={handleDribbelSubmit}
        dareValue={dribbelDare} onDareChange={e => setDribbelDare(e.target.value)}
        tryValue={dribbelTry} onTryChange={e => setDribbelTry(e.target.value)} />
      <GratitudeInputModal show={showGratitudeInput} onClose={() => setShowGratitudeInput(false)} onSubmit={handleGratitudeSubmit}
        value1={gratitude1} onChange1={e => setGratitude1(e.target.value)}
        value2={gratitude2} onChange2={e => setGratitude2(e.target.value)}
        value3={gratitude3} onChange3={e => setGratitude3(e.target.value)} />
      <LevelUpModal show={points.showLevelUp} level={points.newLevel} onClose={() => points.setShowLevelUp(false)} />
      <AchievementModal show={points.showAchievement !== null} achievement={points.showAchievement} onClose={() => points.setShowAchievement(null)} />
      {renderContent()}
    </>
  );
};

const AjaxSleepApp = (props) => (
  <PointsProvider userId={props.user?.id}>
    <AjaxSleepAppContent {...props} />
  </PointsProvider>
);

// ─── Wellness Toolbox ─────────────────────────────────────────────────────────

const tools = [
  { id: 'morning',    icon: Sun,      label: 'Morgen Kick-Off',      sub: 'Begin je dag sterk',       points: 30, color: '#f59e0b' },
  { id: 'challenge',  icon: Zap,      label: 'Missie van de Dag',    sub: 'Dagelijkse uitdaging',     points: 25, color: '#3b82f6' },
  { id: 'thoughts',   icon: Brain,    label: 'Gedachten Dump',       sub: 'Schrijf je gedachten',     points: 15, color: '#8b5cf6' },
  { id: 'breathing',  icon: Wind,     label: 'Krachtoefening',       sub: 'Adem & focus',             points: 25, color: '#06b6d4' },
  { id: 'evening',    icon: Moon,     label: 'Avondritueel',         sub: 'Missies voor het slapen',  points: 20, color: '#6366f1' },
  { id: 'journal',    icon: BookOpen, label: 'Logboek',              sub: 'Jouw persoonlijk dagboek', points: 10, color: '#ec4899' },
];

const footballQuotes = [
  { player: "Johan Cruijff",       quote: "Elk nadeel heb z'n voordeel." },
  { player: "Johan Cruijff",       quote: "Voetbal speel je met je hoofd." },
  { player: "Lionel Messi",        quote: "Je moet blijven vechten voor je droom." },
  { player: "Arjen Robben",        quote: "Je moet altijd blijven gaan, ook al val je 100 keer." },
  { player: "Cristiano Ronaldo",   quote: "Talent zonder hard werken is niets waard." },
];

const ToolboxScreen = ({ onSelectTool, onLogout }) => {
  const { totalPoints, currentLevel } = usePoints();
  const isMatchDay = new Date().getDay() === 6;
  const [quote] = useState(() => footballQuotes[Math.floor(Math.random() * footballQuotes.length)]);

  return (
    <div style={styles.page}>
      <PageHeader title="Groeipad" onLogout={onLogout} />
      <div style={styles.inner}>

        {/* Level Card */}
        <Card style={{ marginBottom: 20, cursor: 'pointer' }} onClick={() => onSelectTool('points')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: 12, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{currentLevel.name}</p>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: C.text }}>{totalPoints} <span style={{ fontSize: 14, fontWeight: 400, color: C.textMuted }}>punten</span></p>
            </div>
            <span style={{ fontSize: 36 }}>{currentLevel.badge}</span>
          </div>
          <ProgressBar value={totalPoints} max={currentLevel.nextLevelThreshold || 100} />
          <p style={{ margin: '8px 0 0', fontSize: 11, color: C.textMuted, textAlign: 'right' }}>Tik voor details →</p>
        </Card>

        {/* Match Day */}
        {isMatchDay && (
          <div
            onClick={() => onSelectTool('match_day')}
            style={{ background: C.red, borderRadius: 16, padding: '16px 20px', marginBottom: 20, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <p style={{ margin: '0 0 2px', color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600 }}>VANDAAG</p>
              <p style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: 18 }}>Wedstrijddag ⚽</p>
              <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Dubbele punten actief</p>
            </div>
            <span style={{ fontSize: 36 }}>🔥</span>
          </div>
        )}

        {/* Tools Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                style={{
                  background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 16,
                  padding: '18px 16px', textAlign: 'left', cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: `${tool.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                }}>
                  <Icon size={22} color={tool.color} />
                </div>
                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 13, color: C.text, lineHeight: 1.3 }}>{tool.label}</p>
                <p style={{ margin: '0 0 10px', fontSize: 11, color: C.textMuted, lineHeight: 1.3 }}>{tool.sub}</p>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.red }}>+{tool.points}p</p>
              </button>
            );
          })}
        </div>

        {/* Quote */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: C.textSub, fontStyle: 'italic' }}>"{quote.quote}"</p>
          <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>— {quote.player}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Tool Screens ─────────────────────────────────────────────────────────────

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
  const isMatchDay = new Date().getDay() === 6;
  const pts = isMatchDay ? 60 : 30;

  useEffect(() => {
    const load = async () => {
      if (user) {
        const entry = await dailyEntryService.getTodayEntry(user.id);
        if (entry?.morning_goal) {
          setSleep(entry.morning_sleep || 5); setGoal(entry.morning_goal || '');
          setPhysical(entry.morning_physical || 5); setMental(entry.morning_mental || 5);
          setConcentration(entry.morning_concentration || 5); setControl(entry.morning_control || 5);
          setHasExistingEntry(true);
        }
      }
      setIsLoading(false);
    };
    load();
  }, [user]);

  const handleComplete = async () => {
    if (!hasExistingEntry) { addPoints(pts, `Morgen Kick-Off${isMatchDay ? ' (2x!)' : ''}`); trackActivity('toolbox_uses'); }
    if (user) await dailyEntryService.saveMorningCheckin(user.id, { sleep, goal, physical, mental, concentration, control });
    onComplete({ sleep, goal, physical, mental, concentration, control });
  };

  if (isLoading) return <div style={styles.page}><ToolHeader title="Morgen Kick-Off" onBack={onBack} /><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}><p style={{ color: C.textMuted }}>Laden...</p></div></div>;

  return (
    <div style={{ ...styles.page, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ToolHeader title="Morgen Kick-Off" onBack={onBack} />
      <div style={{ ...styles.innerNarrow, flex: 1, overflowY: 'auto' }}>
        <div style={{ background: hasExistingEntry ? '#eff6ff' : '#f0fdf4', border: `1px solid ${hasExistingEntry ? '#bfdbfe' : '#bbf7d0'}`, borderRadius: 12, padding: '12px 16px', marginBottom: 20, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: hasExistingEntry ? '#1d4ed8' : '#15803d' }}>
            {hasExistingEntry ? '✏️ Vandaag al ingevuld — je kunt het aanpassen.' : `🎉 +${pts} punten${isMatchDay ? ' (2x Wedstrijddag!)' : ''}!`}
          </p>
        </div>
        <Card style={{ marginBottom: 12 }}>
          <SliderInput label="Hoe heb je geslapen?" minLabel="Slecht" maxLabel="Heel goed" value={sleep} onChange={e => setSleep(e.target.value)} />
          <SliderInput label="Hoe voel je je fysiek?" minLabel="Slecht" maxLabel="Uitstekend" value={physical} onChange={e => setPhysical(e.target.value)} />
          <SliderInput label="Mentale toestand?" minLabel="Overweldigd" maxLabel="Helder" value={mental} onChange={e => setMental(e.target.value)} />
          <SliderInput label="Concentratie?" minLabel="Verstrooid" maxLabel="Gefocust" value={concentration} onChange={e => setConcentration(e.target.value)} />
          <SliderInput label="Controle?" minLabel="Geen" maxLabel="Volledig" value={control} onChange={e => setControl(e.target.value)} />
        </Card>
        <Card>
          <TextAreaInput label="Wat is je doel voor vandaag?" placeholder="Eén klein ding..." value={goal} onChange={e => setGoal(e.target.value)} />
        </Card>
      </div>
      <PrimaryButton onClick={handleComplete}>{hasExistingEntry ? 'Wijzigingen Opslaan' : 'Start de Dag!'}</PrimaryButton>
    </div>
  );
};

const todayChallenge = "Drink vandaag 8 glazen water.";
const ChallengeScreen = ({ onBack, onComplete, isCompleted, user }) => {
  const { addPoints, trackActivity } = usePoints();
  const isMatchDay = new Date().getDay() === 6;
  const pts = isMatchDay ? 50 : 25;

  const handleComplete = async () => {
    if (!isCompleted) {
      addPoints(pts, `Missie van de Dag${isMatchDay ? ' (2x!)' : ''}`);
      trackActivity('toolbox_uses');
      if (user) await dailyEntryService.saveChallenge(user.id);
      onComplete();
    }
  };

  return (
    <div style={{ ...styles.page, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ToolHeader title="Missie van de Dag" onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          {!isCompleted && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '10px 16px', marginBottom: 24 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#15803d' }}>+{pts} punten{isMatchDay ? ' 🔥 2x!' : ' ⭐'}</p>
            </div>
          )}
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: isCompleted ? '#f0fdf4' : '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            {isCompleted ? <CheckCircle size={44} color="#16a34a" /> : <Zap size={44} color={C.red} />}
          </div>
          <Card style={{ marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: C.text }}>{todayChallenge}</p>
          </Card>
          <PrimaryBtn onClick={handleComplete} disabled={isCompleted}>
            {isCompleted ? '✓ Voltooid!' : 'Missie Volbracht!'}
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
};

const ThoughtsScreen = ({ onBack, onSave, savedThought, user }) => {
  const { addPoints, trackActivity } = usePoints();
  const [text, setText] = useState(savedThought || '');
  const isMatchDay = new Date().getDay() === 6;
  const pts = isMatchDay ? 30 : 15;

  const handleSave = async () => {
    if (text.trim()) {
      addPoints(pts, `Gedachten Dump${isMatchDay ? ' (2x!)' : ''}`);
      trackActivity('toolbox_uses');
      if (user) await dailyEntryService.saveThoughts(user.id, text);
      onSave(text);
    }
  };

  return (
    <div style={{ ...styles.page, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ToolHeader title="Gedachten Dump" onBack={onBack} />
      <div style={{ ...styles.innerNarrow, flex: 1 }}>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '10px 16px', marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#15803d' }}>+{pts} punten{isMatchDay ? ' 🔥 2x!' : ' ⭐'}</p>
        </div>
        <Card>
          <TextAreaInput label="Waar denk je aan?" placeholder="Schrijf alles op wat in je opkomt..." value={text} onChange={e => setText(e.target.value)} />
        </Card>
      </div>
      <PrimaryButton onClick={handleSave}>Opslaan</PrimaryButton>
    </div>
  );
};

const BreathingScreen = ({ onBack }) => {
  const { addPoints, trackActivity } = usePoints();
  const [breathingState, setBreathingState] = useState('Klaar?');
  const [isActive, setIsActive] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [cycles, setCycles] = useState(0);
  const isMatchDay = new Date().getDay() === 6;
  const pts = isMatchDay ? 50 : 25;

  useEffect(() => {
    if (!isActive) {
      setBreathingState('Klaar?');
      if (cycles >= 5 && !sessionComplete) {
        addPoints(pts, `Ademhalingsoefening${isMatchDay ? ' (2x!)' : ''}`);
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
  }, [isActive, cycles, sessionComplete]);

  return (
    <div style={{ ...styles.page, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ToolHeader title="Krachtoefening" onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '10px 20px', marginBottom: 32 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#15803d' }}>+{pts} punten na 5 cycli{isMatchDay ? ' 🔥 2x!' : ''}</p>
        </div>

        {/* Cycle counter */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: i <= cycles ? C.red : C.borderMd, transition: 'background 0.3s' }} />
            ))}
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: C.textMuted }}>cycli {cycles}/5</p>
        </div>

        {/* Breathing circle */}
        <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
          {isActive && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: `${C.red}18`, animation: 'breathePulse 4s ease-in-out infinite',
            }} />
          )}
          <div style={{
            width: 160, height: 160, borderRadius: '50%',
            border: `3px solid ${C.red}`, background: C.white,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(220,38,38,0.15)',
          }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.red }}>{breathingState}</span>
          </div>
        </div>

        <button
          onClick={() => setIsActive(!isActive)}
          style={{
            background: isActive ? C.borderMd : C.red, color: isActive ? C.textSub : '#fff',
            border: 'none', borderRadius: 99, padding: '14px 40px',
            fontSize: 16, fontWeight: 700, cursor: 'pointer',
          }}
        >
          {isActive ? 'Stop' : 'Start'}
        </button>
      </div>
      <style>{`@keyframes breathePulse { 0%,100%{transform:scale(1);opacity:.3} 50%{transform:scale(1.2);opacity:.6} }`}</style>
    </div>
  );
};

const MatchRitualScreen = ({ onBack, onSave, savedData }) => {
  const [phase, setPhase] = useState('pre');
  const [feeling, setFeeling] = useState(savedData?.feeling || null);
  const [mission, setMission] = useState(savedData?.mission || '');
  const [customMission, setCustomMission] = useState('');
  const [isCustomMission, setIsCustomMission] = useState(false);
  const [reflectionGood, setReflectionGood] = useState(savedData?.reflectionGood || '');
  const [reflectionEnjoyed, setReflectionEnjoyed] = useState(savedData?.reflectionEnjoyed || '');
  const [reflectionTryNext, setReflectionTryNext] = useState(savedData?.reflectionTryNext || '');
  const [reflectionLearned, setReflectionLearned] = useState(savedData?.reflectionLearned || '');
  const [selectedBadge, setSelectedBadge] = useState(savedData?.selectedBadge || '');

  const missionOptions = [
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
    <div style={{ ...styles.page, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ToolHeader title="Wedstrijd Ritueel" onBack={onBack} />
      <div style={{ ...styles.innerNarrow, flex: 1, overflowY: 'auto' }}>
        {/* Phase Toggle */}
        <div style={{ display: 'flex', background: C.borderMd, borderRadius: 99, padding: 4, marginBottom: 24 }}>
          {['pre', 'post'].map(p => (
            <button key={p} onClick={() => setPhase(p)} style={{
              flex: 1, padding: '8px 0', borderRadius: 99, border: 'none',
              background: phase === p ? C.white : 'transparent',
              fontWeight: 600, fontSize: 13, color: phase === p ? C.text : C.textSub,
              cursor: 'pointer', boxShadow: phase === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
            }}>
              {p === 'pre' ? 'Voor de wedstrijd' : 'Na de wedstrijd'}
            </button>
          ))}
        </div>

        {phase === 'pre' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Card>
              <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 14, color: C.text }}>Hoe voel je je?</p>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {[['green','🙂'],['orange','😐'],['red','😟']].map(([color, emoji]) => (
                  <button key={color} onClick={() => setFeeling(color)} style={{
                    fontSize: 40, background: 'none', border: `3px solid ${feeling === color ? C.red : 'transparent'}`,
                    borderRadius: 12, padding: 8, cursor: 'pointer', transition: 'border-color 0.15s',
                  }}>{emoji}</button>
                ))}
              </div>
            </Card>
            <Card>
              <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 14, color: C.text }}>Kies je missie</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {missionOptions.map(m => (
                  <button key={m} onClick={() => { setMission(m); setIsCustomMission(false); }} style={{
                    textAlign: 'left', padding: '10px 14px', borderRadius: 10,
                    border: `1.5px solid ${mission === m && !isCustomMission ? C.red : C.border}`,
                    background: mission === m && !isCustomMission ? '#fff5f5' : C.bg,
                    fontSize: 13, color: C.text, cursor: 'pointer',
                  }}>{m}</button>
                ))}
                <button onClick={() => setIsCustomMission(true)} style={{
                  textAlign: 'left', padding: '10px 14px', borderRadius: 10,
                  border: `1.5px solid ${isCustomMission ? C.red : C.border}`,
                  background: isCustomMission ? '#fff5f5' : C.bg,
                  fontSize: 13, color: C.text, cursor: 'pointer',
                }}>Bedenk je eigen missie...</button>
                {isCustomMission && (
                  <textarea value={customMission} onChange={e => setCustomMission(e.target.value)}
                    placeholder="Typ hier je eigen missie..."
                    style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${C.borderMd}`, fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }} />
                )}
              </div>
            </Card>
            <Card>
              <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: 14, color: C.text }}>Focus moment</p>
              <p style={{ margin: '0 0 6px', fontSize: 13, color: C.textSub }}><strong>Visualiseer (1 min):</strong> Ogen dicht, stel je voor dat je een goede actie maakt.</p>
              <p style={{ margin: 0, fontSize: 13, color: C.textSub }}><strong>Adem (1 min):</strong> 3x diep in en uit. Voel je voeten.</p>
            </Card>
          </div>
        )}

        {phase === 'post' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Card>
              <TextAreaInput label="Wat ging er goed?" value={reflectionGood} onChange={e => setReflectionGood(e.target.value)} placeholder="" />
              <TextAreaInput label="Waar heb ik van genoten?" value={reflectionEnjoyed} onChange={e => setReflectionEnjoyed(e.target.value)} placeholder="" />
              <TextAreaInput label="Wat wil ik volgende keer proberen?" value={reflectionTryNext} onChange={e => setReflectionTryNext(e.target.value)} placeholder="" />
              <TextAreaInput label="Wat heb ik over mezelf geleerd?" value={reflectionLearned} onChange={e => setReflectionLearned(e.target.value)} placeholder="" />
            </Card>
            <Card>
              <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 14, color: C.text }}>Compliment aan jezelf</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {badges.map(b => (
                  <button key={b.id} onClick={() => setSelectedBadge(b.id)} style={{
                    padding: '12px 8px', borderRadius: 12, border: `1.5px solid ${selectedBadge === b.id ? C.red : C.border}`,
                    background: selectedBadge === b.id ? '#fff5f5' : C.bg, cursor: 'pointer', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{b.icon}</div>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: C.text }}>{b.label}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
      <PrimaryButton onClick={handleSave}>Opslaan in Seizoenboek</PrimaryButton>
    </div>
  );
};

// ─── Wellness Main ────────────────────────────────────────────────────────────

const WellnessAppContent = ({ onBack, onLogout, initialView = 'toolbox', user }) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [dailyData, setDailyData] = useState({});
  const today = new Date().toISOString().split('T')[0];

  const handleToolCompletion = (tool, data) => {
    setDailyData(prev => ({ ...prev, [today]: { ...(prev[today] || {}), [tool]: data } }));
    setCurrentView('toolbox');
  };

  const todayData = dailyData[today] || {};

  switch (currentView) {
    case 'points':     return <PointsDashboard onBack={() => setCurrentView('toolbox')} />;
    case 'match_day':  return <MatchDay onBack={() => setCurrentView('toolbox')} />;
    case 'journal':    return <Journal onBack={() => setCurrentView('toolbox')} user={user} />;
    case 'morning':    return <MorningCheckinScreen onBack={() => setCurrentView('toolbox')} onComplete={d => handleToolCompletion('morning', d)} user={user} />;
    case 'challenge':  return <ChallengeScreen onBack={() => setCurrentView('toolbox')} onComplete={() => handleToolCompletion('challenge', true)} isCompleted={!!todayData.challenge} user={user} />;
    case 'thoughts':   return <ThoughtsScreen onBack={() => setCurrentView('toolbox')} onSave={d => handleToolCompletion('thoughts', d)} savedThought={todayData.thoughts} user={user} />;
    case 'breathing':  return <BreathingScreen onBack={() => setCurrentView('toolbox')} />;
    case 'evening':    return <AjaxSleepApp onBack={() => setCurrentView('toolbox')} onLogout={onLogout} user={user} />;
    default:
      return <ToolboxScreen onSelectTool={setCurrentView} onBack={onBack} onLogout={onLogout} />;
  }
};

const WellnessApp = (props) => (
  <PointsProvider userId={props.user?.id}>
    <WellnessAppContent {...props} />
  </PointsProvider>
);

// ─── Root App ─────────────────────────────────────────────────────────────────

const App = () => {
  const { user, loading, signOut } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user && !localStorage.getItem('groeipad_onboarded')) {
      setShowOnboarding(true);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      await notificationService.registerServiceWorker();
      if (notificationService.areNotificationsEnabled()) {
        notificationService.scheduleDailyNotifications();
      } else {
        setTimeout(async () => {
          const granted = await notificationService.requestNotificationPermission();
          if (granted) {
            notificationService.scheduleDailyNotifications();
            setTimeout(() => notificationService.sendTestNotification(), 1000);
          }
        }, 2000);
      }
    };
    init();
  }, [user]);

  const handleLogout = () => { signOut(); setShowOnboarding(false); };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, background: C.red,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(220,38,38,0.25)',
            fontSize: 40,
          }}>
            🌱
          </div>
          <p style={{ color: C.textMuted, fontSize: 13 }}>Laden...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onDone={() => setShowOnboarding(false)} />;
  }

  return <WellnessApp onLogout={handleLogout} initialView="toolbox" user={user} />;
};

export default App;
