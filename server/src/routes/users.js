import express from 'express';
import { prisma } from '../services/prisma.js';
import { authMiddleware } from '../services/security.js';

const router = express.Router();

router.use(authMiddleware);

// List all educators (id, name, email)
router.get('/educators', async (_req, res) => {
  try {
    const educators = await prisma.user.findMany({
      where: { role: 'EDUCATOR' },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    });
    res.json(educators);
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
