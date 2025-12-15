import React from 'react'

export default function Cart({ carrito, clientes, clienteSeleccionado, onEliminarDelCarrito, onSeleccionarCliente, onProcesarVenta }) {
  const total = carrito.reduce((t, i) => t + i.subtotal, 0)

  return (
    <div className="container">
      <h2>Carrito</h2>
      {carrito.map((item, idx) => (
        <div className="card" key={idx}>
          <div>{item.name} - ${item.precio}</div>
          <div>Cantidad: {item.cantidad}</div>
          <button onClick={() => onEliminarDelCarrito(idx)}>Eliminar</button>
        </div>
      ))}

      <div className="card">
        <div>Total: ${total}</div>
        <div>
          <label>Cliente</label>
          <select onChange={e => onSeleccionarCliente(clientes.find(c => c.id === e.target.value))} value={clienteSeleccionado?.id || ''}>
            <option value="">--Selecciona--</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button className="button" onClick={() => onProcesarVenta('cash')}>Procesar venta (cash)</button>
      </div>
    </div>
  )
}
