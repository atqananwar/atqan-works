'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Folder, File, ArrowLeft, ExternalLink, GitBranch, X } from 'lucide-react';
import { getPublishedProjects } from '@/lib/db/projects';
import type { Project } from '@/types';

const FOLDERS: Record<string, (p: Project) => boolean> = {
  Featured: (p) => p.featured,
  'Client / Business': (p) => p.category.toLowerCase().includes('business') || p.category.toLowerCase().includes('wordpress'),
  'Learning / Ongoing': (p) => p.status === 'In Progress' || p.status === 'Prototype',
};

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'fallback-1',
    slug: 'atqan-os-portfolio',
    title: 'AtqanOS — Interactive Portfolio',
    short_description: 'A macOS-inspired interactive web OS built as a personal portfolio, featuring draggable windows, a dock, desktop icons, and Supabase-backed admin CMS.',
    long_description: 'Built with Next.js 16, Tailwind CSS v4, Zustand, and Supabase. The project showcases a custom window management system, responsive mobile layout, avatar upload, contact form, and a full admin panel for managing projects, skills, and profile data.',
    category: 'Full-Stack / Portfolio',
    status: 'Live',
    featured: true,
    published: true,
    display_order: 1,
    tech_stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Supabase', 'React'],
    key_features: [
      'Draggable/resizable window management system',
      'Supabase-backed admin CMS for projects, skills, and profile',
      'Responsive mobile layout with full app support',
      'Avatar upload via Supabase Storage',
      'Real-time contact form with message inbox',
    ],
    problem_solved: 'Standard portfolio sites are static and forgettable. AtqanOS creates an interactive, memorable OS-like experience that simultaneously demonstrates full-stack engineering skills.',
    live_url: null,
    github_url: 'https://github.com/atqananwar/atqan-works',
    cover_image_url: null,
    screenshots: [],
    demo_video_url: null,
    mockup_video_url: null,
    external_video_url: null,
    case_study: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

type View = 'explorer' | 'folder' | 'project';

