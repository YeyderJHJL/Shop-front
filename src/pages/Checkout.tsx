import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, PartyPopper } from 'lucide-react'
import { useCart } from '../context/CartContext.tsx'
import { formatPrice } from '../lib/format.ts'

const FREE_SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 15

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [confirmed, setConfirmed] = useState(false)

  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const shipping = freeShipping ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  // Success view after confirming the order.
  if (confirmed) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <CheckCircle className="h-24 w-24 text-success" />
        <div>
          <h1 className="text-3xl font-extrabold">¡Pedido confirmado!</h1>
          <p className="mt-2 text-on-surface-variant">
            Gracias por tu compra. Recibirás un correo con los detalles de tu
            pedido y el seguimiento del envío.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-2xl bg-primary px-8 py-4 font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
        >
          Volver a la tienda
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">No hay nada que confirmar</p>
        <Link
          to="/"
          className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Ir a la tienda
        </Link>
      </div>
    )
  }

  function handleConfirm() {
    clearCart()
    setConfirmed(true)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">Finalizar compra</h1>

      <div className="rounded-2xl border border-outline/60 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Resumen del pedido</h2>

        <ul className="divide-y divide-outline/60">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between py-3">
              <span className="text-on-surface-variant">
                {item.name}{' '}
                <span className="text-sm">× {item.quantity}</span>
              </span>
              <span className="font-medium">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-2 border-t border-outline/60 pt-4">
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal</span>
            <span className="font-medium text-on-surface">
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Envío</span>
            {freeShipping ? (
              <span className="font-semibold text-success">Gratis</span>
            ) : (
              <span className="font-medium text-on-surface">
                {formatPrice(shipping)}
              </span>
            )}
          </div>
        </div>

        {freeShipping ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-success-container px-4 py-3 text-sm font-medium text-success">
            <PartyPopper className="h-5 w-5 shrink-0" />
            ¡Felicidades! Tu compra califica para envío gratis.
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-surface-variant px-4 py-3 text-sm text-on-surface-variant">
            Agrega {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} más para
            obtener envío gratis.
          </p>
        )}

        <div className="mt-4 flex justify-between border-t border-outline/60 pt-4 text-lg">
          <span className="font-semibold">Total</span>
          <span className="font-extrabold">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 rounded-2xl bg-primary px-6 py-4 font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
        >
          Confirmar Pedido
        </button>
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="flex-1 rounded-2xl border border-primary px-6 py-4 font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          Volver al carrito
        </button>
      </div>
    </div>
  )
}
