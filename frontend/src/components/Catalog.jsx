import React from 'react'

export default function Catalog({ productos, onAgregar }) {
  return (
    <div className="container">
      <h2>Catálogo</h2>
      {productos.map(p => (
        <div className="card" key={p.id}>
          <strong>{p.name}</strong>
          <div>{p.description}</div>
          <div>Precio: ${p.price}</div>
          <button className="button" onClick={() => onAgregar(p)}>Agregar</button>
        </div>
      ))}
    </div>
  )
}
