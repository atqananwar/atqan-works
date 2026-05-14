import { create } from 'zustand';
import type { WindowState, AppId, AppConfig } from '@/types';

export const APP_CONFIGS: Record<AppId, AppConfig> = {
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    icon: '⌨️',
    defaultSize: { width: 680, height: 440 },
    defaultPosition: { x: 80, y: 80 },
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    icon: '📁',
    defaultSize: { width: 820, height: 560 },
    defaultPosition: { x: 140, y: 60 },
  },
  about: {
    id: 'about',
    title: 'About',
    icon: '🪪',
    defaultSize: { width: 700, height: 520 },
    defaultPosition: { x: 200, y: 100 },
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    icon: '✉️',
    defaultSize: { width: 560, height: 480 },
    defaultPosition: { x: 240, y: 120 },
  },
  skills: {
    id: 'skills',
    title: 'Skills',
    icon: '⚡',
    defaultSize: { width: 640, height: 500 },
    defaultPosition: { x: 160, y: 90 },
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: '⚙️',
    defaultSize: { width: 480, height: 400 },
    defaultPosition: { x: 280, y: 140 },
  },
  welcome: {
    id: 'welcome',
    title: 'Welcome to AtqanOS',
    icon: '👋',
    defaultSize: { width: 560, height: 460 },
    defaultPosition: { x: 400, y: 200 },
  },
};

interface WindowStore {
  windows: Record<AppId, WindowState>;
  topZIndex: number;
  openWindow: (id: AppId) => void;
  openWindowCentered: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  restoreWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updatePosition: (id: AppId, x: number, y: number) => void;
  updateSize: (id: AppId, width: number, height: number) => void;
}

function createInitialWindows(): Record<AppId, WindowState> {
  const appIds: AppId[] = ['terminal', 'projects', 'about', 'contact', 'skills', 'settings', 'welcome'];
  const windows: Partial<Record<AppId, WindowState>> = {};

  appIds.forEach((id, index) => {
    const config = APP_CONFIGS[id];
    windows[id] = {
      id,
      title: config.title,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: index + 10,
      position: config.defaultPosition,
      size: config.defaultSize,
      appId: id,
    };
  });

  return windows as Record<AppId, WindowState>;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: createInitialWindows(),
  topZIndex: 20,

  openWindow: (id) => {
    const { topZIndex } = get();
    const newZ = topZIndex + 1;
    set((state) => ({
      topZIndex: newZ,
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: newZ,
        },
      },
    }));
  },

  openWindowCentered: (id) => {
    if (typeof window === 'undefined') return;
    const { topZIndex } = get();
    const newZ = topZIndex + 1;
    const config = APP_CONFIGS[id];
    const x = Math.max(0, Math.round((window.innerWidth - config.defaultSize.width) / 2));
    // offset upward slightly to keep clear of the 56px dock
    const y = Math.max(0, Math.round((window.innerHeight - config.defaultSize.height - 56) / 2));
    set((state) => ({
      topZIndex: newZ,
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: newZ,
          position: { x, y },
        },
      },
    }));
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
        },
      },
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMinimized: true,
        },
      },
    }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMaximized: true,
          isMinimized: false,
        },
      },
    }));
  },

  restoreWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMaximized: false,
          isMinimized: false,
        },
      },
    }));
  },

  focusWindow: (id) => {
    const { topZIndex } = get();
    const newZ = topZIndex + 1;
    set((state) => ({
      topZIndex: newZ,
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          zIndex: newZ,
          isMinimized: false,
        },
      },
    }));
  },

  updatePosition: (id, x, y) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          position: { x, y },
        },
      },
    }));
  },

  updateSize: (id, width, height) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          size: { width, height },
        },
      },
    }));
  },
}));
