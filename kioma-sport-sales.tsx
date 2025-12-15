import React, { useState } from 'react';
import { CartItem, Client } from './types';
import { productosIniciales } from './data/products';
import { useAuth } from './hooks/useAuth';
import { useClients } from './hooks/useClients';
import { useSales } from './hooks/useSales';
import LoginView from './components/LoginView';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import CatalogoView from './components/CatalogoView';
import ClientesView from './components/ClientesView';
import CarritoView from './components/CarritoView';
import VentasView from './components/VentasView';

const App = () => {
  const { usuarioActual, login, register, logout } = useAuth();
  const { clientes, agregarCliente, eliminarCliente } = useClients();
  const { ventas, agregarVenta, getTotalVentas, getIngresosTotales, getClientesAtendidos, getProductosVendidos } = useSales();

  const [vistaActual, setVistaActual] = useState('login');
  const [productos] = useState(productosIniciales);
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Client | null>(null);

  // Funciones del carrito
  const agregarAlCarrito = (producto: any, talla: string, color: string) => {
    const item: CartItem = {
      ...producto,
      tallaSeleccionada: talla,
      colorSeleccionado: color,
      cantidad: 1,
      subtotal: producto.precio
    };
    setCarrito([...carrito, item]);
  };

  const eliminarDelCarrito = (index: number) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.subtotal, 0);
  };

  // Función de venta
  const procesarVenta = (metodoPago: string) => {
    if (!clienteSeleccionado) {
      alert('Seleccione un cliente');
      return;
    }
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const nuevaVenta = {
      id: getTotalVentas() + 1,
      fecha: new Date().toISOString(),
      cliente: clienteSeleccionado,
      productos: [...carrito],
      metodoPago: metodoPago,
      total: calcularTotal()
    };

    agregarVenta(nuevaVenta);
    alert('Venta procesada exitosamente');
    setCarrito([]);
    setClienteSeleccionado(null);
    setVistaActual('dashboard');
  };

  const handleLogout = () => {
    logout();
    setVistaActual('login');
    setCarrito([]);
    setClienteSeleccionado(null);
  };

  if (!usuarioActual) {
    return (
      <LoginView
        onLogin={login}
        onRegister={register}
        setVistaActual={setVistaActual}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        usuarioActual={usuarioActual}
        carritoCount={carrito.length}
        onLogout={handleLogout}
        setVistaActual={setVistaActual}
      />
      {vistaActual === 'dashboard' && (
        <DashboardView
          totalVentas={getTotalVentas()}
          ingresosTotales={getIngresosTotales()}
          clientesAtendidos={getClientesAtendidos()}
          productosVendidos={getProductosVendidos()}
        />
      )}
      {vistaActual === 'catalogo' && (
        <CatalogoView
          productos={productos}
          onAgregarAlCarrito={agregarAlCarrito}
        />
      )}
      {vistaActual === 'clientes' && (
        <ClientesView
          clientes={clientes}
          onAgregarCliente={agregarCliente}
          onEliminarCliente={eliminarCliente}
        />
      )}
      {vistaActual === 'carrito' && (
        <CarritoView
          carrito={carrito}
          clientes={clientes}
          clienteSeleccionado={clienteSeleccionado}
          onEliminarDelCarrito={eliminarDelCarrito}
          onSeleccionarCliente={setClienteSeleccionado}
          onProcesarVenta={procesarVenta}
        />
      )}
      {vistaActual === 'reportes' && (
        <VentasView ventas={ventas} />
      )}
    </div>
  );
};

export default App;
