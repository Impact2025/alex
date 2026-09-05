import React from 'react';

const OPTIONS = [
  { id: 'green', emoji: '🙂', label: 'Rustig', color: '#22c55e' },
  { id: 'orange', emoji: '😣', label: 'Onrustig', color: '#f59e0b' },
  { id: 'red', emoji: '😠', label: 'Boos / Dicht', color: '#dc2626' },
];

// Non-verbale uitweg: als het kind Oranje of Rood aantikt, schakelt de app
// door naar de Cooling Down-modus in plaats van gewoon de status op te slaan.
const EmotionThermometer = ({ onSelect }) => {
  return (
    <div style={{
      background: '#ffffff', border: '1.5px solid #f0f0f0', borderRadius: 16,
      padding: '16px 20px', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Hoe voel je je nu?
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        {OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            aria-label={opt.label}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '10px 4px', borderRadius: 12, border: `2px solid ${opt.color}33`,
              background: `${opt.color}0f`, cursor: 'pointer', transition: 'transform 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: 28 }}>{opt.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: opt.color }}>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmotionThermometer;
