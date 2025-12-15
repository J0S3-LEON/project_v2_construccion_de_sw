import { useState } from 'react'
import api from '../services/api'

export function useAuth() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  async function login({ email, password }) {
    const res = await api.post('/auth/login', { email, password })
    const { token } = res.data
    localStorage.setItem('token', token)
    // fetch user profile
    const me = await api.get('/auth/me')
    localStorage.setItem('user', JSON.stringify(me.data.user))
    setUser(me.data.user)
  }

  async function register(payload) {
    await api.post('/auth/register', payload)
    return login({ email: payload.email, password: payload.password })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return { usuarioActual: user, login, register, logout }
}
