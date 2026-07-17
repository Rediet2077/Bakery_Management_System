import { useState } from 'react'
import { createSale } from '../services/api'

export default function Cart({ items, onUpdate, onRemove, onClear, cashierId }) {
  const [received, setReceived] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const receivedNum = parseFloat(received) || 0
  const change = receivedNum - total
  const canCheckout = items.length > 0 && receivedNum >= total

  const handleCheckout = async () => {
    if (!canCheckout) return
    setLoading(true)
    setMsg(null)
    try {
      await createSale({
        cashier_id: cashierId,
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
        received: receivedNum,
      })
      setMsg({ type: 'success', text: `Sale complete! Change: Birr ${change.toFixed(2)}` })
      onClear()
      setReceived('')
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-base font-bold text-gray-800 mb-3">Cart</h2>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {items.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            <div className="text-4xl mb-2">🛒</div>
            <p>Cart is empty</p>
            <p className="text-xs">Click products to add</p>
          </div>
        )}
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{item.name}</p>
              <p className="text-xs text-gray-400">Birr {parseFloat(item.price).toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => onUpdate(item.id, item.quantity - 1)}
                className="w-6 h-6 bg-gray-200 hover:bg-amber-200 rounded text-xs font-bold leading-none"
              >−</button>
              <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
              <button
                onClick={() => onUpdate(item.id, item.quantity + 1)}
                className="w-6 h-6 bg-gray-200 hover:bg-amber-200 rounded text-xs font-bold leading-none"
              >+</button>
              <button
                onClick={() => onRemove(item.id)}
                className="w-6 h-6 bg-red-100 hover:bg-red-200 text-red-500 rounded text-xs ml-1"
              >✕</button>
            </div>
            <span className="text-xs font-bold text-amber-700 ml-2 w-14 text-right">
              Birr {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-3 space-y-2">
        <div className="flex justify-between text-sm font-bold text-gray-800">
          <span>Total</span>
          <span className="text-lg text-amber-700">Birr {total.toFixed(2)}</span>
        </div>

        <div>
          <label className="text-xs text-gray-500 font-medium">Money Received</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={received}
            onChange={e => setReceived(e.target.value)}
            placeholder="0.00"
            className="input-field mt-1"
          />
        </div>

        {received !== '' && (
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-gray-600">Change Due</span>
            <span className={change >= 0 ? 'text-green-600 text-base font-bold' : 'text-red-500'}>
              {change >= 0 ? `Birr ${change.toFixed(2)}` : 'Insufficient'}
            </span>
          </div>
        )}

        {received !== '' && receivedNum < total && (
          <p className="text-xs text-red-500 font-medium">⚠️ Amount received is less than total</p>
        )}

        {msg && (
          <div className={`text-xs p-2 rounded-lg font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {msg.text}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={!canCheckout || loading}
          className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2
            ${canCheckout && !loading
              ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
          ) : (
            <>✓ Complete Sale</>
          )}
        </button>
      </div>
    </div>
  )
}
