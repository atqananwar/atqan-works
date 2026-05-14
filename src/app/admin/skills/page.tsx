'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '@/lib/db/skills';
import type { Skill } from '@/types';

const CATEGORIES = [
  'Frontend', 'Backend', 'Database', 'Mobile', 'CMS',
  'VR / Game Development', 'Data', 'Design', 'Tools',
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', display_order: 0, icon_name: null as null | string });
  const [editValues, setEditValues] = useState<Record<string, { name: string; category: string }>>({});

  const load = () => {
    getSkills().then(setSkills).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, Skill[]>);

  const handleAdd = async () => {
    if (!newSkill.name.trim()) return;
    await createSkill({ ...newSkill, icon_name: null, display_order: skills.filter(s => s.category === newSkill.category).length });
    setNewSkill({ name: '', category: 'Frontend', display_order: 0, icon_name: null });
    setAdding(false);
    load();
  };

  const handleEdit = async (id: string) => {
    const vals = editValues[id];
    if (!vals) return;
    await updateSkill(id, vals);
    setEditingId(null);
    load();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    await deleteSkill(id);
    load();
  };

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setEditValues((prev) => ({ ...prev, [skill.id]: { name: skill.name, category: skill.category } }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Skills</h1>
          <p className="text-white/40 text-sm mt-1">{skills.length} skills across {Object.keys(grouped).length} categories</p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Add skill form */}
      {adding && (
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white/60 text-sm font-medium mb-3">New Skill</p>
          <div className="flex gap-3">
            <input
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50"
              placeholder="Skill name"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm transition-colors">Add</button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-white/40 text-sm animate-pulse">Loading...</div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.filter((c) => grouped[c]?.length > 0).map((category) => (
            <div key={category}>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3">{category}</p>
              <div className="space-y-1.5">
                {grouped[category]?.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                    {editingId === skill.id ? (
                      <>
                        <input
                          value={editValues[skill.id]?.name || ''}
                          onChange={(e) => setEditValues((prev) => ({ ...prev, [skill.id]: { ...prev[skill.id], name: e.target.value } }))}
                          className="flex-1 px-2 py-1 rounded-lg bg-white/5 border border-white/20 text-white text-sm focus:outline-none"
                          autoFocus
                        />
                        <button onClick={() => handleEdit(skill.id)} className="text-green-400 hover:text-green-300">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-white/30 hover:text-white">
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-white/80 text-sm">{skill.name}</span>
                        <button onClick={() => startEdit(skill)} className="text-white/30 hover:text-white/70 transition-colors">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(skill.id, skill.name)} className="text-white/30 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
