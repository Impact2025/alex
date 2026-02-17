import React, { useEffect, useRef } from 'react';
import { trapFocus, handleEscapeKey } from '../../utils/keyboardNav';
import { announceModal } from '../../utils/announcer';
import { sanitizeTextInput } from '../../utils/validation';

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999, padding: 24,
};
const card = {
  background: '#fff', borderRadius: 20, padding: 28,
  width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
};
const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '10px 14px',
  border: '1.5px solid #e5e7eb', borderRadius: 10,
  fontSize: 14, fontFamily: 'inherit', outline: 'none',
};
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };

const GratitudeInputModal = ({ show, onClose, onSubmit, value1, onChange1, value2, onChange2, value3, onChange3 }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    announceModal(true, 'Dankbaarheid');
    const cleanupEscape = handleEscapeKey(onClose);
    const cleanupFocus = modalRef.current ? trapFocus(modalRef.current) : () => {};
    return () => { cleanupEscape(); cleanupFocus(); announceModal(false, 'Dankbaarheid'); };
  }, [show, onClose]);

  if (!show) return null;

  const isDisabled = !value1.trim() || !value2.trim() || !value3.trim();

  const handleSubmit = () => {
    const s1 = sanitizeTextInput(value1);
    const s2 = sanitizeTextInput(value2);
    const s3 = sanitizeTextInput(value3);
    if (s1 && s2 && s3) onSubmit();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && !isDisabled) handleSubmit();
  };

  return (
    <div style={overlay} role="dialog" aria-modal="true" aria-labelledby="gratitude-title" onClick={e => e.target === e.currentTarget && onClose()}>
      <div ref={modalRef} style={card} onKeyDown={handleKeyDown}>
        <h2 id="gratitude-title" style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800, color: '#111' }}>Dankbaarheid ⭐</h2>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#6b7280' }}>Schrijf 3 dingen waar je vandaag dankbaar voor bent:</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { id: 'g1', label: '1. Ik ben dankbaar voor...', value: value1, onChange: onChange1, placeholder: '...mijn familie' },
            { id: 'g2', label: '2. Ik ben dankbaar voor...', value: value2, onChange: onChange2, placeholder: '...mijn vrienden' },
            { id: 'g3', label: '3. Ik ben dankbaar voor...', value: value3, onChange: onChange3, placeholder: '...voetbal kunnen spelen' },
          ].map(({ id, label, value, onChange, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} style={labelStyle}>{label}</label>
              <input id={id} type="text" value={value} onChange={onChange} placeholder={placeholder}
                style={inputStyle} aria-required="true"
                onFocus={e => e.target.style.borderColor = '#DC2626'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleSubmit} disabled={isDisabled} style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: isDisabled ? '#d1d5db' : '#DC2626', color: '#fff',
            fontWeight: 700, fontSize: 15, cursor: isDisabled ? 'not-allowed' : 'pointer',
          }}>
            Voltooi Missie
          </button>
          <button onClick={onClose} style={{
            width: '100%', padding: '10px', borderRadius: 12, border: 'none',
            background: 'transparent', color: '#6b7280', fontWeight: 600, cursor: 'pointer', fontSize: 14,
          }}>
            Annuleren
          </button>
        </div>
      </div>
    </div>
  );
};

export default GratitudeInputModal;
