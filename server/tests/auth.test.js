import request from 'supertest';
import { app } from '../src/app.js';

const email = 'jestuser@example.com';
const password = 'secret123';

describe('Auth API', () => {
  it('signs up a new student user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Jest User', email, password, role: 'STUDENT' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('STUDENT');
  });

  it('logs in existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('role');
  });
});
