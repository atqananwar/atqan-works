'use client';

import { ChevronLeft, Home } from 'lucide-react';
import type { AppId } from '@/types';
import { TerminalApp } from '@/components/apps/TerminalApp';
import { ProjectsApp } from '@/components/apps/ProjectsApp';
import { AboutApp } from '@/components/apps/AboutApp';
import { ContactApp } from '@/components/apps/ContactApp';
import { SkillsApp } from '@/components/apps/SkillsApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { WelcomeApp } from '@/components/apps/WelcomeApp';

const APP_TITLES: Record<AppId, string> = {
  terminal: 'Terminal',
  projects: 'Projects',
  about: 'About',
  contact: 'Contact',
  skills: 'Skills',
  settings: 'Settings',
  welcome: 'Welcome',
};

interface MobileAppViewProps {
  appId: AppId;
  onBack: () => void;
  wallpaperIndex: number;
  onWallpaperChange: (i: number) => void;
}

export function MobileAppView({ appId, onBack, wallpaperIndex, onWallpaperChange }: MobileAppViewProps) {
  const renderApp = () => {
    switch (appId) {
      case 'terminal': return <TerminalApp />;
      case 'projects': return <ProjectsApp />;
      case 'about': return <AboutApp />;
      case 'contact': return <ContactApp />;
      case 'skills': return <SkillsApp />;
      case 'settings': return <SettingsApp wallpaperIndex={wallpaperIndex} onWallpaperChange={onWallpaperChange} />;
      case 'welcome': return <WelcomeApp />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mobile app header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/30 backdrop-blur-xl border-b border-white/10 flex-shrink-0">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 active:scale-95 transition-all">
          <ChevronLeft size={16} />
        </button>
        <span className="text-white font-medium text-sm flex-1">{APP_TITLES[appId]}</span>
      </div>

      {/* App content */}
      <div className="flex-1 overflow-hidden">
        {renderApp()}
      </div>

      {/* Home bar */}
      <div className="flex items-center justify-center py-2 border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/60 text-xs hover:bg-white/15 active:scale-95 transition-all">
          <Home size={12} /> Home
        </button>
      </div>
    </div>
  );
}
