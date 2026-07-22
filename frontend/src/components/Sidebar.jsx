import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../services/api'

const adminLinks = [
  { to: '/admin',           label: 'Dashboard',     icon: '', end: true },
  { to: '/admin/inventory', label: 'Products',       icon: '', end: false },
  { to: '/admin/users',     label: 'Users',          icon: '', end: false },
  { to: '/admin/sales',     label: 'Sales History',  icon: '', end: false },
  { to: '/admin/reports',   label: 'Reports',        icon: '', end: false },
  { to: '/admin/settings',  label: 'Settings',       icon: '', end: false },
]

const cashierLinks = [
  { to: '/cashier',        label: 'POS Dashboard', icon: '', end: true },
  { to: '/cashier/sales',  label: 'Sales History', icon: '', end: false },
  { to: '/cashier/profile',label: 'Profile',       icon: '', end: false },
]

export default function Sidebar({ role = 'admin', open, onClose }) {
  const navigate = useNavigate()
  const links = role === 'admin' ? adminLinks : cashierLinks

  const handleLogout = async () => {
    try { await logout() } catch (_) {}
    onClose?.()
    navigate('/login')
  }

  const handleLinkClick = () => onClose?.()

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-56 bg-amber-900 text-amber-100 flex flex-col shadow-xl z-40
        transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:h-auto lg:min-h-screen lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-lg">🍞</div>
            <span className="font-bold text-white text-base">BMS</span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 flex items-center justify-center text-amber-300 hover:text-white"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {links.map(link => (
            <NavLink
              key={link.to + link.label}
              to={link.to}
              end={link.end}
              onClick={handleLinkClick}
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
    </>
  )
}
