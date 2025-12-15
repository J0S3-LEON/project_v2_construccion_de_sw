import request from 'supertest';
import app from '../../app.js';
import { sequelize } from '../../db/index.js';

describe('Auth integration', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('register -> login -> me', async () => {
    const user = { name: 'Test', email: 'test@example.com', password: 'secret123' };

    // register
    const reg = await request(app).post('/api/v1/auth/register').send(user);
    expect(reg.status).toBe(201);
    expect(reg.body.user).toHaveProperty('id');

    // login
    const login = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: user.password });
    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty('token');
    const token = login.body.token;

    // me
    const me = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.user).toHaveProperty('email', user.email);
  });
});
