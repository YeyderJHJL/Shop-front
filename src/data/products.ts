/**
 * Categorías disponibles para clasificar productos y ofertas en el panel.
 * (Los datos reales de productos ahora provienen del backend vía `lib/api.ts`;
 * esta lista sólo alimenta los selectores de categoría de los formularios.)
 */
export const CATEGORIES = [
  'Panadería',
  'Lácteos',
  'Frutas y verduras',
  'Comida preparada',
  'Bebidas',
  'Carnes',
] as const
