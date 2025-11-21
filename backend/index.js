// backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch'); // npm i node-fetch@2

const authRoutes = require('./routes/auth');

const app = express();

// Use JSON bodies
app.use(express.json());

// CORS - tighten in production by setting ALLOWED_ORIGIN to your Netlify URL
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({ origin: ALLOWED_ORIGIN }));

// Routes
app.use('/api/auth', authRoutes);

// Simple health endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Example YOLO count endpoints (in-memory)
let lastCount = 0;
app.post('/api/count', (req, res) => {
  const { count } = req.body;
  if (typeof count !== 'number') return res.status(400).json({ ok: false, error: 'count must be a number' });
  lastCount = count;
  return res.json({ ok: true, lastCount });
});
app.get('/api/count', (req, res) => res.json({ lastCount }));

// Optional: stream proxy (only works if STREAM_URL is publicly reachable by Render)
// NOTE: Render cannot access private LAN IPs like 10.x.x.x
app.get('/stream-proxy', async (req, res) => {
  const streamUrl = process.env.STREAM_URL;
  if (!streamUrl) return res.status(400).send('STREAM_URL not set');

  try {
    const upstream = await fetch(streamUrl);
    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('content-type', contentType);
    upstream.body.pipe(res);
  } catch (err) {
    console.error('stream proxy error', err);
    res.status(502).send('Cannot reach stream');
  }
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
