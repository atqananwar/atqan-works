'use client';

export default function AdminSettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
      <p className="text-white/40 text-sm mb-8">Works CMS configuration</p>

      <div className="max-w-lg space-y-4">
        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white font-medium text-sm">Admin Account</p>
          <p className="text-white/40 text-xs mt-1">Manage your admin credentials via Supabase Auth dashboard.</p>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-blue-400 text-xs hover:underline"
          >
            Open Supabase Dashboard →
          </a>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white font-medium text-sm">Portfolio Site</p>
          <p className="text-white/40 text-xs mt-1">Public portfolio at the root URL.</p>
          <a
            href="/"
            target="_blank"
            className="inline-block mt-3 text-blue-400 text-xs hover:underline"
          >
            View Portfolio →
          </a>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs text-white/40">
          <p className="text-white/60 font-medium text-sm">About Works CMS</p>
          <div className="flex justify-between"><span>Version</span><span>1.0.0</span></div>
          <div className="flex justify-between"><span>Stack</span><span>Next.js + Supabase</span></div>
          <div className="flex justify-between"><span>Deployed</span><span>Vercel</span></div>
        </div>
      </div>
    </div>
  );
}
