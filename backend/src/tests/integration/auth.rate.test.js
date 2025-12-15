import request from 'supertest';
import app from '../../app.js';
import { sequelize } from '../../db/index.js';

describe('Auth rate info', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });
  afterAll(async () => { await sequelize.close(); });

  test('GET /auth/rate-info returns config', async () => {
    const res = await request(app).get('/api/v1/auth/rate-info');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('maxAttempts');
    expect(res.body).toHaveProperty('windowSeconds');
  });
});
