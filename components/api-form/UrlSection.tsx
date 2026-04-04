'use client';

import { Loader2 } from 'lucide-react';
import { HttpMethod } from '@/types/api';

interface UrlSectionProps {
  method: HttpMethod;
  url: string;
  loading: boolean;
  showHeaders: boolean;
  headersCount: number;
  onMethodChange: (method: HttpMethod) => void;
  onUrlChange: (url: string) => void;
  onToggleHeaders: () => void;
  onSubmit: () => void;
  onLoadExample: (url: string) => void;
}

const EXAMPLES = [
  { label: 'GitHub User', url: 'https://api.github.com/users/octocat' },
  { label: 'Users List', url: 'https://jsonplaceholder.typicode.com/users' },
  { label: 'Single Post', url: 'https://jsonplaceholder.typicode.com/posts/1' },
];

export default function UrlSection({
  method,
  url,
  loading,
  showHeaders,
  headersCount,
  onMethodChange,
  onUrlChange,
  onToggleHeaders,
  onSubmit,
  onLoadExample,
}: UrlSectionProps) {
  return (
    <div className="space-y-3">
      {/* Method + URL Row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={method}
          onChange={(e) => onMethodChange(e.target.value as HttpMethod)}
          disabled={loading}
          className="w-full sm:w-28 px-3 py-2.5 bg-neutral-900 border border-neutral-700 text-neutral-200 rounded focus:border-neutral-500 focus:outline-none text-sm font-semibold"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          disabled={loading}
          className="w-full sm:flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-700 text-neutral-200 rounded placeholder-neutral-600 focus:border-neutral-500 focus:outline-none text-sm font-mono"
        />

        <button
          onClick={onToggleHeaders}
          className={`w-full sm:w-auto px-4 py-2.5 rounded text-sm font-medium transition-colors ${
            showHeaders || headersCount > 0
              ? 'bg-neutral-700 text-neutral-100 border border-neutral-600'
              : 'bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600'
          }`}
        >
          Headers {headersCount > 0 && `(${headersCount})`}
        </button>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full sm:w-auto px-8 py-2.5 bg-neutral-200 hover:bg-white disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-900 rounded text-sm font-semibold transition-colors flex items-center justify-center"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
        </button>
      </div>

      {/* Examples */}
      <div className="flex flex-wrap items-center gap-2 text-xs pt-2">
        <span className="text-neutral-500 font-medium">Quick Examples:</span>
        {EXAMPLES.map((example) => (
          <button
            key={example.label}
            onClick={() => onLoadExample(example.url)}
            className="px-3 py-1.5 text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 rounded border border-neutral-800 transition-colors"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
}
