import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import CashierDashboard from './pages/CashierDashboard'
import Inventory from './pages/Inventory'
import Users from './pages/Users'
import SalesHistory from './pages/SalesHistory'
import SaleDetail from './pages/SaleDetail'
import CashierSalesHistory from './pages/CashierSalesHistory'
import Profile from './pages/Profile'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/inventory" element={
          <ProtectedRoute role="admin"><Inventory /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute role="admin"><Users /></ProtectedRoute>
        } />
        <Route path="/admin/sales" element={
          <ProtectedRoute role="admin"><SalesHistory /></ProtectedRoute>
        } />
        <Route path="/admin/sales/:id" element={
          <ProtectedRoute role="admin"><SaleDetail /></ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute role="admin"><Reports /></ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute role="admin"><Settings /></ProtectedRoute>
        } />

        {/* Cashier Routes */}
        <Route path="/cashier" element={
          <ProtectedRoute role="cashier"><CashierDashboard /></ProtectedRoute>
        } />
        <Route path="/cashier/sales" element={
          <ProtectedRoute role="cashier"><CashierSalesHistory /></ProtectedRoute>
        } />
        <Route path="/cashier/profile" element={
          <ProtectedRoute role="cashier"><Profile /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
