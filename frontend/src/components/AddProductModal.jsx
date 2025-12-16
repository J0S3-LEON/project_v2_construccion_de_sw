import React, { useState } from 'react'
import Modal from './Modal'
import { useToast } from '../context/ToastContext'

export default function AddProductModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState('')
  const { showToast } = useToast()

  async function handleSave() {
    if (!name) return showToast('Nombre requerido', 'error')
    if (price === '' || isNaN(Number(price))) return showToast('Precio inválido', 'error')
    if (stock === '' || isNaN(Number(stock))) return showToast('Stock inválido', 'error')
    const payload = { name, description, price: Number(price) || 0, stock: Number(stock) || 0, image }
    try {
      await onSave(payload)
      setName(''); setDescription(''); setPrice(''); setStock(''); setImage('')
      onClose()
    } catch (err) {
      if (err.response?.status === 401) {
        showToast('No autorizado. Inicia sesión para crear productos', 'error')
        window.dispatchEvent(new CustomEvent('ui:show-login'))
        return
      }
      showToast(err.response?.data?.message || err.message || 'Error al crear producto', 'error')
    }
  }

  return (
    <Modal open={open} title="Agregar producto" onClose={onClose}>
      <div>
        <label>Nombre</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <label>Descripción</label>
        <input value={description} onChange={e => setDescription(e.target.value)} />
        <label>Precio</label>
        <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
        <label>Stock</label>
        <input type="number" value={stock} onChange={e => setStock(e.target.value)} />
        <label>Imagen (URL)</label>
        <input value={image} onChange={e => setImage(e.target.value)} />
        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="button" onClick={handleSave} disabled={!name || price === '' || stock === ''}>Guardar</button>
        </div>
      </div>
    </Modal>
  )
}
