const express = require('express');
const router = express.Router();
const { compareRepos } = require('../controllers/compareController');

router.post('/compare', compareRepos);

module.exports = router;
