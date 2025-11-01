import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { prisma } from '../services/prisma.js';

const router = express.Router();

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(64).required(),
  role: Joi.string().valid('STUDENT', 'EDUCATOR').default('STUDENT'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(64).required(),
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Helper with callback style as requested
function withCallback(promise, cb) {
  promise
    .then((data) => cb(null, data))
    .catch((err) => cb(err));
}

router.post('/signup', async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const { name, email, password, role } = value;

  withCallback(prisma.user.findUnique({ where: { email } }), async (findErr, existing) => {
    if (findErr) return res.status(500).json({ error: 'Something went wrong' });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);

    withCallback(
      prisma.user.create({ data: { name, email, passwordHash: hash, role } }),
      (createErr, user) => {
        if (createErr) return res.status(500).json({ error: 'Something went wrong' });
        const token = jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
  });
});

router.post('/login', async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const { email, password } = value;

  withCallback(prisma.user.findUnique({ where: { email } }), async (findErr, user) => {
    if (findErr) return res.status(500).json({ error: 'Something went wrong' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

export default router;
