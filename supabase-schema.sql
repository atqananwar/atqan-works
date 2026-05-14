-- =========================================================
-- ATQAN WORKS — SUPABASE SQL SCHEMA
-- Run this in Supabase SQL Editor: supabase.com/dashboard
-- =========================================================

-- ─────────────────────────────────────────
-- PROFILES TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  headline TEXT NOT NULL DEFAULT '',
  short_bio TEXT NOT NULL DEFAULT '',
  long_bio TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  whatsapp TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  resume_url TEXT,
  location TEXT,
  target_roles TEXT[] DEFAULT '{}',
  education JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- PROJECTS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL DEFAULT '',
  long_description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'In Progress',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  tech_stack TEXT[] DEFAULT '{}',
  key_features TEXT[] DEFAULT '{}',
  problem_solved TEXT DEFAULT '',
  live_url TEXT,
  github_url TEXT,
  cover_image_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  demo_video_url TEXT,
  mockup_video_url TEXT,
  external_video_url TEXT,
  case_study TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- SKILLS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  icon_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- CONTACT MESSAGES TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- SITE SETTINGS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can read profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can manage profiles" ON profiles;
DROP POLICY IF EXISTS "Public can read published projects" ON projects;
DROP POLICY IF EXISTS "Admin can manage projects" ON projects;
DROP POLICY IF EXISTS "Public can read skills" ON skills;
DROP POLICY IF EXISTS "Admin can manage skills" ON skills;
DROP POLICY IF EXISTS "Public can insert messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin can manage messages" ON contact_messages;
DROP POLICY IF EXISTS "Public can read settings" ON site_settings;
DROP POLICY IF EXISTS "Admin can manage settings" ON site_settings;

-- PROFILES
CREATE POLICY "Public can read profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage profiles"
  ON profiles FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- PROJECTS
CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT
  USING (published = true);

CREATE POLICY "Admin can manage projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- SKILLS
CREATE POLICY "Public can read skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage skills"
  ON skills FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- CONTACT MESSAGES
CREATE POLICY "Public can insert messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can manage messages"
  ON contact_messages FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- SITE SETTINGS
CREATE POLICY "Public can read settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =========================================================
-- SUPABASE STORAGE BUCKET
-- Run these in Supabase SQL Editor OR create manually in
-- Storage section of your Supabase dashboard.
-- =========================================================

-- Create storage bucket (run in Supabase dashboard > Storage)
-- Bucket name: project-media
-- Public: true

-- Storage policies (run in SQL Editor)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read project media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload project media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete project media" ON storage.objects;

CREATE POLICY "Public can read project media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-media');

CREATE POLICY "Admin can upload project media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-media'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin can update project media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'project-media'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin can delete project media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'project-media'
    AND auth.role() = 'authenticated'
  );

-- =========================================================
-- SEED DATA
-- =========================================================

