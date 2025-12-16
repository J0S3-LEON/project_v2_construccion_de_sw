import { useEffect, useState } from 'react'
import api from '../services/api'

export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)

  async function fetch() {
    try {
      const res = await api.get('/clients')
      setClients(res.data.data)
    } catch (err) {
      if (err.response?.status === 401) {
        // notify app to logout
        window.dispatchEvent(new CustomEvent('auth:expired'))
      } else {
        console.error('Failed fetching clients', err)
      }
    }
  }

  async function add(payload) {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No autorizado')
      const res = await api.post('/clients', payload, { headers: { Authorization: `Bearer ${token}` } })
      setClients([res.data.client, ...clients])
      return res.data.client
    } catch (err) {
      // normalize axios 401 to friendly message
      if (err.response?.status === 401) throw new Error('Sesión expirada, por favor inicie sesión de nuevo')
      throw err
    }
  }

  async function edit(id, payload) {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No autorizado')
      const res = await api.put(`/clients/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
      setClients(clients.map(c => c.id === id ? res.data.client : c))
      return res.data.client
    } catch (err) {
      if (err.response?.status === 401) throw new Error('Sesión expirada, por favor inicie sesión de nuevo')
      throw err
    }
  }

  async function remove(id) {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No autorizado')
      await api.delete(`/clients/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setClients(clients.filter(c => c.id !== id))
    } catch (err) {
      if (err.response?.status === 401) throw new Error('Sesión expirada, por favor inicie sesión de nuevo')
      throw err
    }
  }

  useEffect(() => {
    let active = true
    async function maybeFetch() {
      const token = localStorage.getItem('token')
      if (!token) return
      if (!active) return
      await fetch()
    }
    maybeFetch()
    // re-fetch when auth changes
    function onAuthChanged() { maybeFetch() }
    window.addEventListener('auth:changed', onAuthChanged)
    return () => { active = false; window.removeEventListener('auth:changed', onAuthChanged) }
  }, [])
  return { clients, fetch, agregarCliente: add, eliminarCliente: remove, editarCliente: edit, loading }
}
