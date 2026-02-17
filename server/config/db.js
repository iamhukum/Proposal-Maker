const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'proposalai.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const JSON_COLUMNS = new Set(['brief_data', 'proposal_data', 'pricing_data', 'timeline_data']);

function parseJsonColumns(row) {
  if (!row) return row;
  for (const key of Object.keys(row)) {
    if (JSON_COLUMNS.has(key) && typeof row[key] === 'string') {
      try {
        row[key] = JSON.parse(row[key]);
      } catch {}
    }
  }
  return row;
}

function query(text, params = []) {
  // Convert PostgreSQL $1, $2 placeholders to SQLite ?
  const sqliteText = text.replace(/\$\d+/g, '?');

  const trimmed = sqliteText.trim().toUpperCase();
  const isSelect = trimmed.startsWith('SELECT');
  const hasReturning = trimmed.includes('RETURNING');

  if (isSelect || hasReturning) {
    const stmt = db.prepare(sqliteText);
    const rows = stmt.all(...params);
    return { rows: rows.map(parseJsonColumns) };
  } else {
    const stmt = db.prepare(sqliteText);
    const info = stmt.run(...params);
    return { rows: [], rowCount: info.changes };
  }
}

module.exports = { query, db };
