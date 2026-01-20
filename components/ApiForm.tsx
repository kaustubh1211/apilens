'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, X, Code, Link as LinkIcon } from 'lucide-react';

interface ApiFormProps {
  onResponse: (response: any) => void;
  onError: (error: string) => void;
}

type InputMode = 'url' | 'json';

export default function ApiForm({ onResponse, onError }: ApiFormProps) {
  const [mode, setMode] = useState<InputMode>('url');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/users');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [loading, setLoading] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([]);
  const [customJson, setCustomJson] = useState(`{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "profile": {
        "age": 30,
        "city": "New York"
      }
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "profile": {
        "age": 25,
        "city": "Los Angeles"
      }
    }
  ],
  "total": 2
}`);
  const [jsonError, setJsonError] = useState('');
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Handle custom JSON mode
    if (mode === 'json') {
      try {
        const parsed = JSON.parse(customJson);
        const response = {
          data: parsed,
          status: 200,
          size: JSON.stringify(parsed).length,
          time: 0,
        };
        onResponse(response);
        setJsonError('');
      } catch (err) {
        setJsonError('Invalid JSON format');
        onError('Invalid JSON format');
      }
      return;
    }

    // Handle URL mode
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
    setMode('url');
    setUrl(exampleUrl);
    setMethod('GET');
    setHeaders([]);
    setShowHeaders(false);
  };

  const loadJsonExample = () => {
    setMode('json');
    setCustomJson(`{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "profile": {
        "age": 30,
        "city": "New York"
      }
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "profile": {
        "age": 25,
        "city": "Los Angeles"
      }
    }
  ],
  "total": 2
}`);
  };

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));
  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  return (
    <div className="space-y-4">
      {/* Mode Tabs */}
      <div className="flex gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setMode('url')}
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
          onClick={() => setMode('json')}
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

      {/* URL Mode */}
      {mode === 'url' && (
        <div className="space-y-3">
          {/* Method + URL Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              disabled={loading}
              className="w-full sm:w-28 px-3 py-2.5 bg-neutral-900 border border-neutral-700 text-neutral-200 rounded focus:border-neutral-500 focus:outline-none text-sm font-semibold"
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
              placeholder="https://api.example.com/endpoint"
              disabled={loading}
              className="w-full sm:flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-700 text-neutral-200 rounded placeholder-neutral-600 focus:border-neutral-500 focus:outline-none text-sm font-mono"
            />

            <button
              onClick={() => setShowHeaders(!showHeaders)}
              className={`w-full sm:w-auto px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                showHeaders || headers.length > 0
                  ? 'bg-neutral-700 text-neutral-100 border border-neutral-600'
                  : 'bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600'
              }`}
            >
              Headers {headers.length > 0 && `(${headers.length})`}
            </button>

            <button
              onClick={() => handleSubmit()}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-2.5 bg-neutral-200 hover:bg-white disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-900 rounded text-sm font-semibold transition-colors flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
            </button>
          </div>

          {/* Headers Section */}
          {showHeaders && (
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Request Headers</span>
                <button
                  onClick={addHeader}
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
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded placeholder-neutral-600 focus:border-neutral-500 focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Header Value"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded placeholder-neutral-600 focus:border-neutral-500 focus:outline-none font-mono"
                  />
                  <button
                    onClick={() => removeHeader(index)}
                    className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Examples */}
          <div className="flex flex-wrap items-center gap-2 text-xs pt-2">
            <span className="text-neutral-500 font-medium">Quick Examples:</span>
            {[
              { label: 'GitHub User', url: 'https://api.github.com/users/octocat' },
              { label: 'Users List', url: 'https://jsonplaceholder.typicode.com/users' },
              { label: 'Single Post', url: 'https://jsonplaceholder.typicode.com/posts/1' },
            ].map((example) => (
              <button
                key={example.label}
                onClick={() => loadExample(example.url)}
                className="px-3 py-1.5 text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 rounded border border-neutral-800 transition-colors"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* JSON Mode */}
      {mode === 'json' && (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
              Paste your JSON here
            </label>
            <textarea
              value={customJson}
              onChange={(e) => {
                setCustomJson(e.target.value);
                setJsonError('');
              }}
              placeholder='{"key": "value"}'
              className="w-full h-64 px-4 py-3 bg-neutral-900 border border-neutral-700 text-neutral-200 rounded placeholder-neutral-600 focus:border-neutral-500 focus:outline-none text-sm font-mono resize-none"
            />
            {jsonError && (
              <p className="text-xs text-red-400">{jsonError}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={loadJsonExample}
              className="text-xs text-neutral-500 hover:text-neutral-300 underline"
            >
              Load example JSON
            </button>
            
            <button
              onClick={() => handleSubmit()}
              className="px-8 py-2.5 bg-neutral-200 hover:bg-white text-neutral-900 rounded text-sm font-semibold transition-colors"
            >
              Visualize
            </button>
          </div>
        </div>
      )}
    </div>
  );
}