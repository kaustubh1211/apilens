'use client';

interface JsonSectionProps {
  json: string;
  error: string | null;
  onJsonChange: (json: string) => void;
  onLoadExample: () => void;
  onSubmit: () => void;
}

export default function JsonSection({
  json,
  error,
  onJsonChange,
  onLoadExample,
  onSubmit,
}: JsonSectionProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
          Paste your JSON here
        </label>
        <textarea
          value={json}
          onChange={(e) => onJsonChange(e.target.value)}
          placeholder='{"key": "value"}'
          className="w-full h-64 px-4 py-3 bg-neutral-900 border border-neutral-700 text-neutral-200 rounded placeholder-neutral-600 focus:border-neutral-500 focus:outline-none text-sm font-mono resize-none"
        />
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onLoadExample}
          className="text-xs text-neutral-500 hover:text-neutral-300 underline"
        >
          Load example JSON
        </button>
        
        <button
          onClick={onSubmit}
          className="px-8 py-2.5 bg-neutral-200 hover:bg-white text-neutral-900 rounded text-sm font-semibold transition-colors"
        >
          Visualize
        </button>
      </div>
    </div>
  );
}
