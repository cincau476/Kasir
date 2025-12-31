import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 1. Jangan lupa import ini
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Bungkus App dengan BrowserRouter dan set basename */}
    <BrowserRouter basename="/kasir">
      <App />
    </BrowserRouter>
  </StrictMode>,
)
