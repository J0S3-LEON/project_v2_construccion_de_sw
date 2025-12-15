import React, { useEffect, useRef } from 'react'

export default function Modal({ open, title, onClose, children }) {
  const ref = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      // focus first focusable element
      setTimeout(() => {
        const el = ref.current?.querySelector('input,button,select,textarea')
        if (el) el.focus()
      }, 0)
    }
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-label={title} style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:10000}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(2,6,23,0.6)'}} />
      <div ref={ref} className="card" style={{minWidth:320,maxWidth:'90%',zIndex:10001}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3>{title}</h3>
          <button className="btn-ghost" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div style={{marginTop:8}}>{children}</div>
      </div>
    </div>
  )
}
