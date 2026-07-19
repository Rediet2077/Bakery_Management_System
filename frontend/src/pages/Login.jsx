import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.username.trim() || !form.password.trim()) {
      return setError('Please enter username and password')
    }
    setLoading(true)
    try {
      const data = await login(form.username, form.password)
      const role = data.user?.role || data.role
      if (role === 'admin') navigate('/admin')
      else navigate('/cashier')
    } catch (e) {
      setError(e.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left – background image panel */}
      <div className="hidden lg:flex w-1/2 bg-amber-900 relative overflow-hidden items-end p-12">
        {/* Bakery background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-amber-800 to-amber-700" />
        {/* Bread pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10">
          <div className="text-6xl mb-6">🥖</div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-3">Bakery<br/>Management<br/>System</h1>
          <p className="text-amber-200 text-sm">© 2024 Bakery Management System</p>
        </div>
      </div>

      {/* Right – login form */}
      <div className="flex-1 flex items-center justify-center bg-amber-50 p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <span className="text-3xl">🥖</span>
            <span className="text-amber-800 font-bold text-xl">Bakery</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back!</h2>
          <p className="text-gray-500 text-sm mb-6">Please login to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="input-field"
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field pr-10"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Logging in...</>
              ) : 'Login'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">© 2024 Bakery Management System</p>
        </div>
      </div>
    </div>
  )
}
