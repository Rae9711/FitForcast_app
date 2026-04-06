import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const LogEntry = lazy(() => import('./pages/LogEntry').then((module) => ({ default: module.LogEntry })));
const History = lazy(() => import('./pages/History').then((module) => ({ default: module.History })));
const Trends = lazy(() => import('./pages/Trends').then((module) => ({ default: module.Trends })));
const LoginPage = lazy(() => import('./pages/Login').then((module) => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('./pages/Signup').then((module) => ({ default: module.SignupPage })));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      {isAuthenticated && (
        <header className="bg-white shadow">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              FitForecast
            </Link>
            <div className="flex items-center gap-6">
              <ul className="flex gap-6">
                <li>
                  <Link to="/" className="text-gray-700 hover:text-primary transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/log" className="text-gray-700 hover:text-primary transition">
                    Log
                  </Link>
                </li>
                <li>
                  <Link to="/history" className="text-gray-700 hover:text-primary transition">
                    History
                  </Link>
                </li>
                <li>
                  <Link to="/trends" className="text-gray-700 hover:text-primary transition">
                    Trends
                  </Link>
                </li>
              </ul>
              <div className="flex items-center gap-4 border-l border-gray-300 pl-6">
                <span className="text-sm text-gray-600">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </header>
      )}

      {/* Main Content */}
      <main className={isAuthenticated ? "max-w-6xl mx-auto px-4 py-8" : ""}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/log"
              element={
                <ProtectedRoute>
                  <LogEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trends"
              element={
                <ProtectedRoute>
                  <Trends />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      {isAuthenticated && (
        <footer className="bg-gray-100 mt-16 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-sm text-gray-600">
                  FitForecast helps you understand the relationship between your fitness, nutrition, and wellbeing.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Log workouts and meals</li>
                  <li>Track feelings and emotions</li>
                  <li>Discover personal patterns</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><a href="#" className="hover:text-primary">Documentation</a></li>
                  <li><a href="#" className="hover:text-primary">Contact</a></li>
                  <li><a href="#" className="hover:text-primary">Privacy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
              © 2026 FitForecast. Performance analytics for a healthier you.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}
