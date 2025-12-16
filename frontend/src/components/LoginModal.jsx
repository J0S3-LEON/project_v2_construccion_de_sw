import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../context/ToastContext'

export default function LoginModal({ onClose }) {
  const { login } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login({ email, password })
      showToast('Sesión restaurada', 'info')
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al iniciar sesión')
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-backdrop">
      <div className="card" style={{width:360}}>
        <h3>Reinicia tu sesión</h3>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
          <label style={{marginTop:8}}>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cerrar</button>
            <button className="button" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
