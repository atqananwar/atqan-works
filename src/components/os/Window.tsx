'use client';

import React from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useWindowStore } from '@/store/windowStore';
import type { AppId } from '@/types';

interface WindowProps {
  id: AppId;
  children: React.ReactNode;
}

// Subtle accent color applied as a left-tinted gradient in each window's title bar
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
  const { windows, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, updatePosition, updateSize } = useWindowStore();
  const win = windows[id];

  if (!win || !win.isOpen || win.isMinimized) return null;

  const handleFocus = () => focusWindow(id);

  if (win.isMaximized) {
    return (
      <div
        className="fixed inset-0 mt-0 mb-14 flex flex-col z-50 overflow-hidden"
        style={{ zIndex: win.zIndex }}
        onClick={handleFocus}
      >
        <div className="flex flex-col h-full rounded-none bg-black/80 backdrop-blur-xl border border-white/10">
          <WindowHeader id={id} />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    );
  }

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
      <div className="flex flex-col h-full rounded-xl overflow-hidden bg-black/75 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50" style={{ pointerEvents: 'auto' }}>
        <WindowHeader id={id} />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </Rnd>
  );
}

function WindowHeader({ id }: { id: AppId }) {
  const { windows, closeWindow, minimizeWindow, maximizeWindow, restoreWindow } = useWindowStore();
  const win = windows[id];

  return (
    <div
      className="window-drag-handle flex items-center gap-2 px-4 py-3 border-b border-white/10 cursor-move select-none flex-shrink-0"
      style={{ background: `linear-gradient(to right, ${APP_ACCENTS[id]}, transparent)` }}
    >
      <div className="flex items-center gap-1.5">
        <button
          onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center group"
        >
          <X size={7} className="opacity-0 group-hover:opacity-100 text-red-900" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors flex items-center justify-center group"
        >
          <Minus size={7} className="opacity-0 group-hover:opacity-100 text-yellow-900" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            win.isMaximized ? restoreWindow(id) : maximizeWindow(id);
          }}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors flex items-center justify-center group"
        >
          <Maximize2 size={6} className="opacity-0 group-hover:opacity-100 text-green-900" />
        </button>
      </div>
      <span className="flex-1 text-center text-sm font-medium text-white/70 truncate pr-16">
        {win.title}
      </span>
    </div>
  );
}
