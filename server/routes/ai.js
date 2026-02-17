const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const {
  generateProposal,
  generatePricing,
  generateTimeline,
  regenerateSection,
} = require('../controllers/aiController');

router.use(authenticate);

router.post('/generate-proposal', generateProposal);
router.post('/generate-pricing', generatePricing);
router.post('/generate-timeline', generateTimeline);
router.post('/regenerate-section', regenerateSection);

module.exports = router;
