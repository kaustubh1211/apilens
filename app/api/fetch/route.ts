import { NextResponse } from 'next/server';

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS = {
  authenticated: { max: 60, windowMs: 60 * 1000 },  // 60 req/min
  anonymous:     { max: 10, windowMs: 60 * 1000 },  // 10 req/min
};

function getRateLimitKey(request: Request, isAuthenticated: boolean): string {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ??
    request.headers.get('x-real-ip') ??
    'unknown';
  return `${isAuthenticated ? 'auth' : 'anon'}:${ip}`;
}

function checkRateLimit(
  key: string,
  isAuthenticated: boolean
): { allowed: boolean; remaining: number; resetAt: number } {
  const limit = isAuthenticated ? RATE_LIMITS.authenticated : RATE_LIMITS.anonymous;
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    // Fresh window
    rateLimitStore.set(key, { count: 1, resetAt: now + limit.windowMs });
    return { allowed: true, remaining: limit.max - 1, resetAt: now + limit.windowMs };
  }

  if (record.count >= limit.max) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: limit.max - record.count, resetAt: record.resetAt };
}

export async function POST(request: Request) {
  try {
    // Read token from Authorization header (set by frontend)
    const authHeader = request.headers.get('authorization');
    const isAuthenticated = !!authHeader?.startsWith('Bearer ');

    const key = getRateLimitKey(request, isAuthenticated);
    const { allowed, remaining, resetAt } = checkRateLimit(key, isAuthenticated);

    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          retryAfter,
          message: `Too many requests. Try again in ${retryAfter}s`,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(resetAt),
            'Retry-After': String(retryAfter),
          },
        }
      );
    }

    const { url, method = 'GET', headers = {} } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '192.168'];
    if (blocked.some(host => url.includes(host))) {
      return NextResponse.json(
        { error: 'Cannot fetch from local/internal URLs' },
        { status: 403 }
      );
    }

    const fetchOptions: RequestInit = {
      method,
      headers: { 'User-Agent': 'ApiLens/1.0', ...headers },
    };

    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    const size = JSON.stringify(data).length;

    return NextResponse.json(
      { data, status: response.status, size },
      {
        headers: {
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(resetAt),
        },
      }
    );
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}