import { fetchApi } from '@/services/apiClient';
import { ApiResponse } from '@/types/api';
import { useState } from 'react';

export const useApiRequest = () => {
  const [loading, setLoading] = useState(false);

  const sendRequest = async (
    url: string,
    method: string,
    headers: Record<string, string>
  ): Promise<ApiResponse> => {
    setLoading(true);
    const start = Date.now();

    try {
      const result = await fetchApi({ url, method, headers });
      return {
        data: result.data,
        status: result.status || 200,
        size: result.size || JSON.stringify(result.data).length,
        time: Date.now() - start,
      };
    } finally {
      setLoading(false);
    }
  };

  return { sendRequest, loading };
};