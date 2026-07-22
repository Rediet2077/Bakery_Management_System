import { useEffect, useState } from 'react'
import { getSales, getMe } from '../services/api'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function CashierSalesHistory() {
  const [sales, setSales] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    Promise.all([getSales(from, to), getMe()])
      .then(([s, u]) => {
        // Filter to show only this cashier's sales
        setSales(s.filter(sale => sale.cashier_name === u.username))
        setUser(u)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleFilter = e => { e.preventDefault(); load() }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="cashier" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar user={user} title="My Sales History" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 mb-5">
            <h1 className="text-xl font-bold text-gray-800">My Sales History</h1>
            <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">From</span>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="input-field w-36" />
              <span className="text-sm text-gray-500">To</span>
              <input type="date" value={to} onChange={e => setTo(e.target.value)} className="input-field w-36" />
              <button type="submit" className="btn-primary">Filter</button>
            </form>
          </div>

          {/* Summary */}
          {!loading && sales.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">🛒</div>
                <div>
                  <p className="text-xs text-gray-500">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-800">{sales.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">💰</div>
                <div>
                  <p className="text-xs text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-amber-700">
                    Birr {sales.reduce((s, i) => s + parseFloat(i.total_amount), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">ID</th>
                    <th className="table-header">Total Amount</th>
                    <th className="table-header">Amount Received</th>
                    <th className="table-header">Change Given</th>
                    <th className="table-header">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </div>
                    </td></tr>
                  ) : sales.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-gray-400">No sales found</td></tr>
                  ) : sales.map(s => (
                    <tr key={s.id} className="table-row">
                      <td className="table-cell font-mono text-gray-500">#{String(s.id).padStart(4, '0')}</td>
                      <td className="table-cell font-bold text-amber-700">Birr {parseFloat(s.total_amount).toFixed(2)}</td>
                      <td className="table-cell text-gray-600">Birr {parseFloat(s.received).toFixed(2)}</td>
                      <td className="table-cell text-green-600">Birr {parseFloat(s.change_given).toFixed(2)}</td>
                      <td className="table-cell text-gray-500 text-xs">
                        {new Date(s.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