export function ProjectsApp() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('explorer');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    getPublishedProjects()
      .then((data) => setProjects(data.length > 0 ? data : FALLBACK_PROJECTS))
      .catch(() => setProjects(FALLBACK_PROJECTS))
      .finally(() => setLoading(false));
  }, []);

  const folderProjects = activeFolder
    ? projects.filter(FOLDERS[activeFolder] || (() => true))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/40 text-sm animate-pulse">Loading projects...</div>
      </div>
    );
  }

  if (view === 'project' && activeProject) {
    return <ProjectDetail project={activeProject} onBack={() => setView('folder')} />;
  }

  if (view === 'folder' && activeFolder) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <button aria-label="Back to Projects" onClick={() => setView('explorer')} className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </button>
          <ChevronRight size={14} className="text-white/30" />
          <span className="text-white/80 text-sm font-medium">{activeFolder}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {folderProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-white/30">
              <Folder size={32} className="mb-2" />
              <p className="text-sm">Coming soon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {folderProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => { setActiveProject(project); setView('project'); }}
                  className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left group"
                >
                  {project.cover_image_url ? (
                    <img src={project.cover_image_url} alt={project.title} className="w-full h-24 object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-24 rounded-lg bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                      <File size={24} className="text-white/30" />
                    </div>
                  )}
                  <div>
                    <p className="text-white text-sm font-medium truncate">{project.title}</p>
                    <p className="text-white/40 text-xs truncate">{project.category}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs">
                      {project.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <Folder size={16} className="text-blue-400" />
        <span className="text-white/80 text-sm font-medium">Projects</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {Object.keys(FOLDERS).map((folderName) => {
          const count = projects.filter(FOLDERS[folderName]).length;
          return (
            <button
              key={folderName}
              onClick={() => { setActiveFolder(folderName); setView('folder'); }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
            >
              <Folder size={20} className="text-yellow-400 flex-shrink-0" />
              <span className="text-white/80 text-sm font-medium flex-1 text-left">{folderName}</span>
              <span className="text-white/30 text-xs">{count} items</span>
              <ChevronRight size={14} className="text-white/30 group-hover:text-white/60 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 sticky top-0 bg-black/60 backdrop-blur-xl z-10">
        <button aria-label="Back to folder" onClick={onBack} className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </button>
        <ChevronRight size={14} className="text-white/30" />
        <span className="text-white/80 text-sm font-medium truncate">{project.title}</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Cover */}
        {project.cover_image_url ? (
          <img src={project.cover_image_url} alt={project.title} className="w-full h-48 object-cover rounded-xl" />
        ) : (
          <div className="w-full h-48 rounded-xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
            <File size={40} className="text-white/20" />
          </div>
        )}

        {/* Title row */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-white text-xl font-bold">{project.title}</h2>
            <span className="flex-shrink-0 px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
              {project.status}
            </span>
          </div>
          <p className="text-white/50 text-sm mt-1">{project.category}</p>
        </div>

        {/* Short desc */}
        <p className="text-white/70 text-sm leading-relaxed">{project.short_description}</p>

        {/* Links */}
        <div className="flex gap-3">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-medium transition-colors">
              <ExternalLink size={12} /> Live Site
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-xs font-medium transition-colors">
              <GitBranch size={12} /> GitHub
            </a>
          )}
        </div>

        {/* Tech stack */}
        {project.tech_stack?.length > 0 && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <span key={tech} className="px-2 py-1 rounded-lg bg-white/10 text-white/70 text-xs">{tech}</span>
              ))}
            </div>
          </div>
        )}

        {/* Problem solved */}
        {project.problem_solved && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Problem Solved</p>
            <p className="text-white/70 text-sm leading-relaxed">{project.problem_solved}</p>
          </div>
        )}

        {/* Key features */}
        {project.key_features?.length > 0 && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Key Features</p>
            <ul className="space-y-1">
              {project.key_features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Long description */}
        {project.long_description && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">About</p>
            <p className="text-white/70 text-sm leading-relaxed">{project.long_description}</p>
          </div>
        )}

        {/* Screenshots */}
        {project.screenshots?.length > 0 && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Screenshots</p>
            <div className="grid grid-cols-2 gap-2">
              {project.screenshots.map((url, i) => (
                <button key={i} onClick={() => setGalleryIndex(i)}>
                  <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-28 object-cover rounded-lg hover:opacity-90 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {project.demo_video_url && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Demo Video</p>
            <video controls className="w-full rounded-xl" poster={project.cover_image_url || undefined} preload="metadata">
              <source src={project.demo_video_url} />
            </video>
          </div>
        )}
        {project.mockup_video_url && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Mockup / Showcase</p>
            <video controls muted loop playsInline className="w-full rounded-xl" preload="metadata">
              <source src={project.mockup_video_url} />
            </video>
          </div>
        )}
        {project.external_video_url && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">External Video</p>
            <a href={project.external_video_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm transition-colors">
              <ExternalLink size={14} /> Watch external video
            </a>
          </div>
        )}

        {/* Case study */}
        {project.case_study && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Case Study</p>
            <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{project.case_study}</div>
          </div>
        )}
      </div>

      {/* Gallery lightbox */}
      {galleryIndex !== null && (
        <div className="fixed inset-0 z-[99] bg-black/90 flex items-center justify-center p-4" onClick={() => setGalleryIndex(null)}>
          <button aria-label="Close gallery" className="absolute top-4 right-4 text-white/60 hover:text-white">
            <X size={24} />
          </button>
          <img src={project.screenshots[galleryIndex]} alt={`${project.title} screenshot ${galleryIndex + 1}`} className="max-w-full max-h-full object-contain rounded-xl" />
          <div className="absolute bottom-4 flex gap-2">
            {project.screenshots.map((_, i) => (
              <button key={i} aria-label={`Screenshot ${i + 1}`} onClick={(e) => { e.stopPropagation(); setGalleryIndex(i); }}
                className={`w-2 h-2 rounded-full transition-colors ${i === galleryIndex ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
