import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { signInWithPincode } = useAuth();
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async () => {
    if (pincode.length !== 4) return;

    setLoading(true);
    setError('');

    try {
      const { data, error } = await signInWithPincode(pincode);
      if (error) throw error;
      if (data?.user) navigate('/');
    } catch (error) {
      setError('Onjuiste pincode');
      setPincode('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handlePinPress = (num) => {
    if (pincode.length < 4) {
      const next = pincode + num;
      setPincode(next);
      setError('');
      if (next.length === 4) {
        setTimeout(() => handleSubmitPin(next), 80);
      }
    }
  };

  const handleSubmitPin = async (pin) => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await signInWithPincode(pin);
      if (error) throw error;
      if (data?.user) navigate('/');
    } catch (error) {
      setError('Onjuiste pincode');
      setPincode('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handlePinDelete = () => {
    setPincode(pincode.slice(0, -1));
    setError('');
  };

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#f8f9fb' }}>
      <div className="flex flex-col items-center w-full px-6" style={{ maxWidth: 360 }}>

        {/* Logo / Header */}
        <div className="mb-8 text-center">
          {/* Groeipad logo */}
          <div style={{
            width: 72, height: 72, borderRadius: 20, background: '#DC2626',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(220,38,38,0.25)',
            fontSize: 36,
          }}>
            🌱
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: 0, letterSpacing: -0.5 }}>
            Groeipad
          </h1>
          <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Voer je pincode in om verder te gaan</p>
        </div>

        {/* PIN dots */}
        <div
          className="flex gap-4 mb-6"
          style={{ animation: shake ? 'shake 0.4s ease' : 'none' }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: pincode[i] ? '#DC2626' : '#e5e7eb',
                transition: 'background 0.15s ease',
              }}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontSize: 13, color: '#DC2626', marginBottom: 12, fontWeight: 500 }}>
            {error}
          </p>
        )}

        {/* Number pad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <PinButton
              key={num}
              label={num}
              onClick={() => handlePinPress(num.toString())}
              disabled={loading || pincode.length >= 4}
            />
          ))}

          {/* Empty cell */}
          <div />

          <PinButton
            label="0"
            onClick={() => handlePinPress('0')}
            disabled={loading || pincode.length >= 4}
          />

          {/* Delete */}
          <button
            type="button"
            onClick={handlePinDelete}
            disabled={loading || pincode.length === 0}
            style={{
              height: 60,
              borderRadius: 14,
              border: 'none',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: pincode.length === 0 ? 'not-allowed' : 'pointer',
              opacity: pincode.length === 0 ? 0.3 : 1,
              transition: 'opacity 0.15s',
            }}
            aria-label="Verwijder laatste cijfer"
          >
            <Delete size={20} color="#6b7280" />
          </button>
        </div>

        {/* Footer */}
        <p style={{ marginTop: 40, fontSize: 12, color: '#d1d5db' }}>
          Groeipad © 2026
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </main>
  );
};

const PinButton = ({ label, onClick, disabled }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => { setPressed(false); }}
      style={{
        height: 60,
        borderRadius: 14,
        border: '1.5px solid #f0f0f0',
        background: pressed ? '#f3f4f6' : '#ffffff',
        fontSize: 22,
        fontWeight: 600,
        color: '#111',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        boxShadow: pressed ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
        transform: pressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.1s ease',
      }}
      aria-label={`Cijfer ${label}`}
    >
      {label}
    </button>
  );
};

export default LoginScreen;
