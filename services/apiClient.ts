
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
  // Attach Firebase token from sessionStorage
  const token = sessionStorage.getItem('apilense_token');
  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const response = await fetch('/api/fetch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify({ url, method, headers }),
  });

  // Handle rate limit response
  if (response.status === 429) {
    const data = await response.json();
    throw new RateLimitError(data.retryAfter ?? 60);
  }

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  // Optionally expose rate limit headers to caller
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