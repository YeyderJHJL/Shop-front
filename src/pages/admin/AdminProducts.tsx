import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useData } from '../../context/DataContext.tsx'
import type { Product } from '../../types.ts'
import { CATEGORIES } from '../../data/products.ts'
import { formatPrice, formatDate, daysUntil, discountPercent } from '../../lib/format.ts'
import Modal from '../../components/admin/Modal.tsx'
import { Field, inputCls } from '../../components/admin/FormField.tsx'

type FormState = Omit<Product, 'id'>

const EMPTY: FormState = {
  name: '',
  price: 0,
  originalPrice: 0,
  category: CATEGORIES[0],
  description: '',
  image: '',
  stock: 0,
  expiryDate: new Date().toISOString().slice(0, 10),
}

function ExpiryBadge({ iso }: { iso: string }) {
  const d = daysUntil(iso)
  const critical = d <= 1
  const soon = d <= 3
  const cls = critical
    ? 'bg-error-container text-error'
    : soon
      ? 'bg-tertiary/15 text-tertiary'
      : 'bg-success-container text-success'
  const label =
    d < 0 ? 'vencido' : d === 0 ? 'vence hoy' : `${d} día${d === 1 ? '' : 's'}`
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {formatDate(iso)} · {label}
    </span>
  )
}

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useData()
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
  }, [products, query])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    const { id: _id, ...rest } = p
    void _id
    setForm(rest)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      if (editing) await updateProduct(editing.id, form)
      else await addProduct(form)
      setModalOpen(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo guardar el producto')
    }
  }

  async function handleDelete(p: Product) {
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return
    try {
      await deleteProduct(p.id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo eliminar el producto')
    }
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Productos</h1>
          <p className="text-on-surface-variant">
            {products.length} producto(s) en el inventario.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-5 w-5" /> Nuevo producto
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-outline bg-white px-4 py-2.5 shadow-sm focus-within:border-primary">
        <Search className="h-5 w-5 text-on-surface-variant" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          className="w-full bg-transparent outline-none placeholder:text-on-surface-variant"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-outline/60 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-outline/60 text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Vencimiento</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-outline/40 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-on-surface">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">{p.category}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-on-surface">
                    {formatPrice(p.price)}
                  </span>
                  {p.originalPrice > p.price && (
                    <span className="ml-2 text-xs text-on-surface-variant line-through">
                      {formatPrice(p.originalPrice)}
                    </span>
                  )}
                  {discountPercent(p.originalPrice, p.price) > 0 && (
                    <span className="ml-1 text-xs font-semibold text-success">
                      -{discountPercent(p.originalPrice, p.price)}%
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.stock === 0
                        ? 'font-semibold text-error'
                        : 'text-on-surface'
                    }
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ExpiryBadge iso={p.expiryDate} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      aria-label={`Editar ${p.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      aria-label={`Eliminar ${p.name}`}
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
                <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar producto' : 'Nuevo producto'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre">
            <input
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Precio rebajado (S/)">
              <input
                required
                type="number"
                min={0}
                step="0.1"
                value={form.price}
                onChange={(e) => set('price', Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Precio original (S/)">
              <input
                required
                type="number"
                min={0}
                step="0.1"
                value={form.originalPrice}
                onChange={(e) => set('originalPrice', Number(e.target.value))}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoría">
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Stock">
              <input
                required
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => set('stock', Number(e.target.value))}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Fecha de vencimiento">
            <input
              required
              type="date"
              value={form.expiryDate}
              onChange={(e) => set('expiryDate', e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="Imagen (URL)">
            <input
              value={form.image}
              onChange={(e) => set('image', e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>

          <Field label="Descripción">
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className={inputCls}
            />
          </Field>

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
              {editing ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
