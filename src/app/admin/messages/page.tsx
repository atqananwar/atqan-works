'use client';

import { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { getMessages, markMessageRead, deleteMessage } from '@/lib/db/messages';
import type { ContactMessage } from '@/types';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = () => {
    getMessages().then(setMessages).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSelect = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.is_read) {
      await markMessageRead(msg.id, true);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await deleteMessage(id);
    if (selected?.id === id) setSelected(null);
    load();
  };

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div className="flex h-full">
      {/* Message list */}
      <div className="w-80 border-r border-white/5 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/5">
          <h1 className="text-xl font-bold text-white">Messages</h1>
          <p className="text-white/40 text-sm mt-0.5">{messages.length} total · {unread} unread</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-5 text-white/40 text-sm animate-pulse">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/30">
              <MailOpen size={28} className="mb-2" />
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`w-full text-left px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors ${selected?.id === msg.id ? 'bg-white/8' : ''}`}
              >
                <div className="flex items-start gap-2">
                  {msg.is_read ? (
                    <MailOpen size={13} className="text-white/30 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Mail size={13} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${msg.is_read ? 'text-white/60' : 'text-white font-medium'}`}>
                      {msg.name}
                    </p>
                    <p className="text-white/40 text-xs truncate">{msg.subject || msg.message}</p>
                    <p className="text-white/25 text-xs mt-0.5">{new Date(msg.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message detail */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">{selected.subject || '(No subject)'}</h2>
                <p className="text-white/50 text-sm mt-1">
                  From <span className="text-white/70">{selected.name}</span> &lt;{selected.email}&gt;
                </p>
                <p className="text-white/30 text-xs mt-0.5">
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(selected.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="mt-4 flex gap-3">
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm transition-colors"
              >
                <Mail size={14} /> Reply by Email
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/20">
            <MailOpen size={40} className="mb-3" />
            <p className="text-sm">Select a message to view</p>
          </div>
        )}
      </div>
    </div>
  );
}
