import { useEffect, useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct, getMe } from '../services/api'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import ProductForm from '../components/ProductForm'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [msg, setMsg] = useState(null)

  const load = () => {
    setLoading(true)
    Promise.all([getProducts(), getMe()])
      .then(([p, u]) => { setProducts(p); setUser(u) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSave = async (form) => {
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, form)
        setMsg({ type: 'success', text: 'Product updated successfully' })
      } else {
        await createProduct(form)
        setMsg({ type: 'success', text: 'Product added successfully' })
      }
      setShowForm(false)
      setEditProduct(null)
      load()
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    }
    setTimeout(() => setMsg(null), 3000)
  }

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      setMsg({ type: 'success', text: 'Product deleted' })
      load()
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    }
    setDeleteId(null)
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} title="Products" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-bold text-gray-800">Products</h1>
            <button onClick={() => { setEditProduct(null); setShowForm(true) }} className="btn-primary flex items-center gap-2">
              <span>+</span> Add Product
            </button>
          </div>

          {msg && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {msg.text}
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header w-12">ID</th>
                    <th className="table-header">Name</th>
                    <th className="table-header">Category</th>
                    <th className="table-header">Price</th>
                    <th className="table-header">Stock</th>
                    <th className="table-header w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </div>
                    </td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No products yet. Add one!</td></tr>
                  ) : products.map(p => (
                    <tr key={p.id} className="table-row">
                      <td className="table-cell text-gray-400">{p.id}</td>
                      <td className="table-cell font-semibold text-gray-800">{p.name}</td>
                      <td className="table-cell">
                        <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">{p.category}</span>
                      </td>
                      <td className="table-cell font-semibold text-amber-700">Birr {parseFloat(p.price).toFixed(2)}</td>
                      <td className="table-cell">
                        <span className={`font-semibold ${parseInt(p.stock) <= 5 ? 'text-red-500' : 'text-green-600'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditProduct(p); setShowForm(true) }}
                            className="w-7 h-7 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs flex items-center justify-center"
                            title="Edit"
                          >✏️</button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="w-7 h-7 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs flex items-center justify-center"
                            title="Delete"
                          >🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editProduct}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditProduct(null) }}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
