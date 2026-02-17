const db = require('../config/db');
const { generatePDF } = require('../services/pdfService');

async function exportPDF(req, res, next) {
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
      return res.status(400).json({ error: 'Proposal has no content to export' });
    }

    const pdf = await generatePDF(proposal);

    const filename = `${proposal.project_title.replace(/[^a-zA-Z0-9]/g, '_')}_Proposal.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdf);
  } catch (err) {
    next(err);
  }
}

module.exports = { exportPDF };
