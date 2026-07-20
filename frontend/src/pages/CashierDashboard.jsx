import { useEffect, useState } from 'react'
import { getProducts, getMe } from '../services/api'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import Cart from '../components/Cart'

export default function CashierDashboard() {
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getMe()])
      .then(([p, u]) => { setProducts(p); setUser(u) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeItem(id)
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const removeItem = (id) => setCartItems(prev => prev.filter(i => i.id !== id))

  const clearCart = () => setCartItems([])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) && parseInt(p.stock) > 0
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="cashier" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} title="POS Dashboard" />

        <div className="flex-1 flex overflow-hidden">
          {/* Products panel */}
          <div className="flex-1 flex flex-col p-5 overflow-hidden">
            {/* Search */}
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9"
              />
            </div>

            <h2 className="text-sm font-bold text-gray-700 mb-3">Products</h2>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                  {filtered.map(p => (
                    <ProductCard key={p.id} product={p} onAdd={addToCart} />
                  ))}
                  {filtered.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-12">
                      <div className="text-4xl mb-2"></div>
                      <p>No products found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart panel */}
          <div className="w-72 xl:w-80 bg-white border-l border-gray-200 flex flex-col p-5 overflow-hidden">
            <Cart
              items={cartItems}
              onUpdate={updateQty}
              onRemove={removeItem}
              onClear={clearCart}
              cashierId={user?.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
