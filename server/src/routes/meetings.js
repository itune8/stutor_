import express from 'express';
import Joi from 'joi';
import { prisma } from '../services/prisma.js';
import { authMiddleware, requireRole } from '../services/security.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const meetingSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  date: Joi.string().required(), // ISO date string
  time: Joi.string().required(), // "HH:MM"
  mode: Joi.string().valid('virtual', 'offline').required(),
  link: Joi.string().uri().allow('', null),
  location: Joi.string().allow('', null),
  notes: Joi.string().allow('', null),
  educatorId: Joi.number().integer().required(),
});

// Helper callback wrapper (as requested)
function withCallback(promise, cb) {
  promise.then((d) => cb(null, d)).catch((e) => cb(e));
}

router.use(authMiddleware);

router.get('/', (req, res) => {
  const userId = req.user.sub;
  const role = req.user.role;
  const where = role === 'EDUCATOR' ? { educatorId: userId } : { requesterId: userId };
  withCallback(
    prisma.meeting.findMany({ where, orderBy: { date: 'asc' } }),
    (err, items) => {
      if (err) return res.status(500).json({ error: 'Something went wrong' });
      res.json(items);
    }
  );
});

// Students create meeting requests
router.post('/', requireRole('STUDENT'), (req, res) => {
  const { error, value } = meetingSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const requesterId = req.user.sub;
  let { title, date, time, mode, link, location, notes, educatorId } = value;
  // Do not auto-generate link at creation; educators can approve and auto-generate later if needed
  if (!link || link.trim() === '') link = null;
  withCallback(
    prisma.meeting.create({
      data: {
        title,
        date,
        time,
        mode,
        link: link || null,
        location: location || null,
        notes: notes || null,
        requesterId,
        educatorId,
        status: 'PENDING',
      }
    }),
    (err, meeting) => {
      if (err) return res.status(500).json({ error: 'Something went wrong' });
      res.status(201).json(meeting);
    }
  );
});

// Educator can update status
router.patch('/:id/status', requireRole('EDUCATOR'), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const schema = Joi.object({ status: Joi.string().valid('APPROVED', 'REJECTED').required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const educatorId = req.user.sub;

  withCallback(
    prisma.meeting.findUnique({ where: { id } }),
    async (findErr, meeting) => {
      if (findErr) return res.status(500).json({ error: 'Something went wrong' });
      if (!meeting || meeting.educatorId !== educatorId)
        return res.status(404).json({ error: 'Not found' });
      // On approve, ensure link exists for virtual
      let link = meeting.link;
      if (value.status === 'APPROVED' && meeting.mode === 'virtual' && (!link || link.trim() === '')) {
        link = `https://meet.jit.si/${uuidv4()}`;
      }
      withCallback(
        prisma.meeting.update({ where: { id }, data: { status: value.status, link } }),
        (updErr, updated) => {
          if (updErr) return res.status(500).json({ error: 'Something went wrong' });
          res.json(updated);
        }
      );
    }
  );
});

router.delete('/:id', (req, res) => {
  const role = req.user.role;
  const userId = req.user.sub;
  const id = parseInt(req.params.id, 10);

  // Students can delete their own requests; educators cannot delete requests (could be extended to cancel)
  if (role === 'EDUCATOR') return res.status(403).json({ error: 'Forbidden' });
  withCallback(prisma.meeting.findUnique({ where: { id } }), (findErr, meeting) => {
    if (findErr) return res.status(500).json({ error: 'Something went wrong' });
    if (!meeting || meeting.requesterId !== userId) return res.status(404).json({ error: 'Not found' });
    withCallback(
      prisma.meeting.delete({ where: { id } }),
      (err) => {
        if (err) return res.status(500).json({ error: 'Something went wrong' });
        res.status(204).end();
      }
    );
  });
});

export default router;
