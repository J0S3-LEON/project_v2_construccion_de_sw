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
  // reload when other parts of app signal products updated
  useEffect(() => {
    function handler() { fetch() }
    window.addEventListener('products:updated', handler)
    return () => window.removeEventListener('products:updated', handler)
  }, [])

  async function createProduct(payload) {
    const res = await api.post('/products', payload)
    setProducts(prev => [res.data.product, ...prev])
    return res.data.product
  }
  return { products, fetch, loading, createProduct }
}
