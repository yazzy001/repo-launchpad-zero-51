// server.js
/*
require('dotenv').config();
const express = require('express');
const path = require('path');
const { runPipeline } = require('./src/pipeline');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//frontend routingg
app.use(express.static(path.join(__dirname, 'public')));

//pipeline 4 API
app.post('/api/run', async (req, res) => {
  try {
    const { url, industry } = req.body || {};
    if (!url || !industry) {
      return res.status(400).json({ error: 'Missing url or industry' });
    }
    const result = await runPipeline(url, industry);
    return res.json(result); // includes finalProfile,savedTo, stats
  } catch (e) {
    console.error('Pipeline error:', e);
    return res.status(500).json({ error: e?.message || 'Internal Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running at http://localhost:${PORT}`);
});
*/

// server.js - Enhanced for sophisticated frontend integration
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { runPipeline } = require('./src/pipeline');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS support for sophisticated frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Ensure profiles dir exists
const PROFILES_DIR = path.join(__dirname, 'profiles');
if (!fs.existsSync(PROFILES_DIR)) fs.mkdirSync(PROFILES_DIR);

// Health check endpoint for sophisticated frontend
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      gemini: !!process.env.GEMINI_API_KEY,
      braveSearch: !!process.env.BRAVE_SEARCH_API_KEY,
      scraping: true
    }
  });
});

// Run pipeline (existing route – unchanged signature)
app.post('/api/run', async (req, res) => {
  try {
    const { url, industry } = req.body || {};
    if (!url || !industry) {
      return res.status(400).json({ error: 'Missing url or industry' });
    }

    // Run your existing flow
    const result = await runPipeline(url, industry);

    // Persist per-run JSON with an id
    const id = Date.now().toString(36);
    const outPath = path.join(PROFILES_DIR, `${id}.json`);
    fs.writeFileSync(outPath, JSON.stringify(result.finalProfile, null, 2));

    // Respond with everything + id so the UI can redirect
    return res.json({
      ...result,
      id,
      savedTo: outPath.replace(process.cwd(), '')
    });
  } catch (e) {
    console.error('Pipeline error:', e);
    return res.status(500).json({ error: e?.message || 'Internal Error' });
  }
});

// Fetch a saved profile by id (for /profile.html)
app.get('/api/profile/:id', (req, res) => {
  try {
    const id = req.params.id;
    const fp = path.join(PROFILES_DIR, `${id}.json`);
    if (!fs.existsSync(fp)) return res.status(404).json({ error: 'Not found' });
    const json = JSON.parse(fs.readFileSync(fp, 'utf8'));
    return res.json(json);
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Internal Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running at http://localhost:${PORT}`);
});
