import React from 'react';
import { ShieldAlert, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Analyzer', path: '/', icon: ShieldAlert },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface-200 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Branding */}
          <Link to="/" className="flex items-center group shrink-0">
            <span className="text-lg sm:text-xl font-black tracking-tighter text-text-900 select-none">
              HEXA<span className="text-primary">PHISH</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center">
            <div className="flex items-center gap-1 sm:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2
                      ${isActive ? 'text-primary' : 'text-text-600 hover:text-text-900 hover:bg-surface-100'}
                    `}
                  >
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <span className="hidden xs:block sm:block">{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


