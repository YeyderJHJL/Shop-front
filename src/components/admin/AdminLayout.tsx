import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Store,
  Tag,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.tsx'

const NAV = [
  { to: '/admin', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/admin/productos', label: 'Productos', icon: Package, end: false },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users, end: false },
  { to: '/admin/ofertas', label: 'Ofertas', icon: Tag, end: false },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag, end: false },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-5 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
          <Store className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-extrabold tracking-tight">Rescate de Comida</p>
          <p className="text-xs text-white/70">Panel de administración</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/15 px-3 py-4">
        <div className="mb-2 px-3 text-xs text-white/70">
          <p className="font-semibold text-white">{user?.name}</p>
          <p className="truncate">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-svh bg-[#f5f2f9]">
      {/* Sidebar fijo en escritorio */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-primary lg:block">
        {sidebar}
      </aside>

      {/* Drawer móvil */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            role="presentation"
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-primary">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Barra superior móvil */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-outline/60 bg-white px-4 lg:hidden">
          <button
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-variant"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-bold">Panel de administración</span>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
