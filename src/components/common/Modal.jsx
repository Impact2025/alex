import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { trapFocus, handleEscapeKey } from '../../utils/keyboardNav';
import { announceModal } from '../../utils/announcer';

/**
 * Accessible Modal Component
 * Full ARIA support, keyboard navigation, focus trap
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = '',
  modalName = 'Modal'
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save currently focused element
    previousFocusRef.current = document.activeElement;

    // Announce modal open
    announceModal(true, modalName);

    // Setup keyboard handlers
    const cleanupEscape = handleEscapeKey(onClose);
    let cleanupFocus = () => {};

    if (modalRef.current) {
      cleanupFocus = trapFocus(modalRef.current);
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      cleanupEscape();
      cleanupFocus();
      document.body.style.overflow = '';
      announceModal(false, modalName);

      // Restore focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose, modalName]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-3xl p-6 w-full ${sizes[size]} ${className} shadow-2xl`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h2 id="modal-title" className="text-xl font-bold text-gray-800">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Sluit modal"
              >
                <X size={24} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
