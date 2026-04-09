
export class RateLimitError extends Error {
  retryAfter: number;
  constructor(retryAfter: number) {
    super(`Rate limit exceeded. Retry after ${retryAfter}s`);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}


export const fetchApi = async ({
  url,
  method,
  headers,
}: {
  url: string;
  method: string;
  headers: Record<string, string>;
}) => {
  const isLocal =
    url.includes('localhost') ||
    url.includes('127.0.0.1') ||
    url.includes('0.0.0.0') ||
    /^https?:\/\/192\.168\./.test(url);

  // ✅ Local APIs: fetch directly from the browser (client-side)
  if (isLocal) {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    return {
      data,
      status: response.status,
      size: JSON.stringify(data).length,
      rateLimit: { remaining: null, resetAt: null }, // No rate limiting for local
    };
  }

  // ✅ Remote APIs: go through your proxy (rate-limited, SSRF-protected)
  const token = sessionStorage.getItem('apilense_token');
  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const response = await fetch('/api/fetch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify({ url, method, headers }),
  });

  if (response.status === 429) {
    const data = await response.json();
    throw new RateLimitError(data.retryAfter ?? 60);
  }

  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

  const remaining = response.headers.get('X-RateLimit-Remaining');
  const resetAt = response.headers.get('X-RateLimit-Reset');
  const result = await response.json();

  return {
    ...result,
    rateLimit: {
      remaining: remaining ? parseInt(remaining) : null,
      resetAt: resetAt ? parseInt(resetAt) : null,
    },
  };
};