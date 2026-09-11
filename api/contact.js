const fs = require('fs');
const path = require('path');

const json = (res, status, body) => {
  res.status(status).json(body);
};

/**
 * Serverless endpoint: POST /api/contact
 * Mirrors the Express dev server's validation + persistence.
 * NOTE: on Vercel the filesystem is read-only except /tmp, so messages
 * persist only for the function instance lifetime there — run the Express
 * server (or plug in a database/email service) for durable storage.
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return json(res, 405, { ok: false, errors: ['Use POST.'] });

  // Collect and parse the JSON body
  let body = {};
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    return json(res, 400, { ok: false, errors: ['Invalid JSON body.'] });
  }

  const { name, email, message } = body ?? {};
  const errors = [];

  if (!name || String(name).trim().length < 2) errors.push('Please tell me your name.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) errors.push('A valid email is required.');
  if (!message || String(message).trim().length < 10) errors.push('Message should be at least 10 characters.');
  if (errors.length) return json(res, 400, { ok: false, errors });

  const entry = {
    id: `msg_${Date.now().toString(36)}`,
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    receivedAt: new Date().toISOString(),
  };

  // Try the durable location first (works locally / on a Node host),
  // then /tmp (Vercel) so the form still succeeds there.
  const targets = [
    path.join(__dirname, '..', 'server', 'data', 'messages.json'),
    path.join('/tmp', 'messages.json'),
  ];
  let saved = false;
  for (const file of targets) {
    try {
      let messages = [];
      try {
        messages = JSON.parse(fs.readFileSync(file, 'utf8'));
      } catch {
        messages = [];
      }
      messages.push(entry);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(messages, null, 2));
      saved = true;
      break;
    } catch {
      /* try next location */
    }
  }
  if (!saved) console.error('[api/contact] Could not persist message:', entry.email);

  return json(res, 201, {
    ok: true,
    id: entry.id,
    message: "Thanks — your message landed. I'll get back to you within 24 hours.",
  });
};