const API_BASE = '/api';

/** GET /api/content — whole site content, with bundled fallback if API is offline. */
export async function fetchContent(fallback) {
  try {
    const res = await fetch(`${API_BASE}/content`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data) throw new Error('Empty content payload');
    return data;
  } catch (err) {
    console.warn('[api] Backend unreachable — using bundled fallback content.', err.message);
    return fallback;
  }
}

/** POST /api/contact — sends the contact form, throws with a readable message on failure. */
export async function sendContact({ name, email, message }) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.errors?.[0] || 'Something went wrong. Please try again.');
  }
  return data;
}
