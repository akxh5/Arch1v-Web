import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`glass-card px-4 py-3 flex items-center gap-3 min-w-[300px] max-w-md ${
        type === 'success' ? 'border-green-400/30' : 'border-red-400/30'
      }`}>
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        )}
        <p className="text-sm flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
