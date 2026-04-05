// hooks/useRateLimit.ts
import { fetchApi, RateLimitError } from '@/services/apiClient';
import { useState, useCallback } from 'react';

export function useApiWithRateLimit() {
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    remaining: number | null;
    retryAfter: number | null;
    isLimited: boolean;
  }>({ remaining: null, retryAfter: null, isLimited: false });

  const call = useCallback(async (params: Parameters<typeof fetchApi>[0]) => {
    try {
      const result = await fetchApi(params);
      setRateLimitInfo({
        remaining: result.rateLimit?.remaining ?? null,
        retryAfter: null,
        isLimited: false,
      });
      return result;
    } catch (err) {
      if (err instanceof RateLimitError) {
        setRateLimitInfo({
          remaining: 0,
          retryAfter: err.retryAfter,
          isLimited: true,
        });
      }
      throw err;
    }
  }, []);

  return { call, rateLimitInfo };
}