import request from 'supertest';
import { app } from '../src/app.js';

async function signup(name, email, role = 'STUDENT') {
  return request(app)
    .post('/api/auth/signup')
    .send({ name, email, password: 'secret123', role });
}

describe('Meetings API with roles', () => {
  it('student requests a meeting; educator approves; both see correct status', async () => {
    const studentEmail = `student_${Date.now()}@example.com`;
    const educatorEmail = `educator_${Date.now()}@example.com`;

    const stu = await signup('Student Jest', studentEmail, 'STUDENT');
    expect(stu.status).toBe(201);
    const studentToken = stu.body.token;

    const edu = await signup('Educator Jest', educatorEmail, 'EDUCATOR');
    expect(edu.status).toBe(201);
    const educatorId = edu.body.user.id;
    const educatorToken = edu.body.token;

    // Student creates a meeting request for this educator
    const create = await request(app)
      .post('/api/meetings')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ title: 'Test Meeting', date: '2025-11-02', time: '10:00', mode: 'virtual', link: '', educatorId });
    expect(create.status).toBe(201);
    expect(create.body.status).toBe('PENDING');

    // Educator sees it in their list
    const eduList = await request(app)
      .get('/api/meetings')
      .set('Authorization', `Bearer ${educatorToken}`);
    expect(eduList.status).toBe(200);
    expect(eduList.body.length).toBeGreaterThanOrEqual(1);
    const meeting = eduList.body.find((m) => m.id === create.body.id);
    expect(meeting).toBeTruthy();
    expect(meeting.status).toBe('PENDING');

    // Educator approves
    const approve = await request(app)
      .patch(`/api/meetings/${create.body.id}/status`)
      .set('Authorization', `Bearer ${educatorToken}`)
      .send({ status: 'APPROVED' });
    expect(approve.status).toBe(200);
    expect(approve.body.status).toBe('APPROVED');
    // Virtual link should be generated if missing
    expect(approve.body.link).toBeTruthy();

    // Student sees approved status
    const stuList = await request(app)
      .get('/api/meetings')
      .set('Authorization', `Bearer ${studentToken}`);
    const updated = stuList.body.find((m) => m.id === create.body.id);
    expect(updated.status).toBe('APPROVED');
    expect(updated.link).toBeTruthy();
  });
});
