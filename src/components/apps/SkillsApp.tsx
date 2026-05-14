'use client';

import { useState, useEffect } from 'react';
import { getSkillsByCategory } from '@/lib/db/skills';
import type { Skill } from '@/types';

const FALLBACK_SKILLS: Record<string, string[]> = {
  Frontend: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'Next.js'],
  Backend: ['PHP', 'Laravel', 'Supabase'],
  Database: ['MySQL', 'PostgreSQL', 'SQL'],
  Mobile: ['Flutter', 'Dart'],
  CMS: ['WordPress', 'BeBuilder', 'JetEngine', 'ARMember', 'Tutor LMS'],
  'VR / Game Development': ['Unity', 'C#', 'Blender', '3ds Max'],
  Data: ['Python', 'pandas', 'matplotlib', 'scikit-learn'],
  Design: ['Adobe Photoshop', 'Adobe Illustrator'],
  Tools: ['Git', 'GitHub', 'VS Code', 'Vercel', 'npm', 'Composer'],
};

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Backend: 'text-green-400 bg-green-500/10 border-green-500/20',
  Database: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Mobile: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  CMS: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'VR / Game Development': 'text-red-400 bg-red-500/10 border-red-500/20',
  Data: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Design: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  Tools: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

export function SkillsApp() {
  const [grouped, setGrouped] = useState<Record<string, Skill[]>>({});
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    getSkillsByCategory()
      .then((data) => {
        if (Object.keys(data).length === 0) {
          setUseFallback(true);
        } else {
          setGrouped(data);
        }
      })
      .catch(() => setUseFallback(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/40 text-sm animate-pulse">Loading skills...</div>
      </div>
    );
  }

  const categories = useFallback
    ? Object.keys(FALLBACK_SKILLS)
    : Object.keys(grouped);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-5 space-y-4">
      <div>
        <p className="text-white text-base font-semibold">Skills & Technologies</p>
        <p className="text-white/40 text-xs mt-0.5">{categories.length} categories</p>
      </div>

      {categories.map((category) => {
        const skillNames = useFallback
          ? FALLBACK_SKILLS[category]
          : grouped[category].map((s) => s.name);
        const colorClass = CATEGORY_COLORS[category] || 'text-white/60 bg-white/5 border-white/10';
        const [headerColor] = colorClass.split(' ');

        return (
          <div key={category}>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${headerColor}`}>
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {skillNames.map((name) => (
                <span
                  key={name}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${colorClass}`}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
