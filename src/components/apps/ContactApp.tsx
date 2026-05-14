'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Link2, GitBranch, Send, Check } from 'lucide-react';
import { createMessage } from '@/lib/db/messages';

export function ContactApp() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createMessage(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contacts = [
    { icon: Mail, label: 'Email', value: 'atqananwar@gmail.com', href: 'mailto:atqananwar@gmail.com' },
    { icon: MessageSquare, label: 'WhatsApp', value: '+60 13-322 8020', href: 'https://wa.me/60133228020' },
    { icon: Link2, label: 'LinkedIn', value: 'linkedin.com/in/atqananwar', href: 'https://linkedin.com/in/atqananwar' },
    { icon: GitBranch, label: 'GitHub', value: 'github.com/atqananwar', href: 'https://github.com/atqananwar' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-5 space-y-5">
      {/* Contact links */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Get In Touch</p>
        <div className="space-y-2">
          {contacts.map(({ icon: Icon, label, value, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-white/60" />
              </div>
              <div>
                <p className="text-white/50 text-xs">{label}</p>
                <p className="text-white/80 text-sm">{value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Send a Message</p>

        {success ? (
          <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check size={24} className="text-green-400" />
            </div>
            <p className="text-green-400 font-medium">Message sent!</p>
            <p className="text-white/50 text-sm text-center">I&apos;ll get back to you as soon as possible.</p>
            <button onClick={() => setSuccess(false)} className="text-white/40 text-xs hover:text-white/70 transition-colors">Send another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/40 text-xs mb-1 block">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs mb-1 block">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Subject</label>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
                placeholder="Subject"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Message *</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors resize-none"
                placeholder="Your message..."
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-sm font-medium transition-colors w-full justify-center"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <Send size={14} />
              )}
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
