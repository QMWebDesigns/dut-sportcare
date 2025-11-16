import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Router, Route } from './components/Router';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './components/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ReportInjury } from './pages/student/ReportInjury';
import { PractitionerDashboard } from './pages/practitioner/PractitionerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { useEffect } from 'react';
import { navigate } from './components/Router';
import './index.css';

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && profile) {
      const path = window.location.pathname;
      if (path === '/' || path === '/login' || path === '/register') {
        if (profile.role === 'student') {
          navigate('/student/dashboard');
        } else if (profile.role === 'practitioner') {
          navigate('/practitioner/dashboard');
        } else if (profile.role === 'admin') {
          navigate('/admin/dashboard');
        }
      }
    }
  }, [user, profile, loading]);

  return (
    <Router>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/report-injury"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ReportInjury />
          </ProtectedRoute>
        }
      />
      <Route
        path="/practitioner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['practitioner']}>
            <PractitionerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;