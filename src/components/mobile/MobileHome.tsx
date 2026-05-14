'use client';

import { useEffect, useState } from 'react';
import type { AppId } from '@/types';

const MOBILE_APPS: { id: AppId; label: string; icon: string }[] = [
  { id: 'terminal', label: 'Terminal', icon: '⌨️' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'about', label: 'About', icon: '🪪' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

interface MobileHomeProps {
  onOpenApp: (id: AppId) => void;
}

export function MobileHome({ onOpenApp }: MobileHomeProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true }));
      setDate(now.toLocaleDateString('en-MY', { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1 text-white text-xs">
        <span>{time}</span>
        <span className="font-medium tracking-wide">AtqanOS</span>
        <span>✦</span>
      </div>

      {/* Clock */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <p className="text-white text-5xl font-light tracking-tight">{time}</p>
        <p className="text-white/50 text-sm mt-2">{date}</p>
      </div>

      {/* Identity intro card */}
      <div style={{
        margin: '0 20px 18px',
        padding: '16px 18px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar */}
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            flexShrink: 0,
          }}>
            A
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ color: 'white', fontWeight: '600', fontSize: '15px', margin: 0, lineHeight: 1.2 }}>
              Atqan Anwar
            </p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', margin: '3px 0 0', lineHeight: 1.3 }}>
              Software Developer / Web Developer
            </p>
          </div>
          {/* Available badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
              boxShadow: '0 0 5px #22c55e',
            }} />
          </div>
        </div>

        {/* CTA button */}
        <button
          onClick={() => onOpenApp('projects')}
          style={{
            display: 'block',
            width: '100%',
            marginTop: '13px',
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}
        >
          View My Projects
        </button>
      </div>

      {/* App grid */}
      <div className="flex-1 px-6">
        <div className="grid grid-cols-3 gap-4">
          {MOBILE_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl shadow-lg group-active:scale-95 transition-transform">
                {app.icon}
              </div>
              <span className="text-white/80 text-xs font-medium text-center leading-tight">{app.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-4 pt-2">
        <div className="w-24 h-1 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
