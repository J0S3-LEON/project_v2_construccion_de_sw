import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../context/ToastContext'

export default function Login({ setVista }) {
  const { login, register } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [name, setName] = useState('')
  const [rateInfo, setRateInfo] = useState(null)
  const [attemptsLeft, setAttemptsLeft] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1') + '/auth/rate-info')
        if (!active) return
        const json = await res.json()
        setRateInfo(json)
      } catch (err) {
        // ignore
      }
    }
    load()
    return () => { active = false }
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    try {
      await login({ email, password });
      showToast('Bienvenido', 'info')
      setVista('dashboard')
    } catch (err) {
      // Show remaining attempts if available from headers
      const remaining = err.response?.headers?.['ratelimit-remaining']
      if (remaining != null) setAttemptsLeft(Number(remaining))
      showError(err)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    try {
      await register({ name: name || email.split('@')[0], email, password })
      // register auto-logins via AuthProvider — redirect to dashboard
      setVista('dashboard')
    } catch (err) {
      showError(err)
    }
  }
  
  // Show more detailed validation errors if present
  function showError(err) {
    setSuccessMsg('')
    if (!err) return setErrorMsg('Error desconocido')
    const resp = err.response?.data
    if (resp?.errors && Array.isArray(resp.errors)) return setErrorMsg(resp.errors.join('\n'))
    if (resp?.message) return setErrorMsg(resp.message)

    const status = err.response?.status
    const retryAfter = err.response?.headers?.['retry-after']
    if (status === 429) {
      const wait = retryAfter ? `${retryAfter} segundos` : 'unos minutos'
      return setErrorMsg(resp?.error || `Demasiados intentos. Intenta de nuevo en ${wait}.`)
    }

    return setErrorMsg(resp?.error || err.message || 'Error')
  }

  return (
    <div className="center" style={{paddingTop:40}}>
      <div style={{width:360}}>
        <h2 style={{marginBottom:8}}>{showRegister ? 'Registrar usuario' : 'Iniciar sesión'}</h2>
        <form onSubmit={showRegister ? handleRegister : handleLogin} className="card">
          {errorMsg && <div className="alert" style={{marginBottom:12}}>{errorMsg}</div>}
          {successMsg && <div className="card" style={{background:'#e6fffa',border:'1px solid #bdeede',marginBottom:12}}>{successMsg}</div>}
          {rateInfo && <div className="muted" style={{marginBottom:8}}>Intentos permitidos: {rateInfo.maxAttempts} cada {Math.round(rateInfo.windowSeconds/60)} min</div>}
          {attemptsLeft != null && <div className="muted" style={{marginBottom:8}}>Intentos restantes: {attemptsLeft}</div>}
          <div>
            {showRegister && <div style={{marginBottom:8}}>
              <label>Nombre</label>
              <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
            </div>}
            <label>Email</label>
            <input type="email" placeholder="ejemplo@dominio.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{marginTop:12}}>
            <label>Contraseña</label>
            <input type="password" placeholder="mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div style={{ marginTop: 12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <button className="button" type="submit">{showRegister ? 'Registrar' : 'Login'}</button>
            <button type="button" className="btn-secondary" onClick={() => { setShowRegister(s => !s); setErrorMsg(''); setSuccessMsg('') }}>{showRegister ? 'Volver a Login' : 'Crear cuenta'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