-- ─────────────────────────────────────────
-- PROFILE SEED
-- ─────────────────────────────────────────
INSERT INTO profiles (
  name, headline, short_bio, long_bio,
  email, phone, whatsapp,
  github_url, linkedin_url,
  location,
  target_roles,
  education,
  experience,
  achievements
) VALUES (
  'Atqan Anwar',
  'Web Developer / Software Developer / Multimedia Computing Graduate',
  'I build practical web, mobile, and multimedia projects with a focus on clean UI, real-world use cases, and user-centered digital experiences.',
  'I am a Computer Science graduate specializing in Multimedia Computing with hands-on experience in web development, WordPress customization, mobile app development, VR development, and full-stack project building. My work includes productivity apps, fitness tracking systems, finance tools, real business websites, and immersive VR experiences. I focus on building useful digital products with clean interfaces, structured code, responsive layouts, and practical business value.',
  'atqananwar@gmail.com',
  '0133228020',
  '+60133228020',
  'https://github.com/atqananwar',
  'https://linkedin.com/in/atqananwar',
  'Selayang, Selangor, Malaysia',
  ARRAY[
    'Junior Software Developer',
    'Web Developer',
    'Frontend Developer',
    'Full-Stack Developer',
    'WordPress Developer'
  ],
  '[
    {
      "degree": "Bachelor of Computer Science (Hons.) Multimedia Computing",
      "institution": "Universiti Teknologi MARA (UiTM) Cawangan Melaka, Kampus Jasin",
      "duration": "March 2022 - August 2025",
      "cgpa": "3.64",
      "note": "Final Year Project: Harvesting Health — Immersive VR Games for Hand Rehabilitation Therapy"
    },
    {
      "degree": "Diploma in Science",
      "institution": "Universiti Teknologi MARA (UiTM) Cawangan Pahang, Kampus Jengka",
      "duration": "September 2019 - March 2022",
      "cgpa": "3.44"
    }
  ]'::jsonb,
  '[
    {
      "role": "Web Designer",
      "company": "Ibtisam Travel & Tours Sdn Bhd",
      "duration": "December 2025 - Present",
      "highlights": [
        "Manage and maintain the company WordPress website",
        "Build and refine web pages using HTML, CSS, JavaScript, and WordPress tools",
        "Manage travel package content, promotions, and corporate service pages",
        "Improve mobile responsiveness, layout consistency, and website usability",
        "Support landing page updates and business-focused website improvements"
      ]
    },
    {
      "role": "Industrial Intern – Web Developer",
      "company": "Ana Muslim Sdn Bhd",
      "duration": "March 2025 - June 2025",
      "highlights": [
        "Worked on a WordPress website ecosystem with parent/child user roles",
        "Used JetEngine, ARMember, Tutor LMS, and Real3D Flipbook",
        "Customized frontend and backend features with HTML, CSS, JavaScript, and PHP",
        "Built child-focused content access and age-based filtering flow",
        "Integrated Firebase-based educational game access"
      ]
    },
    {
      "role": "Junior Graphic Designer",
      "company": "Arahsuci Printing",
      "duration": "January 2019 - July 2019",
      "highlights": [
        "Designed brochures, banners, posters, and marketing materials",
        "Used Adobe Photoshop and Illustrator",
        "Prepared visuals for printing and client approval",
        "Managed design assets and layout revisions"
      ]
    }
  ]'::jsonb,
  ARRAY[
    'Dean''s List Award for semesters 1, 2, 4, 5, and 6',
    'Final Year Project Best Report Award for immersive rehabilitation game research'
  ]
) ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- SKILLS SEED
-- ─────────────────────────────────────────
INSERT INTO skills (name, category, display_order) VALUES
  -- Frontend
  ('HTML', 'Frontend', 1),
  ('CSS', 'Frontend', 2),
  ('JavaScript', 'Frontend', 3),
  ('TypeScript', 'Frontend', 4),
  ('React', 'Frontend', 5),
  ('Tailwind CSS', 'Frontend', 6),
  ('Next.js', 'Frontend', 7),
  -- Backend
  ('PHP', 'Backend', 1),
  ('Laravel', 'Backend', 2),
  ('Supabase', 'Backend', 3),
  -- Database
  ('MySQL', 'Database', 1),
  ('PostgreSQL', 'Database', 2),
  ('SQL', 'Database', 3),
  -- Mobile
  ('Flutter', 'Mobile', 1),
  ('Dart', 'Mobile', 2),
  -- CMS
  ('WordPress', 'CMS', 1),
  ('BeBuilder', 'CMS', 2),
  ('JetEngine', 'CMS', 3),
  ('ARMember', 'CMS', 4),
  ('Tutor LMS', 'CMS', 5),
  ('Real3D Flipbook', 'CMS', 6),
  ('Contact Form 7', 'CMS', 7),
  -- VR / Game Development
  ('Unity', 'VR / Game Development', 1),
  ('C#', 'VR / Game Development', 2),
  ('Blender', 'VR / Game Development', 3),
  ('3ds Max', 'VR / Game Development', 4),
  -- Data
  ('Python', 'Data', 1),
  ('pandas', 'Data', 2),
  ('matplotlib', 'Data', 3),
  ('scikit-learn', 'Data', 4),
  -- Design
  ('Adobe Photoshop', 'Design', 1),
  ('Adobe Illustrator', 'Design', 2),
  -- Tools
  ('Git', 'Tools', 1),
  ('GitHub', 'Tools', 2),
  ('VS Code', 'Tools', 3),
  ('Vercel', 'Tools', 4),
  ('npm', 'Tools', 5),
  ('Composer', 'Tools', 6),
  ('Laragon', 'Tools', 7),
  ('XAMPP', 'Tools', 8)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- PROJECTS SEED
