import React, { useState } from 'react'
import { useToast } from '../context/ToastContext'

export default function Clients({ clients, onAgregarCliente, onEliminarCliente, onEditarCliente, loading }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const { showToast } = useToast()

  const handleAdd = async () => {
    if (!name) return showToast('Nombre requerido', 'error')
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return showToast('Email inválido', 'error')
    try {
      await onAgregarCliente({ name, email })
      setName(''); setEmail('')
      showToast('Cliente agregado', 'info')
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Error al agregar cliente', 'error')
    }
  }

  async function handleEdit(c) {
    const newName = prompt('Editar nombre', c.name)
    if (!newName) return
    const newEmail = prompt('Editar email', c.email)
    if (newEmail && !/^\S+@\S+\.\S+$/.test(newEmail)) return alert('Email inválido')
    try {
      if (onEditarCliente) {
        await onEditarCliente(c.id, { name: newName, email: newEmail })
      } else {
        await onAgregarCliente({ name: newName, email: newEmail })
      }
      showToast('Cliente actualizado', 'info')
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Error al actualizar cliente', 'error')
    }
  }

  return (
    <div>
      <h2>Clientes</h2>
      {loading && <div className="center" style={{padding:20}}><div className="spinner" /></div>}
      <div className="card">
        <div className="form-row">
          <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <button className="button" onClick={handleAdd}>Agregar</button>
        </div>
      </div>

      {clients.length === 0 && <div className="card muted">No hay clientes aún</div>}

      {clients.map(c => (
        <div className="card" key={c.id}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div><strong>{c.name}</strong></div>
              <div className="muted">{c.email}</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn-secondary" onClick={() => handleEdit(c)}>Editar</button>
              <button className="btn-secondary" onClick={() => { if (confirm('Eliminar cliente?')) onEliminarCliente(c.id) }}>Eliminar</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
