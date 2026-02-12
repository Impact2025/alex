import React, { useEffect, useRef } from 'react';
import { trapFocus, handleEscapeKey } from '../../utils/keyboardNav';
import { announceModal } from '../../utils/announcer';
import { sanitizeTextInput } from '../../utils/validation';

const DribbelInputModal = ({ show, onClose, onSubmit, dareValue, onDareChange, tryValue, onTryChange }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    announceModal(true, 'Pyjama-Dribbel');

    const cleanupEscape = handleEscapeKey(onClose);
    let cleanupFocus = () => {};

    if (modalRef.current) {
      cleanupFocus = trapFocus(modalRef.current);
    }

    return () => {
      cleanupEscape();
      cleanupFocus();
      announceModal(false, 'Pyjama-Dribbel');
    };
  }, [show, onClose]);

  if (!show) return null;

  const isButtonDisabled = !dareValue.trim() || !tryValue.trim();

  const handleSubmitWithValidation = () => {
    const sanitizedDare = sanitizeTextInput(dareValue);
    const sanitizedTry = sanitizeTextInput(tryValue);

    if (sanitizedDare && sanitizedTry) {
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
      aria-labelledby="dribble-modal-title"
    >
      <div ref={modalRef} className="bg-white rounded-3xl p-6 w-full max-w-sm" onKeyDown={handleKeyDown}>
        <h2 id="dribble-modal-title" className="text-xl font-bold text-red-700 mb-4">
          Pyjama-Dribbel ✎
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="dare-input" className="block font-semibold text-gray-700 mb-1">
              Vandaag durfde ik...
            </label>
            <textarea
              id="dare-input"
              value={dareValue}
              onChange={onDareChange}
              rows="3"
              className="w-full p-2 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="...iets te vragen in de klas."
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="try-input" className="block font-semibold text-gray-700 mb-1">
              Morgen ga ik proberen...
            </label>
            <textarea
              id="try-input"
              value={tryValue}
              onChange={onTryChange}
              rows="3"
              className="w-full p-2 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="...een nieuw recept uit te proberen."
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

export default DribbelInputModal;
