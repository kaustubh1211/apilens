'use client';

import { Code, Link as LinkIcon } from 'lucide-react';

interface ModeTabsProps {
  mode: 'url' | 'json';
  onModeChange: (mode: 'url' | 'json') => void;
}

export default function ModeTabs({ mode, onModeChange }: ModeTabsProps) {
  return (
    <div className="flex gap-2 border-b border-neutral-800 pb-3">
      <button
        onClick={() => onModeChange('url')}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t transition-colors ${
          mode === 'url'
            ? 'bg-neutral-800 text-neutral-100 border-b-2 border-neutral-400'
            : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        <LinkIcon className="w-4 h-4" />
        API Request
      </button>
      <button
        onClick={() => onModeChange('json')}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t transition-colors ${
          mode === 'json'
            ? 'bg-neutral-800 text-neutral-100 border-b-2 border-neutral-400'
            : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        <Code className="w-4 h-4" />
        Custom JSON
      </button>
    </div>
  );
}
