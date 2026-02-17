import React, { useState } from 'react';

const slides = [
  {
    emoji: '🌱',
    title: 'Welkom bij Groeipad',
    text: 'Jouw plek om elke dag een beetje te groeien. Rustig, zonder druk.',
  },
  {
    emoji: '☀️',
    title: 'Begin je dag goed',
    text: 'Check elke ochtend even in. Hoe sliep je? Wat is je doel vandaag? Kleine vragen, grote impact.',
  },
  {
    emoji: '🌙',
    title: 'Sluit je dag af',
    text: 'Met het avondritueel rond je de dag rustig af. Missies, dankbaarheid, en dromen.',
  },
  {
    emoji: '⭐',
    title: 'Zie hoe je groeit',
    text: 'Je verdient punten voor alles wat je doet. Niet om te winnen — maar om te zien hoe ver je al gekomen bent.',
  },
];

const C = {
  bg: '#f8f9fb', white: '#ffffff', red: '#DC2626',
  border: '#f0f0f0', text: '#111111', textSub: '#6b7280', textMuted: '#9ca3af',
};

const Onboarding = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const isLast = step === slides.length - 1;

  const next = () => {
    if (isLast) {
      localStorage.setItem('groeipad_onboarded', '1');
      onDone();
    } else {
      setStep(s => s + 1);
    }
  };

  const skip = () => {
    localStorage.setItem('groeipad_onboarded', '1');
    onDone();
  };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>

        {/* Emoji */}
        <div style={{
          fontSize: 72, marginBottom: 32, lineHeight: 1,
          transition: 'all 0.3s ease',
        }}>
          {slide.emoji}
        </div>

        {/* Text */}
        <div style={{ minHeight: 100 }}>
          <h2 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>
            {slide.title}
          </h2>
          <p style={{ margin: 0, fontSize: 15, color: C.textSub, lineHeight: 1.6 }}>
            {slide.text}
          </p>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '40px 0' }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 99,
              background: i === step ? C.red : '#e5e7eb',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        {/* Buttons */}
        <button
          onClick={next}
          style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none',
            background: C.red, color: '#fff', fontWeight: 700, fontSize: 16,
            cursor: 'pointer', marginBottom: 12,
          }}
        >
          {isLast ? 'Aan de slag!' : 'Volgende'}
        </button>

        {!isLast && (
          <button
            onClick={skip}
            style={{
              background: 'none', border: 'none', color: C.textMuted,
              fontSize: 14, cursor: 'pointer', padding: '8px',
            }}
          >
            Overslaan
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
