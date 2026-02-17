require('dotenv').config({ path: '../../.env' });
const { pool } = require('./db');

const initSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    credit_balance INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS proposals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    brief_data JSONB,
    proposal_data JSONB,
    pricing_data JSONB,
    timeline_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
`;

async function init() {
  try {
    await pool.query(initSQL);
    console.log('Database tables created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  }
}

init();
