import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const email = (
    typeof body === 'object' && body !== null && 'email' in body
      ? String((body as Record<string, unknown>).email)
      : ''
  )
    .trim()
    .toLowerCase();

  if (!email || !email.includes('@') || !email.split('@')[1]?.includes('.')) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.BREVO_API_KEY ?? '';
  const listIdStr = import.meta.env.BREVO_LIST_ID ?? '';
  const jsonHeaders = { 'Content-Type': 'application/json' };

  if (!apiKey || !listIdStr) {
    return new Response(JSON.stringify({ error: 'Service not configured' }), {
      status: 503,
      headers: jsonHeaders,
    });
  }

  const listId = parseInt(listIdStr, 10);
  if (isNaN(listId)) {
    return new Response(JSON.stringify({ error: 'Service not configured' }), {
      status: 503,
      headers: jsonHeaders,
    });
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
    });

    if (res.ok || res.status === 204) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: jsonHeaders,
      });
    }
    return new Response(JSON.stringify({ error: 'Failed to add contact' }), {
      status: 502,
      headers: jsonHeaders,
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Service error' }), {
      status: 502,
      headers: jsonHeaders,
    });
  }
};
