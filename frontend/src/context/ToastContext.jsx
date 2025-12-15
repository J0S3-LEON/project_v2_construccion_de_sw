import React, { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // showToast(message, type='info', ttl=3000, action=null)
  const showToast = useCallback((message, type = 'info', ttl = 3000, action = null) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, message, type, ttl, action }])
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
          <div key={t.id} role="status" aria-live="polite" style={{background: t.type==='error' ? '#fde2e2' : t.type==='success' ? '#e6fffa' : '#f1f5f9', border: '1px solid #e2e8f0', padding:12, borderRadius:8, minWidth:240, boxShadow:'0 6px 18px rgba(2,6,23,0.06)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{fontSize:18}}>{t.type==='error' ? '❌' : t.type==='success' ? '✅' : 'ℹ️'}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700, marginBottom:4, textTransform:'capitalize'}}>{t.type}</div>
                <div style={{fontSize:14}}>{t.message}</div>
              </div>
              <div>
                {t.action && <button className="btn-ghost" onClick={() => { t.action.callback(); setToasts(s => s.filter(x => x.id !== t.id)) }}>{t.action.label}</button>}
                <button className="btn-ghost" onClick={() => remove(t.id)} aria-label="Cerrar">✕</button>
              </div>
            </div>
            <div style={{height:4,background:'#e6edf3',borderRadius:4,overflow:'hidden',marginTop:8}}>
              <div style={{height:4,background:t.type==='error' ? '#fca5a5' : '#60a5fa', width:'100%', transformOrigin:'left', animation:`toast-progress ${t.ttl}ms linear forwards`}} />
            </div>
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
