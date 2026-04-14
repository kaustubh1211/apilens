'use client';

import { useState } from 'react';
// import { FlowMapping } from '../types/flow';
// import { resolvePath } from '../hooks/useFlowExecutor';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { FlowMapping } from './Flow';
import { resolvePath } from './UserFlowExecutor';

interface MappingEditorProps {
  fromNodeLabel: string;
  toNodeLabel: string;
  sourceData: any;           // resolved response data from source node
  mappings: FlowMapping[];
  onChange: (mappings: FlowMapping[]) => void;
}

function getLeafPaths(obj: any, prefix = '', maxDepth = 3): string[] {
  if (maxDepth === 0 || obj == null || typeof obj !== 'object') return [prefix].filter(Boolean);
  const paths: string[] = [];
  if (Array.isArray(obj)) {
    if (obj.length > 0) {
      paths.push(...getLeafPaths(obj[0], `${prefix}[0]`, maxDepth - 1));
    }
  } else {
    for (const key of Object.keys(obj).slice(0, 20)) {
      const val = obj[key];
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof val === 'object' && val !== null) {
        paths.push(...getLeafPaths(val, path, maxDepth - 1));
      } else {
        paths.push(path);
      }
    }
  }
  return paths;
}

export default function MappingEditor({
  fromNodeLabel,
  toNodeLabel,
  sourceData,
  mappings,
  onChange,
}: MappingEditorProps) {
  const [newFromPath, setNewFromPath] = useState('');
  const [newToParam, setNewToParam] = useState('');
  const [newTarget, setNewTarget] = useState<'url' | 'body' | 'header'>('url');

  const leafPaths = sourceData ? getLeafPaths(sourceData) : [];

  const addMapping = () => {
    if (!newFromPath || !newToParam) return;
    const mapping: FlowMapping = {
      id: crypto.randomUUID(),
      fromPath: newFromPath,
      toParam: newToParam,
      toTarget: newTarget,
    };
    onChange([...mappings, mapping]);
    setNewFromPath('');
    setNewToParam('');
  };

  const removeMapping = (id: string) => {
    onChange(mappings.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Existing mappings */}
      {mappings.length > 0 && (
        <div className="space-y-2">
          {mappings.map(m => {
            const previewVal = sourceData ? resolvePath(sourceData, m.fromPath) : undefined;
            return (
              <div
                key={m.id}
                className="flex items-center gap-2 bg-neutral-900 rounded-lg px-3 py-2 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-amber-400 text-xs">{m.fromPath}</span>
                  {previewVal !== undefined && (
                    <span className="text-neutral-500 text-xs ml-2">
                      = {JSON.stringify(previewVal).slice(0, 30)}
                    </span>
                  )}
                </div>
                <ArrowRight className="w-3 h-3 text-neutral-500 flex-shrink-0" />
                <div className="flex-shrink-0">
                  <span className="font-mono text-blue-400 text-xs">{`{${m.toParam}}`}</span>
                  <span className="text-neutral-600 text-xs ml-1">in {m.toTarget}</span>
                </div>
                <button
                  onClick={() => removeMapping(m.id)}
                  className="text-neutral-600 hover:text-red-400 transition-colors ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add new mapping */}
      <div className="border border-neutral-800 rounded-lg p-3 space-y-3">
        <p className="text-xs text-neutral-500 font-medium">Add mapping</p>

        {/* From path */}
        <div>
          <label className="text-xs text-neutral-500 mb-1 block">
            Field from <span className="text-white">{fromNodeLabel}</span>
          </label>
          {leafPaths.length > 0 ? (
            <select
              value={newFromPath}
              onChange={e => setNewFromPath(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-xs font-mono text-neutral-300 focus:outline-none focus:border-neutral-600"
            >
              <option value="">Select a field…</option>
              {leafPaths.map(p => (
                <option key={p} value={p}>
                  {p}
                  {sourceData && ` = ${JSON.stringify(resolvePath(sourceData, p)).slice(0, 25)}`}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={newFromPath}
              onChange={e => setNewFromPath(e.target.value)}
              placeholder="e.g. [0].id or data.userId"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-xs font-mono text-neutral-300 focus:outline-none focus:border-neutral-600"
            />
          )}
        </div>

        {/* To param */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">
              Param name in <span className="text-white">{toNodeLabel}</span>
            </label>
            <input
              value={newToParam}
              onChange={e => setNewToParam(e.target.value)}
              placeholder="e.g. id"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-xs font-mono text-neutral-300 focus:outline-none focus:border-neutral-600"
            />
            <p className="text-xs text-neutral-600 mt-1">Used as {'{id}'} in URL/body</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Target</label>
            <select
              value={newTarget}
              onChange={e => setNewTarget(e.target.value as any)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-neutral-600"
            >
              <option value="url">URL param</option>
              <option value="body">Request body</option>
              <option value="header">Header</option>
            </select>
          </div>
        </div>

        <button
          onClick={addMapping}
          disabled={!newFromPath || !newToParam}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-md text-neutral-300 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add mapping
        </button>
      </div>
    </div>
  );
}