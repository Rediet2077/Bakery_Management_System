import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../services/api'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/inventory', label: 'Products', icon: '🍞' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/sales', label: 'Sales History', icon: '📋' },
  { to: '/admin/reports', label: 'Reports', icon: '📈' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

const cashierLinks = [
  { to: '/cashier', label: 'POS Dashboard', icon: '🛒' },
  { to: '/cashier/sales', label: 'Sales History', icon: '📋' },
  { to: '/cashier/profile', label: 'Profile', icon: '👤' },
]

export default function Sidebar({ role = 'admin' }) {
  const navigate = useNavigate()
  const links = role === 'admin' ? adminLinks : cashierLinks

  const handleLogout = async () => {
    try { await logout() } catch (_) {}
    navigate('/login')
  }

  return (
    <aside className="w-56 min-h-screen bg-amber-900 text-amber-100 flex flex-col shadow-xl">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-amber-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-lg">🥖</div>
          <span className="font-bold text-white text-base">BMS</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(link => (
          <NavLink
            key={link.to + link.label}
            to={link.to}
            end={link.to === '/admin' || link.to === '/cashier'}
            className={({ isActive }) =>
              `sidebar-link text-amber-100 ${isActive ? 'active' : ''}`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-amber-800">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-amber-200 hover:text-white"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
