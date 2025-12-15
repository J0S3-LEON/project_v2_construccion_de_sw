import React from 'react'
import { useToast } from '../context/ToastContext'

export default function Cart({ carrito, clientes, clienteSeleccionado, onEliminarDelCarrito, onSeleccionarCliente, onProcesarVenta }) {
  const total = carrito.reduce((t, i) => t + i.subtotal, 0)
  const { showToast } = useToast()
  const [paymentMethod, setPaymentMethod] = React.useState('cash')

  function changeQty(idx, delta) {
    const updated = [...carrito]
    const item = updated[idx]
    const newQty = Math.max(1, (item.cantidad || 1) + delta)
    // validate against stock if present
    if (item.stock != null && newQty > item.stock) {
      showToast('No hay suficiente stock', 'error')
      return
    }
    item.cantidad = newQty
    item.subtotal = item.price ? item.price * newQty : item.subtotal
    // notify parent by calling a custom event on window (we'll handle in App)
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: updated }))
  }

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
            <div style={{marginBottom:8}}>${item.subtotal}</div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn-secondary" onClick={() => changeQty(idx, -1)}>-</button>
              <button className="btn-secondary" onClick={() => changeQty(idx, +1)}>+</button>
              <button className="btn-secondary" onClick={() => onEliminarDelCarrito(idx)}>Eliminar</button>
            </div>
          </div>
        </div>
      ))}

      <div className="card">
        <div className="form-row">
          <div>
            <label>Cliente</label>
            <select onChange={e => onSeleccionarCliente(clientes.find(c => c.id === Number(e.target.value)))} value={clienteSeleccionado?.id || ''}>
              <option value="">--Selecciona--</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label>Método de pago</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>
          <div className="center text-right">
            <div style={{marginRight:12}}>Total: <strong>${total}</strong></div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <button className="button" onClick={() => onProcesarVenta(paymentMethod)}>Procesar venta</button>
              <button className="btn-secondary" onClick={() => { if (confirm('Vaciar carrito?')) window.dispatchEvent(new CustomEvent('cart:updated', { detail: [] })) }}>Vaciar carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
