import request from 'supertest';
import app from '../../app.js';
import { sequelize } from '../../db/index.js';

describe('Cart integration', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('GET empty cart, PUT cart, GET saved cart', async () => {
    const user = { name: 'CartUser', email: 'cart@example.com', password: 'secret123' };
    await request(app).post('/api/v1/auth/register').send(user);
    const login = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: user.password });
    const token = login.body.token;

    const get1 = await request(app).get('/api/v1/cart').set('Authorization', `Bearer ${token}`);
    expect(get1.status).toBe(200);
    expect(get1.body.cart).toHaveProperty('items');
    expect(Array.isArray(get1.body.cart.items)).toBe(true);

    const payload = { cart: { items: [{ productId: 1, qty: 2 }, { productId: 2, qty: 1 }] } };
    const put = await request(app).put('/api/v1/cart').set('Authorization', `Bearer ${token}`).send(payload);
    expect(put.status).toBe(200);
    expect(put.body.cart.items).toHaveLength(2);

    const get2 = await request(app).get('/api/v1/cart').set('Authorization', `Bearer ${token}`);
    expect(get2.status).toBe(200);
    expect(get2.body.cart.items).toHaveLength(2);
    expect(get2.body.cart.items[0]).toMatchObject({ productId: 1, qty: 2 });
  });
});
