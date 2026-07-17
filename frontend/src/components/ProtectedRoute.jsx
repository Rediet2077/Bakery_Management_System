import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getMe } from '../services/api'

export default function ProtectedRoute({ children, role }) {
  const [status, setStatus] = useState('loading') // loading | ok | denied
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    getMe()
      .then(data => {
        setUserRole(data.role)
        if (!role || data.role === role) setStatus('ok')
        else setStatus('denied')
      })
      .catch(() => setStatus('denied'))
  }, [role])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-700 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'denied') {
    if (userRole === 'admin') return <Navigate to="/admin" replace />
    if (userRole === 'cashier') return <Navigate to="/cashier" replace />
    return <Navigate to="/login" replace />
  }

  return children
}
