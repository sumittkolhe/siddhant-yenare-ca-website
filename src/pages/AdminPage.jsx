import { useAuth } from '../contexts/AuthContext'
import AdminLogin from '../components/admin/AdminLogin'
import AdminDashboard from '../components/admin/AdminDashboard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function AdminPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!user) {
    return <AdminLogin />
  }

  return <AdminDashboard />
}
