'use client';

import { useState, useEffect } from 'react';
import { userData } from '@/data/JsonExample';
import { ApiResponse, HttpMethod } from '@/types/api';
import { useApiRequest } from '@/hooks/useApiReq';
import { useJsonHandler } from '@/hooks/useJsonHandler';
import ModeTabs from './api-form/ModeTabs';
import UrlSection from './api-form/UrlSection';
import HeadersSection from './api-form/HeadersSection';
import JsonSection from './api-form/JsonSection';
import { useApiWithRateLimit } from '@/hooks/useRateLimit';

interface ApiFormProps {
  onResponse: (response: ApiResponse) => void;
  onError: (error: string) => void;
}

type InputMode = 'url' | 'json';

export default function ApiForm({ onResponse, onError }: ApiFormProps) {
  const [mode, setMode] = useState<InputMode>('url');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/users');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [showHeaders, setShowHeaders] = useState(false);
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([]);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const { sendRequest, loading } = useApiRequest();
  const { json, setJson, parseJson, error } = useJsonHandler(userData);
  const handleSubmit = async () => {
    try {
      if (mode === 'json') {
        const parsed = parseJson();
        if (!parsed) return;

        onResponse({
          data: parsed,
          status: 200,
          size: JSON.stringify(parsed).length,
          time: 0,
        });
        return;
      }

      if (!url) {
        onError('URL is required');
        return;
      }

      const headerObj = Object.fromEntries(
        headers.filter(h => h.key && h.value).map(h => [h.key, h.value])
      );

      const res = await sendRequest(url, method, headerObj);
      onResponse(res);
    } catch (err: any) {
      onError(err.message);
    }
  };

  useEffect(() => {
    if (!hasInitialLoad) {
      handleSubmit();
      setHasInitialLoad(true);
    }
  }, [hasInitialLoad]);

  const loadExample = (exampleUrl: string) => {
    setMode('url');
    setUrl(exampleUrl);
    setMethod('GET');
    setHeaders([]);
    setShowHeaders(false);
  };

  const loadJsonExample = () => {
    setMode('json');
    setJson(JSON.stringify(userData, null, 2));
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
      <ModeTabs mode={mode} onModeChange={setMode} />

      {mode === 'url' && (
        <>
          <UrlSection
            method={method}
            url={url}
            loading={loading}
            showHeaders={showHeaders}
            headersCount={headers.length}
            onMethodChange={setMethod}
            onUrlChange={setUrl}
            onToggleHeaders={() => setShowHeaders(!showHeaders)}
            onSubmit={handleSubmit}
            onLoadExample={loadExample}
          />
          <HeadersSection
            headers={headers}
            showHeaders={showHeaders}
            onToggleHeaders={() => setShowHeaders(!showHeaders)}
            onAddHeader={addHeader}
            onRemoveHeader={removeHeader}
            onUpdateHeader={updateHeader}
          />
        </>
      )}

      {mode === 'json' && (
        <JsonSection
          json={json}
          error={error}
          onJsonChange={setJson}
          onLoadExample={loadJsonExample}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
