import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // DEBUG — remove before shipping
  const rawText = await request.text();
  console.log('[waitlist] content-type:', request.headers.get('content-type'));
  console.log('[waitlist] raw body:', rawText);

  let body: unknown;
  try {
    body = JSON.parse(rawText);
  } catch (err) {
    console.log('[waitlist] JSON parse error:', err);
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('[waitlist] parsed body:', body);

  const email = (typeof body === 'object' && body !== null && 'email' in body
    ? String((body as Record<string, unknown>).email)
    : ''
  ).trim().toLowerCase();

  console.log('[waitlist] extracted email:', JSON.stringify(email));

  if (!email || !email.includes('@') || !email.split('@')[1]?.includes('.')) {
    console.log('[waitlist] email validation failed');
    return new Response(JSON.stringify({ error: 'Invalid email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.BREVO_API_KEY ?? '';
  const listIdStr = import.meta.env.BREVO_LIST_ID ?? '';

  const jsonHeaders = { 'Content-Type': 'application/json' };

  if (!apiKey || !listIdStr) {
    console.log('[waitlist] missing BREVO env vars');
    return new Response(JSON.stringify({ error: 'Service not configured' }), { status: 503, headers: jsonHeaders });
  }

  const listId = parseInt(listIdStr, 10);
  if (isNaN(listId)) {
    return new Response(JSON.stringify({ error: 'Service not configured' }), { status: 503, headers: jsonHeaders });
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

    console.log('[waitlist] brevo status:', res.status);

    if (res.ok || res.status === 204) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: jsonHeaders });
    }
    const brevoBody = await res.text();
    console.log('[waitlist] brevo error body:', brevoBody);
    return new Response(JSON.stringify({ error: 'Failed to add contact' }), { status: 502, headers: jsonHeaders });
  } catch (err) {
    console.log('[waitlist] fetch error:', err);
    return new Response(JSON.stringify({ error: 'Service error' }), { status: 502, headers: jsonHeaders });
  }
};
