import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

// Minimal CORS so the API is reachable from other dev origins too.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ------------------------------ data ------------------------------ */

const contentPath = path.join(__dirname, 'data', 'content.json');
const messagesPath = path.join(__dirname, 'data', 'messages.json');

const readJSON = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
};

const content = readJSON(contentPath, null);
if (!content) {
  console.error(`[server] Could not read ${contentPath}`);
  process.exit(1);
}

/* ------------------------------- api ------------------------------ */

app.get('/api/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

app.get('/api/content', (req, res) => res.json(content));

app.get('/api/profile', (req, res) => res.json(content.profile));

app.get('/api/projects', (req, res) => res.json(content.projects));

app.get('/api/experience', (req, res) => res.json(content.experience));

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body ?? {};
  const errors = [];

  if (!name || String(name).trim().length < 2) errors.push('Please tell me your name.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) errors.push('A valid email is required.');
  if (!message || String(message).trim().length < 10) errors.push('Message should be at least 10 characters.');
  if (errors.length) return res.status(400).json({ ok: false, errors });

  const entry = {
    id: `msg_${Date.now().toString(36)}`,
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    receivedAt: new Date().toISOString(),
  };

  const messages = readJSON(messagesPath, []);
  messages.push(entry);

  try {
    fs.mkdirSync(path.dirname(messagesPath), { recursive: true });
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
  } catch (err) {
    console.error('[server] Failed to persist message:', err.message);
    return res.status(500).json({ ok: false, errors: ['Could not save your message. Please try again shortly.'] });
  }

  console.log(`[server] New contact message from ${entry.email}`);
  res.status(201).json({
    ok: true,
    id: entry.id,
    message: "Thanks — your message landed. I'll get back to you within 24 hours.",
  });
});

app.use('/api', (req, res) => res.status(404).json({ ok: false, errors: ['Unknown API route.'] }));

/* -------------------- static client (production) ------------------ */
/* After `npm run build`, the Express server can serve the built app.  */

const distDir = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`[server] Vortex personal API running at http://localhost:${PORT}`);
});
