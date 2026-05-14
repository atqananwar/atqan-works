import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atqan Anwar — Software Developer Portfolio',
  description: 'Portfolio of Atqan Anwar, a software/web developer building full-stack web apps, dashboards, CMS-style tools, and database-backed projects.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased bg-slate-950 text-white">
        {/* Visually hidden but crawler/screen-reader accessible portfolio content */}
        <section className="sr-only">
          <h1>Atqan Anwar — Software Developer Portfolio</h1>
          <p>Software Developer / Web Developer based in Selayang, Selangor, Malaysia</p>
          <p>Building full-stack web apps, dashboards, CMS tools, CRUD systems, and authentication flows.</p>
          <p>Technologies: React, Next.js, TypeScript, Supabase, Laravel, PHP, MySQL, PostgreSQL, Tailwind CSS, Flutter</p>
          <p>Skills include: full-stack web development, database design, admin panels, portfolio systems, e-commerce, WordPress</p>
          <nav aria-label="Contact links">
            <a href="mailto:atqananwar@gmail.com">Email: atqananwar@gmail.com</a>
            <a href="https://github.com/atqananwar" rel="noopener noreferrer">GitHub: github.com/atqananwar</a>
            <a href="https://linkedin.com/in/atqananwar" rel="noopener noreferrer">LinkedIn: linkedin.com/in/atqananwar</a>
          </nav>
        </section>
        {children}
      </body>
    </html>
  );
}
