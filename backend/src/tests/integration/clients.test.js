import request from 'supertest';
import app from '../../app.js';
import { sequelize } from '../../db/index.js';

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // create a user and get token
  await request(app).post('/api/v1/auth/register').send({ name: 'Admin', email: 'admin@example.com', password: 'admin123' });
  const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@example.com', password: 'admin123' });
  token = res.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Clients integration', () => {
  test('create -> list -> get -> update -> delete', async () => {
    // create
    const payload = { name: 'Client One', email: 'client1@example.com', phone: '+123456' };
    const create = await request(app).post('/api/v1/clients').set('Authorization', `Bearer ${token}`).send(payload);
    expect(create.status).toBe(201);
    expect(create.body.client).toHaveProperty('id');
    const id = create.body.client.id;

    // list
    const list = await request(app).get('/api/v1/clients').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.data.length).toBeGreaterThanOrEqual(1);

    // get
    const get = await request(app).get(`/api/v1/clients/${id}`).set('Authorization', `Bearer ${token}`);
    expect(get.status).toBe(200);
    expect(get.body.client).toHaveProperty('name', payload.name);

    // update
    const upd = await request(app).put(`/api/v1/clients/${id}`).set('Authorization', `Bearer ${token}`).send({ phone: '+999' });
    expect(upd.status).toBe(200);
    expect(upd.body.client).toHaveProperty('phone', '+999');

    // delete
    const del = await request(app).delete(`/api/v1/clients/${id}`).set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(204);

    // get should now 404
    const get2 = await request(app).get(`/api/v1/clients/${id}`).set('Authorization', `Bearer ${token}`);
    expect(get2.status).toBe(404);
  });
});
