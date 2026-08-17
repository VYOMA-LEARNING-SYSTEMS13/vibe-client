
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Twitter, Linkedin, Github, Instagram, ArrowRight, Heart } from 'lucide-react';
import Button from './Button';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (id) => {
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else {
      navigate('/');
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
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#FF6B00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">

          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center space-x-3 mb-8 group">
              <div className="w-12 h-12 bg-[#FF6B00] rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-[#FF6B00]/20">
                <Zap className="text-white fill-current" size={28} />
              </div>
              <span className="text-3xl font-black tracking-tighter text-slate-900 uppercase">VIBE</span>
            </Link>
            <p className="text-slate-600 mb-10 max-w-sm leading-relaxed text-lg">
              Empowering the next generation of professionals through <span className="text-[#FF6B00] font-bold underline decoration-orange-200 underline-offset-4">skill-verified</span> internships and guided mentorship.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Linkedin, Github, Instagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#FF6B00] hover:border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/30 transition-all duration-300"
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links Sections */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-8">Platform</h4>
            <ul className="space-y-5">
              <li><button onClick={() => handleLinkClick('how-it-works')} className="text-slate-500 hover:text-[#FF6B00] font-bold transition-colors">How it Works</button></li>
              <li><button onClick={() => handleLinkClick('features')} className="text-slate-500 hover:text-[#FF6B00] font-bold transition-colors">Features</button></li>
              <li><button onClick={() => handleLinkClick('roles')} className="text-slate-500 hover:text-[#FF6B00] font-bold transition-colors">Roles Available</button></li>
              <li><button onClick={() => handleLinkClick('faq')} className="text-slate-500 hover:text-[#FF6B00] font-bold transition-colors">Help & FAQ</button></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-8">Quick Links</h4>
            <ul className="space-y-5">
              <li><Link to="/login" className="text-slate-500 hover:text-[#FF6B00] font-bold transition-colors">User Login</Link></li>
              <li><Link to="/signup/student" className="text-slate-500 hover:text-[#FF6B00] font-bold transition-colors">For Students</Link></li>
              <li><Link to="/signup/industry" className="text-slate-500 hover:text-[#FF6B00] font-bold transition-colors">For Industry</Link></li>
              <li><Link to="/signup/faculty" className="text-slate-500 hover:text-[#FF6B00] font-bold transition-colors">For Faculty</Link></li>
            </ul>
          </div>

          {/* Interactive Newsletter Section */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-8">Stay in the Loop</h4>
            <p className="text-slate-600 mb-8 text-base leading-relaxed">Join 5,000+ professionals getting weekly career insights and task alerts.</p>
            <div className="relative group">
              <input
                type="email"
                placeholder="name@email.com"
                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-6 pr-16 text-slate-900 focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/5 transition-all shadow-sm font-medium"
              />
              <button className="absolute right-2.5 top-2.5 w-12 h-12 bg-[#FF6B00] text-white rounded-xl flex items-center justify-center hover:bg-[#e65a00] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#FF6B00]/20">
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Metadata Section */}
        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-sm font-bold text-slate-400">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <span>© 2024 VIBE Platforms Inc.</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center">Made with <Heart size={14} className="mx-1.5 text-[#FF6B00] fill-current" /> for Careers</span>
          </div>
          <div className="flex space-x-10">
            <a href="#" className="hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px]">Security</a>
            <a href="#" className="hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px]">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px]">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
