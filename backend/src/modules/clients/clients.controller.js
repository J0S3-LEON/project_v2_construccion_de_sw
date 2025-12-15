import * as clientsService from './clients.service.js';

export async function createClientController(req, res, next) {
  try {
    const client = await clientsService.createClient(req.body);
    res.status(201).json({ client });
  } catch (err) {
    next(err);
  }
}

export async function listClientsController(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await clientsService.listClients({ page: Number(page) || 1, limit: Number(limit) || 20 });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getClientController(req, res, next) {
  try {
    const client = await clientsService.getClientById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json({ client });
  } catch (err) {
    next(err);
  }
}

export async function updateClientController(req, res, next) {
  try {
    const client = await clientsService.updateClient(req.params.id, req.body);
    res.json({ client });
  } catch (err) {
    next(err);
  }
}

export async function deleteClientController(req, res, next) {
  try {
    await clientsService.deleteClient(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
