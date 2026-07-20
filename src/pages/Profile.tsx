import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  LogOut,
  MapPin,
  Package,
  Settings,
  User as UserIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.tsx'

const OPTIONS = [
  { icon: Package, label: 'Mis pedidos' },
  { icon: MapPin, label: 'Direcciones' },
  { icon: Settings, label: 'Configuración' },
]

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">No has iniciado sesión</p>
        <Link
          to="/login"
          className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Iniciar sesión
        </Link>
      </div>
    )
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
      {/* Avatar + info */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white shadow-md">
          {initials || <UserIcon className="h-12 w-12" />}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-on-surface-variant">{user.email}</p>
        </div>
      </div>

      {/* Options list */}
      <div className="mt-8 space-y-3">
        {OPTIONS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl bg-surface-variant px-5 py-4 text-left font-medium text-on-surface transition-colors hover:bg-outline/40"
          >
            <Icon className="h-5 w-5 text-secondary" />
            <span className="flex-1">{label}</span>
            <ChevronRight className="h-5 w-5 text-on-surface-variant" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-error-container px-5 py-4 font-semibold text-error transition-colors hover:brightness-95"
      >
        <LogOut className="h-5 w-5" /> Cerrar Sesión
      </button>
    </div>
  )
}
