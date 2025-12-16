import request from 'supertest'
import app from '../../app.js'
import { sequelize } from '../../db/index.js'

describe('E2E: login -> create client/product -> checkout', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true })
    // seed admin user
    const { User } = await import('../../modules/auth/auth.model.js')
    const bcrypt = (await import('bcryptjs')).default
    const hashed = await bcrypt.hash('admin123', 10)
    await User.create({ name: 'Admin', email: 'admin@example.com', password: hashed })
  })

  test('should login, create client/product and perform a sale', async () => {
    // login
    const loginRes = await request(app).post('/api/v1/auth/login').send({ email: 'admin@example.com', password: 'admin123' })
    expect(loginRes.status).toBe(200)
    const token = loginRes.body.token
    expect(token).toBeDefined()

    // create client
    const clientRes = await request(app).post('/api/v1/clients').set('Authorization', `Bearer ${token}`).send({ name: 'Cliente Test', email: 'cliente@test.com' })
    expect(clientRes.status).toBe(201)
    const client = clientRes.body.client

    // create product
    const productRes = await request(app).post('/api/v1/products').set('Authorization', `Bearer ${token}`).send({ name: 'Producto E2E', price: 5.5, stock: 10, sku: 'E2E-001' })
    expect(productRes.status).toBe(201)
    const product = productRes.body.product

    // perform sale
    const salePayload = { clientId: client.id, items: [{ productId: product.id, qty: 2 }], paymentMethod: 'cash' }
    const saleRes = await request(app).post('/api/v1/sales').set('Authorization', `Bearer ${token}`).send(salePayload)
    expect(saleRes.status).toBe(201)
    const sale = saleRes.body.sale
    expect(sale).toBeDefined()
    // check stock decreased
    const { Product } = await import('../../modules/products/products.model.js')
    const prodAfter = await Product.findByPk(product.id)
    expect(prodAfter.stock).toBe(8)
  })
})
