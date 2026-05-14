'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 5000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 100);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [duration, onClose]);

  return (
    <div className={`fixed top-4 right-4 z-[9999] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
      <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 shadow-2xl max-w-sm">
        <div className="flex items-start gap-3">
          <span className="text-xl">👋</span>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Welcome to AtqanOS</p>
            <p className="text-white/60 text-xs mt-1">{message}</p>
          </div>
          <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="text-white/40 hover:text-white/80 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
