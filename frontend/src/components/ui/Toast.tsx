import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id?: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  message,
  variant = 'info',
  duration = 4000,
  onClose,
  className,
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const borderVariants = {
    success: 'border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200',
    error: 'border-red-500/30 bg-red-50/90 dark:bg-red-950/40 text-red-900 dark:text-red-200',
    warning: 'border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200',
    info: 'border-blue-500/30 bg-blue-50/90 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 max-w-md w-full',
        borderVariants[variant],
        className
      )}
      role="alert"
    >
      {icons[variant]}
      <div className="flex-1 min-w-0">
        {title && <h4 className="text-sm font-semibold leading-tight mb-1">{title}</h4>}
        <p className="text-xs leading-relaxed opacity-90">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-current shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
