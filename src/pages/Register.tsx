import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, Store, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext.tsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    register(name, email)
    navigate('/profile')
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-8">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
          <Store className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
        <p className="text-on-surface-variant">Únete para empezar a comprar</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-outline/60 bg-white p-6 shadow-sm"
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-on-surface-variant">
            Nombre completo
          </span>
          <div className="flex items-center gap-2 rounded-xl border border-outline bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <User className="h-5 w-5 text-on-surface-variant" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full bg-transparent outline-none placeholder:text-on-surface-variant"
            />
          </div>
        </label>

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

        <button
          type="submit"
          className="w-full rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
        >
          Crear Cuenta
        </button>
      </form>

      <p className="mt-6 text-center text-on-surface-variant">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
