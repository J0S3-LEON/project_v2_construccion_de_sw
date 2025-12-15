import React from 'react'

export default function Dashboard({ totalVentas = 0, ingresosTotales = 0 }) {
  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div className="card">Ventas: {totalVentas}</div>
      <div className="card">Ingresos: ${ingresosTotales}</div>
    </div>
  )
}
