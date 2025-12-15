import React, { useState } from 'react'
import Modal from './Modal'

export default function AddProductModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState('')

  async function handleSave() {
    if (!name) return alert('Nombre requerido')
    const payload = { name, description, price: Number(price) || 0, stock: Number(stock) || 0, image }
    await onSave(payload)
    setName(''); setDescription(''); setPrice(''); setStock(''); setImage('')
    onClose()
  }

  return (
    <Modal open={open} title="Agregar producto" onClose={onClose}>
      <div>
        <label>Nombre</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <label>Descripción</label>
        <input value={description} onChange={e => setDescription(e.target.value)} />
        <label>Precio</label>
        <input value={price} onChange={e => setPrice(e.target.value)} />
        <label>Stock</label>
        <input value={stock} onChange={e => setStock(e.target.value)} />
        <label>Imagen (URL)</label>
        <input value={image} onChange={e => setImage(e.target.value)} />
        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="button" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </Modal>
  )
}
