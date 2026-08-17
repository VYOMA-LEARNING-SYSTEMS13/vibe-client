
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Briefcase, Zap, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const SignupSelection = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center bg-[#FAFAFA]">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Choose Your Path</h1>
        <p className="text-slate-600 max-w-xl mx-auto">Select how you want to participate in the VIBE ecosystem. Each role has specialized tools for your success.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <SelectionCard
          role="Student"
          icon={<GraduationCap size={40} />}
          desc="Find tasks, solve problems, and get hired by top verified industries."
          href="/signup/student"
          color="bg-blue-50 text-blue-600"
        />
        <SelectionCard
          role="Faculty"
          icon={<Users size={40} />}
          desc="Guide students on real-world projects and build academic-industry bridges."
          href="/signup/faculty"
          color="bg-[#FF6B00]/10 text-[#FF6B00]"
        />
        <SelectionCard
          role="Industry"
          icon={<Briefcase size={40} />}
          desc="Post real tasks, evaluate talent objectively, and hire with confidence."
          href="/signup/industry"
          color="bg-green-50 text-green-600"
        />
      </div>

      <p className="mt-12 text-slate-500">
        Already have an account? <Link to="/login" className="text-[#FF6B00] hover:underline font-medium">Log In</Link>
      </p>
    </div>
  );
};

const SelectionCard = ({
  role, icon, desc, href, color
}) => (
  <Link to={href} className="group block h-full">
    <GlassCard className="h-full flex flex-col p-8 transition-transform group-hover:scale-[1.02] bg-white border-slate-200">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${color}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-[#FF6B00] transition-colors">{role}</h3>
      <p className="text-slate-600 mb-8 flex-grow">{desc}</p>
      <div className="flex items-center text-[#FF6B00] font-semibold">
        Start Journey <ArrowRight size={20} className="ml-2 group-hover:scale-110 transition-transform" />
      </div>
    </GlassCard>
  </Link>
);

export default SignupSelection;
