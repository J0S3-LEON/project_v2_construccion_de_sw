import { sequelize } from '../../db/index.js';
import { createProduct, getProductById } from '../../modules/products/products.service.js';

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });
  } catch (err) {
    console.error('Sequelize sync error:', err);
    throw err;
  }
});

afterAll(async () => {
  await sequelize.close();
});

test('create and get product unit', async () => {
  const p = await createProduct({ name: 'UnitProduct', price: 5.5, stock: 10 });
  expect(p).toHaveProperty('id');
  const got = await getProductById(p.id);
  expect(got).not.toBeNull();
  expect(got.name).toBe('UnitProduct');
});
