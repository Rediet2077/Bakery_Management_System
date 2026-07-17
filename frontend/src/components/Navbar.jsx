export default function Navbar({ user, title = '' }) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Bakery Management System</span>
        {title && <><span className="text-gray-300">/</span><span className="text-amber-700 font-medium text-sm">{title}</span></>}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{user?.role === 'admin' ? 'Admin' : `Cashier: ${user?.username}`}</span>
        <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
