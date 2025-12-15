import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Login({ setVista }) {
  const { login, register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    try { await login({ email, password }); setVista('dashboard') } catch (err) { alert(err.response?.data?.error || err.message) }
  }

  async function handleRegister(e) {
    e.preventDefault()
    try { await register({ name: email.split('@')[0], email, password }); alert('Registrado. Ya puedes iniciar sesión.') } catch (err) { alert(err.response?.data?.error || err.message) }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="card">
        <div>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div style={{ marginTop: 8 }}>
          <button className="button" type="submit">Login</button>
          <button type="button" style={{ marginLeft: 8 }} onClick={handleRegister}>Register</button>
        </div>
      </form>
    </div>
  )
}
