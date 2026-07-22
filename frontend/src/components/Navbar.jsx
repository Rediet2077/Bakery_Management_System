export default function Navbar({ user, title = '', onMenuClick }) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 text-gray-500 hover:text-gray-800"
          aria-label="Open menu"
        >
          <span className="w-5 h-0.5 bg-current rounded" />
          <span className="w-5 h-0.5 bg-current rounded" />
          <span className="w-5 h-0.5 bg-current rounded" />
        </button>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-gray-400 text-sm">Bakery Management System</span>
          {title && (
            <>
              <span className="hidden sm:inline text-gray-300">/</span>
              <span className="text-amber-700 font-medium text-sm">{title}</span>
            </>
          )}
          {/* On mobile show just the title */}
          {title && <span className="sm:hidden text-amber-700 font-semibold text-sm">{title}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <span className="hidden sm:inline text-sm text-gray-600">
          {user?.role === 'admin' ? 'Admin' : `${user?.username}`}
        </span>
        <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
