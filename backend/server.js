import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import analysisRoutes from './routes/analysis.js';
import farmRoutes from './routes/farm.js';

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- CORS FIX (PRODUCTION SAFE) ---------------- */

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'https://agrimates-frontend.onrender.com'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests like Postman or server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// IMPORTANT: handle preflight requests
app.options('*', cors(corsOptions));

/* ---------------- MIDDLEWARE ---------------- */

app.use(express.json({ limit: '15mb' }));

/* ---------------- DATABASE ---------------- */

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected Successfully ✅'))
  .catch(err => console.error('MongoDB Connection Failed ❌', err));

/* ---------------- ROUTES ---------------- */

app.get('/', (_req, res) => {
  res.send('🚀 AgriMate Backend is running successfully');
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'agrimate-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/farm', farmRoutes);

/* ---------------- ERROR HANDLER ---------------- */

app.use((err, _req, res, _next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`🚀 AgriMate API running on port ${PORT}`);
});
