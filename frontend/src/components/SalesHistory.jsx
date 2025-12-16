import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function SalesHistory() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get('/sales?limit=50')
        if (!active) return
        setSales(res.data.data || [])
      } catch (err) {
        console.error('Failed loading sales', err)
      } finally { setLoading(false) }
    }
    load()
    function onUpdated() { load() }
    window.addEventListener('sales:updated', onUpdated)
    return () => { active = false; window.removeEventListener('sales:updated', onUpdated) }
  }, [])

  return (
    <div style={{marginTop:16}}>
      <h3>Historial de ventas</h3>
      {loading && <div className="muted">Cargando...</div>}
      {sales.length === 0 && !loading && <div className="muted">Sin ventas aún</div>}
      {sales.map(s => (
        <div className="card" key={s.id}>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <div>
              <div className="muted">Venta #{s.id} · {new Date(s.createdAt).toLocaleString()}</div>
              <div>A total: ${s.total}</div>
              <div className="muted">Productos:</div>
              <ul>
                {(s.items || []).map(it => <li key={it.id}>{it.qty} × {it.product?.name || it.productId} (${it.price})</li>)}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
