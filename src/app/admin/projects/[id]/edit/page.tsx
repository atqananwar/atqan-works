'use client';

import { useEffect, useState } from 'react';
import { getProjectById } from '@/lib/db/projects';
import { ProjectForm } from '@/components/admin/ProjectForm';
import type { Project } from '@/types';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      getProjectById(p.id).then((proj) => {
        setProject(proj);
        setLoading(false);
      });
    });
  }, [params]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-white/40 text-sm animate-pulse">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8">
        <p className="text-white/40 text-sm">Project not found.</p>
      </div>
    );
  }

  return <ProjectForm initialData={project} />;
}
