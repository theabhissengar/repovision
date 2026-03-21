const express = require('express');
const { getRepoHealth } = require('../controllers/repo.controller');

const router = express.Router();

router.get('/repo/health', getRepoHealth);

module.exports = router;
