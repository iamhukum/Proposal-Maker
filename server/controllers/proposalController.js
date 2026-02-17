const db = require('../config/db');
const { validateProposal } = require('../utils/validators');

async function getAll(req, res, next) {
  try {
    const result = await db.query(
      'SELECT id, client_name, project_title, status, created_at, updated_at FROM proposals WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json({ proposals: result.rows });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM proposals WHERE id = $1 AND user_id = $2', [
      req.params.id,
      req.user.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json({ proposal: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const errors = validateProposal(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0] });
    }

    const { client_name, project_title, brief_data } = req.body;

    const result = await db.query(
      `INSERT INTO proposals (user_id, client_name, project_title, brief_data)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, client_name.trim(), project_title.trim(), JSON.stringify(brief_data || {})]
    );

    res.status(201).json({ proposal: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const existing = await db.query('SELECT id FROM proposals WHERE id = $1 AND user_id = $2', [
      req.params.id,
      req.user.id,
    ]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const { client_name, project_title, status, proposal_data, pricing_data, timeline_data, brief_data } = req.body;

    const result = await db.query(
      `UPDATE proposals SET
        client_name = COALESCE($1, client_name),
        project_title = COALESCE($2, project_title),
        status = COALESCE($3, status),
        proposal_data = COALESCE($4, proposal_data),
        pricing_data = COALESCE($5, pricing_data),
        timeline_data = COALESCE($6, timeline_data),
        brief_data = COALESCE($7, brief_data),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [
        client_name,
        project_title,
        status,
        proposal_data ? JSON.stringify(proposal_data) : null,
        pricing_data ? JSON.stringify(pricing_data) : null,
        timeline_data ? JSON.stringify(timeline_data) : null,
        brief_data ? JSON.stringify(brief_data) : null,
        req.params.id,
        req.user.id,
      ]
    );

    res.json({ proposal: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await db.query(
      'DELETE FROM proposals WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json({ message: 'Proposal deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
