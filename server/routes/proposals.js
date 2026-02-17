const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getAll, getById, create, update, remove } = require('../controllers/proposalController');

router.use(authenticate);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
