import { useEffect, useState } from 'react'
import { getMe } from '../services/api'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    getMe()
      .then(u => setUser(u))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="cashier" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar user={user} title="Profile" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6">My Profile</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="max-w-md">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Avatar header */}
                <div className="bg-amber-700 px-6 py-8 flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-amber-700 text-3xl font-bold shadow-md mb-3">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <h2 className="text-white text-xl font-bold">{user?.username}</h2>
                  <span className="mt-1 px-3 py-0.5 bg-amber-600 rounded-full text-amber-100 text-xs font-medium capitalize">
                    {user?.role}
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Username</span>
                    <span className="text-sm font-semibold text-gray-800">{user?.username}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Role</span>
                    <span className="text-sm font-semibold text-gray-800 capitalize">{user?.role}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">User ID</span>
                    <span className="text-sm font-mono text-gray-500">#{String(user?.id || 0).padStart(4, '0')}</span>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
                    💡 To change your password, contact your administrator.
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
