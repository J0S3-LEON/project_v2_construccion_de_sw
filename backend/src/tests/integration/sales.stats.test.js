import request from 'supertest';
import app from '../../app.js';
import { sequelize } from '../../db/index.js';

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await request(app).post('/api/v1/auth/register').send({ name: 'Admin', email: 'admin@example.com', password: 'admin123' });
  const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@example.com', password: 'admin123' });
  token = res.body.token;
});

afterAll(async () => { await sequelize.close(); });

describe('Sales stats', () => {
  test('should return aggregated totals after creating sales', async () => {
    // create two products
    const p1 = await request(app).post('/api/v1/products').set('Authorization', `Bearer ${token}`).send({ name: 'P1', price: 10, stock: 10, sku: 'P1' });
    const p2 = await request(app).post('/api/v1/products').set('Authorization', `Bearer ${token}`).send({ name: 'P2', price: 5, stock: 10, sku: 'P2' });

    // create a client
    const c = await request(app).post('/api/v1/clients').set('Authorization', `Bearer ${token}`).send({ name: 'Client A', email: 'ca@example.com' });

    // make two sales
    await request(app).post('/api/v1/sales').set('Authorization', `Bearer ${token}`).send({ clientId: c.body.client.id, items: [{ productId: p1.body.product.id, qty: 1 }, { productId: p2.body.product.id, qty: 2 }], paymentMethod: 'cash' });
    await request(app).post('/api/v1/sales').set('Authorization', `Bearer ${token}`).send({ clientId: c.body.client.id, items: [{ productId: p1.body.product.id, qty: 2 }], paymentMethod: 'card' });

    const stats = await request(app).get('/api/v1/sales/stats').set('Authorization', `Bearer ${token}`);
    expect(stats.status).toBe(200);
    expect(stats.body).toHaveProperty('totalVentas', 2);
    expect(Number(stats.body.ingresosTotales)).toBeCloseTo( (1*10 + 2*5) + (2*10) );
  });
});
