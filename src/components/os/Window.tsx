'use client';

import React from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2, ChevronLeft } from 'lucide-react';
import { useWindowStore } from '@/store/windowStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { AppId } from '@/types';

interface WindowProps {
  id: AppId;
  children: React.ReactNode;
}

const APP_ACCENTS: Record<AppId, string> = {
  terminal:  'rgba(34,211,238,0.18)',
  projects:  'rgba(96,165,250,0.18)',
  about:     'rgba(167,139,250,0.18)',
  contact:   'rgba(52,211,153,0.18)',
  skills:    'rgba(251,191,36,0.18)',
  settings:  'rgba(148,163,184,0.18)',
  welcome:   'rgba(99,102,241,0.22)',
};

export function Window({ id, children }: WindowProps) {
  const {
    windows, topZIndex,
    closeWindow, minimizeWindow, maximizeWindow, restoreWindow,
    focusWindow, updatePosition, updateSize,
  } = useWindowStore();
  const win = windows[id];
  const isMobile = useIsMobile();

  if (!win || !win.isOpen || win.isMinimized) return null;

  const isActive = win.zIndex === topZIndex;
  const handleFocus = () => focusWindow(id);

  // Mobile: render as a fullscreen fixed overlay — no drag, no resize
  if (isMobile) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: win.zIndex,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          pointerEvents: 'auto',
        }}
      >
        {/* Mobile header bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.10)',
            flexShrink: 0,
            background: `linear-gradient(to right, ${APP_ACCENTS[id]}, transparent)`,
          }}
        >
          <button
            aria-label={`Close ${win.title}`}
            onClick={() => closeWindow(id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.80)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <span style={{
            flex: 1,
            color: 'rgba(255,255,255,0.75)',
            fontSize: '15px',
            fontWeight: '600',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            paddingRight: '72px', // offset for the back button width
          }}>
            {win.title}
          </span>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          {children}
        </div>
      </div>
    );
  }

  // Desktop: maximized state
  if (win.isMaximized) {
    return (
      <div
        className="fixed inset-0 mt-0 mb-14 flex flex-col overflow-hidden"
        style={{ zIndex: win.zIndex }}
        onClick={handleFocus}
      >
        <div
          className="flex flex-col h-full rounded-none backdrop-blur-xl"
          style={{
            background: 'rgba(0,0,0,0.80)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <WindowHeader id={id} isActive={true} />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    );
  }

  // Desktop: floating window
  const activeShadow = '0 28px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.10)';
  const inactiveShadow = '0 8px 28px rgba(0,0,0,0.45)';
  const activeBorder = '1px solid rgba(255,255,255,0.22)';
  const inactiveBorder = '1px solid rgba(255,255,255,0.07)';

  return (
    <Rnd
      style={{ zIndex: win.zIndex, pointerEvents: 'auto' }}
      size={win.size}
      position={win.position}
      minWidth={340}
      minHeight={260}
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      onDragStop={(_, d) => updatePosition(id, d.x, d.y)}
      onResizeStop={(_, __, ref, ___, pos) => {
        updateSize(id, ref.offsetWidth, ref.offsetHeight);
        updatePosition(id, pos.x, pos.y);
      }}
      onClick={handleFocus}
      onMouseDown={handleFocus}
    >
      <div
        className="flex flex-col h-full rounded-xl overflow-hidden backdrop-blur-xl"
        style={{
          pointerEvents: 'auto',
          background: isActive ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0.65)',
          border: isActive ? activeBorder : inactiveBorder,
          boxShadow: isActive ? activeShadow : inactiveShadow,
          transition: 'box-shadow 0.18s ease, border-color 0.18s ease',
        }}
      >
        <WindowHeader id={id} isActive={isActive} />
        <div
          className="flex-1 overflow-auto"
          style={{ opacity: isActive ? 1 : 0.88, transition: 'opacity 0.18s ease' }}
        >
          {children}
        </div>
      </div>
    </Rnd>
  );
}

function WindowHeader({ id, isActive }: { id: AppId; isActive: boolean }) {
  const { windows, closeWindow, minimizeWindow, maximizeWindow, restoreWindow } = useWindowStore();
  const win = windows[id];

  // Build a dimmed accent for inactive windows by layering a dark overlay in the gradient
  const headerBg = isActive
    ? `linear-gradient(to right, ${APP_ACCENTS[id]}, transparent)`
    : `linear-gradient(to right, rgba(0,0,0,0.35), transparent), linear-gradient(to right, ${APP_ACCENTS[id]}, transparent)`;

  return (
    <div
      className="window-drag-handle flex items-center gap-2 px-4 py-3 border-b cursor-move select-none flex-shrink-0"
      style={{
        background: headerBg,
        borderBottomColor: isActive ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)',
        transition: 'border-color 0.18s ease',
      }}
    >
      {/* Traffic light buttons — always at full opacity so they stay clickable */}
      <div className="flex items-center gap-1.5">
        <button
          aria-label={`Close ${win.title}`}
          onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center group"
          style={{ opacity: isActive ? 1 : 0.6 }}
        >
          <X size={7} className="opacity-0 group-hover:opacity-100 text-red-900" />
        </button>
        <button
          aria-label={`Minimize ${win.title}`}
          onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors flex items-center justify-center group"
          style={{ opacity: isActive ? 1 : 0.6 }}
        >
          <Minus size={7} className="opacity-0 group-hover:opacity-100 text-yellow-900" />
        </button>
        <button
          aria-label={win.isMaximized ? `Restore ${win.title}` : `Maximize ${win.title}`}
          onClick={(e) => {
            e.stopPropagation();
            win.isMaximized ? restoreWindow(id) : maximizeWindow(id);
          }}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors flex items-center justify-center group"
          style={{ opacity: isActive ? 1 : 0.6 }}
        >
          <Maximize2 size={6} className="opacity-0 group-hover:opacity-100 text-green-900" />
        </button>
      </div>
      <span
        className="flex-1 text-center text-sm font-medium truncate pr-16"
        style={{
          color: isActive ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.38)',
          transition: 'color 0.18s ease',
        }}
      >
        {win.title}
      </span>
    </div>
  );
}
