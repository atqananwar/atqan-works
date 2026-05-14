'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Upload } from 'lucide-react';
import { createProject, updateProject } from '@/lib/db/projects';
import { uploadProjectMedia } from '@/lib/storage/projectMedia';
import { slugify } from '@/lib/utils';
import type { Project } from '@/types';

type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at'>;

const STATUS_OPTIONS = [
  'Completed / Live',
  'Mostly Completed / Improving',
  'In Progress',
  'Prototype',
  'Archived',
  'Concept',
];

const CATEGORY_OPTIONS = [
  'Web App',
  'Mobile App',
  'Business Website / WordPress',
  'Web App / Fitness',
  'Web App / Finance',
  'Mobile App / Productivity',
  'VR / Game',
  'Data / Analytics',
  'Other',
];

const defaultForm: ProjectFormData = {
  slug: '',
  title: '',
  short_description: '',
  long_description: '',
  category: '',
  status: 'In Progress',
  featured: false,
  published: false,
  display_order: 0,
  tech_stack: [],
  key_features: [],
  problem_solved: '',
  live_url: null,
  github_url: null,
  cover_image_url: null,
  screenshots: [],
  demo_video_url: null,
  mockup_video_url: null,
  external_video_url: null,
  case_study: null,
};

interface ProjectFormProps {
  initialData?: Project;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormData>(
    initialData
      ? { ...initialData }
      : defaultForm
  );
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState<string | null>(null);

