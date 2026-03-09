import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import { Dashboard } from './pages/Dashboard';
import { LogEntry } from './pages/LogEntry';
import { History } from './pages/History';
import { Trends } from './pages/Trends';
import './App.css';

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            FitForecast
          </Link>
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
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<LogEntry />} />
          <Route path="/history" element={<History />} />
          <Route path="/trends" element={<Trends />} />
        </Routes>
      </main>

      {/* Footer */}
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
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}
