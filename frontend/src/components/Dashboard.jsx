import React from 'react'
import SalesHistory from './SalesHistory'

export default function Dashboard({ totalVentas = 0, ingresosTotales = 0 }) {
  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
        <div className="card">
          <div className="muted">Ventas</div>
          <div style={{fontSize:24,fontWeight:700}}>{totalVentas}</div>
        </div>
        <div className="card">
          <div className="muted">Ingresos</div>
          <div style={{fontSize:24,fontWeight:700}}>${ingresosTotales}</div>
        </div>
      </div>
      <SalesHistory />
    </div>
  )
}
