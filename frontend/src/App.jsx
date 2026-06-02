import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './AuthContext';
import { useInactivityLogout } from './hooks/useInactivityLogout';
import InactivityWarningModal from './components/InactivityWarningModal';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Categories from './pages/Categories';
import MonthlySummary from './pages/MonthlySummary';
import Goals from './pages/Goals';
import Layout from './components/Layout';
import './index.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="skeleton w-12 h-12 rounded-full" /></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function AppRoutes() {
  const { user, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);

  const { stayLoggedIn } = useInactivityLogout({
    active: !!user,                      // only track when logged in
    onWarn:   () => setShowWarning(true),
    onReset:  () => setShowWarning(false),
    onLogout: () => {
      setShowWarning(false);
      logout();
    },
  });

  return (
    <>
      <InactivityWarningModal
        visible={showWarning}
        onStayLoggedIn={() => {
          setShowWarning(false);
          stayLoggedIn(); // explicitly resets the 20-min timer
        }}
      />

      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="records" element={<Records />} />
          <Route path="categories" element={<Categories />} />
          <Route path="monthly-summary" element={<MonthlySummary />} />
          <Route path="goals" element={<Goals />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
          },
        }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
