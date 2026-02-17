const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { db } = require('./db');

const initSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    credit_balance INTEGER DEFAULT 10,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    project_title TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    brief_data TEXT,
    proposal_data TEXT,
    pricing_data TEXT,
    timeline_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
`;

try {
  db.exec(initSQL);
  console.log('Database tables created successfully');
  process.exit(0);
} catch (err) {
  console.error('Database initialization failed:', err);
  process.exit(1);
}
