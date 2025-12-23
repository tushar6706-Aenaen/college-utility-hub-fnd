import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import StudentNotices from './pages/student/Notices'
import StudentEvents from './pages/student/Events'
import StudentLostFound from './pages/student/LostFound'
import StudentFeedback from './pages/student/Feedback'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ManageNotices from './pages/admin/ManageNotices'
import ManageEvents from './pages/admin/ManageEvents'
import ModerateLostFound from './pages/admin/ModerateLostFound'
import ViewFeedback from './pages/admin/ViewFeedback'
import ManageAdmins from './pages/admin/ManageAdmins'

// Layout
import DashboardLayout from './components/layout/DashboardLayout'

function App() {
  const { isAuthenticated, user } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <Login />
          )
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? (
            <Navigate to="/student/dashboard" replace />
          ) : (
            <Register />
          )
        } 
      />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="notices" element={<StudentNotices />} />
        <Route path="events" element={<StudentEvents />} />
        <Route path="lostfound" element={<StudentLostFound />} />
        <Route path="feedback" element={<StudentFeedback />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="notices" element={<ManageNotices />} />
        <Route path="events" element={<ManageEvents />} />
        <Route path="lostfound" element={<ModerateLostFound />} />
        <Route path="feedback" element={<ViewFeedback />} />
        <Route path="admins" element={<ManageAdmins />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

