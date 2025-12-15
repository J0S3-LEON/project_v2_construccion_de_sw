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
      <header className="site-header">
        <div className="container">
          <div className="logo" onClick={() => setVista('dashboard')} style={{cursor:'pointer'}}>Kioma Sport</div>
          <nav className="nav">
            <div className={`nav-item`} onClick={() => setVista('dashboard')}>Dashboard</div>
            <div className={`nav-item`} onClick={() => setVista('catalog')}>Catálogo</div>
            <div className={`nav-item`} onClick={() => setVista('clients')}>Clientes</div>
            <div className={`nav-item`} onClick={() => setVista('cart')}>Carrito ({carrito.length})</div>
          </nav>
          <div className="nav-right">
            <button className="button" onClick={() => { logout(); setVista('login') }}>Logout</button>
          </div>
        </div>
      </header>

      <main className="container" style={{paddingTop:12}}>
        {vista === 'dashboard' && <Dashboard />}
        {vista === 'catalog' && <Catalog productos={products} onAgregar={agregarAlCarrito} />}
        {vista === 'clients' && <Clients clients={clients} onAgregarCliente={agregarCliente} onEliminarCliente={eliminarCliente} />}
        {vista === 'cart' && <Cart carrito={carrito} clientes={clients} clienteSeleccionado={clienteSeleccionado} onEliminarDelCarrito={eliminarDelCarrito} onSeleccionarCliente={setClienteSeleccionado} onProcesarVenta={procesarVenta} />}
      </main>
      <footer style={{padding:'24px 0', marginTop:24}} className="center">
        <div className="muted">Kioma Sport · Proyecto final · &copy; {new Date().getFullYear()}</div>
      </footer>
    </div>
  )
}
