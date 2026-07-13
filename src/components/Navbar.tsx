import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Store, User } from 'lucide-react'
import { useCart } from '../context/CartContext.tsx'
import { useAuth } from '../context/AuthContext.tsx'

export default function Navbar() {
  const { count } = useCart()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Store className="h-6 w-6" />
          <span className="text-xl font-extrabold tracking-tight">Tienda</span>
        </Link>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              type="button"
              aria-label="Panel de administración"
              onClick={() => navigate('/admin')}
              className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:bg-white/15"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="hidden sm:inline">Panel</span>
            </button>
          )}
          <button
            type="button"
            aria-label="Carrito"
            onClick={() => navigate('/cart')}
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/15"
          >
            <ShoppingCart className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-tertiary px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="Perfil"
            onClick={() => navigate('/profile')}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/15"
          >
            <User className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </header>
  )
}
