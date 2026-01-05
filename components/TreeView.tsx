'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface TreeViewProps {
  data: unknown;
  searchQuery?: string;
}

export default function TreeView({ data, searchQuery = '' }: TreeViewProps) {
  return (
    <div className="font-mono text-sm">
      <TreeNode data={data} path="root" searchQuery={searchQuery} />
    </div>
  );
}

interface TreeNodeProps {
  data: unknown;
  path: string;
  isLast?: boolean;
  searchQuery?: string;
}


function TreeNode({ data, path, isLast = true, searchQuery = '' }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = (value: unknown) => {
    const textValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    navigator.clipboard.writeText(textValue);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getType = (value: unknown): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 text-gray-900">{part}</mark>
      ) : (
        part
      )
    );
  };

  const type = getType(data);
  const isExpandable = type === 'object' || type === 'array';

  if (!isExpandable) {
    const valueStr = formatValue(data, type);
    const matches = searchQuery && (
      valueStr.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className={`flex items-center gap-2 py-1 group ${matches ? 'bg-yellow-50' : ''}`}>
        <span className="text-gray-400">•</span>
        <span className={getValueColor(type)}>
          {highlightText(valueStr, searchQuery)}
        </span>
        <button
          onClick={() => handleCopy(data)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3 text-gray-500" />
          )}
        </button>
      </div>
    );
  }

 const entries: [string | number, unknown][] =
  type === 'array' && Array.isArray(data)
    ? data.map((item, index) => [index, item])
    : typeof data === 'object' && data !== null
      ? Object.entries(data as Record<string, unknown>)
      : [];

  const isEmpty = entries.length === 0;

  return (
    <div className="py-0.5">
      <div className="flex items-center gap-2 group">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 hover:bg-gray-100 rounded px-1 py-0.5 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <span className="text-blue-600 font-medium">
            {type === 'array' ? `Array[${entries.length}]` : `Object`}
          </span>
        </button>
        
        <button
          onClick={() => handleCopy(data)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3 text-gray-500" />
          )}
        </button>

        {!isExpanded && !isEmpty && (
          <span className="text-gray-400 text-xs">
            {entries.length} {entries.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {isExpanded && (
        <div className="ml-4 border-l-2 border-gray-200 pl-4">
          {isEmpty ? (
            <div className="text-gray-400 py-1">Empty {type}</div>
          ) : (
            entries.map(([key, value], index) => {
              const keyStr = String(key);
              const keyMatches = searchQuery && keyStr.toLowerCase().includes(searchQuery.toLowerCase());

              return (
                <div key={key} className="relative">
                  <div className={`flex items-start gap-2 py-0.5 ${keyMatches ? 'bg-yellow-50' : ''}`}>
                    <span className="text-purple-600 font-medium min-w-fit">
                      {type === 'array' ? `[${key}]` : (
                        <>
                          {highlightText(keyStr, searchQuery)}:
                        </>
                      )}
                    </span>
                    <div className="flex-1">
                      <TreeNode 
                        data={value} 
                        path={`${path}.${key}`}
                        isLast={index === entries.length - 1}
                        searchQuery={searchQuery}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function formatValue(value: any, type: string): string {
  if (type === 'null') return 'null';
  if (type === 'string') return `"${value}"`;
  if (type === 'boolean') return value.toString();
  if (type === 'number') return value.toString();
  return String(value);
}

function getValueColor(type: string): string {
  switch (type) {
    case 'string': return 'text-gray-300';
    case 'number': return 'text-gray-300';
    case 'boolean': return 'text-gray-300';
    case 'null': return 'text-gray-600';
    default: return 'text-gray-300';
  }
}