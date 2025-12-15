import { sequelize } from '../../db/index.js';
import { createClient, getClientById } from '../../modules/clients/clients.service.js';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('create and get client unit', async () => {
  const c = await createClient({ name: 'UnitClient', email: 'u1@example.com' });
  expect(c).toHaveProperty('id');
  const got = await getClientById(c.id);
  expect(got).not.toBeNull();
  expect(got.name).toBe('UnitClient');
});
