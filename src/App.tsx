import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import TrackLocation from './pages/TrackLocation'
import ShareLocation from './pages/ShareLocation'
import Layout from './components/Layout'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Routes>
          <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />} />
          <Route
            path="/"
            element={isAuthenticated ? <Layout /> : <Navigate to="/auth" />}
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="track/:trackingId" element={<TrackLocation />} />
            <Route path="share" element={<ShareLocation />} />
          </Route>
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
