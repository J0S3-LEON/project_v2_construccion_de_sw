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

describe('Products integration', () => {
  test('create -> list -> search -> get -> update -> delete', async () => {
    // create (protected)
    const payload = { name: 'Ball', description: 'Football', sku: 'BALL001', price: 19.99, stock: 10 };
    const create = await request(app).post('/api/v1/products').set('Authorization', `Bearer ${token}`).send(payload);
    expect(create.status).toBe(201);
    expect(create.body.product).toHaveProperty('id');
    const id = create.body.product.id;

    // list (public)
    const list = await request(app).get('/api/v1/products');
    expect(list.status).toBe(200);
    expect(list.body.data.length).toBeGreaterThanOrEqual(1);

    // search q (public)
    const search = await request(app).get('/api/v1/products').query({ q: 'ball' });
    expect(search.status).toBe(200);
    expect(search.body.data.length).toBeGreaterThanOrEqual(1);

    // get
    const get = await request(app).get(`/api/v1/products/${id}`);
    expect(get.status).toBe(200);
    expect(get.body.product).toHaveProperty('name', payload.name);

    // update (protected)
    const upd = await request(app).put(`/api/v1/products/${id}`).set('Authorization', `Bearer ${token}`).send({ price: 24.5 });
    expect(upd.status).toBe(200);
    expect(Number(upd.body.product.price)).toBeCloseTo(24.5);

    // delete (protected)
    const del = await request(app).delete(`/api/v1/products/${id}`).set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(204);

    // get should now 404
    const get2 = await request(app).get(`/api/v1/products/${id}`);
    expect(get2.status).toBe(404);
  });
});
