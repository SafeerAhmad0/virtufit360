import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Clone the incoming form-data
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Invalid content-type' }, { status: 400 });
  }

  // Pass the raw body to the remote API
  const body = req.body;
  const url = 'http://catvton-api.fly.dev/tryon'; // HTTP, not HTTPS!

  const apiRes = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': contentType,
    },
    body,
  });

  // Pass through the result
  const arrayBuffer = await apiRes.arrayBuffer();
  const headers = new Headers();
  apiRes.headers.forEach((value, key) => {
    headers.set(key, value);
  });
  return new Response(arrayBuffer, {
    status: apiRes.status,
    statusText: apiRes.statusText,
    headers,
  });
}
