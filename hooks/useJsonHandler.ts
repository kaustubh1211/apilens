import { useState } from 'react';

export const useJsonHandler = (initial: object) => {
  const [json, setJson] = useState(JSON.stringify(initial, null, 2));
  const [error, setError] = useState('');

  const parseJson = () => {
    try {
      const parsed = JSON.parse(json);
      setError('');
      return parsed;
    } catch {
      setError('Invalid JSON format');
      return null;
    }
  };

  return { json, setJson, parseJson, error };
};