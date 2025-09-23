const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Allow overriding the SQLite DB path with an environment variable so hosted
// environments (like Render) can mount a persistent disk in a custom location.
const dbPath = process.env.SQLITE_DB_PATH || path.resolve(__dirname, '../data/sqlite.db');
console.log(`Using SQLite DB at ${dbPath}`);
const db = new Database(dbPath, { verbose: console.log });

function parseRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    ingredients: row.ingredients ? JSON.parse(row.ingredients) : [],
    steps: row.steps ? JSON.parse(row.steps) : [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt || null
  };
}

app.get('/api/recipes', (req, res) => {
  const includeDeleted = String(req.query.includeDeleted || '').toLowerCase() === 'true';
  const rows = includeDeleted
    ? db.prepare('SELECT * FROM recipes ORDER BY title ASC').all()
    : db.prepare('SELECT * FROM recipes WHERE deletedAt IS NULL ORDER BY title ASC').all();
  res.json(rows.map(parseRow));
});

app.get('/api/recipes/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id);
  const parsed = parseRow(row);
  if (!parsed) return res.status(404).json({ message: 'Not found' });
  res.json(parsed);
});

app.post('/api/recipes', (req, res) => {
  const now = new Date().toISOString();
  const id = req.body.id || randomUUID();
  const payload = {
    id,
    title: req.body.title || '',
    description: req.body.description || '',
    ingredients: JSON.stringify(req.body.ingredients || []),
    steps: JSON.stringify(req.body.steps || []),
    createdAt: now,
    updatedAt: now
  };
  db.prepare('INSERT INTO recipes (id, title, description, ingredients, steps, createdAt, updatedAt) VALUES (@id, @title, @description, @ingredients, @steps, @createdAt, @updatedAt)').run(payload);
  res.status(201).json(payload);
});

app.put('/api/recipes/:id', (req, res) => {
  const now = new Date().toISOString();
  const id = req.params.id;
  const existing = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Not found' });
  const updates = {
    id,
    title: req.body.title ?? existing.title,
    description: req.body.description ?? existing.description,
    ingredients: JSON.stringify(req.body.ingredients ?? JSON.parse(existing.ingredients || '[]')),
    steps: JSON.stringify(req.body.steps ?? JSON.parse(existing.steps || '[]')),
    createdAt: existing.createdAt,
    updatedAt: now
  };
  db.prepare('UPDATE recipes SET title = @title, description = @description, ingredients = @ingredients, steps = @steps, updatedAt = @updatedAt WHERE id = @id').run(updates);
  res.json(updates);
});

app.delete('/api/recipes/:id', (req, res) => {
  const id = req.params.id;
  const now = new Date().toISOString();
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  db.prepare('UPDATE recipes SET deletedAt = ?, updatedAt = ? WHERE id = ?').run(now, now, id);
  const updated = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
  res.json(parseRow(updated));
});

app.post('/api/recipes/:id/restore', (req, res) => {
  const id = req.params.id;
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  if (!row.deletedAt) return res.status(400).json({ message: 'Not deleted' });
  const now = new Date().toISOString();
  db.prepare('UPDATE recipes SET deletedAt = NULL, updatedAt = ? WHERE id = ?').run(now, id);
  const updated = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
  res.json(parseRow(updated));
});

// Simple auth routes (no real hashing for demo — easy to replace with bcrypt/jwt)
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  try {
    const id = randomUUID();
    const now = new Date().toISOString();
    db.prepare('INSERT INTO users (id, username, password, createdAt) VALUES (?, ?, ?, ?)').run(id, username, password, now);
    res.status(201).json({ id, username, createdAt: now });
  } catch (err) {
    res.status(400).json({ message: 'username already exists' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  const user = db.prepare('SELECT id, username, password, createdAt FROM users WHERE username = ?').get(username);
  if (!user || user.password !== password) return res.status(401).json({ message: 'invalid credentials' });
  res.json({ token: user.id, user: { id: user.id, username: user.username, createdAt: user.createdAt } });
});

app.get('/api/profile', (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '') || req.query.token;
  if (!token) return res.status(401).json({ message: 'missing token' });
  const user = db.prepare('SELECT id, username, createdAt FROM users WHERE id = ?').get(token);
  if (!user) return res.status(404).json({ message: 'user not found' });
  res.json({ id: user.id, username: user.username, createdAt: user.createdAt });
});

module.exports = { app, db };
