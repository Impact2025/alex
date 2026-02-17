import React, { useEffect, useRef } from 'react';
import { trapFocus, handleEscapeKey } from '../../utils/keyboardNav';
import { announceModal, announceAchievement } from '../../utils/announcer';

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999, padding: 24,
};

const RewardModal = ({ show, rewardType, onClose, weeklyRewards }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const reward = weeklyRewards?.[rewardType];
    if (reward) { announceModal(true, 'Beloning'); announceAchievement(reward.title); }
    const cleanupEscape = handleEscapeKey(onClose);
    const cleanupFocus = modalRef.current ? trapFocus(modalRef.current) : () => {};
    return () => { cleanupEscape(); cleanupFocus(); announceModal(false, 'Beloning'); };
  }, [show, onClose, rewardType, weeklyRewards]);

  if (!show || !rewardType) return null;
  const reward = weeklyRewards[rewardType];
  if (!reward) return null;

  return (
    <div style={overlay} role="dialog" aria-modal="true" aria-labelledby="reward-title" onClick={e => e.target === e.currentTarget && onClose()}>
      <div ref={modalRef} style={{ background: '#fff', borderRadius: 24, padding: 36, textAlign: 'center', width: '100%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }} role="img" aria-label={`Beloning ${reward.icon}`}>{reward.icon}</div>
        <h2 id="reward-title" style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#DC2626' }}>{reward.title}</h2>
        <p style={{ margin: '0 0 28px', color: '#6b7280', fontSize: 15 }}>{reward.message}</p>
        <button onClick={onClose} style={{
          background: '#DC2626', color: '#fff', border: 'none',
          padding: '14px 36px', borderRadius: 99, fontWeight: 700, fontSize: 16, cursor: 'pointer',
        }}>
          Super!
        </button>
      </div>
    </div>
  );
};

export default RewardModal;