-- ─────────────────────────────────────────
INSERT INTO projects (
  slug, title, short_description, long_description,
  category, status, featured, published, display_order,
  tech_stack, key_features, problem_solved,
  live_url, github_url
) VALUES
(
  'todocheck',
  'ToDoCheck',
  'A Flutter productivity app combining task management, Eisenhower Matrix, Kanban, Pomodoro, habit tracking, journaling, and statistics.',
  'ToDoCheck is a Flutter productivity app that combines task management, Eisenhower Matrix planning, Kanban workflow, calendar scheduling, Pomodoro focus sessions, habit tracking, journaling, search, statistics, and customizable settings.',
  'Mobile App / Productivity',
  'Mostly Completed / Improving',
  true,
  true,
  1,
  ARRAY['Flutter', 'Dart', 'Provider', 'TableCalendar', 'Percent Indicator'],
  ARRAY[
    'Today dashboard with task progress and overdue warning',
    'Task management with All, Matrix, and Kanban views',
    'Eisenhower Matrix for priority planning',
    'Kanban workflow visualization',
    'Calendar view for due-date based tasks',
    'Pomodoro focus timer linked to active tasks',
    'Habit tracker with streaks and reminders',
    'Journal entries with mood and tags',
    'Global search for tasks and journal',
    'Statistics dashboard',
    'Custom accent color and custom lists',
    'Bottom navigation between Home, Tasks, Calendar, Focus, Habits, and Journal'
  ],
  'ToDoCheck helps users organize tasks, habits, focus sessions, and journal entries in one lightweight productivity system instead of switching between multiple separate apps.',
  NULL,
  NULL
),
(
  'gerakfit',
  'GerakFit',
  'A React + Supabase fitness tracking PWA for planning workouts, logging sessions, tracking progressive overload, and monitoring analytics.',
  'GerakFit is a React + Supabase fitness tracking web app that helps users plan workouts, build routines, log training sessions, track progressive overload, monitor analytics, and manage fitness profiles in one structured system.',
  'Web App / Fitness',
  'Mostly Completed / Improving',
  true,
  true,
  2,
  ARRAY['React', 'TypeScript', 'Supabase', 'Supabase Auth', 'PostgreSQL', 'Recharts', 'Custom Theme System'],
  ARRAY[
    'User authentication with login, registration, and forgot password',
    'Onboarding flow for fitness goal, experience level, and training frequency',
    'Dashboard with weekly training progress, recent sessions, and personal records',
    'Preset routine explorer with level and equipment filters',
    'Custom routine creation using exercise selection and set configuration',
    'Workout logger with exercises, sets, reps, weight, RPE, warmup sets, and rest timer',
    'Progressive overload suggestions based on previous performance',
    'Personal record detection and celebration',
    'Exercise library with search, muscle group filter, and difficulty filter',
    'Analytics dashboard with weekly volume, consistency, and muscle frequency',
    'AI-style workout summary based on weekly sessions and training gaps',
    'Daily challenge system with rank-based bodyweight challenges and XP'
  ],
  'GerakFit helps users replace scattered workout notes with a structured fitness system for planning routines, logging workouts, tracking progress, and understanding training performance through analytics.',
  NULL,
  'https://github.com/atqananwar/GerakFit'
),
(
  'dompetku',
  'Dompetku',
  'A Laravel personal finance app for managing accounts, transactions, and basic financial tracking while learning real-world backend structure.',
  'Dompetku is a Laravel personal finance app for managing accounts, transactions, and basic financial tracking while learning real-world backend structure.',
  'Web App / Finance',
  'In Progress',
  true,
  true,
  3,
  ARRAY['Laravel', 'PHP', 'MySQL', 'Blade', 'Tailwind CSS'],
  ARRAY[
    'Account management',
    'Transaction tracking',
    'Laravel MVC architecture',
    'MySQL database structure',
    'Blade views',
    'Form validation',
    'CRUD workflow',
    'Route, controller, model, and view structure'
  ],
  'Dompetku helps users organize financial accounts and transactions while demonstrating backend fundamentals, database relationships, and Laravel application structure.',
  NULL,
  NULL
),
(
  'ibtisam-website',
  'Ibtisam Website',
  'A real-world travel agency website with travel package pages, inquiry flow, WhatsApp conversion, responsive design, and SEO-friendly structure.',
  'A real-world travel agency website focused on travel package pages, landing pages, inquiry flow, WhatsApp conversion, responsive design, and SEO-friendly content structure.',
  'Business Website / WordPress',
  'Completed / Live',
  true,
  true,
  4,
  ARRAY['WordPress', 'BeBuilder', 'CSS', 'JavaScript', 'Contact Form 7'],
  ARRAY[
    'Travel package landing pages',
    'Inquiry form flow',
    'WhatsApp conversion flow',
    'Responsive page sections',
    'Custom CSS design components',
    'SEO-friendly content structure',
    'Business-focused website layout',
    'Real-world content and conversion strategy'
  ],
  'The Ibtisam website helps a travel agency present packages clearly, collect inquiries, guide users toward WhatsApp communication, and improve online credibility.',
  'https://ibtisam2u.com/',
  NULL
)
ON CONFLICT (slug) DO NOTHING;
