import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { RouteGuard } from './components/RouteGuard';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              {/* Core Global Components */}
              <Navbar />
              <ToastContainer />

              {/* Page Routing */}
              <div style={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  
                  {/* Protected Dashboard Route */}
                  <Route
                    path="/dashboard"
                    element={
                      <RouteGuard>
                        <DashboardPage />
                      </RouteGuard>
                    }
                  />
                  
                  {/* Catch-all fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
