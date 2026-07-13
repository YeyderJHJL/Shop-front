import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  size?: 'sm' | 'md'
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  size = 'md',
}: QuantitySelectorProps) {
  const btn =
    size === 'sm'
      ? 'h-8 w-8'
      : 'h-10 w-10'
  const label = size === 'sm' ? 'w-8 text-base' : 'w-12 text-lg'

  return (
    <div className="inline-flex items-center rounded-xl border border-outline bg-white">
      <button
        type="button"
        aria-label="Disminuir cantidad"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={`${btn} flex items-center justify-center rounded-l-xl text-secondary transition-colors hover:bg-surface-variant disabled:opacity-40`}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className={`${label} text-center font-bold tabular-nums`}>{value}</span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        onClick={() => onChange(value + 1)}
        className={`${btn} flex items-center justify-center rounded-r-xl text-primary transition-colors hover:bg-surface-variant`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
