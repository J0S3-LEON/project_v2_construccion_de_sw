#!/usr/bin/env node
import './setup.js'
import { sequelize } from '../src/db/index.js'
import { Product } from '../src/modules/products/products.model.js'
import { Client } from '../src/modules/clients/clients.model.js'

async function seed() {
  try {
    await sequelize.authenticate()
    // ensure DB schema is available; avoid destructive ALTER that may fail due to FK constraints
    try {
      await sequelize.sync()
    } catch (err) {
      console.warn('Warning: sequelize.sync() failed, continuing with seeding if possible', err.message)
    }

    const products = [
      { name: 'Zapatillas Runner', description: 'Cómodas y ligeras', price: 59.99, stock: 10, sku: 'ZR-001', image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=400&q=80' },
      { name: 'Camiseta Deportiva', description: 'Transpirable', price: 19.50, stock: 25, sku: 'CD-002', image: 'https://images.unsplash.com/photo-1520975913811-6e3a7a6b4a6b?auto=format&fit=crop&w=400&q=80' },
      { name: 'Balón Oficial', description: 'Tamaño 5', price: 29.00, stock: 5, sku: 'BO-003', image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=400&q=80' },
      { name: 'Malla de Natación', description: 'Resistente al cloro', price: 24.99, stock: 8, sku: 'MN-004', image: 'https://images.unsplash.com/photo-1506634572419-9d27be54d1b7?auto=format&fit=crop&w=400&q=80' },
      { name: 'Gorra Runner', description: 'Ligera y ajustable', price: 12.00, stock: 0, sku: 'GR-005', image: 'https://images.unsplash.com/photo-1471550668521-9f8aa0c4d6d2?auto=format&fit=crop&w=400&q=80' },
      { name: 'Sudadera con capucha', description: 'Cálida y cómoda', price: 39.99, stock: 15, sku: 'SC-006', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80' },
      { name: 'Calcetines deportivos (pack 3)', description: 'Transpirables', price: 9.99, stock: 50, sku: 'CD-007', image: 'https://images.unsplash.com/photo-1520975913811-6e3a7a6b4a6b?auto=format&fit=crop&w=400&q=80' },
      { name: 'Botella de agua', description: 'Acero inoxidable 500ml', price: 14.99, stock: 30, sku: 'BW-008', image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=400&q=80' },
      { name: 'Mochila deportiva', description: 'Espaciosa, con compartimento para zapatillas', price: 49.99, stock: 12, sku: 'MD-009', image: 'https://images.unsplash.com/photo-1542444459-db44f5e3b9d6?auto=format&fit=crop&w=400&q=80' },
      { name: 'Cinturón Deportivo', description: 'Ajustable y resistente', price: 15.00, stock: 20, sku: 'CD-010', image: 'https://images.unsplash.com/photo-1520975937383-8d3bff2b0b60?auto=format&fit=crop&w=400&q=80' },
      { name: 'Guantes de entrenamiento', description: 'Agarré y protección', price: 22.50, stock: 18, sku: 'GT-011', image: 'https://images.unsplash.com/photo-1589820296159-9a1af1b5e3ab?auto=format&fit=crop&w=400&q=80' },
      { name: 'Toalla deportiva', description: 'Secado rápido, compacta', price: 8.99, stock: 40, sku: 'TD-012', image: 'https://images.unsplash.com/photo-1485968570982-9b0f9d89d2b5?auto=format&fit=crop&w=400&q=80' }
    ]

    // additional demo products
    const moreProducts = [
      { name: 'Cuerda de saltar profesional', description: 'Longitud ajustable, asas ergonómicas', price: 7.99, stock: 60, sku: 'CS-013', image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=80' },
      { name: 'Colchoneta yoga', description: 'Antideslizante 6mm', price: 21.99, stock: 30, sku: 'CY-014', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' },
      { name: 'Soporte para botella', description: 'Compatible con bicicletas', price: 11.50, stock: 45, sku: 'SB-015', image: 'https://images.unsplash.com/photo-1504609813442-a8922a2a0a2a?auto=format&fit=crop&w=400&q=80' },
      { name: 'Gimnasio de pulseras (resistance band)', description: 'Set de 3 niveles', price: 18.00, stock: 25, sku: 'RB-016', image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=400&q=80' },
      { name: 'Monitor de ritmo cardíaco', description: 'Bluetooth, resistente al sudor', price: 49.99, stock: 10, sku: 'HR-017', image: 'https://images.unsplash.com/photo-1516900528554-3c11a56f7b9b?auto=format&fit=crop&w=400&q=80' },
      { name: 'Bandana deportiva', description: 'Absorbe sudor, ligera', price: 6.50, stock: 100, sku: 'BD-018', image: 'https://images.unsplash.com/photo-1520975690888-272b1f1c7a2b?auto=format&fit=crop&w=400&q=80' }
    ]

    for (const p of products) {
      await Product.findOrCreate({ where: { sku: p.sku }, defaults: p })
    }

    for (const p of moreProducts) {
      await Product.findOrCreate({ where: { sku: p.sku }, defaults: p })
    }

    const clients = [
      { name: 'Juan Pérez', email: 'juan.perez@example.com', phone: '+51 912 345 678' },
      { name: 'María Gómez', email: 'maria.gomez@example.com', phone: '+51 923 456 789' },
      { name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', phone: '+51 934 567 890' },
      { name: 'Ana Torres', email: 'ana.torres@example.com', phone: '+51 945 678 901' },
      { name: 'Luis Fernández', email: 'luis.fernandez@example.com', phone: '+51 956 789 012' },
      { name: 'Sofía Morales', email: 'sofia.morales@example.com', phone: '+51 967 890 123' },
      { name: 'Diego López', email: 'diego.lopez@example.com', phone: '+51 978 901 234' },
      { name: 'Valentina Ríos', email: 'valentina.rios@example.com', phone: '+51 989 012 345' },
      { name: 'Marcos Díaz', email: 'marcos.diaz@example.com', phone: '+51 990 123 456' },
      { name: 'Patricia Salas', email: 'patricia.salas@example.com', phone: '+51 991 234 567' },
      { name: 'Hugo Vargas', email: 'hugo.vargas@example.com', phone: '+51 992 345 678' }
    ]

    for (const c of clients) {
      await Client.findOrCreate({ where: { email: c.email }, defaults: c })
    }

    // Remove a specific problematic sale from history if present
    try {
      const { Sale } = await import('../src/modules/sales/sales.model.js')
      const problematicId = 'eb34a5bc-841b-4a7c-bbd2-e38b2b42be3a'
      const deleted = await Sale.destroy({ where: { id: problematicId } })
      if (deleted) console.log(`Removed problematic sale ${problematicId} from DB`)
    } catch (err) {
      // Ignore if sales model/table doesn't exist yet in dev environments
    }

    console.log('Seeding completed')
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed', err)
    process.exit(1)
  }
}

seed()
