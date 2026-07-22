import { useEffect, useState } from 'react'
import { getSales, getMe, deleteSale } from '../services/api'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function SalesHistory() {
  const [sales, setSales] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    Promise.all([getSales(from, to), getMe()])
      .then(([s, u]) => { setSales(s); setUser(u) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleFilter = e => { e.preventDefault(); load() }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deleteSale(id)
      setSales(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      alert(err.message || 'Failed to delete sale.')
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} title="Sales History" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <h1 className="text-xl font-bold text-gray-800">Sales History</h1>
            {/* Date filter */}
            <form onSubmit={handleFilter} className="flex items-center gap-2">
              <span className="text-sm text-gray-500">From</span>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="input-field w-36" />
              <span className="text-sm text-gray-500">To</span>
              <input type="date" value={to} onChange={e => setTo(e.target.value)} className="input-field w-36" />
              <button type="submit" className="btn-primary">Filter</button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">ID</th>
                    <th className="table-header">Cashier</th>
                    <th className="table-header">Total Amount</th>
                    <th className="table-header">Amount Received</th>
                    <th className="table-header">Change Given</th>
                    <th className="table-header">Date</th>
                    <th className="table-header">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </div>
                    </td></tr>
                  ) : sales.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">No sales found</td></tr>
                  ) : sales.map(s => (
                    <tr
                      key={s.id}
                      className="table-row"
                    >
                      <td
                        className="table-cell font-mono text-gray-500 cursor-pointer"
                        onClick={() => navigate(`/admin/sales/${s.id}`)}
                      >
                        #{String(s.id).padStart(4, '0')}
                      </td>
                      <td
                        className="table-cell font-semibold text-gray-800 cursor-pointer"
                        onClick={() => navigate(`/admin/sales/${s.id}`)}
                      >
                        {s.cashier_name}
                      </td>
                      <td
                        className="table-cell font-bold text-amber-700 cursor-pointer"
                        onClick={() => navigate(`/admin/sales/${s.id}`)}
                      >
                        Birr {parseFloat(s.total_amount).toFixed(2)}
                      </td>
                      <td
                        className="table-cell text-gray-600 cursor-pointer"
                        onClick={() => navigate(`/admin/sales/${s.id}`)}
                      >
                        Birr {parseFloat(s.received).toFixed(2)}
                      </td>
                      <td
                        className="table-cell text-green-600 cursor-pointer"
                        onClick={() => navigate(`/admin/sales/${s.id}`)}
                      >
                        Birr {parseFloat(s.change_given).toFixed(2)}
                      </td>
                      <td
                        className="table-cell text-gray-500 text-xs cursor-pointer"
                        onClick={() => navigate(`/admin/sales/${s.id}`)}
                      >
                        {new Date(s.created_at).toLocaleString()}
                      </td>
                      <td className="table-cell">
                        {confirmId === s.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Sure?</span>
                            <button
                              onClick={() => handleDelete(s.id)}
                              disabled={deletingId === s.id}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              {deletingId === s.id ? '...' : 'Yes'}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(s.id)}
                            className="px-3 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        )}
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
