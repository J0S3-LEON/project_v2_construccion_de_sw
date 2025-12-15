import React, { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', ttl = 3000) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), ttl)
  }, [])

  // support legacy window events: dispatch CustomEvent('toast',{detail:{message,type}})
  React.useEffect(() => {
    function listener(e) {
      const d = e.detail || {}
      showToast(d.message || 'mensaje', d.type || 'info')
    }
    window.addEventListener('toast', listener)
    return () => window.removeEventListener('toast', listener)
  }, [showToast])

  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{position:'fixed', right:16, top:16, zIndex:9999, display:'flex', flexDirection:'column', gap:8}}>
        {toasts.map(t => (
          <div key={t.id} style={{background: t.type==='error' ? '#fde2e2' : '#e6fffa', border: '1px solid #bdeede', padding:12, borderRadius:8, minWidth:220}}>
            <div style={{fontWeight:700, marginBottom:4}}>{t.type}</div>
            <div style={{fontSize:14}}>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastContext
