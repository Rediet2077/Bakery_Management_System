import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSaleDetail, getMe } from '../services/api'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function SaleDetail() {
  const { id } = useParams()
  const [sale, setSale] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getSaleDetail(id), getMe()])
      .then(([s, u]) => { setSale(s); setUser(u) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} title="Sale Details" />

        <main className="flex-1 overflow-y-auto p-6">
          <button
            onClick={() => navigate('/admin/sales')}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-800 text-sm font-medium mb-5"
          >
            ← Back to Sales
          </button>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !sale ? (
            <div className="text-center text-gray-400 py-20">Sale not found</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sale info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Sale Information</h2>
                <div className="space-y-3">
                  <InfoRow label="Sale ID:" value={`#${String(sale.id).padStart(4, '0')}`} />
                  <InfoRow label="Cashier:" value={sale.cashier_name} />
                  <InfoRow label="Date:" value={new Date(sale.created_at).toLocaleString()} />
                  <InfoRow label="Total Amount:" value={`Birr ${parseFloat(sale.total_amount).toFixed(2)}`} bold />
                  <InfoRow label="Amount Received:" value={`Birr ${parseFloat(sale.received).toFixed(2)}`} />
                  <InfoRow label="Change Given:" value={`Birr ${parseFloat(sale.change_given).toFixed(2)}`} green />
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Items</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">ID</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Product</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Price</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Qty</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(sale.items || []).map((item, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-2.5 text-sm text-gray-400">{i + 1}</td>
                        <td className="py-2.5 text-sm font-medium text-gray-800">{item.product_name}</td>
                        <td className="py-2.5 text-sm text-gray-600">Birr {parseFloat(item.price).toFixed(2)}</td>
                        <td className="py-2.5 text-sm text-gray-600">{item.quantity}</td>
                        <td className="py-2.5 text-sm font-bold text-amber-700">Birr {(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function InfoRow({ label, value, bold, green }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-50">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium ${bold ? 'text-amber-700 font-bold text-base' : green ? 'text-green-600' : 'text-gray-800'}`}>
        {value}
      </span>
    </div>
  )
}
