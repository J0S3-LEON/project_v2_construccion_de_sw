import { useEffect, useState } from 'react'
import api from '../services/api'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  async function fetch(q) {
    try {
      setLoading(true)
      const res = await api.get('/products', { params: q ? { q } : {} })
      setProducts(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])
  return { products, fetch, loading }
}
