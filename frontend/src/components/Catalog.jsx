import React from 'react'

export default function Catalog({ productos, onAgregar }) {
  return (
    <div>
      <h2>Catálogo</h2>
      <div className="grid">
        {productos.map(p => (
          <div className="card product-card" key={p.id}>
            <div className="product-name">{p.name}</div>
            <div className="product-desc">{p.description}</div>
            <div className="product-meta">
              <div className="muted">Precio: ${p.price}</div>
              <button className="button" onClick={() => onAgregar(p)}>Agregar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
