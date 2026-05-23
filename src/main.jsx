import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'
import { initializeSessions } from './lib/tracking'
import App from './App'
import './index.css'

// Seed visitor analytics records in local storage
initializeSessions();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0f1d34',
                color: '#c5cdd9',
                border: '1px solid rgba(36, 53, 84, 0.5)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#d4af37',
                  secondary: '#0a1628',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#0a1628',
                },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
