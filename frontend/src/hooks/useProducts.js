import { useEffect, useState } from 'react'
import api from '../services/api'

export function useProducts() {
  const [products, setProducts] = useState([])
  async function fetch(q) {
    const res = await api.get('/products', { params: q ? { q } : {} })
    setProducts(res.data.data)
  }

  useEffect(() => { fetch() }, [])
  return { products, fetch }
}
