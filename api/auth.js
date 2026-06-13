const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB } = require('./_db');
const JWT_SECRET = process.env.JWT_SECRET || 'din_secret_change_this_in_env';
const DEFAULT_STATE = {
  habits: [
    { id: 1, name: 'Morning workout', emoji: '💪', log: {} },
    { id: 2, name: 'Read 30 min', emoji: '📚', log: {} },
    { id: 3, name: 'Meditate', emoji: '🧘', log: {} },
    { id: 4, name: 'Cold shower', emoji: '🧊', log: {} },
    { id: 5, name: 'No junk food', emoji: '🥗', log: {} },
    { id: 6, name: 'Sleep by 11 PM', emoji: '😴', log: {} },
  ],
  challenges: [
    { id: 1, name: 'No Fap', emoji: '🔒', totalDays: 90, curr: 0, start: null, failed: false, done: false, log: {} },
    { id: 2, name: 'Cold Showers', emoji: '🧊', totalDays: 30, curr: 0, start: null, failed: false, done: false, log: {} },
    { id: 3, name: 'No Social Media', emoji: '📵', totalDays: 21, curr: 0, start: null, failed: false, done: false, log: {} },
  ],
  learnedWords: [], writingLog: [], engLevel: 'B1', wordIdx: 0, grammarIdx: 0,
  engMode: 'word', engCat: 'all',
  subjects: [
    { id: 1, name: 'English', color: '#5b9cf6', entries: [] },
    { id: 2, name: 'Programming', color: '#c9a84c', entries: [] },
    { id: 3, name: 'Fitness', color: '#3ecf8e', entries: [] },
  ],
  journalEntries: [], sidebarCollapsed: false,
};
module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const db = await connectDB();
    const { action } = req.query;
    if (action === 'signup' && req.method === 'POST') {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
      if (!/^[a-z0-9_.\-]{3,24}$/.test(username.toLowerCase())) return res.status(400).json({ error: 'Username: 3-24 chars, letters/numbers/_ only.' });
      if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      const existing = await db.collection('users').findOne({ username: username.toLowerCase() });
      if (existing) return res.status(409).json({ error: 'Username already taken.' });
      const hash = await bcrypt.hash(password, 12);
      await db.collection('users').insertOne({ username: username.toLowerCase(), passwordHash: hash, createdAt: new Date() });
      await db.collection('userdata').insertOne({ username: username.toLowerCase(), state: DEFAULT_STATE, updatedAt: new Date() });
      const token = jwt.sign({ username: username.toLowerCase() }, JWT_SECRET, { expiresIn: '30d' });
      return res.status(201).json({ token, username: username.toLowerCase() });
    }
    if (action === 'login' && req.method === 'POST') {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
      const user = await db.collection('users').findOne({ username: username.toLowerCase() });
      if (!user) return res.status(401).json({ error: 'Account not found. Please sign up first.' });
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: 'Wrong password. Try again.' });
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '30d' });
      return res.status(200).json({ token, username: user.username });
    }
    if (action === 'verify' && req.method === 'GET') {
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token.' });
      try {
        const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
        return res.status(200).json({ username: decoded.username });
      } catch { return res.status(401).json({ error: 'Invalid or expired token.' }); }
    }
    return res.status(404).json({ error: 'Unknown action.' });
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
};
