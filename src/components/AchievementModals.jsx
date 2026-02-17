import React from 'react';
import { Award } from 'lucide-react';

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999, padding: 24,
};
const card = {
  background: '#fff', borderRadius: 24, padding: 36, textAlign: 'center',
  width: '100%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
};
const closeBtn = {
  background: '#DC2626', color: '#fff', border: 'none',
  padding: '14px 36px', borderRadius: 99, fontWeight: 700, fontSize: 16, cursor: 'pointer',
};

export const LevelUpModal = ({ show, level, onClose }) => {
  if (!show || !level) return null;
  return (
    <div style={overlay} role="dialog" aria-modal="true" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={card}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>{level.badge}</div>
        <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: 1 }}>Level Up!</p>
        <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 900, color: '#111' }}>{level.name}</h2>
        <p style={{ margin: '0 0 28px', color: '#6b7280', fontSize: 14 }}>Je bent nu een echte {level.name}!</p>
        <button onClick={onClose} style={closeBtn}>Geweldig!</button>
      </div>
    </div>
  );
};

export const AchievementModal = ({ show, achievement, onClose }) => {
  if (!show || !achievement) return null;
  return (
    <div style={overlay} role="dialog" aria-modal="true" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={card}>
        <Award size={36} color="#d97706" style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 56, marginBottom: 12 }}>{achievement.icon}</div>
        <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>Achievement Unlocked</p>
        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#111' }}>{achievement.name}</h2>
        <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: 14 }}>{achievement.description}</p>
        <div style={{ background: '#f0fdf4', borderRadius: 99, padding: '8px 20px', display: 'inline-block', marginBottom: 24 }}>
          <span style={{ color: '#15803d', fontWeight: 700, fontSize: 15 }}>+{achievement.points} punten</span>
        </div>
        <br />
        <button onClick={onClose} style={closeBtn}>Super!</button>
      </div>
    </div>
  );
};

export const PointsToast = ({ points, reason, show, onClose }) => {
  if (!show) return null;
  setTimeout(onClose, 3000);
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, background: '#16a34a', color: '#fff', padding: '12px 20px', borderRadius: 99, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
      <span style={{ fontWeight: 700 }}>+{points} punten!</span>
      {reason && <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.9 }}>{reason}</p>}
    </div>
  );
};
