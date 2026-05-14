'use client';

import { useState, useEffect } from 'react';
import { MapPin, Mail, GitBranch, Link2, Download, GraduationCap, Briefcase, Award } from 'lucide-react';
import { getProfile } from '@/lib/db/profile';
import type { Profile } from '@/types';

const FALLBACK_PROFILE: Partial<Profile> = {
  name: 'Atqan Anwar',
  headline: 'Web Developer / Software Developer / Multimedia Computing Graduate',
  short_bio: 'I build practical web, mobile, and multimedia projects with a focus on clean UI, real-world use cases, and user-centered digital experiences.',
  location: 'Selayang, Selangor, Malaysia',
  email: 'atqananwar@gmail.com',
  github_url: 'https://github.com/atqananwar',
  linkedin_url: 'https://linkedin.com/in/atqananwar',
  target_roles: ['Junior Software Developer', 'Web Developer', 'Frontend Developer', 'Full-Stack Developer'],
  achievements: ["Dean's List Award for semesters 1, 2, 4, 5, and 6", "Final Year Project Best Report Award"],
};

type Tab = 'about' | 'experience' | 'education';

export function AboutApp() {
  const [profile, setProfile] = useState<Partial<Profile>>(FALLBACK_PROFILE);
  const [tab, setTab] = useState<Tab>('about');

  useEffect(() => {
    getProfile().then((p) => { if (p) setProfile(p); }).catch(() => {});
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-white/10">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {profile.name?.[0] ?? 'A'}
          </div>
          <div className="min-w-0">
            <h2 className="text-white text-xl font-bold">{profile.name}</h2>
            <p className="text-white/50 text-sm mt-0.5 leading-snug">{profile.headline}</p>
            {profile.location && (
              <div className="flex items-center gap-1 mt-2 text-white/40 text-xs">
                <MapPin size={10} /> {profile.location}
              </div>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-xs transition-colors">
              <Mail size={11} /> Email
            </a>
          )}
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-xs transition-colors">
              <GitBranch size={11} /> GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-xs transition-colors">
              <Link2 size={11} /> LinkedIn
            </a>
          )}
          {profile.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs transition-colors">
              <Download size={11} /> Resume
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-3 gap-1 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.id ? 'text-white bg-white/10 border-b-2 border-blue-400' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'about' && (
          <div className="space-y-5">
            <div>
              <p className="text-white/70 text-sm leading-relaxed">{profile.short_bio}</p>
              {profile.long_bio && profile.long_bio !== profile.short_bio && (
                <p className="text-white/60 text-sm leading-relaxed mt-3">{profile.long_bio}</p>
              )}
            </div>

            {profile.target_roles && profile.target_roles.length > 0 && (
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Target Roles</p>
                <div className="flex flex-wrap gap-2">
                  {profile.target_roles.map((role) => (
                    <span key={role} className="px-2 py-1 rounded-lg bg-blue-500/15 text-blue-300 text-xs">{role}</span>
                  ))}
                </div>
              </div>
            )}

            {profile.achievements && profile.achievements.length > 0 && (
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Award size={10} /> Achievements
                </p>
                <ul className="space-y-1.5">
                  {profile.achievements.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-yellow-400 mt-0.5">🏆</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === 'experience' && (
          <div className="space-y-4">
            {(profile.experience ?? []).length === 0 ? (
              <p className="text-white/30 text-sm text-center mt-8">No experience data.</p>
            ) : (
              (profile.experience ?? []).map((exp, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase size={14} className="text-white/60" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm">{exp.role}</p>
                      <p className="text-white/50 text-xs">{exp.company}</p>
                      <p className="text-white/30 text-xs mt-0.5">{exp.duration}</p>
                      {exp.highlights?.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.highlights.map((h, j) => (
                            <li key={j} className="text-xs text-white/60 flex items-start gap-1.5">
                              <span className="text-blue-400 mt-0.5">•</span>{h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'education' && (
          <div className="space-y-4">
            {(profile.education ?? []).length === 0 ? (
              <p className="text-white/30 text-sm text-center mt-8">No education data.</p>
            ) : (
              (profile.education ?? []).map((edu, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={14} className="text-white/60" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{edu.degree}</p>
                      <p className="text-white/50 text-xs">{edu.institution}</p>
                      <p className="text-white/30 text-xs mt-0.5">{edu.duration}</p>
                      {edu.cgpa && <p className="text-white/50 text-xs mt-1">CGPA: <span className="text-white/80">{edu.cgpa}</span></p>}
                      {edu.note && <p className="text-white/50 text-xs mt-1 italic">{edu.note}</p>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
