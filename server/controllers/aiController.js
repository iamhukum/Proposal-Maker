const aiService = require('../services/aiService');
const db = require('../config/db');

async function generateProposal(req, res, next) {
  try {
    const { proposal_id } = req.body;

    const result = await db.query('SELECT * FROM proposals WHERE id = $1 AND user_id = $2', [
      proposal_id,
      req.user.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const proposal = result.rows[0];
    const briefData = {
      client_name: proposal.client_name,
      project_title: proposal.project_title,
      ...(proposal.brief_data || {}),
    };

    const proposalData = await aiService.generateProposal(briefData);

    await db.query(
      "UPDATE proposals SET proposal_data = $1, status = 'generated', updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [JSON.stringify(proposalData), proposal_id]
    );

    res.json({ proposal_data: proposalData });
  } catch (err) {
    next(err);
  }
}

async function generatePricing(req, res, next) {
  try {
    const { proposal_id } = req.body;

    const result = await db.query('SELECT * FROM proposals WHERE id = $1 AND user_id = $2', [
      proposal_id,
      req.user.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const proposal = result.rows[0];
    if (!proposal.proposal_data) {
      return res.status(400).json({ error: 'Generate proposal content first' });
    }

    const briefData = {
      client_name: proposal.client_name,
      project_title: proposal.project_title,
      ...(proposal.brief_data || {}),
    };

    const pricingData = await aiService.generatePricing(briefData, proposal.proposal_data);

    await db.query(
      'UPDATE proposals SET pricing_data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(pricingData), proposal_id]
    );

    res.json({ pricing_data: pricingData });
  } catch (err) {
    next(err);
  }
}

async function generateTimeline(req, res, next) {
  try {
    const { proposal_id } = req.body;

    const result = await db.query('SELECT * FROM proposals WHERE id = $1 AND user_id = $2', [
      proposal_id,
      req.user.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const proposal = result.rows[0];
    if (!proposal.proposal_data) {
      return res.status(400).json({ error: 'Generate proposal content first' });
    }

    const briefData = {
      client_name: proposal.client_name,
      project_title: proposal.project_title,
      ...(proposal.brief_data || {}),
    };

    const timelineData = await aiService.generateTimeline(briefData, proposal.proposal_data);

    await db.query(
      'UPDATE proposals SET timeline_data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(timelineData), proposal_id]
    );

    res.json({ timeline_data: timelineData });
  } catch (err) {
    next(err);
  }
}

async function regenerateSection(req, res, next) {
  try {
    const { proposal_id, section_name, current_content } = req.body;

    const result = await db.query('SELECT * FROM proposals WHERE id = $1 AND user_id = $2', [
      proposal_id,
      req.user.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const proposal = result.rows[0];
    const briefData = {
      client_name: proposal.client_name,
      project_title: proposal.project_title,
      ...(proposal.brief_data || {}),
    };

    const regenerated = await aiService.regenerateSection(section_name, briefData, current_content);

    res.json({ content: regenerated.content });
  } catch (err) {
    next(err);
  }
}

module.exports = { generateProposal, generatePricing, generateTimeline, regenerateSection };
