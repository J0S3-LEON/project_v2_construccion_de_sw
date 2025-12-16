import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    // when app mounts, ensure token/user from localStorage are consistent
    const token = localStorage.getItem('token')
    if (token && !user) {
      api.get('/auth/me').then(res => setUser(res.data.user)).catch(() => {
        // if token invalid, clear it
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      })
    }
  }, [])

  async function login({ email, password }) {
    const res = await api.post('/auth/login', { email, password })
    const { token } = res.data
    localStorage.setItem('token', token)
    const me = await api.get('/auth/me')
    localStorage.setItem('user', JSON.stringify(me.data.user))
    setUser(me.data.user)
    window.dispatchEvent(new CustomEvent('auth:changed', { detail: me.data.user }))
  }

  async function register(payload) {
    await api.post('/auth/register', payload)
    // auto-login after register
    await login({ email: payload.email, password: payload.password })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.dispatchEvent(new CustomEvent('auth:changed', { detail: null }))
  }

  return (
    <AuthContext.Provider value={{ usuarioActual: user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}

export default AuthContext
