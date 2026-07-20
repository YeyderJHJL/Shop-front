import type { Offer } from '../types.ts'

// Ofertas especiales configurables desde el panel de administración.
export const OFFERS: Offer[] = [
  {
    id: 1,
    title: 'Rescate de panadería',
    description:
      'Descuento extra en todo el pan y bollería del día para evitar que se desperdicie.',
    discountPercent: 40,
    category: 'Panadería',
    active: true,
    startDate: '2026-07-10',
    endDate: '2026-07-31',
  },
  {
    id: 2,
    title: 'Lácteos por vencer',
    description:
      'Yogures, leches y quesos próximos a su fecha preferente a mitad de precio.',
    discountPercent: 50,
    category: 'Lácteos',
    active: true,
    startDate: '2026-07-01',
    endDate: '2026-07-20',
  },
  {
    id: 3,
    title: 'Frutas imperfectas',
    description:
      'Frutas y verduras con imperfecciones estéticas, mismo sabor, menor precio.',
    discountPercent: 30,
    category: 'Frutas y verduras',
    active: true,
    startDate: '2026-07-05',
    endDate: '2026-08-05',
  },
  {
    id: 4,
    title: 'Fin de semana antidesperdicio',
    description:
      'Descuento general en toda la tienda para vaciar excedentes antes del cierre semanal.',
    discountPercent: 20,
    category: 'Todos',
    active: false,
    startDate: '2026-06-20',
    endDate: '2026-06-22',
  },
]
