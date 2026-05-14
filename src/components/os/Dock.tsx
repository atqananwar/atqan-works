'use client';

import { useEffect, useState } from 'react';
import { useWindowStore, APP_CONFIGS } from '@/store/windowStore';
import type { AppId } from '@/types';

const DOCK_APPS: AppId[] = ['terminal', 'projects', 'about', 'contact', 'skills', 'settings'];

const APP_ICONS: Record<AppId, string> = {
  terminal: '⌨️',
  projects: '📁',
  about: '🪪',
  contact: '✉️',
  skills: '⚡',
  settings: '⚙️',
  welcome: '👋',
};

export function Dock() {
  const { windows, openWindowCentered, focusWindow, minimizeWindow } = useWindowStore();
  const [time, setTime] = useState('');
  const [hoveredApp, setHoveredApp] = useState<AppId | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDockClick = (appId: AppId) => {
    const win = windows[appId];
    if (!win?.isOpen) {
      openWindowCentered(appId);
    } else if (win.isMinimized) {
      focusWindow(appId);
    } else {
      minimizeWindow(appId);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: 9999,
    }}>
      {/* Glass bar */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.50)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderTop: '1px solid rgba(255,255,255,0.10)',
      }} />

      {/* Left: Branding */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: '7px',
          background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: '700',
          color: 'white',
          flexShrink: 0,
        }}>
          A
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '600' }}>AtqanOS</span>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', marginTop: '2px' }}>Atqan Anwar</span>
        </div>
      </div>

      {/* Center: Dock icons */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        {DOCK_APPS.map((appId) => {
          const win = windows[appId];
          const isOpen = win?.isOpen;
          const isActive = isOpen && !win?.isMinimized;
          const isHovered = hoveredApp === appId;
          const config = APP_CONFIGS[appId];

          return (
            <button
              key={appId}
              aria-label={config.title}
              onClick={() => handleDockClick(appId)}
              onMouseEnter={() => setHoveredApp(appId)}
              onMouseLeave={() => setHoveredApp(null)}
              title={config.title}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: isActive
                  ? 'rgba(255,255,255,0.20)'
                  : isHovered
                  ? 'rgba(255,255,255,0.10)'
                  : 'transparent',
                transform: isHovered ? 'scale(1.18) translateY(-3px)' : 'scale(1)',
                transition: 'transform 0.18s ease, background 0.15s ease',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <span style={{ fontSize: '22px', lineHeight: 1 }}>{APP_ICONS[appId]}</span>

              {/* Active dot */}
              {isOpen && (
                <span style={{
                  position: 'absolute',
                  bottom: '-3px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: isActive ? 'white' : 'rgba(255,255,255,0.4)',
                }} />
              )}

              {/* Tooltip — visibility driven by JS state, no CSS group needed */}
              <span style={{
                position: 'absolute',
                top: '-34px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(0,0,0,0.88)',
                border: '1px solid rgba(255,255,255,0.14)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.45)',
                color: 'white',
                fontSize: '11px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.15s ease',
              }}>
                {config.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: Clock */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        color: 'white',
        fontSize: '12px',
        fontFamily: 'monospace',
        fontWeight: '500',
      }}>
        {time}
      </div>
    </div>
  );
}
