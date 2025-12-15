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
  // create client and products
  const client = await request(app).post('/api/v1/clients').set('Authorization', `Bearer ${token}`).send({ name: 'C1' });
  await request(app).post('/api/v1/products').set('Authorization', `Bearer ${token}`).send({ name: 'Ball', price: 10.00, stock: 5 });
  await request(app).post('/api/v1/products').set('Authorization', `Bearer ${token}`).send({ name: 'Shoe', price: 50.00, stock: 2 });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Sales integration', () => {
  test('create sale and validate stock change and retrieval', async () => {
    // get client and products
    const clients = await request(app).get('/api/v1/clients').set('Authorization', `Bearer ${token}`);
    const clientId = clients.body.data[0].id;
    const products = await request(app).get('/api/v1/products');
    const ball = products.body.data.find(p => p.name === 'Ball');
    const shoe = products.body.data.find(p => p.name === 'Shoe');

    // create sale: buy 2 balls and 1 shoe
    const salePayload = { clientId, items: [{ productId: ball.id, qty: 2 }, { productId: shoe.id, qty: 1 }], paymentMethod: 'cash' };
    const create = await request(app).post('/api/v1/sales').set('Authorization', `Bearer ${token}`).send(salePayload);
    expect(create.status).toBe(201);
    expect(create.body.sale).toHaveProperty('id');
    const saleId = create.body.sale.id;

    // stock reduced
    const pAfter = await request(app).get(`/api/v1/products/${ball.id}`);
    expect(pAfter.status).toBe(200);
    expect(Number(pAfter.body.product.stock)).toBe(3); // 5 - 2

    // get sale
    const get = await request(app).get(`/api/v1/sales/${saleId}`).set('Authorization', `Bearer ${token}`);
    expect(get.status).toBe(200);
    expect(get.body.sale).toHaveProperty('items');
    expect(get.body.sale.items.length).toBe(2);
  });
});
