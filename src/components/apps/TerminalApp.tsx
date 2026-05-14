'use client';

import { useState, useRef, useEffect } from 'react';
import { getProfile } from '@/lib/db/profile';
import { getPublishedProjects } from '@/lib/db/projects';
import { getSkillsByCategory } from '@/lib/db/skills';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
}

const WELCOME_LINES: TerminalLine[] = [
  { type: 'system', content: 'AtqanOS Terminal v1.0.0' },
  { type: 'system', content: 'Type "help" for available commands.' },
  { type: 'output', content: '' },
];

export function TerminalApp() {
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_LINES);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLines = (newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  };

  const runCommand = async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    addLines([{ type: 'input', content: `$ ${cmd}` }]);

    if (!trimmed) return;

    setHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);

    switch (trimmed) {
      case 'help':
        addLines([
          { type: 'output', content: '' },
          { type: 'output', content: 'Available commands:' },
          { type: 'output', content: '  help        Show this help message' },
          { type: 'output', content: '  whoami      Display profile information' },
          { type: 'output', content: '  skills      List skills by category' },
          { type: 'output', content: '  projects    List published projects' },
          { type: 'output', content: '  contact     Show contact information' },
          { type: 'output', content: '  clear       Clear terminal' },
          { type: 'output', content: '' },
        ]);
        break;

      case 'whoami':
        try {
          const profile = await getProfile();
          if (profile) {
            addLines([
              { type: 'output', content: '' },
              { type: 'output', content: `Name:     ${profile.name}` },
              { type: 'output', content: `Role:     ${profile.headline}` },
              { type: 'output', content: `Location: ${profile.location || 'Malaysia'}` },
              { type: 'output', content: '' },
              { type: 'output', content: profile.short_bio },
              { type: 'output', content: '' },
            ]);
          } else {
            addLines([{ type: 'output', content: 'Atqan Anwar — Web & Software Developer, Malaysia.' }]);
          }
        } catch {
          addLines([{ type: 'output', content: 'Atqan Anwar — Web & Software Developer, Malaysia.' }]);
        }
        break;

      case 'skills':
        try {
          const grouped = await getSkillsByCategory();
          const outputLines: TerminalLine[] = [{ type: 'output', content: '' }];
          Object.entries(grouped).forEach(([category, skills]) => {
            outputLines.push({ type: 'output', content: `[${category}]` });
            outputLines.push({ type: 'output', content: `  ${skills.map((s) => s.name).join(', ')}` });
            outputLines.push({ type: 'output', content: '' });
          });
          addLines(outputLines);
        } catch {
          addLines([{ type: 'error', content: 'Failed to load skills.' }]);
        }
        break;

      case 'projects':
        try {
          const projects = await getPublishedProjects();
          const outputLines: TerminalLine[] = [{ type: 'output', content: '' }];
          projects.forEach((p) => {
            outputLines.push({
              type: 'output',
              content: `  ${p.title.padEnd(24)} [${p.status}]`,
            });
          });
          outputLines.push({ type: 'output', content: '' });
          addLines(outputLines);
        } catch {
          addLines([{ type: 'error', content: 'Failed to load projects.' }]);
        }
        break;

      case 'contact':
        try {
          const profile = await getProfile();
          addLines([
            { type: 'output', content: '' },
            { type: 'output', content: `Email:    ${profile?.email || 'atqananwar@gmail.com'}` },
            { type: 'output', content: `GitHub:   ${profile?.github_url || 'github.com/atqananwar'}` },
            { type: 'output', content: `LinkedIn: ${profile?.linkedin_url || 'linkedin.com/in/atqananwar'}` },
            { type: 'output', content: `WhatsApp: ${profile?.whatsapp || '+60133228020'}` },
            { type: 'output', content: '' },
          ]);
        } catch {
          addLines([
            { type: 'output', content: '' },
            { type: 'output', content: 'Email: atqananwar@gmail.com' },
            { type: 'output', content: '' },
          ]);
        }
        break;

      case 'clear':
        setLines(WELCOME_LINES);
        return;

      default:
        addLines([
          { type: 'error', content: `Command not found: ${trimmed}. Type "help" for available commands.` },
        ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? '' : history[newIndex]);
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-black/50 font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className={`leading-5 whitespace-pre-wrap break-all ${
            line.type === 'input' ? 'text-green-400' :
            line.type === 'error' ? 'text-red-400' :
            line.type === 'system' ? 'text-blue-400' :
            'text-white/80'
          }`}>
            {line.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
        <span className="text-green-400 select-none">$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          className="flex-1 bg-transparent text-white outline-none caret-green-400 placeholder-white/20"
          placeholder="type a command..."
        />
      </form>
    </div>
  );
}
