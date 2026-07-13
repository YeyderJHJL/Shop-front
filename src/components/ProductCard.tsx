import { Link } from 'react-router-dom'
import type { Product } from '../types.ts'
import { formatPrice, formatDate, discountPercent } from '../lib/format.ts'
import AsyncImage from './AsyncImage.tsx'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-outline/60 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative">
        <AsyncImage
          src={product.image}
          alt={product.name}
          className="aspect-square w-full"
        />
        {discountPercent(product.originalPrice, product.price) > 0 && (
          <span className="absolute left-2 top-2 rounded-lg bg-success px-2 py-0.5 text-xs font-bold text-white shadow">
            -{discountPercent(product.originalPrice, product.price)}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">
          {product.category}
        </span>
        <h3 className="line-clamp-2 flex-1 text-sm font-medium text-on-surface group-hover:text-primary">
          {product.name}
        </h3>
        <p className="text-xs text-tertiary">Vence: {formatDate(product.expiryDate)}</p>
        <div className="flex items-baseline gap-2 pt-1">
          <p className="text-lg font-extrabold text-on-surface">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice > product.price && (
            <span className="text-xs text-on-surface-variant line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
