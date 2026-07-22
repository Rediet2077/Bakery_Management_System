import { useEffect, useState } from 'react'
import { getMe } from '../services/api'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function Settings() {
  const [user, setUser] = useState(null)
  const [saved, setSaved] = useState(false)
  const [shopName, setShopName] = useState(
    () => localStorage.getItem('bms_shop_name') || 'Bakery Management System'
  )
  const [currency, setCurrency] = useState(
    () => localStorage.getItem('bms_currency') || 'Birr'
  )
  const [lowStockThreshold, setLowStockThreshold] = useState(
    () => localStorage.getItem('bms_low_stock') || '10'
  )

  useEffect(() => {
    getMe().then(u => setUser(u)).catch(console.error)
  }, [])

  const handleSave = e => {
    e.preventDefault()
    localStorage.setItem('bms_shop_name', shopName)
    localStorage.setItem('bms_currency', currency)
    localStorage.setItem('bms_low_stock', lowStockThreshold)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} title="Settings" />

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6">Settings</h1>

          <div className="max-w-lg space-y-5">
            {/* General Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">General Settings</h2>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Shop Name</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={e => setShopName(e.target.value)}
                    className="input-field"
                    placeholder="Your bakery name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Currency Label</label>
                  <input
                    type="text"
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Birr"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={lowStockThreshold}
                    onChange={e => setLowStockThreshold(e.target.value)}
                    className="input-field"
                    placeholder="e.g. 10"
                  />
                  <p className="text-xs text-gray-400 mt-1">Products with stock below this number will appear in low stock alerts.</p>
                </div>

                {saved && (
                  <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 font-medium">
                    ✓ Settings saved successfully
                  </div>
                )}

                <button type="submit" className="btn-primary w-full py-2.5">
                  Save Settings
                </button>
              </form>
            </div>

            {/* Admin Profile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">Admin Account</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center py-1 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Username</span>
                  <span className="text-sm font-semibold text-gray-800">{user?.username}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Role</span>
                  <span className="text-sm font-semibold text-gray-800 capitalize">{user?.role}</span>
                </div>
                <div className="mt-2 bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
                  💡 To change your password, update it directly in the database via phpMyAdmin.
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
