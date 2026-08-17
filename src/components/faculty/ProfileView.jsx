import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../../utils/auth";
import Avatar from "../shared/Avatar";
import {
  User,
  Building,
  Lock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Award,
  Calendar,
  BookOpen,
  Edit3,
  Mail,
  Phone,
} from "lucide-react";

export const ProfileView = ({ user, onProfileUpdate }) => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || '',
    mobileNo: user.mobileNo || '',
    dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    institutionName: user.Profile?.InstituteName || '',
    position: user.Profile?.position || '',
    department: user.Profile?.branch || '',
    experience: user.Profile?.YearOfExperience || '',
    expertise: user.Profile?.ExpertiseDomains || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const updatedUser = await auth.updateProfile(user._id, formData);
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (isEditing) {
      handleUpdateProfile();
    } else {
      setIsEditing(true);
    }
  };

  const inputClasses =
    "w-full px-5 py-3.5 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-gray-800 placeholder-gray-400 font-medium shadow-sm hover:bg-white/60";

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Profile Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-6 md:p-10 border border-white shadow-xl flex flex-col md:flex-row items-center gap-8"
      >
        <div className="relative group">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-tr from-orange-500 to-amber-300 p-1">
            <Avatar
              name={user.name}
              src={user.ImageUrl || user.avatar}
              className="w-full h-full rounded-[1.8rem] md:rounded-[2.2rem] border-4 border-white"
              initialsClassName="text-3xl md:text-4xl"
            />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 rounded-[2.3rem] md:rounded-[2.8rem] border-2 border-dashed border-orange-500/30 -z-10"
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2 w-full">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              {user.name}
            </h2>
            <span className="px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-widest ring-1 ring-orange-200">
              {user.role}
            </span>
          </div>
          <p className="text-gray-500 font-medium text-sm md:text-base">
            {formData.position} • {formData.department}
          </p>

          <div className="pt-4 max-w-sm mx-auto md:mx-0">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs md:text-sm font-bold text-gray-400">
                Profile Completion
              </span>
              <span className="text-xs md:text-sm font-black text-orange-600">
                90%
              </span>
            </div>
            <div className="h-2.5 md:h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "90%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleEditClick}
          disabled={loading}
          className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${isEditing ? "bg-orange-600 text-white shadow-orange-200" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} shadow-lg`}
        >
          <Edit3 size={18} />
          <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
        </button>
      </motion.section>

      {/* 2. Stepper Form Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-2xl ${step === 1 ? "bg-orange-500 text-white" : "bg-white text-orange-500 border border-orange-100"} shadow-lg transition-colors`}
          >
            <User size={24} />
          </div>
          <div className="h-px w-4 md:w-8 bg-gray-200" />
          <div
            className={`p-3 rounded-2xl ${step === 2 ? "bg-orange-500 text-white" : "bg-white text-orange-500 border border-orange-100"} shadow-lg transition-colors`}
          >
            <Award size={24} />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-gray-900 ml-2">
            {step === 1 ? "Personal Information" : "Professional Information"}
          </h3>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 border border-white shadow-xl">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
              >
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={inputClasses}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className={inputClasses + " opacity-60 cursor-not-allowed"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={inputClasses}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-gray-800 transition-all group"
                  >
                    Next Step{" "}
                    <ChevronRight
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
              >
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    College/University
                  </label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter institution name"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Position/Designation
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g., Assistant Professor"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g., Computer Science"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g., 10"
                    className={inputClasses}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Areas of Expertise
                  </label>
                  <textarea
                    rows={3}
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g., Machine Learning, Data Science, Web Development"
                    className={inputClasses + " resize-none"}
                  />
                </div>
                <div className="md:col-span-2 flex flex-col md:flex-row justify-between gap-4 pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-2 text-gray-500 font-bold px-4 py-2 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={!isEditing || loading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-orange-200 hover:bg-orange-700 transition-all"
                  >
                    {loading ? 'Updating...' : 'Update Profile'} <CheckCircle2 size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 3. Change Password Section */}
      <section className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 border border-white shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-1 space-y-4">
          <div className="w-16 h-16 rounded-[1.5rem] bg-orange-50 text-orange-500 flex items-center justify-center shadow-lg shadow-orange-100">
            <Lock size={32} />
          </div>
          <h3 className="text-2xl font-black text-gray-900">Security Center</h3>
          <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">
            Protect your account by using a strong password. We recommend a mix
            of symbols, numbers, and capital letters.
          </p>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Current Password"
              className={inputClasses + " pr-12"}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-orange-500 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="password"
              placeholder="New Password"
              className={inputClasses}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className={inputClasses}
            />
          </div>

          <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3">
            Update Password <Lock size={18} />
          </button>
        </div>
      </section>

      {/* 4. Statistics Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-orange-50 text-orange-600 shadow-sm">
              <Award size={28} />
            </div>
            <div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">
                Students Mentored
              </span>
              <span className="text-3xl font-black text-gray-900 tracking-tight">
                45
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-green-50 text-green-600 shadow-sm">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">
                Tasks Reviewed
              </span>
              <span className="text-3xl font-black text-gray-900 tracking-tight">
                128
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-600 shadow-sm">
              <BookOpen size={28} />
            </div>
            <div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">
                Active Requests
              </span>
              <span className="text-3xl font-black text-gray-900 tracking-tight">
                12
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
