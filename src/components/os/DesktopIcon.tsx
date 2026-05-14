'use client';

import { useWindowStore, APP_CONFIGS } from '@/store/windowStore';
import type { AppId } from '@/types';

const APP_ICONS: Record<AppId, string> = {
  terminal: '⌨️',
  projects: '📁',
  about: '🪪',
  contact: '✉️',
  skills: '⚡',
  settings: '⚙️',
  welcome: '👋',
};

interface DesktopIconProps {
  appId: AppId;
}

export function DesktopIcon({ appId }: DesktopIconProps) {
  const { openWindowCentered, focusWindow, windows } = useWindowStore();
  const config = APP_CONFIGS[appId];
  const win = windows[appId];
  const isOpen = win?.isOpen && !win?.isMinimized;

  const handleClick = () => {
    if (win?.isOpen) {
      focusWindow(appId);
    } else {
      openWindowCentered(appId);
    }
  };

  return (
    <button
      onClick={handleClick}
      onDoubleClick={handleClick}
      className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-all duration-150 select-none group w-20"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform"
        style={{
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.20)',
        }}
      >
        {APP_ICONS[appId]}
      </div>
      <span className="text-white text-xs font-medium text-center leading-tight drop-shadow-lg max-w-full truncate">
        {config.title}
      </span>
      {isOpen && (
        <div className="w-1 h-1 rounded-full bg-white/70 mt-0.5" />
      )}
    </button>
  );
}
