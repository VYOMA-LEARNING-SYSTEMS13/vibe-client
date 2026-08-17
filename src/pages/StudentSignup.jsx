
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Zap, User, GraduationCap, ShieldCheck, Mail, Phone, Calendar, Building, BookOpen, Lock, Briefcase, MapPin, Award } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { auth } from '../utils/auth';
import api from '../services/api';

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const totalSteps = 4;

  // Determine role from path
  const role = location.pathname.split('/').pop() || 'student';

  const [formData, setFormData] = useState({
    // Shared / Student
    fullName: '',
    dob: '',
    mobile: '',
    email: '',
    collegeName: '',
    degree: '',
    branch: '',
    currentYear: '',
    password: '',
    confirmPassword: '',
    // Faculty Specific
    position: '',
    experience: '',
    expertise: '',
    // Industry Specific
    companyName: '',
    industryType: '',
    establishmentYear: '',
    location: '',
    internshipType: 'Remote',
    otp: ''
  });

  const updateFormData = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
    // Clear errors for updated fields
    const fieldKeys = Object.keys(fields);
    setErrors(prev => {
      const newErrors = { ...prev };
      fieldKeys.forEach(key => delete newErrors[key]);
      return newErrors;
    });
  };

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {};

    if (role === 'industry') {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.industryType.trim()) newErrors.industryType = 'Industry type is required';
    } else {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!isValidMobile(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (role === 'student') {
      if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
      if (!formData.degree) newErrors.degree = 'Degree is required';
      if (!formData.branch.trim()) newErrors.branch = 'Branch is required';
      if (!formData.currentYear) newErrors.currentYear = 'Current year is required';
    } else if (role === 'faculty') {
      if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
      if (!formData.position.trim()) newErrors.position = 'Position is required';
      if (!formData.experience) newErrors.experience = 'Experience is required';
      if (!formData.expertise.trim()) newErrors.expertise = 'Expertise is required';
    } else if (role === 'industry') {
      if (!formData.establishmentYear) newErrors.establishmentYear = 'Establishment year is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      if (!formData.internshipType) newErrors.internshipType = 'Internship type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    let isValid = false;

    if (step === 1) {
      isValid = validateStep1();
    } else if (step === 2) {
      isValid = validateStep2();
    } else if (step === 3) {
      isValid = validateStep3();
    }

    if (isValid) {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setErrors({});
    setStep(s => Math.max(s - 1, 1));
  };

  // Role-specific validation
  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Mobile validation (basic)
  const isValidMobile = (mobile) => {
    const mobileRegex = /^[0-9+\s-]{10,}$/;
    return mobileRegex.test(mobile);
  };

  const isStep1Valid = (() => {
    if (role === 'industry') {
      return formData.companyName.trim() &&
        formData.industryType.trim() &&
        isValidEmail(formData.email) &&
        isValidMobile(formData.mobile);
    }
    return formData.fullName.trim() &&
      formData.dob &&
      isValidMobile(formData.mobile) &&
      isValidEmail(formData.email);
  })();

  const isStep2Valid = (() => {
    if (role === 'student') {
      return formData.collegeName.trim() &&
        formData.degree &&
        formData.branch.trim() &&
        formData.currentYear;
    }
    if (role === 'faculty') {
      return formData.collegeName.trim() &&
        formData.position.trim() &&
        formData.experience &&
        formData.expertise.trim();
    }
    if (role === 'industry') {
      return formData.establishmentYear &&
        formData.location.trim() &&
        formData.internshipType;
    }
    return false;
  })();

  const isStep3Valid = formData.password &&
    formData.password === formData.confirmPassword &&
    formData.password.length >= 8;

  // Define role specific content configurations separately to avoid temporal dead zone usage
  const ROLE_CONFIGS = {
    student: {
      title: "Student Account",
      subtitle: "Join VIBE to start solving real world challenges",
      icon: <GraduationCap size={32} className="text-[#FF6B00]" />,
      step2Title: "Academic Details",
      step2Icon: <GraduationCap size={20} className="text-[#FF6B00]" />
    },
    faculty: {
      title: "Faculty Account",
      subtitle: "Mentor real industry problems and guide professionals",
      icon: <User size={32} className="text-[#FF6B00]" />,
      step2Title: "Professional Profile",
      step2Icon: <Award size={20} className="text-[#FF6B00]" />
    },
    industry: {
      title: "Industry Account",
      subtitle: "Hire skilled interns by evaluating real work",
      icon: <Briefcase size={32} className="text-[#FF6B00]" />,
      step2Title: "Company Details",
      step2Icon: <Building size={20} className="text-[#FF6B00]" />
    }
  };

  // Select the appropriate config based on current role, defaulting to student
  const roleContent = ROLE_CONFIGS[role] || ROLE_CONFIGS.student;

  const handleResendOtp = async () => {
    const userData = {
      email: formData.email,
      role: role,
      accountType: role,
      name: role === 'industry' ? formData.companyName : formData.fullName,
      mobileNo: formData.mobile,
      dob: formData.dob,
      password: formData.password,
      
      // Student/Faculty specific
      institutionName: formData.collegeName,
      degree: formData.degree,
      branch: formData.branch,
      currentYear: formData.currentYear,
      
      position: formData.position,
      experience: formData.experience,
      expertise: formData.expertise,
      
      // Industry specific
      companyName: formData.companyName,
      industryType: formData.industryType,
      establishmentYear: formData.establishmentYear,
      location: formData.location,
      internshipType: formData.internshipType
    };

    setIsLoading(true);
    try {
      await api.post('/users/register', userData);
      alert("✅ Verification code resent successfully!");
    } catch (error) {
      console.error("Resend OTP error:", error);
      alert("❌ Failed to resend verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center relative overflow-hidden bg-[#FAFAFA]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/5 blur-[100px]" />

      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <Zap className="text-[#FF6B00]" size={32} />
            <span className="text-2xl font-bold tracking-tighter text-slate-900">VIBE</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900">{roleContent.title}</h1>
          <p className="text-slate-600">{roleContent.subtitle}</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center mb-10 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 -z-10" />
          <div className="absolute top-1/2 left-0 h-0.5 bg-[#FF6B00] -translate-y-1/2 -z-10 transition-all duration-500" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} />
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${s <= step ? 'bg-[#FF6B00] text-white scale-110 shadow-lg shadow-[#FF6B00]/30' : 'bg-white text-slate-400 border border-slate-200'}`}
            >
              {s < step ? <Check size={20} /> : s}
            </div>
          ))}
        </div>

        <GlassCard className="bg-white border-slate-200 shadow-xl overflow-visible">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                    {role === 'industry' ? <Building size={20} className="text-[#FF6B00]" /> : <User size={20} className="text-[#FF6B00]" />}
                    {role === 'industry' ? 'Company Info' : 'Personal Info'}
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {role === 'industry' ? (
                      <>
                        <InputField
                          label="Company Name"
                          icon={<Building size={18} />}
                          placeholder="Acme Corp"
                          value={formData.companyName}
                          onChange={v => updateFormData({ companyName: v })}
                          error={errors.companyName}
                        />
                        <InputField
                          label="Industry Type"
                          icon={<Briefcase size={18} />}
                          placeholder="Software, Finance, Healthcare..."
                          value={formData.industryType}
                          onChange={v => updateFormData({ industryType: v })}
                          error={errors.industryType}
                        />
                      </>
                    ) : (
                      <>
                        <InputField
                          label="Full Name"
                          icon={<User size={18} />}
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={v => updateFormData({ fullName: v })}
                          error={errors.fullName}
                        />
                        <InputField
                          label="Date of Birth"
                          icon={<Calendar size={18} />}
                          type="date"
                          value={formData.dob}
                          onChange={v => updateFormData({ dob: v })}
                          error={errors.dob}
                        />
                      </>
                    )}
                    <InputField
                      label="Mobile Number"
                      icon={<Phone size={18} />}
                      placeholder="+91 98765 43210"
                      value={formData.mobile}
                      onChange={v => updateFormData({ mobile: v })}
                      error={errors.mobile}
                    />
                    <InputField
                      label="Official Email"
                      icon={<Mail size={18} />}
                      placeholder={role === 'industry' ? "hr@company.com" : "name@college.edu"}
                      value={formData.email}
                      onChange={v => updateFormData({ email: v })}
                      error={errors.email}
                      name="email"
                      autocomplete="username"
                    />
                  </div>
                  <Button fullWidth size="lg" disabled={!isStep1Valid} onClick={nextStep}>
                    Next Step <ArrowRight className="ml-2" size={20} />
                  </Button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                    {roleContent.step2Icon} {roleContent.step2Title}
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {role === 'student' && (
                      <>
                        <InputField label="College Name" icon={<Building size={18} />} placeholder="Institute of Technology" value={formData.collegeName} onChange={v => updateFormData({ collegeName: v })} />
                        <div className="grid grid-cols-2 gap-4">
                          <SelectField label="Degree" value={formData.degree} options={['B.Tech', 'BCA', 'B.Sc', 'MCA', 'MBA']} onChange={v => updateFormData({ degree: v })} />
                          <InputField label="Branch" icon={<BookOpen size={18} />} placeholder="Computer Science" value={formData.branch} onChange={v => updateFormData({ branch: v })} />
                        </div>
                        <SelectField label="Current Year" value={formData.currentYear} options={['1st Year', '2nd Year', '3rd Year', '4th Year']} onChange={v => updateFormData({ currentYear: v })} />
                      </>
                    )}
                    {role === 'faculty' && (
                      <>
                        <InputField label="College Name" icon={<Building size={18} />} placeholder="Institute of Technology" value={formData.collegeName} onChange={v => updateFormData({ collegeName: v })} />
                        <InputField label="Position / Designation" icon={<User size={18} />} placeholder="Assistant Professor" value={formData.position} onChange={v => updateFormData({ position: v })} />
                        <InputField label="Years of Experience" icon={<Calendar size={18} />} type="number" placeholder="5" value={formData.experience} onChange={v => updateFormData({ experience: v })} />
                        <InputField label="Expertise Domains" icon={<Award size={18} />} placeholder="Machine Learning, IoT, Web Dev" value={formData.expertise} onChange={v => updateFormData({ expertise: v })} />
                      </>
                    )}
                    {role === 'industry' && (
                      <>
                        <InputField label="Years Since Establishment" icon={<Calendar size={18} />} type="number" placeholder="2010" value={formData.establishmentYear} onChange={v => updateFormData({ establishmentYear: v })} />
                        <InputField label="Location" icon={<MapPin size={18} />} placeholder="Mumbai, Remote, New York" value={formData.location} onChange={v => updateFormData({ location: v })} />
                        <SelectField label="Internship Type" value={formData.internshipType} options={['Remote', 'Onsite', 'Hybrid']} onChange={v => updateFormData({ internshipType: v })} />
                        <p className="text-xs text-slate-400 italic mt-2 ml-1">“All companies are verified before posting internships.”</p>
                      </>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="secondary" className="flex-1" onClick={prevStep}><ArrowLeft className="mr-2" size={20} /> Back</Button>
                    <Button className="flex-[2]" size="lg" disabled={!isStep2Valid} onClick={nextStep}>Next Step <ArrowRight className="ml-2" size={20} /></Button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900"><ShieldCheck size={20} className="text-[#FF6B00]" /> Security</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <InputField 
                      label="Create Password" 
                      icon={<Lock size={18} />} 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.password} 
                      onChange={v => updateFormData({ password: v })} 
                      name="password"
                      autocomplete="new-password"
                    />
                    <InputField 
                      label="Confirm Password" 
                      icon={<Lock size={18} />} 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.confirmPassword} 
                      onChange={v => updateFormData({ confirmPassword: v })} 
                      name="confirmPassword"
                      autocomplete="new-password"
                    />
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
                      <p>• At least 8 characters long</p>
                      <p>• Must match both fields</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="secondary" className="flex-1" onClick={prevStep}><ArrowLeft className="mr-2" size={20} /> Back</Button>
                    <Button
                      className="flex-[2]"
                      size="lg"
                      disabled={!isStep3Valid || isLoading}
                      onClick={async () => {
                        if (!validateStep3()) {
                          return;
                        }
                        
                        // Collect all data for registration
                        const userData = {
                          email: formData.email,
                          role: role,
                          accountType: role,
                          name: role === 'industry' ? formData.companyName : formData.fullName,
                          mobileNo: formData.mobile,
                          dob: formData.dob,
                          password: formData.password,
                          
                          // Student/Faculty specific
                          institutionName: formData.collegeName,
                          degree: formData.degree,
                          branch: formData.branch,
                          currentYear: formData.currentYear,
                          
                          position: formData.position,
                          experience: formData.experience,
                          expertise: formData.expertise,
                          
                          // Industry specific
                          companyName: formData.companyName,
                          industryType: formData.industryType,
                          establishmentYear: formData.establishmentYear,
                          location: formData.location,
                          internshipType: formData.internshipType
                        };

                        setIsLoading(true);
                        try {
                          // Step 3 now sends ALL data to initiate registration
                          await api.post('/users/register', userData);
                          nextStep();
                        } catch (error) {
                          if (error.response && error.response.status === 409) {
                            alert("❌ User with this email already exists.");
                          } else {
                            console.error("Send OTP error:", error);
                          }
                          
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send Verification Code"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900"><ShieldCheck size={20} className="text-[#FF6B00]" /> Verify Email</h2>
                  <p className="text-slate-600">We sent a verification code to <b>{formData.email}</b>. Please enter it below.</p>
                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label="Verification Code"
                      icon={<ShieldCheck size={18} />}
                      placeholder="123456"
                      value={formData.otp}
                      onChange={v => {
                        if (/^\d*$/.test(v) && v.length <= 6) updateFormData({ otp: v });
                      }}
                      maxLength={6}
                      inputMode="numeric"
                    />
                    <div className="text-right">
                      <button 
                        type="button" 
                        onClick={handleResendOtp}
                        className="text-sm text-[#FF6B00] hover:text-[#e05e00] font-semibold transition-colors"
                      >
                        Resend Code?
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="secondary" className="flex-1" onClick={prevStep}><ArrowLeft className="mr-2" size={20} /> Back</Button>
                    <Button
                      className="flex-[2]"
                      size="lg"
                      disabled={(!formData.otp || formData.otp.length < 6) || isLoading}
                      onClick={async () => {
                        // Final step just verifies OTP
                        setIsLoading(true);
                        try {
                          await auth.signup({ 
                            email: formData.email, 
                            otp: formData.otp 
                          });

                          if (role === 'industry') {
                            alert('✅ Application Submitted!\n\nYour company registration has been submitted for verification. Please login to continue.');
                            navigate('/login');
                          } else {
                            // Show success message
                            const successMessage = role === 'student'
                              ? '🎉 Welcome to VIBE!\n\nYour student account has been created successfully. Please login to access your dashboard.'
                              : '🎉 Welcome to VIBE!\n\nYour faculty account has been created successfully. Please login to access your dashboard.';

                            alert(successMessage);

                            // Redirect to login for all users
                            navigate('/login');
                          }
                        } catch (error) {
                          alert('❌ Error creating account. Please check the OTP and try again.');
                          console.error('Signup error:', error);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </span>
                      ) : (
                        role === 'industry' ? 'Submit for Verification' : `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
};

// Internal Helper Components for Inputs
const InputField = ({
  label,
  icon,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  ...props
}) => (
  <div className="relative group">
    <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1 group-focus-within:text-[#FF6B00] transition-colors">{label}</label>
    <div className="relative">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#FF6B00]'}`}>{icon}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full bg-slate-50 border rounded-xl py-3.5 pl-12 pr-4 text-slate-900 focus:outline-none transition-all font-medium ${error
          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
          : 'border-slate-200 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/5'
          }`}
        placeholder={placeholder}
        {...props}
      />
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-500 mt-1 ml-1 font-medium"
      >
        {error}
      </motion.p>
    )}
  </div>
);

const SelectField = ({
  label,
  value,
  options,
  onChange,
  error
}) => (
  <div className="relative group">
    <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1 group-focus-within:text-[#FF6B00] transition-colors">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full bg-slate-50 border rounded-xl py-3.5 px-4 text-slate-900 focus:outline-none transition-all appearance-none font-medium ${error
          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
          : 'border-slate-200 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/5'
          }`}
      >
        <option value="" disabled className="bg-white">Select {label}</option>
        {options.map(opt => <option key={opt} value={opt} className="bg-white">{opt}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ArrowRight size={16} className="rotate-90" />
      </div>
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-500 mt-1 ml-1 font-medium"
      >
        {error}
      </motion.p>
    )}
  </div>
);

export default Signup;
