import type { Product } from '../types.ts'

// Catálogo simulado de alimentos próximos a vencer o excedentes, ofrecidos a
// precio rebajado para reducir el desperdicio. Las imágenes se sirven desde un
// CDN de placeholders para ejercitar los estados de carga de AsyncImage.
export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Pan de molde integral',
    price: 3.5,
    originalPrice: 6.9,
    category: 'Panadería',
    description:
      'Pan de molde integral artesanal, ideal para tostadas y sándwiches. Excedente de producción del día en perfecto estado.',
    image: 'https://picsum.photos/seed/bread/600/600',
    stock: 12,
    expiryDate: '2026-07-16',
  },
  {
    id: 2,
    name: 'Yogurt natural 1L',
    price: 4.2,
    originalPrice: 7.5,
    category: 'Lácteos',
    description:
      'Yogurt natural sin azúcar añadida, rico en probióticos. Próximo a su fecha de consumo preferente pero en óptimas condiciones.',
    image: 'https://picsum.photos/seed/yogurt/600/600',
    stock: 8,
    expiryDate: '2026-07-15',
  },
  {
    id: 3,
    name: 'Manzanas rojas (kg)',
    price: 2.9,
    originalPrice: 5.0,
    category: 'Frutas y verduras',
    description:
      'Manzanas rojas frescas con pequeñas imperfecciones estéticas. Perfectas para jugos, postres o consumo directo.',
    image: 'https://picsum.photos/seed/apples/600/600',
    stock: 25,
    expiryDate: '2026-07-20',
  },
  {
    id: 4,
    name: 'Leche entera 1L (pack x6)',
    price: 12.9,
    originalPrice: 21.0,
    category: 'Lácteos',
    description:
      'Pack de 6 cajas de leche entera UHT. Excedente de inventario con vencimiento cercano, ideal para familias.',
    image: 'https://picsum.photos/seed/milk/600/600',
    stock: 6,
    expiryDate: '2026-07-28',
  },
  {
    id: 5,
    name: 'Empanadas de pollo (x4)',
    price: 6.0,
    originalPrice: 12.0,
    category: 'Comida preparada',
    description:
      'Cuatro empanadas de pollo horneadas hoy. Sobrante del mostrador, listas para calentar y servir.',
    image: 'https://picsum.photos/seed/empanada/600/600',
    stock: 10,
    expiryDate: '2026-07-14',
  },
  {
    id: 6,
    name: 'Ensalada mixta lista',
    price: 3.9,
    originalPrice: 8.0,
    category: 'Comida preparada',
    description:
      'Ensalada fresca de hojas verdes, tomate y zanahoria, empacada hoy. Consumir dentro de las próximas 24 horas.',
    image: 'https://picsum.photos/seed/salad/600/600',
    stock: 5,
    expiryDate: '2026-07-14',
  },
  {
    id: 7,
    name: 'Queso fresco 500g',
    price: 7.5,
    originalPrice: 13.0,
    category: 'Lácteos',
    description:
      'Queso fresco artesanal de 500 gramos. Próximo a vencer, ideal para el desayuno o para preparaciones al horno.',
    image: 'https://picsum.photos/seed/cheese/600/600',
    stock: 9,
    expiryDate: '2026-07-18',
  },
  {
    id: 8,
    name: 'Plátanos maduros (kg)',
    price: 1.9,
    originalPrice: 3.8,
    category: 'Frutas y verduras',
    description:
      'Plátanos maduros perfectos para batidos, panqueques o pan de plátano. Excedente que no puede esperar más días en góndola.',
    image: 'https://picsum.photos/seed/banana/600/600',
    stock: 18,
    expiryDate: '2026-07-15',
  },
  {
    id: 9,
    name: 'Croissants de mantequilla (x6)',
    price: 5.5,
    originalPrice: 11.0,
    category: 'Panadería',
    description:
      'Media docena de croissants de mantequilla horneados esta mañana. Sobrante del día, crujientes y frescos.',
    image: 'https://picsum.photos/seed/croissant/600/600',
    stock: 7,
    expiryDate: '2026-07-14',
  },
  {
    id: 10,
    name: 'Jugo de naranja 1.5L',
    price: 4.0,
    originalPrice: 7.9,
    category: 'Bebidas',
    description:
      'Jugo de naranja 100% natural, sin conservantes. Vencimiento preferente cercano, refrigerar tras la compra.',
    image: 'https://picsum.photos/seed/juice/600/600',
    stock: 14,
    expiryDate: '2026-07-19',
  },
  {
    id: 11,
    name: 'Pechuga de pollo (kg)',
    price: 8.9,
    originalPrice: 15.5,
    category: 'Carnes',
    description:
      'Pechuga de pollo fresca refrigerada. Excedente del día con precio rebajado, consumir o congelar pronto.',
    image: 'https://picsum.photos/seed/chicken/600/600',
    stock: 4,
    expiryDate: '2026-07-15',
  },
  {
    id: 12,
    name: 'Tomates (kg)',
    price: 2.2,
    originalPrice: 4.5,
    category: 'Frutas y verduras',
    description:
      'Tomates maduros ideales para salsas y guisos. Ligeras marcas estéticas, sabor intacto.',
    image: 'https://picsum.photos/seed/tomato/600/600',
    stock: 20,
    expiryDate: '2026-07-17',
  },
]

/** Categorías disponibles para clasificar productos y ofertas. */
export const CATEGORIES = [
  'Panadería',
  'Lácteos',
  'Frutas y verduras',
  'Comida preparada',
  'Bebidas',
  'Carnes',
] as const
