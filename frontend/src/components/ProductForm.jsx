import { useState, useEffect } from 'react'

const CATEGORIES = ['Bread', 'Cake', 'Donuts', 'Pastries', 'Cookies', 'Snacks', 'Drinks', 'Other']

export default function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Bread',
    price: '',
    stock: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
      })
    }
  }, [product])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Product name is required')
    if (!form.price || parseFloat(form.price) <= 0) return setError('Price must be greater than 0')
    if (!form.stock || parseInt(form.stock) < 0) return setError('Stock cannot be negative')
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. Chocolate Cake" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Price (Birr) *</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Stock *</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="input-field" placeholder="0" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary py-2.5">
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
