import React from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border w-full max-w-lg rounded-card shadow-xl p-6 relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          {title && <h3 className="text-lg font-bold text-text">{title}</h3>}
          <button onClick={onClose} className="text-text-muted hover:text-text p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
