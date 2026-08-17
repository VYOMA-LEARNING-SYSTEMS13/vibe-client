
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Zap, User, GraduationCap, Briefcase, ArrowRight, Star, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import { auth } from '../utils/auth';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform login
    try {
      const success = await auth.login(email, password);

      if (success) {
        // Redirect based on role
        const user = auth.getCurrentUser();
        
        if (user && user.role) {
          navigate(`/dashboard/${user.role}`);
        } else {
          // Fallback if something went wrong
          console.error("Login successful but no role found", user);
          alert("Login successful but could not determine user role.");
        }
      }
    } catch (error) {
      alert(error?.message || "Login failed. Please check your credentials.");
    }
  };

  const roleData = {
    student: {
      title: "Welcome back, Student",
      desc: "Ready to tackle your next verified task?",
      icon: <GraduationCap size={24} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    faculty: {
      title: "Hello, Mentor",
      desc: "Your students are waiting for guidance.",
      icon: <User size={24} />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    industry: {
      title: "Industry Portal",
      desc: "Evaluate talent and hire top performers.",
      icon: <Briefcase size={24} />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden pt-24 lg:pt-0">

      {/* LEFT SIDE: Brand Experience (Visible on Desktop) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-[55%] xl:w-[60%] bg-[#fdf6ec] relative p-16 pt-32 flex-col justify-between overflow-hidden"
      >
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF6B00]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        {/* Top Section 
        //**<div className="relative z-10">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-[#FF6B00] rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-lg shadow-[#FF6B00]/20">
              <Zap className="text-white fill-current" size={28} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white uppercase">VIBE</span>
          </Link>
        </div>*/}

        {/* Middle Section: Value Prop */}
        <div className="relative z-10 max-w-xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl xl:text-7xl font-extrabold text-slate-800 leading-tight mb-8"
          >
            Your Career, <br />
            <span className="text-[#FF6B00]">Verified.</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-8"
          >
            <div>
              <p className="text-3xl font-bold text-slate-800 mb-1">1,200+</p>
              <p className="text-slate-600 text-sm font-medium uppercase tracking-wider">Verified Tasks</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800 mb-1">98%</p>
              <p className="text-slate-600 text-sm font-medium uppercase tracking-wider">Offer Rate</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 bg-white/80 border border-slate-200 p-8 rounded-3xl backdrop-blur-md max-w-lg shadow-lg"
        >
          <div className="flex space-x-1 mb-4">
            {Array.from({ length: 5 }, (_, i) => i + 1).map(i => <Star key={i} size={14} className="text-[#FF6B00] fill-current" />)}
          </div>
          <p className="text-slate-700 italic mb-6 leading-relaxed">
            "VIBE changed the way I looked at internships. Instead of just sending resumes, I actually proved my skills by solving a real problem for TechCorp. I had my offer in 4 days."
          </p>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-800 border border-slate-200">JD</div>
            <div>
              <p className="text-slate-800 font-bold text-sm">John Doe</p>
              <p className="text-slate-600 text-xs">Software Intern @ TechCorp</p>
            </div>
          </div>
        </motion.div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </motion.div>

      {/* RIGHT SIDE: Immersive Auth */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 xl:p-24 bg-white">
        <div className="max-w-md w-full mx-auto">

          <div className="mb-12">
            <h1 className="text-3xl font-black text-slate-900 mb-3">Login to VIBE</h1>
            <p className="text-slate-500">Secure access to your professional dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Unique Role Selection Tiles */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Select Your Perspective</label>
              <div className="grid grid-cols-3 gap-3">
                {['student', 'faculty', 'industry'].filter(Boolean).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${role === r
                      ? 'border-[#FF6B00] bg-white shadow-xl shadow-[#FF6B00]/10'
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-400'
                      }`}
                  >
                    {role === r && (
                      <motion.div
                        layoutId="role-indicator"
                        className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF6B00] rounded-full flex items-center justify-center text-white shadow-lg"
                      >
                        <CheckCircle size={14} />
                      </motion.div>
                    )}
                    <div className={`mb-2 transition-colors ${role === r ? 'text-[#FF6B00]' : 'text-slate-400'}`}>
                      {r === 'student' ? <GraduationCap size={24} /> : r === 'faculty' ? <User size={24} /> : <Briefcase size={24} />}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${role === r ? 'text-slate-900' : 'text-slate-400'}`}>
                      {r}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className={`text-lg font-bold ${roleData[role].color}`}>{roleData[role].title}</h3>
                  <p className="text-sm text-slate-500">{roleData[role].desc}</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1 group-focus-within:text-[#FF6B00] transition-colors">Business Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF6B00] transition-all" size={20} />
                      <input
                        type="email"
                        name="email"
                        autocomplete="username"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/5 transition-all font-medium"
                        placeholder="e.g. name@company.com"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="flex justify-between items-center mb-2 ml-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[#FF6B00] transition-colors">Password</label>
                      <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs font-bold text-[#FF6B00] hover:text-[#e65a00]">Forgot?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF6B00] transition-all" size={20} />
                      <input
                        type="password"
                        name="password"
                        autocomplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/5 transition-all font-medium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-4">
              <Button type="submit" fullWidth size="lg" className="h-14 text-lg">
                Sign In to Dashboard <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>

            <div className="text-center">
              <p className="text-slate-500 text-sm">
                New to the platform? {' '}
                <Link to="/signup" className="text-[#FF6B00] font-bold hover:underline underline-offset-4">Create your account</Link>
              </p>
            </div>
          </form>

          {/* Social Proof Footer (Mobile) */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between lg:hidden">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted by 200+ companies</p>
            <div className="flex -space-x-2">
              {Array.from({ length: 3 }, (_, i) => i + 1).map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Reset Password</h3>
                <button onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-slate-600">
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {forgotStep === 1 ? (
                  <>
                    <p className="text-slate-600">Enter your email address and we'll send you a verification code to reset your password.</p>
                    <InputField
                      label="Email Address"
                      icon={<Mail size={18} />}
                      placeholder="you@example.com"
                      value={forgotEmail}
                      onChange={setForgotEmail}
                    />
                    <Button 
                      fullWidth 
                      onClick={async () => {
                        if (!forgotEmail) return alert("Please enter your email");
                        try {
                          const response = await api.post('/users/forgot-password', { email: forgotEmail });
                          
                          if (response.status === 200) {
                            setForgotStep(2);
                            alert("Verification code sent to your email!");
                          }
                        } catch (err) {
                          console.error(err);
                          const msg = err.response?.data?.message || "Failed to send code";
                          alert(msg);
                        }
                      }}
                    >
                      Send Reset Code
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-slate-600">Enter the 6-digit code sent to <b>{forgotEmail}</b> and your new password.</p>
                    <InputField
                      label="Verification Code"
                      icon={<Lock size={18} />}
                      placeholder="123456"
                      value={forgotOtp}
                      onChange={setForgotOtp}
                    />
                    <InputField
                      label="New Password"
                      icon={<Lock size={18} />}
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={setNewPassword}
                    />
                    <Button 
                      fullWidth 
                      onClick={async () => {
                        if (!forgotOtp || !newPassword) return alert("Please fill all fields");
                        try {
                          const response = await api.post('/users/reset-password', { 
                            email: forgotEmail, 
                            otp: forgotOtp, 
                            newPassword 
                          });
                          
                          if (response.status === 200) {
                            alert("Password reset successfully! You can now login.");
                            setShowForgotModal(false);
                            setForgotStep(1);
                            setForgotEmail('');
                            setForgotOtp('');
                            setNewPassword('');
                          }
                        } catch (err) {
                          console.error(err);
                          const msg = err.response?.data?.message || "Failed to reset password";
                          alert(msg);
                        }
                      }}
                    >
                      Reset Password
                    </Button>
                    <button 
                      onClick={() => setForgotStep(1)} 
                      className="w-full text-sm text-slate-500 hover:text-[#FF6B00] mt-2"
                    >
                      Back to Email
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Input Field (Duplicated from Signup for self-containment if needed, or import if available)
const InputField = ({ label, icon, type = 'text', placeholder, value, onChange }) => (
  <div className="relative group">
    <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1 group-focus-within:text-[#FF6B00] transition-colors">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B00] transition-colors">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/5 transition-all font-medium"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default Login;
