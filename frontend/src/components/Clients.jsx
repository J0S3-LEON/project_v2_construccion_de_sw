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
    <div className="container">
      <h2>Clientes</h2>
      <div className="card">
        <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="button" onClick={handleAdd}>Agregar</button>
      </div>

      {clients.map(c => (
        <div className="card" key={c.id}>
          <div><strong>{c.name}</strong></div>
          <div>{c.email}</div>
          <button onClick={() => onEliminarCliente(c.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  )
}
