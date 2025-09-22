const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'sqlite.db');

const db = new Database(dbPath);

// Create recipes table if not exists
db.exec(`
CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  steps TEXT,
  createdAt TEXT,
  updatedAt TEXT,
  deletedAt TEXT
);
`);

// Create users table for simple auth
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  createdAt TEXT
);
`);

// Seed initial data if table empty
const row = db.prepare('SELECT COUNT(1) as cnt FROM recipes').get();
if (row.cnt === 0) {
  const now = new Date().toISOString();
  const recipes = [
    {
      id: 'r1',
      title: 'Pasta Aglio e Olio',
      description: 'Simple garlic and oil pasta.',
      ingredients: JSON.stringify(['200g spaghetti', '2 cloves garlic', '50ml olive oil', 'Salt', 'Parsley']),
      steps: JSON.stringify(['Boil pasta', 'Saute garlic', 'Toss together']),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    },
    {
      id: 'r2',
      title: 'Tomato Bruschetta',
      description: 'Toasted bread with fresh tomatoes and basil.',
      ingredients: JSON.stringify(['Bread slices', 'Tomatoes', 'Basil', 'Olive oil', 'Salt']),
      steps: JSON.stringify(['Toast bread', 'Top with tomato mix', 'Serve']),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    },
    {
      id: 'r3',
      title: 'Chocolate Mousse',
      description: 'Light and airy chocolate dessert.',
      ingredients: JSON.stringify(['Chocolate', 'Eggs', 'Sugar', 'Cream']),
      steps: JSON.stringify(['Melt chocolate', 'Fold in whipped cream', 'Chill']),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    },
    // soft-deleted sample for testing restore
    {
      id: 'r4',
      title: 'Deleted Sample',
      description: 'This recipe is soft-deleted and should not show up in list.',
      ingredients: JSON.stringify(['x']),
      steps: JSON.stringify(['y']),
      createdAt: now,
      updatedAt: now,
      deletedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    }
  ];

  const stmt = db.prepare(`INSERT INTO recipes (id, title, description, ingredients, steps, createdAt, updatedAt, deletedAt) VALUES (@id, @title, @description, @ingredients, @steps, @createdAt, @updatedAt, @deletedAt)`);
  const insert = db.transaction((items) => {
    for (const it of items) stmt.run(it);
  });
  insert(recipes);
  console.log('Seeded initial recipes data (multiple entries)');
} else {
  console.log('Recipes table exists, no seed needed');
}

// Seed a default user if none exists
const usersRow = db.prepare('SELECT COUNT(1) as cnt FROM users').get();
if (usersRow.cnt === 0) {
  const now = new Date().toISOString();
  db.prepare('INSERT INTO users (id, username, password, createdAt) VALUES (?, ?, ?, ?)').run('u1', 'admin', 'password', now);
  console.log('Seeded default user: admin / password');
} else {
  console.log('Users table exists, no user seed needed');
}

db.close();
