import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
	<ToastProvider>
		<AuthProvider>
			<App />
		</AuthProvider>
	</ToastProvider>
)
