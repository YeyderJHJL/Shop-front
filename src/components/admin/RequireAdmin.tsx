import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.tsx'

/**
 * Protege las rutas del panel: solo usuarios con rol 'admin' pasan.
 * Sin sesión redirige a /login; con sesión de cliente redirige al inicio.
 */
export default function RequireAdmin() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  return <Outlet />
}
