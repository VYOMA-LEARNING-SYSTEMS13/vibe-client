
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, User, Menu, X } from 'lucide-react';
import Button from './Button';
import { auth } from '../utils/auth';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = auth.isAuthenticated();
  const currentUser = auth.getCurrentUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Navigation items configuration
  const navLinks = [
    { name: 'Home', path: '/', id: 'hero' },
    { name: 'How It Works', path: '/', id: 'how-it-works' },
    { name: 'Features', path: '/', id: 'features' },
    { name: 'Roles', path: '/', id: 'roles' },
    { name: 'FAQ', path: '/', id: 'faq' },
  ];

  // Helper function to handle navigation to sections
  const handleNavClick = (path, id) => {
    // If we are already on the target path (Home)
    if (location.pathname === path && id) {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // Navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // Navigate to path first
      navigate(path);
      // After navigation, wait a bit for component to mount then scroll
      if (id) {
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const handleDashboardClick = () => {
    if (currentUser?.role === 'student') {
      navigate('/dashboard/student');
    } else if (currentUser?.role === 'faculty') {
      navigate('/dashboard/faculty');
    } else if (currentUser?.role === 'industry') {
      navigate('/dashboard/industry');
    }
  };

  // Check if we're on login/signup pages for different styling
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/signup' || 
                     location.pathname.startsWith('/signup/') ||
                     location.pathname === '/forgot-password';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isAuthPage 
          ? (scrolled 
              ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200 py-3 shadow-lg shadow-slate-200/20' 
              : 'bg-white/80 backdrop-blur-sm py-5'
            )
          : (scrolled 
              ? 'bg-white/70 backdrop-blur-xl border-b border-slate-200 py-3 shadow-lg shadow-slate-200/20' 
              : 'bg-transparent py-5'
            )
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo Section */}
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-[#FF6B00]/20">
                <Zap className="text-white fill-current" size={20} />
              </div>
              <span className={`text-lg sm:text-2xl font-black tracking-tighter uppercase ${
                isAuthPage ? 'text-slate-900' : 'text-slate-900'
              }`}>VIBE</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path, link.id)}
                  className={`px-4 py-2 text-sm font-bold transition-all rounded-lg whitespace-nowrap ${
                    isAuthPage 
                      ? 'text-slate-600 hover:text-[#FF6B00] hover:bg-[#FF6B00]/5' 
                      : 'text-slate-600 hover:text-[#FF6B00] hover:bg-[#FF6B00]/5'
                  }`}
                >
                  {link.name}
                </button>
              ))}

              <div className={`h-6 w-px mx-4 ${
                isAuthPage ? 'bg-slate-200' : 'bg-slate-200'
              }`} />

              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`font-bold text-sm px-4 flex items-center gap-2 ${
                    isAuthPage ? 'text-slate-600 hover:text-[#FF6B00] hover:bg-[#FF6B00]/5' : ''
                  }`}
                  onClick={handleDashboardClick}
                >
                  <User size={16} />
                  Dashboard
                </Button>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`font-bold text-sm px-4 ${
                        isAuthPage ? 'text-slate-600 hover:text-[#FF6B00] hover:bg-[#FF6B00]/5' : ''
                      }`}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="shadow-lg shadow-[#FF6B00]/20 font-bold text-sm px-4"
                    >
                      Join VIBE
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isAuthPage 
                  ? 'text-slate-900 hover:bg-slate-100' 
                  : 'text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`fixed top-[72px] left-0 right-0 z-40 lg:hidden border-b shadow-xl overflow-hidden ${
              isAuthPage 
                ? 'bg-white/95 backdrop-blur-xl border-slate-200' 
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    handleNavClick(link.path, link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-base font-bold rounded-lg transition-all ${
                    isAuthPage 
                      ? 'text-slate-700 hover:text-[#FF6B00] hover:bg-[#FF6B00]/5' 
                      : 'text-slate-700 hover:text-[#FF6B00] hover:bg-[#FF6B00]/5'
                  }`}
                >
                  {link.name}
                </button>
              ))}

              <div className={`h-px my-4 ${
                isAuthPage ? 'bg-slate-200' : 'bg-slate-200'
              }`} />

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleDashboardClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-base font-bold rounded-lg transition-all ${
                    isAuthPage 
                      ? 'text-slate-900 hover:bg-slate-100' 
                      : 'text-[#FF6B00] hover:bg-[#FF6B00]/5'
                  }`}
                >
                  <User size={20} />
                  Dashboard
                </button>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" className="block">
                    <Button 
                      variant="ghost" 
                      fullWidth 
                      size="lg" 
                      className={`font-bold ${
                        isAuthPage ? 'text-slate-600 hover:text-[#FF6B00] hover:bg-[#FF6B00]/5' : ''
                      }`}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" className="block">
                    <Button 
                      variant="primary" 
                      fullWidth 
                      size="lg" 
                      className="font-bold shadow-lg shadow-[#FF6B00]/20"
                    >
                      Join VIBE
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
