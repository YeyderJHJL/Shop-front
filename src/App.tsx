import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Home from './pages/Home.tsx'
import ProductDetail from './pages/ProductDetail.tsx'
import Cart from './pages/Cart.tsx'
import Checkout from './pages/Checkout.tsx'
import Profile from './pages/Profile.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import RequireAdmin from './components/admin/RequireAdmin.tsx'
import AdminLayout from './components/admin/AdminLayout.tsx'
import AdminDashboard from './pages/admin/AdminDashboard.tsx'
import AdminProducts from './pages/admin/AdminProducts.tsx'
import AdminUsers from './pages/admin/AdminUsers.tsx'
import AdminOffers from './pages/admin/AdminOffers.tsx'
import AdminOrders from './pages/admin/AdminOrders.tsx'

export default function App() {
  return (
    <Routes>
      {/* Aplicación de clientes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Panel de administración (protegido por rol) */}
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/productos" element={<AdminProducts />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          <Route path="/admin/ofertas" element={<AdminOffers />} />
          <Route path="/admin/pedidos" element={<AdminOrders />} />
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}
