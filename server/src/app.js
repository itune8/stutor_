import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import meetingsRouter from './routes/meetings.js';
import usersRouter from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Serve static frontend
const STATIC_DIR = process.env.STATIC_DIR || path.resolve(__dirname, '../../');
app.use(express.static(STATIC_DIR));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/users', usersRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Fallback to index.html for basic routing
app.get(['/', '/index.html'], (_req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});
