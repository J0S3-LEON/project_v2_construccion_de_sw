import { useContext } from 'react'
import { useAuthContext } from '../context/AuthContext'

// useAuth now delegates to AuthContext so the auth state is shared across the app
export function useAuth() {
  const ctx = useAuthContext()
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
