// components/GenericModal.js
import React from "react";

interface ModalProps {
  isOpen: boolean;
  content: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, content, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleOverlayClick}
      />
      <div
        className="relative min-h-screen flex items-center justify-center"
        onClick={handleOverlayClick}
      >
        <div className="relative bg-base-100 rounded-lg shadow-xl">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Modal;
