'use client';

import { useWindowStore } from '@/store/windowStore';

const FOCUS_TAGS = ['Full-Stack Web Apps', 'Portfolio Systems', 'Dashboards', 'CMS Tools'];

export function WelcomeApp() {
  const { closeWindow, openWindowCentered } = useWindowStore();

  const handleViewProjects = () => {
    closeWindow('welcome');
    openWindowCentered('projects');
  };

  const handleContactMe = () => {
    closeWindow('welcome');
    openWindowCentered('contact');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '28px 32px 24px',
      gap: '18px',
      overflowY: 'auto',
    }}>
      {/* Avatar + Identity */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          fontWeight: '700',
          color: 'white',
          flexShrink: 0,
        }}>
          A
        </div>
        <div>
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '700', margin: 0, lineHeight: 1.2 }}>
            Atqan Anwar
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '5px 0 0', lineHeight: 1.4 }}>
            Software Developer / Web Developer
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '9px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
              boxShadow: '0 0 6px #22c55e',
            }} />
            <span style={{ color: '#86efac', fontSize: '12px', fontWeight: '500' }}>
              Available for opportunities
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p style={{
        color: 'rgba(255,255,255,0.65)',
        fontSize: '13.5px',
        lineHeight: '1.65',
        margin: 0,
      }}>
        I build full-stack web apps focused on clean UI and real-world use cases — from portfolio systems and interactive dashboards to CMS tools and admin panels. Multimedia Computing graduate with a strong eye for design and UX.
      </p>

      {/* Focus area tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {FOCUS_TAGS.map((tag) => (
          <span key={tag} style={{
            padding: '4px 13px',
            borderRadius: '999px',
            background: 'rgba(59,130,246,0.13)',
            color: '#93c5fd',
            fontSize: '12px',
            border: '1px solid rgba(59,130,246,0.25)',
            fontWeight: '500',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Contact info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <span style={{ fontSize: '14px' }}>✉️</span>
          <a
            href="mailto:atqananwar@gmail.com"
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}
          >
            atqananwar@gmail.com
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <span style={{ fontSize: '14px' }}>📍</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
            Selayang, Selangor, Malaysia
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 -4px' }} />

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleViewProjects}
          style={{
            flex: 1,
            padding: '11px',
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
          onClick={handleContactMe}
          style={{
            flex: 1,
            padding: '11px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}
        >
          Contact Me
        </button>
      </div>

      {/* Hint */}
      <p style={{
        color: 'rgba(255,255,255,0.22)',
        fontSize: '11px',
        textAlign: 'center',
        margin: 0,
        lineHeight: 1.4,
      }}>
        Tip: Double-click desktop icons or use the dock below to open apps.
      </p>
    </div>
  );
}