  const update = (key: keyof ProjectFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = (key: 'tech_stack' | 'key_features', value: string) => {
    if (!value.trim()) return;
    update(key, [...(form[key] as string[]), value.trim()]);
    if (key === 'tech_stack') setTechInput('');
    if (key === 'key_features') setFeatureInput('');
  };

  const removeTag = (key: 'tech_stack' | 'key_features', index: number) => {
    update(key, (form[key] as string[]).filter((_, i) => i !== index));
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: !initialData ? slugify(title) : prev.slug,
    }));
  };

  const handleUpload = async (
    file: File,
    mediaType: 'cover' | 'screenshot' | 'demo-video' | 'mockup-video'
  ) => {
    if (!form.slug) {
      setError('Please set a project slug before uploading media.');
      return;
    }
    setUploadingMedia(mediaType);
    setError('');
    try {
      const url = await uploadProjectMedia(file, form.slug, mediaType);
      if (mediaType === 'cover') update('cover_image_url', url);
      else if (mediaType === 'screenshot') update('screenshots', [...form.screenshots, url]);
      else if (mediaType === 'demo-video') update('demo_video_url', url);
      else if (mediaType === 'mockup-video') update('mockup_video_url', url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingMedia(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) {
      setError('Title and slug are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (initialData) {
        await updateProject(initialData.id, form);
      } else {
        await createProject(form);
      }
      router.push('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {initialData ? 'Edit Project' : 'New Project'}
          </h1>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center gap-2">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>

      {error && <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      <div className="space-y-8">
        {/* Basic Info */}
        <Section title="Basic Info">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(v) => handleTitleChange(v)} placeholder="Project title" />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(v) => update('slug', v)} placeholder="project-slug" />
            </div>
            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={String(form.display_order)}
                onChange={(v) => update('display_order', parseInt(v) || 0)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
              >
                <option value="">Select category</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-6 mt-2">
            <Checkbox label="Featured" checked={form.featured} onChange={(v) => update('featured', v)} />
            <Checkbox label="Published" checked={form.published} onChange={(v) => update('published', v)} />
          </div>
        </Section>

        {/* Descriptions */}
        <Section title="Descriptions">
          <div>
            <Label>Short Description</Label>
            <textarea
              value={form.short_description}
              onChange={(e) => update('short_description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="Brief description shown in project cards"
            />
          </div>
          <div>
            <Label>Long Description</Label>
            <textarea
              value={form.long_description}
              onChange={(e) => update('long_description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="Detailed project description"
            />
          </div>
          <div>
            <Label>Problem Solved</Label>
            <textarea
              value={form.problem_solved}
              onChange={(e) => update('problem_solved', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="What problem does this solve?"
            />
          </div>
          <div>
            <Label>Case Study</Label>
            <textarea
              value={form.case_study ?? ''}
              onChange={(e) => update('case_study', e.target.value || null)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="Case study content (optional)"
            />
          </div>
        </Section>

        {/* Tech & Features */}
        <Section title="Tech & Features">
          <div>
            <Label>Tech Stack</Label>
            <div className="flex gap-2 mb-2">
              <input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addTag('tech_stack', techInput); }
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50"
                placeholder="Add tech (press Enter)"
              />
              <button type="button" onClick={() => addTag('tech_stack', techInput)} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tech_stack.map((tech, i) => (
                <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white/70 text-xs">
                  {tech}
                  <button type="button" onClick={() => removeTag('tech_stack', i)} className="text-white/40 hover:text-white">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <Label>Key Features</Label>
            <div className="flex gap-2 mb-2">
              <input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addTag('key_features', featureInput); }
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50"
                placeholder="Add feature (press Enter)"
              />
              <button type="button" onClick={() => addTag('key_features', featureInput)} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-1">
              {form.key_features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/70 text-sm">
                  <span className="flex-1">{feat}</span>
                  <button type="button" onClick={() => removeTag('key_features', i)} className="text-white/30 hover:text-white">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Links */}
        <Section title="Links">
          <div>
            <Label>Live URL</Label>
            <Input value={form.live_url ?? ''} onChange={(v) => update('live_url', v || null)} placeholder="https://..." />
          </div>
          <div>
            <Label>GitHub URL</Label>
            <Input value={form.github_url ?? ''} onChange={(v) => update('github_url', v || null)} placeholder="https://github.com/..." />
          </div>
        </Section>

        {/* Media */}
        <Section title="Media">
          {/* Cover Image */}
          <div>
            <Label>Cover Image</Label>
            {form.cover_image_url && (
              <div className="mb-2 relative inline-block">
                <img src={form.cover_image_url} alt="Cover" className="w-40 h-28 object-cover rounded-lg" />
                <button type="button" onClick={() => update('cover_image_url', null)} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                  <X size={10} />
                </button>
              </div>
            )}
            <MediaUploadButton
              accept="image/*"
              loading={uploadingMedia === 'cover'}
              onFile={(f) => handleUpload(f, 'cover')}
            />
          </div>

          {/* Screenshots */}
          <div>
            <Label>Screenshots</Label>
            {form.screenshots.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {form.screenshots.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="w-24 h-16 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => update('screenshots', form.screenshots.filter((_, j) => j !== i))}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <X size={8} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <MediaUploadButton
              accept="image/*"
              loading={uploadingMedia === 'screenshot'}
              onFile={(f) => handleUpload(f, 'screenshot')}
              label="Upload Screenshot"
            />
          </div>

          {/* Demo Video */}
          <div>
            <Label>Demo Video</Label>
            {form.demo_video_url && (
              <div className="mb-2">
                <video src={form.demo_video_url} controls className="w-full max-w-xs rounded-lg" />
                <button type="button" onClick={() => update('demo_video_url', null)} className="text-red-400 text-xs mt-1 hover:underline">Remove</button>
              </div>
            )}
            <MediaUploadButton
              accept="video/*"
              loading={uploadingMedia === 'demo-video'}
              onFile={(f) => handleUpload(f, 'demo-video')}
              label="Upload Demo Video"
            />
          </div>

          {/* Mockup Video */}
          <div>
            <Label>Mockup / 3D Video</Label>
            {form.mockup_video_url && (
              <div className="mb-2">
                <video src={form.mockup_video_url} controls muted className="w-full max-w-xs rounded-lg" />
                <button type="button" onClick={() => update('mockup_video_url', null)} className="text-red-400 text-xs mt-1 hover:underline">Remove</button>
              </div>
            )}
            <MediaUploadButton
              accept="video/*"
              loading={uploadingMedia === 'mockup-video'}
              onFile={(f) => handleUpload(f, 'mockup-video')}
              label="Upload Mockup Video"
            />
          </div>

          {/* External Video */}
          <div>
            <Label>External Video URL (YouTube, Vimeo, MP4)</Label>
            <Input
              value={form.external_video_url ?? ''}
              onChange={(v) => update('external_video_url', v || null)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </Section>
      </div>

      <div className="mt-8 flex gap-3">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center gap-2">
          {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  );
}

// Sub-components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-white/40 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-white/50 text-xs mb-1.5 block">{children}</label>;
}

function Input({
  value, onChange, placeholder, type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
    />
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-white/20 bg-white/5 accent-blue-500"
      />
      <span className="text-white/60 text-sm">{label}</span>
    </label>
  );
}

function MediaUploadButton({
  accept, loading, onFile, label = 'Upload Image',
}: {
  accept: string;
  loading: boolean;
  onFile: (f: File) => void;
  label?: string;
}) {
  return (
    <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/40 text-sm cursor-pointer hover:border-white/40 hover:text-white/60 transition-colors w-fit ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white/60 rounded-full animate-spin" />
      ) : (
        <Upload size={14} />
      )}
      {loading ? 'Uploading...' : label}
      <input type="file" accept={accept} className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onFile(file);
        e.target.value = '';
      }} />
    </label>
  );
}
