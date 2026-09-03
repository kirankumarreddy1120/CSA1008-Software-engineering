import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { WeatherProvider } from './context/WeatherContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Forecast from './pages/Forecast';
import Alerts from './pages/Alerts';
import ClimateHistory from './pages/ClimateHistory';
import Agriculture from './pages/Agriculture';
import Settings from './pages/Settings';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <LanguageProvider>
      <WeatherProvider>
        <Router>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
            
            {/* Global Navbar */}
            <Navbar
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />

            <div className="flex-1 flex">
              {/* Sidebar Navigation */}
              <Sidebar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
              />

              {/* Main Content Area */}
              <main className="flex-1 lg:pl-64 min-w-0 flex flex-col justify-between">
                <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/forecast" element={<Forecast />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/climate" element={<ClimateHistory />} />
                    <Route path="/agriculture" element={<Agriculture />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>

                {/* Footer */}
                <Footer />
              </main>
            </div>

          </div>
        </Router>
      </WeatherProvider>
    </LanguageProvider>
  );
}
