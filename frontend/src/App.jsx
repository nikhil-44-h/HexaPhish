import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ParticleBackground from './components/ParticleBackground';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-surface-50 text-text-900 relative selection:bg-primary/20 selection:text-primary-dark">
        
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0 bg-dot-pattern opacity-40 pointer-events-none"></div>
        
        <ParticleBackground />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 w-full relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
