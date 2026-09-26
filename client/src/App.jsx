import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentDrivesPage from './pages/student/StudentDrivesPage';
import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
import StudentInterviewsPage from './pages/student/StudentInterviewsPage';
import PlacementSuccessPage from './pages/student/PlacementSuccessPage';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffStudentsPage from './pages/staff/StaffStudentsPage';
import StaffDrivesPage from './pages/staff/StaffDrivesPage';
import StaffDriveDetailPage from './pages/staff/StaffDriveDetailPage';
import StaffReportsPage from './pages/staff/StaffReportsPage';
import StaffAuditLogsPage from './pages/staff/StaffAuditLogsPage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterDriveStudentsPage from './pages/recruiter/RecruiterDriveStudentsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Error Pages
import NotFoundPage from './pages/error/NotFoundPage';
import ForbiddenPage from './pages/error/ForbiddenPage';

// Role Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forbidden" element={<ForbiddenPage />} />

              {/* Protected Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/drives"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDrivesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/applications"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/interviews"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentInterviewsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/selection-celebration"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <PlacementSuccessPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Staff Routes */}
              <Route
                path="/staff/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/students"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffStudentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/drives"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffDrivesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/drives/:id"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffDriveDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/reports"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/audit-logs"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffAuditLogsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Recruiter Routes */}
              <Route
                path="/recruiter/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['recruiter']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/drives"
                element={
                  <ProtectedRoute allowedRoles={['recruiter']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/drives/:id/students"
                element={
                  <ProtectedRoute allowedRoles={['recruiter']}>
                    <RecruiterDriveStudentsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-All 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
