export interface Project {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  long_description: string;
  category: string;
  status: string;
  featured: boolean;
  published: boolean;
  display_order: number;
  tech_stack: string[];
  key_features: string[];
  problem_solved: string;
  live_url: string | null;
  github_url: string | null;
  cover_image_url: string | null;
  screenshots: string[];
  demo_video_url: string | null;
  mockup_video_url: string | null;
  external_video_url: string | null;
  case_study: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  display_order: number;
  icon_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string;
  headline: string;
  short_bio: string;
  long_bio: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  resume_url: string | null;
  location: string | null;
  target_roles: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  achievements: string[];
  created_at: string;
  updated_at: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  duration: string;
  cgpa?: string;
  note?: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  duration: string;
  highlights: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

// Window manager types
export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  appId: AppId;
}

export type AppId =
  | 'terminal'
  | 'projects'
  | 'about'
  | 'contact'
  | 'skills'
  | 'settings'
  | 'welcome';

export interface AppConfig {
  id: AppId;
  title: string;
  icon: string;
  defaultSize: { width: number; height: number };
  defaultPosition: { x: number; y: number };
}
