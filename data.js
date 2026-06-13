// api/data.js — load and save user app state from/to MongoDB
const jwt = require('jsonwebtoken');
const { connectDB } = require('./_db');

const JWT_SECRET = process.env.JWT_SECRET || 'din_secret_change_this_in_env';

function getUsername(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    return decoded.username;
  } catch {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const username = getUsername(req);
  if (!username) return res.status(401).json({ error: 'Unauthorized.' });

  try {
    const db = await connectDB();

    // ── LOAD STATE ───────────────────────────────────
    if (req.method === 'GET') {
      const doc = await db.collection('userdata').findOne({ username });
      if (!doc) return res.status(404).json({ error: 'No data found.' });
      return res.status(200).json({ state: doc.state, updatedAt: doc.updatedAt });
    }

    // ── SAVE STATE ───────────────────────────────────
    if (req.method === 'POST') {
      const { state } = req.body;
      if (!state) return res.status(400).json({ error: 'No state provided.' });

      await db.collection('userdata').updateOne(
        { username },
        { $set: { state, updatedAt: new Date() } },
        { upsert: true }
      );
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed.' });

  } catch (err) {
    console.error('Data error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};
