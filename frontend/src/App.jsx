import React, { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useClients } from './hooks/useClients'
import { useProducts } from './hooks/useProducts'
import { useSales } from './hooks/useSales'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Catalog from './components/Catalog'
import Clients from './components/Clients'
import Cart from './components/Cart'

export default function App() {
  const { usuarioActual, logout } = useAuth()
  const { clients, agregarCliente, eliminarCliente } = useClients()
  const { products } = useProducts()
  const { checkout } = useSales()

  const [vista, setVista] = useState(usuarioActual ? 'dashboard' : 'login')
  const [carrito, setCarrito] = useState([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)

  const agregarAlCarrito = (p) => {
    const item = { ...p, cantidad: 1, subtotal: p.price }
    setCarrito([...carrito, item])
  }

  const eliminarDelCarrito = (i) => setCarrito(carrito.filter((_, idx) => idx !== i))

  const procesarVenta = async (metodoPago) => {
    if (!clienteSeleccionado) return alert('Seleccione cliente')
    if (carrito.length === 0) return alert('Carrito vacío')
    const items = carrito.map(i => ({ productId: i.id, qty: i.cantidad }))
    try {
      await checkout({ clientId: clienteSeleccionado.id, items, paymentMethod: metodoPago })
      alert('Venta realizada')
      setCarrito([])
      setClienteSeleccionado(null)
      setVista('dashboard')
    } catch (err) { alert(err.response?.data?.error || err.message) }
  }

  if (!usuarioActual) return <Login setVista={setVista} />

  return (
    <div>
      <div className="nav">
        <div style={{cursor:'pointer'}} onClick={() => setVista('dashboard')}>Dashboard</div>
        <div style={{cursor:'pointer'}} onClick={() => setVista('catalog')}>Catálogo</div>
        <div style={{cursor:'pointer'}} onClick={() => setVista('clients')}>Clientes</div>
        <div style={{cursor:'pointer'}} onClick={() => setVista('cart')}>Carrito ({carrito.length})</div>
        <div style={{marginLeft:'auto'}}><button className="button" onClick={() => { logout(); setVista('login') }}>Logout</button></div>
      </div>

      {vista === 'dashboard' && <Dashboard />}
      {vista === 'catalog' && <Catalog productos={products} onAgregar={agregarAlCarrito} />}
      {vista === 'clients' && <Clients clients={clients} onAgregarCliente={agregarCliente} onEliminarCliente={eliminarCliente} />}
      {vista === 'cart' && <Cart carrito={carrito} clientes={clients} clienteSeleccionado={clienteSeleccionado} onEliminarDelCarrito={eliminarDelCarrito} onSeleccionarCliente={setClienteSeleccionado} onProcesarVenta={procesarVenta} />}
    </div>
  )
}
