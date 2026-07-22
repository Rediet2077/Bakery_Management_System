import { useEffect, useState } from 'react'
import { getDashboard, getMe } from '../services/api'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getDashboard(), getMe()])
      .then(([d, u]) => { setData(d); setUser(u) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )

  const stats     = data?.stats    || {}
  const lowStock  = data?.low_stock || []
  const chartData = data?.chart    || []

  const revenueUp   = stats.revenue_change > 0
  const revNeutral  = stats.today_revenue === 0 && stats.revenue_change === 0
  const salesUp     = stats.sales_change > 0
  const salesNeutral = stats.today_sales === 0 && stats.sales_change === 0

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar user={user} title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* Stat Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5 mb-5 md:mb-6">
            <StatCard
              label="Today's Revenue"
              value={`Birr ${parseFloat(stats.today_revenue || 0).toFixed(2)}`}
              sub={revNeutral ? 'No sales yet' : `${stats.revenue_change >= 0 ? '+' : ''}${stats.revenue_change}% vs yesterday`}
              positive={revNeutral ? null : revenueUp}
              icon="💵"
              iconBg="bg-green-100"
            />
            <StatCard
              label="Today's Sales"
              value={stats.today_sales || 0}
              sub={salesNeutral ? 'No transactions' : `${stats.sales_change >= 0 ? '+' : ''}${stats.sales_change}% vs yesterday`}
              positive={salesNeutral ? null : salesUp}
              icon="🛒"
              iconBg="bg-blue-100"
            />
            <StatCard
              label="Total Products"
              value={stats.total_products ?? '—'}
              sub="in inventory"
              positive={null}
              icon="🧁"
              iconBg="bg-amber-100"
              onClick={() => navigate('/admin/inventory')}
            />
            <StatCard
              label="Active Cashiers"
              value={stats.total_cashiers ?? '—'}
              sub="registered"
              positive={null}
              icon="👤"
              iconBg="bg-purple-100"
              onClick={() => navigate('/admin/users')}
            />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">

            {/* Low Stock Alerts */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Low Stock Alerts</h3>
                {lowStock.length > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                    {lowStock.length}
                  </span>
                )}
              </div>
              {lowStock.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">All stock levels are good ✓</p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {lowStock.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700 truncate">{item.name}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${
                        item.stock <= 2 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {item.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sales Chart */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
              <h3 className="font-bold text-gray-800 mb-4">Sales Overview (This Week)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#c47b22" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#c47b22" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={45} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                    formatter={(val) => [`Birr ${parseFloat(val).toFixed(2)}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#c47b22"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                    dot={{ fill: '#c47b22', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, positive, icon, iconBg, onClick }) {
  return (
    <div
      className={`stat-card flex items-start gap-3 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className={`w-10 h-10 md:w-12 md:h-12 ${iconBg} rounded-xl flex items-center justify-center text-xl md:text-2xl flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium mb-0.5 leading-tight">{label}</p>
        <p className="text-lg md:text-2xl font-bold text-gray-800 leading-tight">{value}</p>
        <p className={`text-xs mt-0.5 leading-tight ${
          positive === true  ? 'text-green-600' :
          positive === false ? 'text-red-500'   : 'text-gray-400'
        }`}>
          {sub}
        </p>
      </div>
    </div>
  )
}
