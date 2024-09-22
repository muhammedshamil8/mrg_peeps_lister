import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '@/assets/styles/index.css'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from "@/components/ui/toaster"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider >
      <App />
      <Toaster />
    </AuthProvider>
  </StrictMode>,
)
