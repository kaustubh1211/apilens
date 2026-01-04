'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, X } from 'lucide-react';

interface ApiFormProps {
  onResponse: (response: any) => void;
  onError: (error: string) => void;
}

export default function ApiForm({ onResponse, onError }: ApiFormProps) {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/users');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [loading, setLoading] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([]);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!url.trim()) {
      onError('Please enter a URL');
      return;
    }

    setLoading(true);

    try {
      const startTime = Date.now();
      
      const requestHeaders: Record<string, string> = {};
      headers.forEach(({ key, value }) => {
        if (key.trim() && value.trim()) {
          requestHeaders[key.trim()] = value.trim();
        }
      });
      
      const response = await fetch('/api/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, method, headers: requestHeaders }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const result = await response.json();
      const endTime = Date.now();

      onResponse({ ...result, time: endTime - startTime });
    } catch (error) {
      onError('Failed to fetch API');
    } finally {
      setLoading(false);
    }
  };

  // Auto-run on initial load
  useEffect(() => {
    if (!hasInitialLoad) {
      setHasInitialLoad(true);
      handleSubmit();
    }
  }, []);

  const loadExample = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setMethod('GET');
    setHeaders([]);
    setShowHeaders(false);
  };

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));
  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  return (
    <div className="space-y-3">
      {/* Method + URL Row */}
      <div className="flex gap-2">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as any)}
          disabled={loading}
          className="w-24 px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-200 rounded focus:border-neutral-500 focus:outline-none text-sm font-mono"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter API URL"
          disabled={loading}
          className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-200 rounded placeholder-neutral-600 focus:border-neutral-500 focus:outline-none text-sm font-mono"
        />

        <button
          onClick={() => setShowHeaders(!showHeaders)}
          className="px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-400 rounded hover:text-neutral-200 hover:border-neutral-600 text-sm"
        >
          Headers {headers.length > 0 && `(${headers.length})`}
        </button>

        <button
          onClick={() => handleSubmit()}
          disabled={loading}
          className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 text-neutral-200 rounded text-sm font-medium"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
        </button>
      </div>

      {/* Headers Section */}
      {showHeaders && (
        <div className="bg-neutral-900 border border-neutral-700 rounded p-3 space-y-2">
          {headers.length === 0 && (
            <p className="text-neutral-500 text-xs">No headers added</p>
          )}
          
          {headers.map((header, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Key"
                value={header.key}
                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                className="flex-1 px-2 py-1.5 bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded placeholder-neutral-600 focus:border-neutral-500 focus:outline-none font-mono"
              />
              <input
                type="text"
                placeholder="Value"
                value={header.value}
                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                className="flex-1 px-2 py-1.5 bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded placeholder-neutral-600 focus:border-neutral-500 focus:outline-none font-mono"
              />
              <button
                onClick={() => removeHeader(index)}
                className="p-1.5 text-neutral-500 hover:text-neutral-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          
          <button
            onClick={addHeader}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Header
          </button>
        </div>
      )}

      {/* Examples */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-500">Examples:</span>
        {[
          { label: 'GitHub User', url: 'https://api.github.com/users/octocat' },
          { label: 'Users List', url: 'https://jsonplaceholder.typicode.com/users' },
          { label: 'Single Post', url: 'https://jsonplaceholder.typicode.com/posts/1' },
        ].map((example) => (
          <button
            key={example.label}
            onClick={() => loadExample(example.url)}
            className="px-2 py-1 text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 rounded border border-neutral-800"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
}