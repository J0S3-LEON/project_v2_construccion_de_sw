import React, { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useToast } from './context/ToastContext'
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
  const { showToast } = useToast()
  const { clients, agregarCliente, eliminarCliente, editarCliente, loading: clientsLoading } = useClients()
  const { products, loading: productsLoading } = useProducts()
  const { checkout } = useSales()

  const [vista, setVista] = useState(usuarioActual ? 'dashboard' : 'login')
  const [carrito, setCarrito] = useState([])
  // persist carrito in localStorage so users don't lose it on refresh
  useEffect(() => {
    const raw = localStorage.getItem('cart')
    if (raw) setCarrito(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(carrito))
  }, [carrito])
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)

  const agregarAlCarrito = (p) => {
    const item = { ...p, cantidad: 1, subtotal: p.price }
    setCarrito([...carrito, item])
  }

  const eliminarDelCarrito = (i) => setCarrito(carrito.filter((_, idx) => idx !== i))

  // Listen for cart updates from child components (quantity changes)
  useEffect(() => {
    function handler(e) {
      setCarrito(e.detail)
    }
    window.addEventListener('cart:updated', handler)
    return () => window.removeEventListener('cart:updated', handler)
  }, [])

  const procesarVenta = async (metodoPago) => {
    if (!clienteSeleccionado) return showToast('Seleccione cliente', 'error')
    if (carrito.length === 0) return showToast('Carrito vacío', 'error')
    const items = carrito.map(i => ({ productId: i.id, qty: i.cantidad }))
    try {
      await checkout({ clientId: clienteSeleccionado.id, items, paymentMethod: metodoPago })
      showToast('Venta realizada con éxito', 'info')
      setCarrito([])
      setClienteSeleccionado(null)
      setVista('dashboard')
    } catch (err) { showToast(err.response?.data?.error || err.message, 'error') }
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
        {vista === 'catalog' && <Catalog productos={products} onAgregar={agregarAlCarrito} loading={productsLoading} />}
        {vista === 'clients' && <Clients clients={clients} onAgregarCliente={agregarCliente} onEliminarCliente={eliminarCliente} onEditarCliente={editarCliente} loading={clientsLoading} />}
        {vista === 'cart' && <Cart carrito={carrito} clientes={clients} clienteSeleccionado={clienteSeleccionado} onEliminarDelCarrito={eliminarDelCarrito} onSeleccionarCliente={setClienteSeleccionado} onProcesarVenta={procesarVenta} />}
      </main>
      <footer style={{padding:'24px 0', marginTop:24}} className="center">
        <div className="muted">Kioma Sport · Proyecto final · &copy; {new Date().getFullYear()}</div>
      </footer>
    </div>
  )
}
