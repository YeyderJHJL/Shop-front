import { useState } from 'react'
import type { FormEvent } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useData } from '../../context/DataContext.tsx'
import type { Offer } from '../../types.ts'
import { CATEGORIES } from '../../data/products.ts'
import { formatDate } from '../../lib/format.ts'
import Modal from '../../components/admin/Modal.tsx'
import { Field, inputCls } from '../../components/admin/FormField.tsx'

type FormState = Omit<Offer, 'id'>

const EMPTY: FormState = {
  title: '',
  description: '',
  discountPercent: 10,
  category: 'Todos',
  active: true,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
}

export default function AdminOffers() {
  const { offers, addOffer, updateOffer, deleteOffer } = useData()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Offer | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  function openEdit(o: Offer) {
    setEditing(o)
    const { id: _id, ...rest } = o
    void _id
    setForm(rest)
    setModalOpen(true)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (editing) updateOffer(editing.id, form)
    else addOffer(form)
    setModalOpen(false)
  }

  function handleDelete(o: Offer) {
    if (window.confirm(`¿Eliminar la oferta "${o.title}"?`)) deleteOffer(o.id)
  }

  function toggleActive(o: Offer) {
    const { id: _id, ...rest } = o
    void _id
    updateOffer(o.id, { ...rest, active: !o.active })
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Ofertas</h1>
          <p className="text-on-surface-variant">
            {offers.filter((o) => o.active).length} activa(s) de {offers.length}.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-5 w-5" /> Nueva oferta
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {offers.map((o) => (
          <div
            key={o.id}
            className="flex flex-col rounded-2xl border border-outline/60 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-on-surface">{o.title}</h3>
                <span className="text-xs text-on-surface-variant">{o.category}</span>
              </div>
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-extrabold text-primary">
                -{o.discountPercent}%
              </span>
            </div>
            <p className="mt-2 flex-1 text-sm text-on-surface-variant">
              {o.description}
            </p>
            <p className="mt-3 text-xs text-on-surface-variant">
              {formatDate(o.startDate)} → {formatDate(o.endDate)}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleActive(o)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  o.active
                    ? 'bg-success-container text-success'
                    : 'bg-surface-variant text-on-surface-variant'
                }`}
              >
                {o.active ? 'Activa' : 'Inactiva'}
              </button>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(o)}
                  aria-label={`Editar ${o.title}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(o)}
                  aria-label={`Eliminar ${o.title}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-error-container hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {offers.length === 0 && (
          <p className="col-span-full py-10 text-center text-on-surface-variant">
            No hay ofertas configuradas.
          </p>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar oferta' : 'Nueva oferta'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Título">
            <input
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
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
          <div className="grid grid-cols-2 gap-4">
            <Field label="Descuento (%)">
              <input
                required
                type="number"
                min={0}
                max={100}
                value={form.discountPercent}
                onChange={(e) => set('discountPercent', Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Categoría">
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className={inputCls}
              >
                <option value="Todos">Todos</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Inicio">
              <input
                required
                type="date"
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Fin">
              <input
                required
                type="date"
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set('active', e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm font-medium text-on-surface">Oferta activa</span>
          </label>
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
              {editing ? 'Guardar cambios' : 'Crear oferta'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
