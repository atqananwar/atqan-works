'use client';

import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { getProfile, updateProfile } from '@/lib/db/profile';
import type { Profile, EducationEntry, ExperienceEntry } from '@/types';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [targetRoleInput, setTargetRoleInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');

  useEffect(() => {
    getProfile().then(setProfile).catch(console.error).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    setError('');
    try {
      await updateProfile(profile.id, profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof Profile, value: unknown) => {
    setProfile((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  const addRole = () => {
    if (!targetRoleInput.trim() || !profile) return;
    update('target_roles', [...profile.target_roles, targetRoleInput.trim()]);
    setTargetRoleInput('');
  };

  const addAchievement = () => {
    if (!achievementInput.trim() || !profile) return;
    update('achievements', [...profile.achievements, achievementInput.trim()]);
    setAchievementInput('');
  };

  const addEducation = () => {
    const entry: EducationEntry = { degree: '', institution: '', duration: '' };
    update('education', [...(profile?.education ?? []), entry]);
  };

  const updateEdu = (i: number, key: keyof EducationEntry, value: string) => {
    const updated = [...(profile?.education ?? [])];
    updated[i] = { ...updated[i], [key]: value };
    update('education', updated);
  };

  const removeEdu = (i: number) => {
    update('education', profile?.education.filter((_, j) => j !== i));
  };

  const addExperience = () => {
    const entry: ExperienceEntry = { role: '', company: '', duration: '', highlights: [] };
    update('experience', [...(profile?.experience ?? []), entry]);
  };

  const updateExp = (i: number, key: keyof ExperienceEntry, value: string | string[]) => {
    const updated = [...(profile?.experience ?? [])];
    updated[i] = { ...updated[i], [key]: value };
    update('experience', updated);
  };

  const removeExp = (i: number) => {
    update('experience', profile?.experience.filter((_, j) => j !== i));
  };

  if (loading) return <div className="p-8 text-white/40 text-sm animate-pulse">Loading...</div>;
  if (!profile) return <div className="p-8 text-white/40 text-sm">Profile not found. Run the seed SQL first.</div>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-white/40 text-sm mt-1">Public portfolio identity</p>
        </div>
        <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center gap-2">
          {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">Profile saved!</div>}

      <div className="space-y-8">
        <Section title="Basic Info">
          <Grid2>
            <Field label="Name">
              <Inp value={profile.name} onChange={(v) => update('name', v)} />
            </Field>
            <Field label="Location">
              <Inp value={profile.location ?? ''} onChange={(v) => update('location', v || null)} />
            </Field>
          </Grid2>
          <Field label="Headline">
            <Inp value={profile.headline} onChange={(v) => update('headline', v)} />
          </Field>
          <Grid2>
            <Field label="Email">
              <Inp type="email" value={profile.email} onChange={(v) => update('email', v)} />
            </Field>
            <Field label="Phone">
              <Inp value={profile.phone ?? ''} onChange={(v) => update('phone', v || null)} />
            </Field>
            <Field label="WhatsApp">
              <Inp value={profile.whatsapp ?? ''} onChange={(v) => update('whatsapp', v || null)} />
            </Field>
            <Field label="GitHub URL">
              <Inp value={profile.github_url ?? ''} onChange={(v) => update('github_url', v || null)} />
            </Field>
            <Field label="LinkedIn URL">
              <Inp value={profile.linkedin_url ?? ''} onChange={(v) => update('linkedin_url', v || null)} />
            </Field>
            <Field label="Resume URL">
              <Inp value={profile.resume_url ?? ''} onChange={(v) => update('resume_url', v || null)} />
            </Field>
          </Grid2>
        </Section>

        <Section title="Bio">
          <Field label="Short Bio">
            <textarea value={profile.short_bio} onChange={(e) => update('short_bio', e.target.value)} rows={2} className={textareaClass} />
          </Field>
          <Field label="Long Bio">
            <textarea value={profile.long_bio} onChange={(e) => update('long_bio', e.target.value)} rows={4} className={textareaClass} />
          </Field>
        </Section>

        <Section title="Target Roles">
          <div className="flex gap-2 mb-2">
            <input value={targetRoleInput} onChange={(e) => setTargetRoleInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addRole()} className={inputClass} placeholder="Add role (press Enter)" />
            <button type="button" onClick={addRole} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm"><Plus size={14} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.target_roles.map((role, i) => (
              <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 text-xs">
                {role}
                <button onClick={() => update('target_roles', profile.target_roles.filter((_, j) => j !== i))}><X size={10} /></button>
              </span>
            ))}
          </div>
        </Section>

        <Section title="Achievements">
          <div className="flex gap-2 mb-2">
            <input value={achievementInput} onChange={(e) => setAchievementInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addAchievement()} className={inputClass} placeholder="Add achievement (press Enter)" />
            <button type="button" onClick={addAchievement} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm"><Plus size={14} /></button>
          </div>
          <div className="space-y-1">
            {profile.achievements.map((a, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/70 text-sm">
                <span className="flex-1">{a}</span>
                <button onClick={() => update('achievements', profile.achievements.filter((_, j) => j !== i))} className="text-white/30 hover:text-red-400"><X size={12} /></button>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Education">
          {profile.education.map((edu, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-xs font-medium">Education #{i + 1}</p>
                <button onClick={() => removeEdu(i)} className="text-white/30 hover:text-red-400"><X size={14} /></button>
              </div>
              <Grid2>
                <Field label="Degree">
                  <Inp value={edu.degree} onChange={(v) => updateEdu(i, 'degree', v)} />
                </Field>
                <Field label="Institution">
                  <Inp value={edu.institution} onChange={(v) => updateEdu(i, 'institution', v)} />
                </Field>
                <Field label="Duration">
                  <Inp value={edu.duration} onChange={(v) => updateEdu(i, 'duration', v)} />
                </Field>
                <Field label="CGPA">
                  <Inp value={edu.cgpa ?? ''} onChange={(v) => updateEdu(i, 'cgpa', v)} />
                </Field>
              </Grid2>
              <Field label="Note / FYP">
                <Inp value={edu.note ?? ''} onChange={(v) => updateEdu(i, 'note', v)} />
              </Field>
            </div>
          ))}
          <button onClick={addEducation} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">
            <Plus size={14} /> Add Education
          </button>
        </Section>

        <Section title="Experience">
          {profile.experience.map((exp, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-xs font-medium">Experience #{i + 1}</p>
                <button onClick={() => removeExp(i)} className="text-white/30 hover:text-red-400"><X size={14} /></button>
              </div>
              <Grid2>
                <Field label="Role">
                  <Inp value={exp.role} onChange={(v) => updateExp(i, 'role', v)} />
                </Field>
                <Field label="Company">
                  <Inp value={exp.company} onChange={(v) => updateExp(i, 'company', v)} />
                </Field>
                <Field label="Duration">
                  <Inp value={exp.duration} onChange={(v) => updateExp(i, 'duration', v)} />
                </Field>
              </Grid2>
              <Field label="Highlights (one per line)">
                <textarea
                  value={exp.highlights.join('\n')}
                  onChange={(e) => updateExp(i, 'highlights', e.target.value.split('\n').filter(Boolean))}
                  rows={3}
                  className={textareaClass}
                />
              </Field>
            </div>
          ))}
          <button onClick={addExperience} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">
            <Plus size={14} /> Add Experience
          </button>
        </Section>
      </div>
    </div>
  );
}

const inputClass = 'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors';
const textareaClass = `${inputClass} resize-none`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-white/40 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-white/50 text-xs mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function Inp({ value, onChange, type = 'text' }: { value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      className={inputClass} />
  );
}
