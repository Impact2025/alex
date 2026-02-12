import React, { useEffect, useRef } from 'react';
import { trapFocus, handleEscapeKey } from '../../utils/keyboardNav';
import { announceModal } from '../../utils/announcer';
import { sanitizeTextInput } from '../../utils/validation';

const GratitudeInputModal = ({ show, onClose, onSubmit, value1, onChange1, value2, onChange2, value3, onChange3 }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    announceModal(true, 'Dankbaarheid');

    const cleanupEscape = handleEscapeKey(onClose);
    let cleanupFocus = () => {};

    if (modalRef.current) {
      cleanupFocus = trapFocus(modalRef.current);
    }

    return () => {
      cleanupEscape();
      cleanupFocus();
      announceModal(false, 'Dankbaarheid');
    };
  }, [show, onClose]);

  if (!show) return null;

  const isButtonDisabled = !value1.trim() || !value2.trim() || !value3.trim();

  const handleSubmitWithValidation = () => {
    const sanitized1 = sanitizeTextInput(value1);
    const sanitized2 = sanitizeTextInput(value2);
    const sanitized3 = sanitizeTextInput(value3);

    if (sanitized1 && sanitized2 && sanitized3) {
      onSubmit();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && !isButtonDisabled) {
      handleSubmitWithValidation();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gratitude-modal-title"
      aria-describedby="gratitude-modal-description"
    >
      <div ref={modalRef} className="bg-white rounded-3xl p-6 w-full max-w-sm" onKeyDown={handleKeyDown}>
        <h2 id="gratitude-modal-title" className="text-xl font-bold text-red-700 mb-4">
          Dankbaarheid ⭐
        </h2>
        <p id="gratitude-modal-description" className="text-sm text-gray-600 mb-4">
          Schrijf 3 dingen waar je vandaag dankbaar voor bent:
        </p>
        <div className="space-y-3">
          <div>
            <label htmlFor="gratitude-1" className="block font-semibold text-gray-700 mb-1">
              1. Ik ben dankbaar voor...
            </label>
            <input
              id="gratitude-1"
              type="text"
              value={value1}
              onChange={onChange1}
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="...mijn familie"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="gratitude-2" className="block font-semibold text-gray-700 mb-1">
              2. Ik ben dankbaar voor...
            </label>
            <input
              id="gratitude-2"
              type="text"
              value={value2}
              onChange={onChange2}
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="...mijn vrienden"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="gratitude-3" className="block font-semibold text-gray-700 mb-1">
              3. Ik ben dankbaar voor...
            </label>
            <input
              id="gratitude-3"
              type="text"
              value={value3}
              onChange={onChange3}
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="...voetbal kunnen spelen"
              aria-required="true"
            />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={handleSubmitWithValidation}
            disabled={isButtonDisabled}
            className={`w-full text-white font-bold py-3 rounded-full min-h-[44px] transition-colors ${
              isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
            aria-label="Voltooi missie en verdien 1 goal"
          >
            Voltooi Missie (+1 goal)
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-600 font-bold py-2 hover:text-red-600 transition-colors min-h-[44px]"
            aria-label="Annuleer en sluit"
          >
            Annuleren
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Tip: Druk Ctrl+Enter om snel op te slaan
        </p>
      </div>
    </div>
  );
};

export default GratitudeInputModal;
