'use client';

import { useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Desktop } from '@/components/os/Desktop';
import { MobileHome } from '@/components/mobile/MobileHome';
import { MobileAppView } from '@/components/mobile/MobileAppView';
import type { AppId } from '@/types';

const WALLPAPERS = [
  'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
  'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900',
  'bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900',
];

export default function HomePage() {
  const isMobile = useIsMobile();
  const [mobileApp, setMobileApp] = useState<AppId | null>(null);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);

  if (isMobile) {
    return (
      <div className={`w-full h-screen overflow-hidden ${WALLPAPERS[wallpaperIndex]} relative`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 h-full">
          {mobileApp ? (
            <MobileAppView
              appId={mobileApp}
              onBack={() => setMobileApp(null)}
              wallpaperIndex={wallpaperIndex}
              onWallpaperChange={(i) => {
                setWallpaperIndex(i);
                localStorage.setItem('atqan-wallpaper', String(i));
              }}
            />
          ) : (
            <MobileHome onOpenApp={(id) => setMobileApp(id)} />
          )}
        </div>
      </div>
    );
  }

  return <Desktop />;
}
