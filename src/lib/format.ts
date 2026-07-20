/** Formats a number as Peruvian Soles, e.g. 349.9 -> "S/ 349.90". */
export function formatPrice(value: number): string {
  return `S/ ${value.toFixed(2)}`
}

/** Formats an ISO date (yyyy-mm-dd) as "13 jul 2026". */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Whole days from today until the given ISO date. Negative if already past.
 * Used to flag products that are about to expire.
 */
export function daysUntil(iso: string): number {
  const target = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(target.getTime())) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.round((target.getTime() - today.getTime()) / msPerDay)
}

/** Discount percentage between an original and a reduced price (rounded). */
export function discountPercent(original: number, price: number): number {
  if (original <= 0 || price >= original) return 0
  return Math.round((1 - price / original) * 100)
}
