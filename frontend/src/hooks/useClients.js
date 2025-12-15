import { useEffect, useState } from 'react'
import api from '../services/api'

export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)

  async function fetch() {
    const res = await api.get('/clients')
    setClients(res.data.data)
  }

  async function add(payload) {
    const res = await api.post('/clients', payload)
    setClients([res.data.client, ...clients])
  }

  async function edit(id, payload) {
    const res = await api.put(`/clients/${id}`, payload)
    setClients(clients.map(c => c.id === id ? res.data.client : c))
    return res.data.client
  }

  async function remove(id) {
    await api.delete(`/clients/${id}`)
    setClients(clients.filter(c => c.id !== id))
  }

  useEffect(() => { fetch() }, [])
  return { clients, fetch, agregarCliente: add, eliminarCliente: remove, editarCliente: edit, loading }
}
