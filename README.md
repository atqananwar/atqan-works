# Atqan Works — AtqanOS Portfolio + Works CMS

A full-stack Web OS-inspired developer portfolio with a private CMS admin dashboard.

- **Public**: AtqanOS — desktop-like portfolio with draggable windows, dock, Terminal, Projects, About, Contact, Skills, Settings apps, and a mobile homescreen mode
- **Admin**: Works CMS at `/admin` — manage projects, skills, profile, messages

**Stack**: Next.js 16 · TypeScript · Tailwind CSS · Supabase · Zustand · react-rnd

---

## Setup

### 1. Install

```bash
npm install
```

### 2. Create Supabase Project

Go to [supabase.com](https://supabase.com) → New project → Settings → API → copy Project URL + anon key.

### 3. Set Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run SQL Schema

In Supabase Dashboard → SQL Editor → paste `supabase-schema.sql` → Run.

This creates all tables, RLS policies, storage bucket, and seeds your portfolio data.

### 5. Create Admin User

Supabase Dashboard → Authentication → Users → Add User → Create new user with your email + password.

### 6. Run Locally

```bash
npm run dev
```

- Portfolio: http://localhost:3000
- Admin CMS: http://localhost:3000/admin

---

## Deploy to Vercel

```bash
npx vercel
```

Or push to GitHub and import on vercel.com. Add the two env vars in Vercel's Environment Variables settings.

---

## Using Works CMS

### Add / Edit Projects
`/admin/projects` → New Project or pencil icon → fill all sections including media uploads.

### Upload Images & Videos
In the project form Media section:
- Cover image, screenshots: JPG/PNG/WebP up to 5MB each
- Demo video, mockup video: MP4/WebM/MOV up to 50MB each
- External video URL: YouTube, Vimeo, or any hosted MP4 link (recommended for large files)

### Update Skills
`/admin/skills` → Add Skill → name + category.

### Edit Profile
`/admin/profile` → edit inline → Save Profile.

### View Messages
`/admin/messages` → click a message to read, reply by email, or delete.

---

## Folder Structure

```
src/
├── app/            # Next.js pages (public + /admin/*)
├── components/
│   ├── os/         # Desktop, Window, Dock, Toast
│   ├── apps/       # Terminal, Projects, About, Contact, Skills, Settings
│   ├── mobile/     # MobileHome, MobileAppView
│   └── admin/      # AdminSidebar, ProjectForm
├── lib/
│   ├── supabase/   # Browser + server + middleware clients
│   ├── db/         # Database query functions
│   └── storage/    # Supabase Storage upload helpers
├── store/          # Zustand window manager
├── hooks/          # useIsMobile, useTheme
└── types/          # TypeScript interfaces
```
