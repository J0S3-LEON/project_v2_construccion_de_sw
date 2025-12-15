import React, { useState } from 'react'
import { useToast } from '../context/ToastContext'
import EditClientModal from './EditClientModal'

export default function Clients({ clients, onAgregarCliente, onEliminarCliente, onEditarCliente, loading }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)

  const handleAdd = async () => {
    if (!name) return showToast('Nombre requerido', 'error')
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return showToast('Email inválido', 'error')
    try {
      await onAgregarCliente({ name, email })
      setName(''); setEmail('')
      showToast('Cliente agregado', 'info')
    } catch (err) {
      // friendly message on 401
      if (err.message && err.message.includes('Sesión expirada')) {
        showToast(err.message, 'error')
        // optionally force logout by dispatching event so App can handle it
        window.dispatchEvent(new CustomEvent('auth:expired'))
        return
      }
      showToast(err.response?.data?.message || err.message || 'Error al agregar cliente', 'error')
    }
  }

  async function handleEdit(c) {
    setEditingClient(c)
    setModalOpen(true)
  }

  async function handleSaveClient(payload) {
    if (!editingClient) return
    try {
      await onEditarCliente(editingClient.id, payload)
      showToast('Cliente actualizado', 'info')
      setModalOpen(false)
      setEditingClient(null)
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

      <EditClientModal open={modalOpen} client={editingClient} onClose={() => { setModalOpen(false); setEditingClient(null) }} onSave={handleSaveClient} />

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
