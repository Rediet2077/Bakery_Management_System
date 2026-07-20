import { useEffect, useState } from 'react'
import { getDashboard, getMe } from '../services/api'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboard(), getMe()])
      .then(([d, u]) => { setData(d); setUser(u) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )

  const stats = data?.stats || {}
  const lowStock = data?.low_stock || []
  const chartData = data?.chart || []

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} title="Dashboard" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <StatCard
              label="Today's Revenue"
              value={`Birr ${parseFloat(stats.today_revenue || 0).toFixed(2)}`}
              sub={`${stats.revenue_change >= 0 ? '+' : ''}${stats.revenue_change || 0}% from yesterday`}
              positive={stats.revenue_change >= 0}
              icon="$"
              iconBg="bg-green-100"
            />
            <StatCard
              label="Today's Sales"
              value={stats.today_sales || 0}
              sub={`${stats.sales_change >= 0 ? '+' : ''}${stats.sales_change || 0}% from yesterday`}
              positive={stats.sales_change >= 0}
              icon="b"
              iconBg="bg-blue-100"
            />
            <StatCard
              label="Low Stock Items"
              value={lowStock.length}
              sub={<span className="text-amber-600 text-xs cursor-pointer hover:underline">View Details</span>}
              icon="A"
              iconBg="bg-orange-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Low Stock Alerts */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Low Stock Alerts</h3>
              {lowStock.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">All stock levels are good ✓</p>
              ) : (
                <div className="space-y-2">
                  {lowStock.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        item.stock <= 2 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {item.stock} items left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sales Chart */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Sales Overview (This Week)</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                      formatter={(val) => [`Birr ${val}`, 'Revenue']}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#c47b22"
                      strokeWidth={2.5}
                      dot={{ fill: '#c47b22', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                  No sales data yet
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, positive, icon, iconBg }) {
  return (
    <div className="stat-card flex items-start gap-4">
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className={`text-xs mt-0.5 ${positive === false ? 'text-red-500' : positive === true ? 'text-green-600' : 'text-gray-400'}`}>
          {sub}
        </p>
      </div>
    </div>
  )
}
