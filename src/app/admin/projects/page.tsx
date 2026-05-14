'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { getAllProjects, deleteProject, toggleProjectPublished } from '@/lib/db/projects';
import type { Project } from '@/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getAllProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteProject(id);
    load();
  };

  const handleToggle = async (id: string, published: boolean) => {
    await toggleProjectPublished(id, !published);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-white/40 text-sm mt-1">{projects.length} total</p>
        </div>
        <Link href="/admin/projects/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium transition-colors">
          <Plus size={16} /> New Project
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30">
          <p className="text-sm">No projects yet.</p>
          <Link href="/admin/projects/new" className="mt-3 text-blue-400 text-sm hover:underline">Create your first project</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
              {project.cover_image_url ? (
                <img src={project.cover_image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-white/10 flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium text-sm truncate">{project.title}</p>
                  {project.featured && <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-xs">Featured</span>}
                  <span className={`px-1.5 py-0.5 rounded text-xs ${project.published ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                    {project.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-white/40 text-xs mt-0.5 truncate">{project.category} · {project.status}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggle(project.id, project.published)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  title={project.published ? 'Unpublish' : 'Publish'}
                >
                  {project.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <Edit size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/10 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
