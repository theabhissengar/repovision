const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const analyzeRoutes = require('./src/routes/analyzeRoutes');
const compareRoutes = require('./src/routes/compareRoutes');
const repoRoutes = require('./src/routes/repo.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', analyzeRoutes);
app.use('/api', compareRoutes);
app.use('/api', repoRoutes);

// Catch-all error handler (malformed JSON body, unhandled throws, etc.)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body.' });
  }
  console.error(err.message);
  return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
