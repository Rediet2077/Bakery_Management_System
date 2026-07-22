import { useEffect, useState } from 'react'
import { getDashboard, getSales, getMe } from '../services/api'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#c47b22', '#e5a44c', '#f0c070', '#d4956a', '#a85d18', '#7a3f0a']

export default function Reports() {
  const [data, setData] = useState(null)
  const [sales, setSales] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    Promise.all([getDashboard(), getSales(), getMe()])
      .then(([d, s, u]) => { setData(d); setSales(s); setUser(u) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" open={false} onClose={() => {}} />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )

  const chartData = data?.chart || []
  const stats = data?.stats || {}
  const totalRevenue = sales.reduce((s, i) => s + parseFloat(i.total_amount), 0)
  const avgSale = sales.length > 0 ? totalRevenue / sales.length : 0

  // Cashier performance
  const cashierMap = {}
  sales.forEach(s => {
    if (!cashierMap[s.cashier_name]) cashierMap[s.cashier_name] = { name: s.cashier_name, sales: 0, revenue: 0 }
    cashierMap[s.cashier_name].sales++
    cashierMap[s.cashier_name].revenue += parseFloat(s.total_amount)
  })
  const cashierData = Object.values(cashierMap)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar user={user} title="Reports" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-5 md:mb-6">Reports & Analytics</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryCard icon="💰" label="Total Revenue" value={`Birr ${totalRevenue.toFixed(2)}`} bg="bg-green-50" color="text-green-700" />
            <SummaryCard icon="🛒" label="Total Sales" value={sales.length} bg="bg-blue-50" color="text-blue-700" />
            <SummaryCard icon="📊" label="Avg. Sale Value" value={`Birr ${avgSale.toFixed(2)}`} bg="bg-amber-50" color="text-amber-700" />
            <SummaryCard icon="👥" label="Active Cashiers" value={cashierData.length} bg="bg-purple-50" color="text-purple-700" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Weekly Revenue Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Weekly Revenue (Birr)</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                      formatter={(val) => [`Birr ${val}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#c47b22" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
              )}
            </div>

            {/* Cashier Revenue Pie */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Revenue by Cashier</h3>
              {cashierData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={cashierData}
                      dataKey="revenue"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {cashierData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [`Birr ${parseFloat(val).toFixed(2)}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
              )}
            </div>
          </div>

          {/* Cashier Performance Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Cashier Performance</h3>
            {cashierData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No sales data yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="table-header">Cashier</th>
                      <th className="table-header">Total Sales</th>
                      <th className="table-header">Total Revenue</th>
                      <th className="table-header">Avg. per Sale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashierData.sort((a, b) => b.revenue - a.revenue).map(c => (
                      <tr key={c.name} className="table-row">
                        <td className="table-cell font-semibold text-gray-800">{c.name}</td>
                        <td className="table-cell text-gray-600">{c.sales}</td>
                        <td className="table-cell font-bold text-amber-700">Birr {c.revenue.toFixed(2)}</td>
                        <td className="table-cell text-gray-600">Birr {(c.revenue / c.sales).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function SummaryCard({ icon, label, value, bg, color }) {
  return (
    <div className={`${bg} rounded-xl p-4 flex items-center gap-3`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  )
}
