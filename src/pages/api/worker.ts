import type { APIRoute } from 'astro';

const TURNSTILE_VERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const workerUrl = import.meta.env.CLOUDFLARE_WORKER_URL;
const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
const workerAuthToken = import.meta.env.WORKER_AUTH_TOKEN;

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'content-length',
  'host',
  'cf-turnstile-token',
]);

const sanitizeHeaders = (headers: Headers) => {
  const clean = new Headers();
  headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(lower)) {
      return;
    }
    clean.set(key, value);
  });
  return clean;
};

const getClientIp = (request: Request) => {
  const candidates = [
    request.headers.get('cf-connecting-ip'),
    request.headers.get('x-forwarded-for'),
    request.headers.get('x-real-ip'),
  ];

  for (const value of candidates) {
    if (!value) continue;
    const [first] = value.split(',');
    if (first && first.trim().length > 0) {
      return first.trim();
    }
  }

  return undefined;
};

export const post: APIRoute = async ({ request }) => {
  if (!workerUrl) {
    return new Response(JSON.stringify({ error: 'CLOUDFLARE_WORKER_URL is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!turnstileSecret) {
    return new Response(JSON.stringify({ error: 'TURNSTILE_SECRET_KEY is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!workerAuthToken) {
    return new Response(JSON.stringify({ error: 'WORKER_AUTH_TOKEN is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const contentType = request.headers.get('content-type') ?? '';
  const bodyText = await request.text();

  let token = request.headers.get('cf-turnstile-token')?.trim();
  let parsedBody: Record<string, unknown> | undefined;
  let tokenFoundInBody = false;

  if ((!token || token.length === 0) && bodyText && contentType.includes('application/json')) {
    try {
      parsedBody = JSON.parse(bodyText);
      const candidate =
        parsedBody?.['cf-turnstile-token'] ?? parsedBody?.['turnstileToken'] ?? parsedBody?.['token'];
      if (typeof candidate === 'string' && candidate.length > 0) {
        token = candidate.trim();
        tokenFoundInBody = true;
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing Turnstile token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const verifyParams = new URLSearchParams();
  verifyParams.append('secret', turnstileSecret);
  verifyParams.append('response', token);

  const clientIp = getClientIp(request);
  if (clientIp) {
    verifyParams.append('remoteip', clientIp);
  }

  try {
    const verifyResponse = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
      method: 'POST',
      body: verifyParams,
    });

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Turnstile verification failed', details: verifyData }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (!verifyData?.success) {
      return new Response(
        JSON.stringify({ error: 'Turnstile validation rejected', details: verifyData?.['error-codes'] ?? verifyData }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Unable to contact Turnstile', message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let bodyForWorker = bodyText.length > 0 ? bodyText : undefined;
  if (tokenFoundInBody && parsedBody) {
    delete parsedBody['cf-turnstile-token'];
    delete parsedBody['turnstileToken'];
    delete parsedBody['token'];
    bodyForWorker = JSON.stringify(parsedBody);
  }

  const forwardHeaders = sanitizeHeaders(request.headers);
  forwardHeaders.set('Authorization', `Bearer ${workerAuthToken}`);

  try {
    const workerResponse = await fetch(workerUrl, {
      method: 'POST',
      headers: forwardHeaders,
      body: bodyForWorker,
      redirect: 'manual',
    });

    const responseHeaders = sanitizeHeaders(workerResponse.headers);

    return new Response(workerResponse.body, {
      status: workerResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Failed to reach Cloudflare Worker', message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const all: APIRoute = async (ctx) => {
  if (ctx.request.method.toUpperCase() !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { Allow: 'POST', 'Content-Type': 'application/json' },
    });
  }

  return post(ctx);
};
