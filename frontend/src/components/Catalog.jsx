import React, { useMemo, useState } from 'react'
import { useToast } from '../context/ToastContext'

export default function Catalog({ productos, onAgregar, loading = false }) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 9
  const { showToast } = useToast()

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase()
    if (!lower) return productos
    return productos.filter(p => (p.name + ' ' + p.description).toLowerCase().includes(lower))
  }, [productos, q])

  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageItems = filtered.slice((page-1)*perPage, page*perPage)

  function handleAgregar(p) {
    onAgregar(p)
    showToast(`${p.name} agregado al carrito`, 'info')
  }

  if (loading) return <div className="center" style={{paddingTop:40}}><div className="spinner" /></div>

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h2>Catálogo</h2>
        <div style={{width:320}}>
          <input placeholder="Buscar productos..." value={q} onChange={e => { setQ(e.target.value); setPage(1) }} />
        </div>
      </div>

      <div className="grid">
        {pageItems.map(p => (
          <div className="card product-card" key={p.id}>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:64,height:64,background:'#f3f4f6',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <img alt={p.name} src={p.image || '/favicon.ico'} style={{maxWidth:'100%',maxHeight:'100%'}} />
              </div>
              <div style={{flex:1}}>
                <div className="product-name">{p.name}</div>
                <div className="product-desc">{p.description}</div>
                <div className="muted">Stock: {p.stock ?? 'N/A'}</div>
              </div>
            </div>
            <div className="product-meta" style={{marginTop:8}}>
              <div className="muted">Precio: ${p.price}</div>
              <button className="button" onClick={() => handleAgregar(p)}>Agregar</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:16}}>
        <button className="btn-secondary" onClick={() => setPage(Math.max(1, page-1))} disabled={page===1}>Anterior</button>
        <div className="muted">Página {page} de {pages}</div>
        <button className="btn-secondary" onClick={() => setPage(Math.min(pages, page+1))} disabled={page===pages}>Siguiente</button>
      </div>
    </div>
  )
}

