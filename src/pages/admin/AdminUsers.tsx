import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useData } from '../../context/DataContext.tsx'
import type { User, UserRole, UserStatus } from '../../types.ts'
import { formatDate } from '../../lib/format.ts'
import Modal from '../../components/admin/Modal.tsx'
import { Field, inputCls } from '../../components/admin/FormField.tsx'

type FormState = Omit<User, 'id'>

const EMPTY: FormState = {
  name: '',
  email: '',
  role: 'cliente',
  status: 'activo',
  joinedAt: new Date().toISOString().slice(0, 10),
}

export default function AdminUsers() {
  const { users, addUser, updateUser, deleteUser } = useData()
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    )
  }, [users, query])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  function openEdit(u: User) {
    setEditing(u)
    const { id: _id, ...rest } = u
    void _id
    setForm(rest)
    setModalOpen(true)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (editing) updateUser(editing.id, form)
    else addUser(form)
    setModalOpen(false)
  }

  function handleDelete(u: User) {
    if (window.confirm(`¿Eliminar la cuenta de "${u.name}"?`)) deleteUser(u.id)
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Usuarios</h1>
          <p className="text-on-surface-variant">
            {users.length} cuenta(s) registradas.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-5 w-5" /> Nuevo usuario
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-outline bg-white px-4 py-2.5 shadow-sm focus-within:border-primary">
        <Search className="h-5 w-5 text-on-surface-variant" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="w-full bg-transparent outline-none placeholder:text-on-surface-variant"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-outline/60 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-outline/60 text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Registro</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-outline/40 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-on-surface">{u.name}</p>
                  <p className="text-xs text-on-surface-variant">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.role === 'admin'
                        ? 'bg-primary/15 text-primary'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.status === 'activo'
                        ? 'bg-success-container text-success'
                        : 'bg-error-container text-error'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">
                  {formatDate(u.joinedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(u)}
                      aria-label={`Editar ${u.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(u)}
                      aria-label={`Eliminar ${u.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-error-container hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-on-surface-variant">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar usuario' : 'Nuevo usuario'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre completo">
            <input
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Correo electrónico">
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rol">
              <select
                value={form.role}
                onChange={(e) => set('role', e.target.value as UserRole)}
                className={inputCls}
              >
                <option value="cliente">cliente</option>
                <option value="admin">admin</option>
              </select>
            </Field>
            <Field label="Estado">
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as UserStatus)}
                className={inputCls}
              >
                <option value="activo">activo</option>
                <option value="inactivo">inactivo</option>
              </select>
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl px-4 py-2.5 font-medium text-on-surface-variant transition-colors hover:bg-surface-variant"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              {editing ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
