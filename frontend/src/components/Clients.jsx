import React, { useState } from 'react'

export default function Clients({ clients, onAgregarCliente, onEliminarCliente }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleAdd = async () => {
    if (!name) return alert('Nombre requerido')
    await onAgregarCliente({ name, email })
    setName(''); setEmail('')
  }

  return (
    <div>
      <h2>Clientes</h2>
      <div className="card">
        <div className="form-row">
          <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <button className="button" onClick={handleAdd}>Agregar</button>
        </div>
      </div>

      {clients.map(c => (
        <div className="card" key={c.id}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div><strong>{c.name}</strong></div>
              <div className="muted">{c.email}</div>
            </div>
            <div>
              <button className="btn-secondary" onClick={() => onEliminarCliente(c.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
