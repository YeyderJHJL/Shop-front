import type { User } from '../types.ts'

// Usuarios semilla. Incluye al menos un administrador y varios clientes para
// demostrar los dos tipos de usuario del sistema. AuthContext resuelve el rol
// de quien inicia sesión buscando su correo en esta lista.
export const USERS: User[] = [
  {
    id: 1,
    name: 'Admin Rescate',
    email: 'admin@shop.com',
    role: 'admin',
    status: 'activo',
    joinedAt: '2026-01-05',
  },
  {
    id: 2,
    name: 'Juan Turpo',
    email: 'jturpoan@unsa.edu.pe',
    role: 'cliente',
    status: 'activo',
    joinedAt: '2026-03-12',
  },
  {
    id: 3,
    name: 'María Quispe',
    email: 'maria.quispe@gmail.com',
    role: 'cliente',
    status: 'activo',
    joinedAt: '2026-04-02',
  },
  {
    id: 4,
    name: 'Carlos Mamani',
    email: 'carlos.mamani@gmail.com',
    role: 'cliente',
    status: 'inactivo',
    joinedAt: '2026-04-20',
  },
  {
    id: 5,
    name: 'Lucía Flores',
    email: 'lucia.flores@hotmail.com',
    role: 'cliente',
    status: 'activo',
    joinedAt: '2026-05-15',
  },
  {
    id: 6,
    name: 'Supervisor Tienda',
    email: 'supervisor@shop.com',
    role: 'admin',
    status: 'activo',
    joinedAt: '2026-02-01',
  },
]

/** Correos con rol de administrador, útil para validaciones rápidas. */
export const ADMIN_EMAILS = USERS.filter((u) => u.role === 'admin').map(
  (u) => u.email,
)
