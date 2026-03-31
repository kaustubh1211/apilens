export const fetchApi = async ({
  url,
  method,
  headers,
}: {
  url: string;
  method: string;
  headers: Record<string, string>;
}) => {
  const response = await fetch('/api/fetch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, method, headers }),
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.json();
};