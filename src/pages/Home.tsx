import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, RefreshCw, Search } from 'lucide-react'
import type { Product } from '../types.ts'
import { useData } from '../context/DataContext.tsx'
import ProductCard from '../components/ProductCard.tsx'

type FetchState = 'loading' | 'success' | 'error'

export default function Home() {
  const { products: catalog } = useData()
  const [state, setState] = useState<FetchState>('loading')
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Simulate an async catalog fetch to exercise the sync / error indicators.
  useEffect(() => {
    let cancelled = false
    setState('loading')
    const timer = setTimeout(() => {
      if (cancelled) return
      setProducts(catalog)
      setState('success')
    }, 900)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [reloadKey, catalog])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
  }, [products, query])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search bar */}
      <div className="mx-auto mb-6 max-w-2xl">
        <div className="flex items-center gap-3 rounded-2xl border border-outline bg-white px-4 py-3 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="h-5 w-5 text-on-surface-variant" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full bg-transparent text-base outline-none placeholder:text-on-surface-variant"
          />
        </div>
      </div>

      {/* Sync status bar */}
      <div className="mb-4 h-6">
        {state === 'loading' && (
          <div className="flex items-center justify-center gap-2 text-sm text-on-surface-variant">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Sincronizando catálogo...
          </div>
        )}
        {state === 'success' && (
          <p className="text-center text-sm text-on-surface-variant">
            {filtered.length} producto{filtered.length !== 1 && 's'} disponible
            {filtered.length !== 1 && 's'}
          </p>
        )}
      </div>

      {/* Loading skeletons */}
      {state === 'loading' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-outline/60 bg-white"
            >
              <div className="aspect-square w-full animate-pulse bg-surface-variant" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-1/3 animate-pulse rounded bg-surface-variant" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-surface-variant" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-surface-variant" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state (offline-first retry) */}
      {state === 'error' && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <AlertCircle className="h-12 w-12 text-error" />
          <div>
            <p className="text-lg font-semibold">No se pudo cargar el catálogo</p>
            <p className="text-on-surface-variant">Revisa tu conexión e inténtalo de nuevo.</p>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <RefreshCw className="h-4 w-4" /> Reintentar
          </button>
        </div>
      )}

      {/* Product grid */}
      {state === 'success' && (
        <>
          {filtered.length === 0 ? (
            <p className="py-24 text-center text-on-surface-variant">
              No encontramos resultados para “{query}”.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
