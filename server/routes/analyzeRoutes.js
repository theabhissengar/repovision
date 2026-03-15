const express = require('express');
const router = express.Router();
const { previewRepo, analyzeRepo } = require('../controllers/analyzeController');

router.post('/preview', previewRepo);
router.post('/analyze', analyzeRepo);

module.exports = router;
