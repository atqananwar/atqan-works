'use client';

import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/db/profile';
import type { AppId } from '@/types';

const MOBILE_APPS: { id: AppId; label: string; icon: string }[] = [
  { id: 'terminal', label: 'Terminal', icon: '⌨️' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'about', label: 'About', icon: '🪪' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

const FEATURED_PROJECTS: { name: string; tech: string }[] = [
  { name: 'Atqan Works', tech: 'Next.js · Supabase · Tailwind' },
  { name: 'GerakFit', tech: 'Flutter · Firebase' },
  { name: 'Dompetku', tech: 'Laravel · MySQL' },
];

interface MobileHomeProps {
  onOpenApp: (id: AppId) => void;
}

export function MobileHome({ onOpenApp }: MobileHomeProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

  useEffect(() => {
    getProfile().then((p) => { if (p?.avatar_url) setAvatarUrl(p.avatar_url); }).catch(() => {});
  }, []);

  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Status bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px 4px',
        color: 'white',
        fontSize: '12px',
      }}>
        <span>{time}</span>
        <span style={{ fontWeight: 500, letterSpacing: '0.05em' }}>AtqanOS</span>
        <span>✦</span>
      </div>

      {/* Clock */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 0 14px' }}>
        <p style={{ color: 'white', fontSize: '48px', fontWeight: 300, letterSpacing: '-0.02em', margin: 0, lineHeight: 1 }}>{time}</p>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: '6px 0 0' }}>{date}</p>
      </div>

      {/* Identity intro card */}
      <div style={{
        margin: '0 16px 14px',
        padding: '14px 16px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        {/* Top row: avatar + name/role + dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Atqan Anwar"
              style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
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
            }}>A</div>
          )}

          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ color: 'white', fontWeight: '600', fontSize: '15px', margin: 0, lineHeight: 1.2 }}>
              Atqan Anwar
            </p>
            <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: '12px', margin: '2px 0 0', lineHeight: 1.3 }}>
              Software Developer / Web Developer
            </p>
            <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: '11px', margin: '2px 0 0', lineHeight: 1.3 }}>
              Building full-stack web apps, dashboards &amp; CMS tools.
            </p>
          </div>

          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#22c55e',
            display: 'inline-block',
            boxShadow: '0 0 5px #22c55e',
            flexShrink: 0,
          }} />
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button
            onClick={() => onOpenApp('projects')}
            style={{
              flex: 1,
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
            View Projects
          </button>
          <button
            onClick={() => onOpenApp('contact')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.80)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              letterSpacing: '0.01em',
            }}
          >
            Contact Me
          </button>
        </div>
      </div>

      {/* App grid */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {MOBILE_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '18px',
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              }}>
                {app.icon}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px', fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>
                {app.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Projects */}
      <div style={{ margin: '18px 16px 0' }}>
        <p style={{
          color: 'rgba(255,255,255,0.30)',
          fontSize: '10px',
          fontWeight: '600',
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          margin: '0 0 8px 2px',
        }}>
          Featured Projects
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {FEATURED_PROJECTS.map((proj) => (
            <button
              key={proj.name}
              onClick={() => onOpenApp('projects')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div>
                <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '13px', fontWeight: '600', margin: 0, lineHeight: 1.2 }}>
                  {proj.name}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: '2px 0 0', lineHeight: 1 }}>
                  {proj.tech}
                </p>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '16px', lineHeight: 1 }}>›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Home indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0 12px' }}>
        <div style={{ width: '96px', height: '4px', borderRadius: '9999px', background: 'rgba(255,255,255,0.18)' }} />
      </div>
    </div>
  );
}
