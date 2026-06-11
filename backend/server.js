import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import analysisRoutes from './routes/analysis.js';
import farmRoutes from './routes/farm.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', 
  credentials: true 
}));

app.use(express.json({ limit: '15mb' }));

// ✅ FIX: Root route (solves "Cannot GET /")
app.get("/", (_req, res) => {
  res.send("🚀 AgriMate Backend is running successfully");
});

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'agrimate-api' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/farm', farmRoutes);

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`AgriMate API running on http://localhost:${PORT}`);
});