'use client';

import { useState } from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface SettingsAppProps {
  wallpaperIndex: number;
  onWallpaperChange: (index: number) => void;
}

const WALLPAPERS = [
  { name: 'Midnight Blue', class: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' },
  { name: 'Deep Purple', class: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900' },
  { name: 'Ocean Teal', class: 'bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900' },
];

export function SettingsApp({ wallpaperIndex, onWallpaperChange }: SettingsAppProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-full overflow-y-auto p-5 space-y-6">
      <div>
        <p className="text-white text-base font-semibold">Settings</p>
        <p className="text-white/40 text-xs mt-0.5">AtqanOS preferences</p>
      </div>

      {/* Appearance */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Appearance</p>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={16} className="text-white/60" /> : <Sun size={16} className="text-yellow-400" />}
              <div>
                <p className="text-white text-sm font-medium">Theme</p>
                <p className="text-white/40 text-xs">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-white/20' : 'bg-blue-500'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-1' : 'left-7'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Wallpaper */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Palette size={10} /> Wallpaper
        </p>
        <div className="space-y-2">
          {WALLPAPERS.map((wp, i) => (
            <button
              key={i}
              onClick={() => onWallpaperChange(i)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all ${
                wallpaperIndex === i
                  ? 'bg-white/10 border-blue-500/40'
                  : 'bg-white/5 border-white/10 hover:bg-white/8'
              }`}
            >
              <div className={`w-10 h-6 rounded-md ${wp.class} flex-shrink-0`} />
              <span className="text-white/70 text-sm">{wp.name}</span>
              {wallpaperIndex === i && <span className="ml-auto text-blue-400 text-xs">Active</span>}
            </button>
          ))}
        </div>
      </div>

      {/* About AtqanOS */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">About AtqanOS</p>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs text-white/50">
          <div className="flex justify-between"><span>Version</span><span className="text-white/70">1.0.0</span></div>
          <div className="flex justify-between"><span>Built with</span><span className="text-white/70">Next.js + Supabase</span></div>
          <div className="flex justify-between"><span>Developer</span><span className="text-white/70">Atqan Anwar</span></div>
        </div>
      </div>
    </div>
  );
}
