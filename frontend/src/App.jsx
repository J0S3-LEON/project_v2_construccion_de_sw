import React, { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useToast } from './context/ToastContext'
import { useClients } from './hooks/useClients'
import { useProducts } from './hooks/useProducts'
import { useSales } from './hooks/useSales'
import api from './services/api'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Catalog from './components/Catalog'
import Clients from './components/Clients'
import Cart from './components/Cart'
import LoginModal from './components/LoginModal'

export default function App() {
  const { usuarioActual, logout } = useAuth()
  const { showToast } = useToast()
  const { clients, fetch: fetchClients, agregarCliente, eliminarCliente, editarCliente, loading: clientsLoading } = useClients()
  const { products, fetch: fetchProducts, loading: productsLoading, createProduct } = useProducts()
  const { checkout } = useSales()

  const [vista, setVista] = useState(usuarioActual ? 'dashboard' : 'login')
  const [carrito, setCarrito] = useState([])
  const [totalVentas, setTotalVentas] = useState(0)
  const [ingresosTotales, setIngresosTotales] = useState(0)
  // persist carrito in localStorage so users don't lose it on refresh
  useEffect(() => {
    const raw = localStorage.getItem('cart')
    if (raw) setCarrito(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(carrito))
  }, [carrito])

  // handle undo action from toast (removes one last occurrence of product)
  useEffect(() => {
    function handler(e) {
      const productId = e.detail?.productId
      if (!productId) return
      setCarrito(prev => {
        for (let i = prev.length - 1; i >= 0; i--) {
          if (prev[i].id === productId) {
            const next = prev.filter((_, idx) => idx !== i)
            return next
          }
        }
        // nothing removed
        showToast('No se encontró el producto en el carrito', 'error')
        return prev
      })
    }
    window.addEventListener('cart:undo', handler)
    return () => window.removeEventListener('cart:undo', handler)
  }, [showToast])

  // when user logs in, fetch server cart and merge with local cart
  useEffect(() => {
    if (!usuarioActual) return
    let active = true
    const sync = async () => {
      try {
        const res = await api.get('/cart')
        if (!active) return
        const serverItems = res.data.cart.items || []
        // build maps
        const localMap = {}
        carrito.forEach(i => { localMap[i.id] = (localMap[i.id] || 0) + (i.cantidad || 1) })
        const merged = { ...localMap }
        serverItems.forEach(si => { merged[si.productId] = (merged[si.productId] || 0) + si.qty })
        // rebuild cart array using products details when available
        const newCart = Object.entries(merged).flatMap(([idStr, qty]) => {
          const id = idStr
          const prod = products.find(p => String(p.id) === String(id)) || { id, name: 'Producto', price: 0 }
          return Array.from({ length: qty }).map(() => ({ ...prod, cantidad: 1, subtotal: (prod.price || 0) }))
        })
        setCarrito(newCart)
        // persist merged cart to server
        const payload = { cart: { items: Object.entries(merged).map(([productId, qty]) => ({ productId, qty })) } }
        await api.put('/cart', payload)
      } catch (err) {
        console.error(err)
        showToast('No se pudo sincronizar carrito', 'error')
      }
    }
    sync()
    return () => { active = false }
    // only run when usuarioActual changes (initial login)
  }, [usuarioActual])

  // when carrito changes and user is authenticated, save to server
  useEffect(() => {
    if (!usuarioActual) return
    const itemsMap = {}
    carrito.forEach(i => { itemsMap[i.id] = (itemsMap[i.id] || 0) + (i.cantidad || 1) })
    const payload = { cart: { items: Object.entries(itemsMap).map(([productId, qty]) => ({ productId: Number(productId), qty })) } }
    api.put('/cart', payload).catch(err => console.error('Failed saving cart', err))
  }, [carrito, usuarioActual])
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)

  const agregarAlCarrito = (p) => {
    // prevent adding more than available stock
    if (p.stock != null) {
      const currentQty = carrito.filter(i => String(i.id) === String(p.id)).length
      if (currentQty >= p.stock) return showToast(`Insufficient stock for product ${p.name}`, 'error')
    }
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

  // Listen for auth expiration events (from hooks/components)
  useEffect(() => {
    function onAuthExpired() {
      // when session expires, clear local session and show re-login modal
      showToast('Sesión expirada, por favor vuelva a iniciar sesión', 'error')
      logout()
      setShowRelogin(true)
    }
    window.addEventListener('auth:expired', onAuthExpired)
    function onShowLogin() { setVista('login') }
    window.addEventListener('ui:show-login', onShowLogin)
    return () => { window.removeEventListener('auth:expired', onAuthExpired); window.removeEventListener('ui:show-login', onShowLogin) }
  }, [logout, showToast])

  const [showRelogin, setShowRelogin] = useState(false)

  const procesarVenta = async (metodoPago) => {
    if (!clienteSeleccionado) return showToast('Seleccione cliente', 'error')
    if (carrito.length === 0) return showToast('Carrito vacío', 'error')
    const items = carrito.map(i => ({ productId: i.id, qty: i.cantidad }))
    try {
      const sale = await checkout({ clientId: clienteSeleccionado.id, items, paymentMethod: metodoPago })
      showToast('Venta realizada con éxito', 'info')
      // update dashboard counters immediately
      setTotalVentas(prev => prev + 1)
      setIngresosTotales(prev => prev + Number(sale.total || 0))
      setCarrito([])
      setClienteSeleccionado(null)
      setVista('dashboard')
      // notify sales list components to refresh
      window.dispatchEvent(new CustomEvent('sales:updated', { detail: sale }))
    } catch (err) { showToast(err.response?.data?.error || err.message, 'error') }
  }

  // Fetch sales stats when user logs in
  useEffect(() => {
    if (!usuarioActual) return
    let active = true
    const load = async () => {
      try {
        const res = await api.get('/sales?limit=1000')
        if (!active) return
        const sales = res.data.data || []
        setTotalVentas(sales.length)
        setIngresosTotales(sales.reduce((acc, s) => acc + Number(s.total || 0), 0))
      } catch (err) {
        console.error('Failed loading sales stats', err)
      }
    }
    load()
    return () => { active = false }
  }, [usuarioActual])

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
          <div className="nav-right" style={{display:'flex',alignItems:'center',gap:12}}>
            <button className="btn-ghost" onClick={async () => { await fetchProducts(); await fetchClients(); showToast('Datos actualizados', 'info') }}>Refresh</button>
            {usuarioActual && (
              <div className="profile" title={usuarioActual.name} style={{display:'flex',alignItems:'center',gap:8}}>
                <div className="avatar">{(usuarioActual.name || usuarioActual.email || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div>
                <div className="muted" style={{fontSize:12}}>{usuarioActual.name}</div>
              </div>
            )}
            <button className="button" onClick={() => { logout(); setVista('login') }}>Logout</button>
          </div>
        </div>
      </header>

      <main className="container" style={{paddingTop:12}}>
        {vista === 'dashboard' && <Dashboard totalVentas={totalVentas} ingresosTotales={ingresosTotales} />}
        {vista === 'catalog' && <Catalog productos={products} onAgregar={agregarAlCarrito} onCrearProducto={createProduct} loading={productsLoading} />}
        {vista === 'clients' && <Clients clients={clients} onAgregarCliente={agregarCliente} onEliminarCliente={eliminarCliente} onEditarCliente={editarCliente} loading={clientsLoading} />}
        {vista === 'cart' && <Cart carrito={carrito} clientes={clients} clienteSeleccionado={clienteSeleccionado} onEliminarDelCarrito={eliminarDelCarrito} onSeleccionarCliente={setClienteSeleccionado} onProcesarVenta={procesarVenta} />}
      </main>
      <footer style={{padding:'24px 0', marginTop:24}} className="center">
        <div className="muted">Kioma Sport · Proyecto final · &copy; {new Date().getFullYear()}</div>
      </footer>

      {showRelogin && <LoginModal onClose={() => setShowRelogin(false)} />}
    </div>
  )

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
          <div className="nav-right" style={{display:'flex',alignItems:'center',gap:12}}>
            {usuarioActual && (
              <div className="profile" title={usuarioActual.name} style={{display:'flex',alignItems:'center',gap:8}}>
                <div className="avatar">{(usuarioActual.name || usuarioActual.email || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div>
                <div className="muted" style={{fontSize:12}}>{usuarioActual.name}</div>
              </div>
            )}
            <button className="button" onClick={() => { logout(); setVista('login') }}>Logout</button>
          </div>
        </div>
      </header>

      <main className="container" style={{paddingTop:12}}>
        {vista === 'dashboard' && <Dashboard totalVentas={totalVentas} ingresosTotales={ingresosTotales} />}
        {vista === 'catalog' && <Catalog productos={products} onAgregar={agregarAlCarrito} onCrearProducto={createProduct} loading={productsLoading} />}
        {vista === 'clients' && <Clients clients={clients} onAgregarCliente={agregarCliente} onEliminarCliente={eliminarCliente} onEditarCliente={editarCliente} loading={clientsLoading} />}
        {vista === 'cart' && <Cart carrito={carrito} clientes={clients} clienteSeleccionado={clienteSeleccionado} onEliminarDelCarrito={eliminarDelCarrito} onSeleccionarCliente={setClienteSeleccionado} onProcesarVenta={procesarVenta} />}
      </main>
      <footer style={{padding:'24px 0', marginTop:24}} className="center">
        <div className="muted">Kioma Sport · Proyecto final · &copy; {new Date().getFullYear()}</div>
      </footer>
    </div>
  )
}
