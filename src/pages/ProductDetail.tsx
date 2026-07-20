import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ShoppingCart } from 'lucide-react'
import { useData } from '../context/DataContext.tsx'
import { formatPrice, formatDate, discountPercent } from '../lib/format.ts'
import { useCart } from '../context/CartContext.tsx'
import AsyncImage from '../components/AsyncImage.tsx'
import QuantitySelector from '../components/QuantitySelector.tsx'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { products } = useData()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">Producto no encontrado</p>
        <Link
          to="/"
          className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Volver a la tienda
        </Link>
      </div>
    )
  }

  function handleAdd() {
    if (!product) return
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: large image */}
        <AsyncImage
          src={product.image}
          alt={product.name}
          className="aspect-square w-full rounded-3xl border border-outline/60 shadow-sm"
        />

        {/* Right: info */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            {product.category}
          </span>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-on-surface sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <p className="text-4xl font-extrabold text-on-surface">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-on-surface-variant line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="rounded-lg bg-success-container px-2 py-0.5 text-sm font-semibold text-success">
                  -{discountPercent(product.originalPrice, product.price)}%
                </span>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-tertiary/15 px-3 py-1 font-medium text-tertiary">
              Vence: {formatDate(product.expiryDate)}
            </span>
            <span className="rounded-full bg-surface-variant px-3 py-1 font-medium text-on-surface-variant">
              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-on-surface-variant">
            {product.description}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <span className="font-medium text-on-surface-variant">Cantidad</span>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-lg font-semibold text-white shadow-md transition-colors ${
              added ? 'bg-success' : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {added ? (
              <>
                <Check className="h-5 w-5" /> Agregado al carrito
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" /> Agregar al Carrito
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
