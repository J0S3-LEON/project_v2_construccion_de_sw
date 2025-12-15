import api from '../services/api'

export function useSales() {
  async function checkout({ clientId, items, paymentMethod }) {
    const res = await api.post('/sales', { clientId, items, paymentMethod })
    return res.data.sale
  }

  return { checkout }
}
