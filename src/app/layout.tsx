import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AtqanOS — Atqan Anwar Portfolio',
  description: 'Interactive Web OS-inspired portfolio by Atqan Anwar.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
