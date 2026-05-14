'use client';

import { useEffect, useState } from 'react';
import { FolderKanban, Eye, FileEdit, Zap, MessageSquare, MailOpen } from 'lucide-react';
import { getAllProjects } from '@/lib/db/projects';
import { getSkills } from '@/lib/db/skills';
import { getMessages, getUnreadCount } from '@/lib/db/messages';

interface Stats {
  total: number;
  published: number;
  drafts: number;
  skills: number;
  messages: number;
  unread: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, drafts: 0, skills: 0, messages: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllProjects(), getSkills(), getMessages(), getUnreadCount()])
      .then(([projects, skills, messages, unread]) => {
        setStats({
          total: projects.length,
          published: projects.filter((p) => p.published).length,
          drafts: projects.filter((p) => !p.published).length,
          skills: skills.length,
          messages: messages.length,
          unread,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Projects', value: stats.total, icon: FolderKanban, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Published', value: stats.published, icon: Eye, color: 'text-green-400 bg-green-500/10' },
    { label: 'Drafts', value: stats.drafts, icon: FileEdit, color: 'text-yellow-400 bg-yellow-500/10' },
    { label: 'Skills', value: stats.skills, icon: Zap, color: 'text-purple-400 bg-purple-500/10' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'text-orange-400 bg-orange-500/10' },
    { label: 'Unread', value: stats.unread, icon: MailOpen, color: 'text-red-400 bg-red-500/10' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back, Atqan.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon size={17} />
              </div>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-white/40 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="mt-8">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/projects/new" className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm transition-colors">
            + New Project
          </a>
          <a href="/admin/skills" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">
            Manage Skills
          </a>
          <a href="/admin/messages" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">
            View Messages {stats.unread > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">{stats.unread}</span>}
          </a>
        </div>
      </div>
    </div>
  );
}
