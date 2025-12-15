import React, { useEffect, useState } from 'react'
import Modal from './Modal'

export default function EditClientModal({ open, client, onClose, onSave }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (client) {
      setName(client.name || '')
      setEmail(client.email || '')
    }
  }, [client])

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ name: name.trim(), email: email.trim() })
  }

  return (
    <Modal open={open} title={client ? 'Editar cliente' : 'Nuevo cliente'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{marginTop:8}}>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{marginTop:12,display:'flex',justifyContent:'flex-end',gap:8}}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="button" type="submit">Guardar</button>
        </div>
      </form>
    </Modal>
  )
}
