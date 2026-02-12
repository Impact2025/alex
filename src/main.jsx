import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import './accessibility.css'
import { AuthProvider } from './contexts/AuthContext'
import { PointsProvider } from './PointsContext'
import { router } from './router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PointsProvider>
        <RouterProvider router={router} />
      </PointsProvider>
    </AuthProvider>
  </StrictMode>,
)
