import { useEffect, useState } from 'react'
import api from '../services/api'

export function useClients() {
  const [clients, setClients] = useState([])

  async function fetch() {
    const res = await api.get('/clients')
    setClients(res.data.data)
  }

  async function add(payload) {
    const res = await api.post('/clients', payload)
    setClients([res.data.client, ...clients])
  }

  async function remove(id) {
    await api.delete(`/clients/${id}`)
    setClients(clients.filter(c => c.id !== id))
  }

  useEffect(() => { fetch() }, [])
  return { clients, fetch, agregarCliente: add, eliminarCliente: remove }
}
