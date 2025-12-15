import React from 'react'

export default function Cart({ carrito, clientes, clienteSeleccionado, onEliminarDelCarrito, onSeleccionarCliente, onProcesarVenta }) {
  const total = carrito.reduce((t, i) => t + i.subtotal, 0)

  return (
    <div>
      <h2>Carrito</h2>
      {carrito.length === 0 && <div className="card muted">El carrito está vacío</div>}
      {carrito.map((item, idx) => (
        <div className="card cart-item" key={idx}>
          <div>
            <div><strong>{item.name}</strong></div>
            <div className="muted">Cantidad: {item.cantidad}</div>
          </div>
          <div className="text-right">
            <div>${item.subtotal}</div>
            <button className="btn-secondary" onClick={() => onEliminarDelCarrito(idx)}>Eliminar</button>
          </div>
        </div>
      ))}

      <div className="card">
        <div className="form-row">
          <div>
            <label>Cliente</label>
            <select onChange={e => onSeleccionarCliente(clientes.find(c => c.id === e.target.value))} value={clienteSeleccionado?.id || ''}>
              <option value="">--Selecciona--</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="center text-right">
            <div style={{marginRight:12}}>Total: <strong>${total}</strong></div>
            <button className="button" onClick={() => onProcesarVenta('cash')}>Procesar venta</button>
          </div>
        </div>
      </div>
    </div>
  )
}
