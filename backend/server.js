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

const allowedOrigins = [process.env.CORS_ORIGIN, 'http://localhost:5173', 'http://localhost:5174'].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '15mb' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected Successfully ✅'))
  .catch(err => console.error('MongoDB Connection Failed ❌', err));

app.get('/', (_req, res) => res.send('🚀 AgriMate Backend is running successfully'));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'agrimate-api' }));

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/farm', farmRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`AgriMate API running on http://localhost:${PORT}`));
