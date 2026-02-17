import React from 'react';
import { Trophy, TrendingUp, Zap, Award, Target, ArrowLeft } from 'lucide-react';
import { usePoints } from '../PointsContext';

const C = {
  bg: '#f8f9fb', white: '#ffffff', red: '#DC2626',
  border: '#f0f0f0', borderMd: '#e5e7eb',
  text: '#111111', textSub: '#6b7280', textMuted: '#9ca3af',
};

const Card = ({ children, style }) => (
  <div style={{
    background: C.white, borderRadius: 16, border: `1.5px solid ${C.border}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 20, ...style,
  }}>
    {children}
  </div>
);

const PointsDashboard = ({ onBack }) => {
  const { totalPoints, weeklyPoints, currentStreak, currentLevel, progressToNextLevel, unlockedAchievements, LEVELS, ACHIEVEMENTS } = usePoints();
  const nextLevel = LEVELS.find(l => l.id === currentLevel.id + 1);

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      {/* Header */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={20} color={C.textSub} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Mijn Punten</span>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 40px' }}>

        {/* Current Level */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Huidig Level</p>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text }}>{currentLevel.name}</h2>
            </div>
            <span style={{ fontSize: 48 }}>{currentLevel.badge}</span>
          </div>

          {nextLevel ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: C.textSub, fontWeight: 600 }}>Naar {nextLevel.name}</span>
                <span style={{ fontSize: 13, color: C.textSub }}>{Math.round(progressToNextLevel)}%</span>
              </div>
              <div style={{ background: C.borderMd, borderRadius: 99, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${progressToNextLevel}%`, height: '100%', background: C.red, borderRadius: 99, transition: 'width 0.5s ease' }} />
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: C.textMuted }}>
                Nog {nextLevel.minPoints - totalPoints} punten nodig
              </p>
            </>
          ) : (
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#92400e' }}>Maximum Level Bereikt! Je bent een Ajax Legende!</p>
            </div>
          )}
        </Card>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { icon: Trophy, label: 'Totaal', value: totalPoints, color: '#f59e0b' },
            { icon: TrendingUp, label: 'Deze Week', value: weeklyPoints, color: '#3b82f6' },
            { icon: Zap, label: 'Streak', value: currentStreak, color: C.red },
          ].map(({ icon: Icon, label, value, color }) => (
            <Card key={label} style={{ padding: 16, textAlign: 'center' }}>
              <Icon size={20} color={color} style={{ margin: '0 auto 8px' }} />
              <p style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 800, color: C.text }}>{value}</p>
              <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>{label}</p>
            </Card>
          ))}
        </div>

        {/* All Levels */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Target size={18} color={C.red} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text }}>Alle Levels</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LEVELS.map(level => {
              const isUnlocked = totalPoints >= level.minPoints;
              const isCurrent = level.id === currentLevel.id;
              return (
                <div key={level.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 12,
                  background: isCurrent ? '#fff5f5' : isUnlocked ? '#f0fdf4' : C.bg,
                  border: `1.5px solid ${isCurrent ? '#fecaca' : isUnlocked ? '#bbf7d0' : C.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28, opacity: isUnlocked ? 1 : 0.3 }}>{level.badge}</span>
                    <div>
                      <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 14, color: isCurrent ? C.red : C.text }}>{level.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>{level.minPoints}–{level.maxPoints === 99999 ? '∞' : level.maxPoints} punten</p>
                    </div>
                  </div>
                  {isCurrent && <span style={{ fontSize: 11, fontWeight: 700, background: C.red, color: '#fff', padding: '4px 10px', borderRadius: 99 }}>Huidig</span>}
                  {isUnlocked && !isCurrent && <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Achievements */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Award size={18} color={C.red} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text }}>
              Achievements ({unlockedAchievements.length}/{Object.keys(ACHIEVEMENTS).length})
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
            {Object.values(ACHIEVEMENTS).map(achievement => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              return (
                <div key={achievement.id} style={{
                  padding: '14px 10px', borderRadius: 12, textAlign: 'center',
                  background: isUnlocked ? '#fefce8' : C.bg,
                  border: `1.5px solid ${isUnlocked ? '#fde68a' : C.border}`,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6, opacity: isUnlocked ? 1 : 0.25 }}>{achievement.icon}</div>
                  <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: isUnlocked ? C.text : C.textMuted }}>{achievement.name}</p>
                  <p style={{ margin: '0 0 6px', fontSize: 11, color: C.textMuted }}>{achievement.description}</p>
                  {isUnlocked && (
                    <span style={{ fontSize: 11, fontWeight: 700, background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: 99 }}>+{achievement.points}</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PointsDashboard;
