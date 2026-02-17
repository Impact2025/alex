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
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };
const textareaStyle = {
  width: '100%', boxSizing: 'border-box', padding: '10px 14px',
  border: '1.5px solid #e5e7eb', borderRadius: 10,
  fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none',
};

const DribbelInputModal = ({ show, onClose, onSubmit, dareValue, onDareChange, tryValue, onTryChange }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    announceModal(true, 'Pyjama-Dribbel');
    const cleanupEscape = handleEscapeKey(onClose);
    const cleanupFocus = modalRef.current ? trapFocus(modalRef.current) : () => {};
    return () => { cleanupEscape(); cleanupFocus(); announceModal(false, 'Pyjama-Dribbel'); };
  }, [show, onClose]);

  if (!show) return null;

  const isDisabled = !dareValue.trim() || !tryValue.trim();

  const handleSubmit = () => {
    const d = sanitizeTextInput(dareValue);
    const t = sanitizeTextInput(tryValue);
    if (d && t) onSubmit();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && !isDisabled) handleSubmit();
  };

  return (
    <div style={overlay} role="dialog" aria-modal="true" aria-labelledby="dribbel-title" onClick={e => e.target === e.currentTarget && onClose()}>
      <div ref={modalRef} style={card} onKeyDown={handleKeyDown}>
        <h2 id="dribbel-title" style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 800, color: '#111' }}>Pyjama-Dribbel ✎</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label htmlFor="dare-input" style={labelStyle}>Vandaag durfde ik...</label>
            <textarea id="dare-input" value={dareValue} onChange={onDareChange} rows={3}
              placeholder="...iets te vragen in de klas."
              style={textareaStyle} aria-required="true"
              onFocus={e => e.target.style.borderColor = '#DC2626'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div>
            <label htmlFor="try-input" style={labelStyle}>Morgen ga ik proberen...</label>
            <textarea id="try-input" value={tryValue} onChange={onTryChange} rows={3}
              placeholder="...een nieuw recept uit te proberen."
              style={textareaStyle} aria-required="true"
              onFocus={e => e.target.style.borderColor = '#DC2626'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
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

export default DribbelInputModal;
