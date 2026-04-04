'use client';

import { Plus, X } from 'lucide-react';

interface Header {
  key: string;
  value: string;
}

interface HeadersSectionProps {
  headers: Header[];
  showHeaders: boolean;
  onToggleHeaders: () => void;
  onAddHeader: () => void;
  onRemoveHeader: (index: number) => void;
  onUpdateHeader: (index: number, field: 'key' | 'value', value: string) => void;
}

export default function HeadersSection({
  headers,
  showHeaders,
  onToggleHeaders,
  onAddHeader,
  onRemoveHeader,
  onUpdateHeader,
}: HeadersSectionProps) {
  if (!showHeaders) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Request Headers</span>
        <button
          onClick={onAddHeader}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>
      
      {headers.length === 0 && (
        <p className="text-neutral-600 text-xs py-2">No headers added</p>
      )}
      
      {headers.map((header, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            placeholder="Header Key"
            value={header.key}
            onChange={(e) => onUpdateHeader(index, 'key', e.target.value)}
            className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded placeholder-neutral-600 focus:border-neutral-500 focus:outline-none font-mono"
          />
          <input
            type="text"
            placeholder="Header Value"
            value={header.value}
            onChange={(e) => onUpdateHeader(index, 'value', e.target.value)}
            className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded placeholder-neutral-600 focus:border-neutral-500 focus:outline-none font-mono"
          />
          <button
            onClick={() => onRemoveHeader(index)}
            className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
