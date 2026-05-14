'use client';

import { useEffect, useState } from 'react';
import { DesktopIcon } from './DesktopIcon';
import { Dock } from './Dock';
import { Window } from './Window';
import { TerminalApp } from '@/components/apps/TerminalApp';
import { ProjectsApp } from '@/components/apps/ProjectsApp';
import { AboutApp } from '@/components/apps/AboutApp';
import { ContactApp } from '@/components/apps/ContactApp';
import { SkillsApp } from '@/components/apps/SkillsApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { WelcomeApp } from '@/components/apps/WelcomeApp';
import { useWindowStore } from '@/store/windowStore';
import type { AppId } from '@/types';

const DESKTOP_APPS: AppId[] = ['terminal', 'projects', 'about', 'contact', 'skills', 'settings'];

// Inline gradients — Tailwind cannot detect dynamically constructed class strings at build time
const WALLPAPERS: string[] = [
  'linear-gradient(to bottom right, #020617, #172554, #0f172a)',
  'linear-gradient(to bottom right, #020617, #3b0764, #0f172a)',
  'linear-gradient(to bottom right, #020617, #042f2e, #0f172a)',
];

// Inline styles for ambient orbs — avoids Tailwind purging dynamic class strings
const ORB_STYLES: React.CSSProperties[] = [
  {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '384px',
    height: '384px',
    background: 'rgba(59,130,246,0.10)',
    borderRadius: '9999px',
    filter: 'blur(64px)',
    pointerEvents: 'none',
  },
  {
    position: 'absolute',
    bottom: '33%',
    right: '25%',
    width: '320px',
    height: '320px',
    background: 'rgba(168,85,247,0.10)',
    borderRadius: '9999px',
    filter: 'blur(64px)',
    pointerEvents: 'none',
    animationDelay: '1000ms',
  },
  {
    position: 'absolute',
    top: '50%',
    right: '33%',
    width: '256px',
    height: '256px',
    background: 'rgba(20,184,166,0.08)',
    borderRadius: '9999px',
    filter: 'blur(64px)',
    pointerEvents: 'none',
    animationDelay: '500ms',
  },
];

export function Desktop() {
  const [wallpaper, setWallpaper] = useState(0);
  const { openWindowCentered } = useWindowStore();

  useEffect(() => {
    // Always restore wallpaper preference
    const saved = localStorage.getItem('atqan-wallpaper');
    if (saved) setWallpaper(parseInt(saved));

    // Always open welcome on mount — no sessionStorage guard so StrictMode double-invoke works
    const t = setTimeout(() => openWindowCentered('welcome'), 400);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: WALLPAPERS[wallpaper] }}
    >
      {/* Ambient orbs — pointer-events:none inline so purge cannot strip it */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ pointerEvents: 'none' }}
      >
        {ORB_STYLES.map((style, i) => (
          <div key={i} className="animate-pulse" style={style} />
        ))}
      </div>

      {/* Desktop icons grid — z-index 10 keeps it above background, pointer-events auto (default) */}
      <div className="absolute top-6 left-6 flex flex-col gap-1" style={{ zIndex: 10 }}>
        {DESKTOP_APPS.map((appId) => (
          <DesktopIcon key={appId} appId={appId} />
        ))}
      </div>

      {/* Windows container — pointer-events:none so transparent gaps don't swallow clicks;
          each Window/Rnd re-enables pointer-events:auto on its own box */}
      <div className="absolute inset-0 mb-14" style={{ pointerEvents: 'none' }}>
        {DESKTOP_APPS.map((appId) => (
          <Window key={appId} id={appId}>
            {appId === 'terminal' && <TerminalApp />}
            {appId === 'projects' && <ProjectsApp />}
            {appId === 'about' && <AboutApp />}
            {appId === 'contact' && <ContactApp />}
            {appId === 'skills' && <SkillsApp />}
            {appId === 'settings' && (
              <SettingsApp
                wallpaperIndex={wallpaper}
                onWallpaperChange={(i) => {
                  setWallpaper(i);
                  localStorage.setItem('atqan-wallpaper', String(i));
                }}
              />
            )}
          </Window>
        ))}
        <Window id="welcome">
          <WelcomeApp />
        </Window>
      </div>

      {/* Dock */}
      <Dock />

    </div>
  );
}
