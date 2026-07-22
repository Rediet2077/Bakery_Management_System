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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)   // mobile cart drawer

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

  const cartTotal = cartItems.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0)

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) && parseInt(p.stock) > 0
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="cashier" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar user={user} title="POS Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 flex overflow-hidden relative">

          {/* ── Products panel ── */}
          <div className="flex-1 flex flex-col p-3 md:p-5 overflow-hidden min-w-0">
            {/* Search */}
            <div className="relative mb-3">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
                  {filtered.map(p => (
                    <ProductCard key={p.id} product={p} onAdd={addToCart} />
                  ))}
                  {filtered.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-12">
                      <div className="text-4xl mb-2">🔍</div>
                      <p>No products found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Cart panel — desktop sidebar ── */}
          <div className="hidden lg:flex w-72 xl:w-80 bg-white border-l border-gray-200 flex-col p-5 overflow-hidden">
            <Cart
              items={cartItems}
              onUpdate={updateQty}
              onRemove={removeItem}
              onClear={clearCart}
              cashierId={user?.id}
            />
          </div>

          {/* ── Cart drawer — mobile ── */}
          {cartOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setCartOpen(false)}
            />
          )}
          <div className={`
            fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl z-40 flex flex-col p-5 overflow-hidden
            transition-transform duration-300 ease-in-out lg:hidden
            ${cartOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700"
              >✕</button>
            </div>
            <Cart
              items={cartItems}
              onUpdate={updateQty}
              onRemove={removeItem}
              onClear={clearCart}
              cashierId={user?.id}
              onCheckout={() => setCartOpen(false)}
            />
          </div>

        </div>
      </div>

      {/* ── Floating cart button — mobile ── */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-5 right-5 lg:hidden z-20 w-14 h-14 bg-amber-700 hover:bg-amber-800 text-white rounded-full shadow-lg flex items-center justify-center text-2xl"
        aria-label="Open cart"
      >
        🛒
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {cartItems.reduce((s, i) => s + i.quantity, 0)}
          </span>
        )}
      </button>
    </div>
  )
}
