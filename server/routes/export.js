const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { exportPDF } = require('../controllers/exportController');

router.use(authenticate);

router.post('/pdf', exportPDF);

module.exports = router;
