import React, { useEffect, useRef } from 'react';
import { trapFocus, handleEscapeKey } from '../../utils/keyboardNav';
import { announceModal, announceAchievement } from '../../utils/announcer';

const RewardModal = ({ show, rewardType, onClose, weeklyRewards }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    const reward = weeklyRewards?.[rewardType];
    if (reward) {
      announceModal(true, 'Beloning');
      announceAchievement(reward.title);
    }

    const cleanupEscape = handleEscapeKey(onClose);
    let cleanupFocus = () => {};

    if (modalRef.current) {
      cleanupFocus = trapFocus(modalRef.current);
    }

    return () => {
      cleanupEscape();
      cleanupFocus();
      announceModal(false, 'Beloning');
    };
  }, [show, onClose, rewardType, weeklyRewards]);

  if (!show || !rewardType) return null;

  const reward = weeklyRewards[rewardType];
  if (!reward) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reward-modal-title"
    >
      <div ref={modalRef} className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 animate-bounce">
        <div className="text-8xl mb-4" role="img" aria-label={`Beloning icoon ${reward.icon}`}>
          {reward.icon}
        </div>
        <h2 id="reward-modal-title" className="text-2xl font-bold text-red-600 mb-2">
          {reward.title}
        </h2>
        <p className="text-gray-700 mb-6">{reward.message}</p>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-colors min-h-[44px]"
          aria-label="Sluit beloning"
        >
          Super!
        </button>
      </div>
    </div>
  );
};

export default RewardModal;
