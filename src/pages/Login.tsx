import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext.tsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const account = await login(email, password)
      navigate(account.role === 'admin' ? '/admin' : '/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-8">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
          <Store className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
        <p className="text-on-surface-variant">Inicia sesión para continuar</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-outline/60 bg-white p-6 shadow-sm"
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-on-surface-variant">
            Correo electrónico
          </span>
          <div className="flex items-center gap-2 rounded-xl border border-outline bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Mail className="h-5 w-5 text-on-surface-variant" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              className="w-full bg-transparent outline-none placeholder:text-on-surface-variant"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-on-surface-variant">
            Contraseña
          </span>
          <div className="flex items-center gap-2 rounded-xl border border-outline bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Lock className="h-5 w-5 text-on-surface-variant" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent outline-none placeholder:text-on-surface-variant"
            />
          </div>
        </label>

        {error && (
          <p className="rounded-xl bg-error-container px-4 py-3 text-sm font-medium text-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-md transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-outline/60 bg-surface-variant/50 px-4 py-3 text-center text-sm text-on-surface-variant">
        <p className="font-medium text-on-surface">Cuentas de demostración</p>
        <p>
          Administrador: <span className="font-mono">admin@shop.com</span> /{' '}
          <span className="font-mono">admin123</span>
        </p>
        <p>
          Cliente: <span className="font-mono">cliente@feliz.com</span> /{' '}
          <span className="font-mono">cliente123</span>
        </p>
        <p className="mt-1 text-xs">Conectado a la API desplegada (Render).</p>
      </div>

      <p className="mt-6 text-center text-on-surface-variant">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  )
}
