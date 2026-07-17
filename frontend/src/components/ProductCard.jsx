// Maps category names to bakery emoji images
const EMOJI_MAP = {
  bread: '🍞',
  cake: '🎂',
  donut: '🍩',
  donuts: '🍩',
  croissant: '🥐',
  muffin: '🧁',
  cupcake: '🧁',
  cookies: '🍪',
  cookie: '🍪',
  pastry: '🥐',
  pastries: '🥐',
  milk: '🥛',
  snack: '🍿',
  snacks: '🍿',
  default: '🥖',
}

function getEmoji(name = '', category = '') {
  const key = (name + ' ' + category).toLowerCase()
  for (const [k, v] of Object.entries(EMOJI_MAP)) {
    if (key.includes(k)) return v
  }
  return EMOJI_MAP.default
}

export default function ProductCard({ product, onAdd }) {
  const emoji = getEmoji(product.name, product.category)

  return (
    <button
      onClick={() => onAdd(product)}
      className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm border border-gray-100
                 hover:border-amber-400 hover:shadow-md transition-all duration-200 active:scale-95"
    >
      <div className="w-16 h-16 bg-amber-50 rounded-xl flex items-center justify-center text-4xl">
        {emoji}
      </div>
      <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{product.name}</span>
      <span className="text-sm font-bold text-amber-700">Birr {parseFloat(product.price).toFixed(2)}</span>
    </button>
  )
}
