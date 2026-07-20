import type { ReactNode } from 'react'

/** Clases compartidas para inputs, selects y textareas de los formularios admin. */
export const inputCls =
  'w-full rounded-xl border border-outline bg-white px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

/** Etiqueta + control de formulario, usada por todos los modales del panel. */
export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  )
}
