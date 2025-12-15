import { Client } from './clients.model.js';

export async function createClient(payload) {
  const client = await Client.create(payload);
  return client;
}

export async function listClients({ page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const { rows, count } = await Client.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
  return { data: rows, meta: { count, page, limit } };
}

export async function getClientById(id) {
  return Client.findByPk(id);
}

export async function updateClient(id, payload) {
  const client = await Client.findByPk(id);
  if (!client) throw { status: 404, message: 'Client not found' };
  await client.update(payload);
  return client;
}

export async function deleteClient(id) {
  const client = await Client.findByPk(id);
  if (!client) throw { status: 404, message: 'Client not found' };
  await client.destroy();
  return;
}
