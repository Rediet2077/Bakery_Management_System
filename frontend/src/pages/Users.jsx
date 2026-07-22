import { useEffect, useState } from 'react'
import { getUsers, createUser, deleteUser, getMe } from '../services/api'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function Users() {
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [form, setForm] = useState({ username: '', password: '', role: 'cashier' })
  const [formError, setFormError] = useState('')
  const [msg, setMsg] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([getUsers(), getMe()])
      .then(([u, me]) => { setUsers(u); setUser(me) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async e => {
    e.preventDefault()
    setFormError('')
    if (!form.username.trim()) return setFormError('Username is required')
    if (form.password.length < 6) return setFormError('Password must be at least 6 characters')
    try {
      await createUser(form)
      setMsg({ type: 'success', text: 'User created successfully' })
      setShowForm(false)
      setForm({ username: '', password: '', role: 'cashier' })
      load()
    } catch (e) {
      setFormError(e.message)
    }
    setTimeout(() => setMsg(null), 3000)
  }

  const handleDelete = async id => {
    try {
      await deleteUser(id)
      setMsg({ type: 'success', text: 'User deleted' })
      load()
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    }
    setDeleteId(null)
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar user={user} title="Users" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-bold text-gray-800">Users</h1>
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
              <span>+</span> Add User
            </button>
          </div>

          {msg && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {msg.text}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header w-12">ID</th>
                  <th className="table-header">Username</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">Created At</th>
                  <th className="table-header w-24">Actions</th>
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
                ) : users.map((u, i) => (
                  <tr key={u.id} className="table-row">
                    <td className="table-cell text-gray-400">{i + 1}</td>
                    <td className="table-cell font-semibold text-gray-800">{u.username}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td className="table-cell text-gray-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                    <td className="table-cell">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => setDeleteId(u.id)}
                          className="w-7 h-7 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs flex items-center justify-center"
                          title="Delete"
                        >🗑️</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Add New User</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Username *</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  className="input-field"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-field">
                  <option value="cashier">Cashier</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {formError && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setFormError('') }} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-2.5">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Delete User?</h3>
            <p className="text-gray-500 text-sm mb-5">This will permanently remove the user account.</p>
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
