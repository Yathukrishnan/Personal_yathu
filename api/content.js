const fs = require('fs');
const path = require('path');

/**
 * Serverless endpoint: GET /api/content
 * Serves the same content.json the Express dev server uses.
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const file = path.join(__dirname, '..', 'server', 'data', 'content.json');
    const content = JSON.parse(fs.readFileSync(file, 'utf8'));
    return res.status(200).json(content);
  } catch (err) {
    return res.status(500).json({ ok: false, errors: ['Could not load site content.'] });
  }
};