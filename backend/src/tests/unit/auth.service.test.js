import { sequelize } from '../../db/index.js';
import { registerService, loginService } from '../../modules/auth/auth.service.js';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('register and login service unit', async () => {
  const payload = { name: 'Unit', email: 'unit@example.com', password: 'pwd12345' };
  const user = await registerService(payload);
  expect(user).toHaveProperty('id');

  const token = await loginService({ email: payload.email, password: payload.password });
  expect(typeof token).toBe('string');
});
