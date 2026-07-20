import type { Order } from '../types.ts'

// Pedidos simulados que el administrador gestiona desde el panel.
export const ORDERS: Order[] = [
  {
    id: 1001,
    customerName: 'María Quispe',
    customerEmail: 'maria.quispe@gmail.com',
    items: [
      { productId: 1, name: 'Pan de molde integral', price: 3.5, quantity: 2 },
      { productId: 2, name: 'Yogurt natural 1L', price: 4.2, quantity: 1 },
    ],
    total: 11.2,
    status: 'pendiente',
    date: '2026-07-13',
  },
  {
    id: 1002,
    customerName: 'Carlos Mamani',
    customerEmail: 'carlos.mamani@gmail.com',
    items: [
      { productId: 5, name: 'Empanadas de pollo (x4)', price: 6.0, quantity: 1 },
      { productId: 9, name: 'Croissants de mantequilla (x6)', price: 5.5, quantity: 1 },
    ],
    total: 11.5,
    status: 'preparando',
    date: '2026-07-13',
  },
  {
    id: 1003,
    customerName: 'Lucía Flores',
    customerEmail: 'lucia.flores@hotmail.com',
    items: [
      { productId: 4, name: 'Leche entera 1L (pack x6)', price: 12.9, quantity: 1 },
      { productId: 3, name: 'Manzanas rojas (kg)', price: 2.9, quantity: 2 },
    ],
    total: 18.7,
    status: 'entregado',
    date: '2026-07-12',
  },
  {
    id: 1004,
    customerName: 'Juan Turpo',
    customerEmail: 'jturpoan@unsa.edu.pe',
    items: [
      { productId: 11, name: 'Pechuga de pollo (kg)', price: 8.9, quantity: 1 },
      { productId: 12, name: 'Tomates (kg)', price: 2.2, quantity: 1 },
    ],
    total: 11.1,
    status: 'pendiente',
    date: '2026-07-13',
  },
  {
    id: 1005,
    customerName: 'María Quispe',
    customerEmail: 'maria.quispe@gmail.com',
    items: [
      { productId: 6, name: 'Ensalada mixta lista', price: 3.9, quantity: 3 },
    ],
    total: 11.7,
    status: 'cancelado',
    date: '2026-07-11',
  },
]
