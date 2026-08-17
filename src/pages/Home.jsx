import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Users,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  BrainCircuit,
  Rocket,
  ChevronDown,
  Code,
  MessageSquare,
  Award,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  UserCheck,
  Sparkles,
} from "lucide-react";
import Button from "../components/Button";
import GlassCard from "../components/GlassCard";
import { Link } from "react-router-dom";

const TypewriterHeadline = () => {
  const words = ["Verified Internships.", "Real Tasks.", "Real Careers."];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000); // Pause at end of word
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      reverse ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <span className="text-[#FF6B00] min-h-[1.1em] inline-block">
      {words[index].substring(0, subIndex)}
      <span className="animate-pulse border-r-4 border-[#FF6B00] ml-1">
        &nbsp;
      </span>
    </span>
  );
};

const Home = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-[90vh] flex items-center overflow-hidden px-4 sm:px-6 lg:px-8"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6B00]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-full text-sm font-semibold text-[#FF6B00] mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]"></span>
              </span>
              <span>Next Gen Internship Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 flex flex-col">
              <span className="text-slate-400 text-xl sm:text-3xl md:text-4xl font-bold mb-2 uppercase tracking-tight">
                Focusing on
              </span>
              <TypewriterHeadline />
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              VIBE connects students, verified industries, and faculty mentors
              through real-world tasks that lead to guaranteed internship
              opportunities.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Join VIBE <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <a
                href="#roles"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("roles")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Explore Roles
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Enhanced Professional Visual - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hidden md:flex relative h-[400px] sm:h-[500px] lg:h-[600px] items-center justify-center"
          >
            <div className="relative w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]">
              {/* Back Decorative Layer */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#FF6B00]/5 to-blue-500/5 rounded-full blur-[80px]" />

              {/* Main Dashboard Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-2xl z-10 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-200" />
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-200" />
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-200" />
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    Active Session: 42m
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center border border-slate-100 shadow-sm">
                          <Code
                            size={16}
                            className="text-[#FF6B00] sm:w-5 sm:h-5"
                          />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            Task: AI Pipeline
                          </p>
                          <p className="text-[8px] sm:text-[10px] text-slate-500">
                            TechCorp Global • Level 4
                          </p>
                        </div>
                      </div>
                      <div className="px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 text-[8px] sm:text-[10px] font-bold rounded-full">
                        VERIFIED
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 2, delay: 1 }}
                        className="h-full bg-[#FF6B00]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-center space-x-1 sm:space-x-2 text-blue-600 mb-2">
                        <Users size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="text-[8px] sm:text-[10px] font-bold">
                          MENTORSHIP
                        </span>
                      </div>
                      <p className="text-[9px] sm:text-[11px] text-slate-700 leading-tight">
                        "Logic looks solid. Try optimizing the API call."
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 bg-orange-50 rounded-xl border border-orange-100">
                      <div className="flex items-center space-x-1 sm:space-x-2 text-[#FF6B00] mb-2">
                        <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="text-[8px] sm:text-[10px] font-bold">
                          DEADLINE
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-black text-slate-900">
                        2d : 14h
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Success Notification */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -right-4 sm:-right-8 top-1/2 bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xl z-20 max-w-[150px] sm:max-w-[200px]"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200">
                    <Award size={14} className="sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-900">
                    Achievement!
                  </span>
                </div>
                <p className="text-[8px] sm:text-[10px] text-slate-500">
                  Task Completed: System Architecture Review
                </p>
              </motion.div>

              {/* Floating Industry Match */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -left-6 sm:-left-12 bottom-8 sm:bottom-12 bg-white rounded-2xl p-3 sm:p-5 shadow-2xl z-20 text-gray-800 min-w-[160px] sm:min-w-[220px] border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Briefcase
                      size={12}
                      className="text-[#FF6B00] sm:w-4 sm:h-4"
                    />
                  </div>
                  <div className="h-1 sm:h-1.5 w-8 sm:w-12 bg-gray-200 rounded-full" />
                </div>
                <h4 className="text-[10px] sm:text-xs font-bold mb-1 text-[#FF6B00]">
                  Internship Offer
                </h4>
                <p className="text-[8px] sm:text-[10px] text-gray-500 mb-2 sm:mb-3">
                  TechCorp Engineering Division
                </p>
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[7px] sm:text-[9px] font-medium text-green-500 uppercase tracking-widest">
                    Ready to accept
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              How VIBE Works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The bridge between learning and leading in the professional world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap />,
                title: "Industries Upload Tasks",
                desc: "Real business problems waiting for solutions.",
              },
              {
                icon: <Rocket />,
                title: "Students Apply & Build",
                desc: "Showcase skills by solving the task at hand.",
              },
              {
                icon: <BrainCircuit />,
                title: "Faculty Mentors Guide",
                desc: "Expert guidance throughout the task lifecycle.",
              },
              {
                icon: <ShieldCheck />,
                title: "Get Verified Offers",
                desc: "Successful completion leads to direct offers.",
              },
            ].map((step, idx) => (
              <div key={idx} className="h-full">
                <GlassCard className="h-80 flex flex-col">
                  <div className="flex flex-col h-full relative">
                    <div className="w-14 h-14 bg-[#FF6B00]/10 rounded-2xl flex items-center justify-center mb-6 text-[#FF6B00] flex-shrink-0">
                      {step.icon}
                    </div>
                    <div className="flex-1 flex flex-col pb-16">
                      <h3 className="text-xl font-bold mb-3 text-slate-900 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                    <div className="text-6xl font-black text-slate-100 absolute -bottom-2 -right-2">
                      0{idx + 1}
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why VIBE Section */}
      <section id="features" className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-slate-900">
                Why Choose VIBE?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Verified Industries Only",
                    desc: "We vet every partner to ensure quality and legitimacy.",
                  },
                  {
                    title: "Mentorship While You Build",
                    desc: "Don't just work, grow with guidance from expert faculty.",
                  },
                  {
                    title: "Skill-Based Selection",
                    desc: "Resumes tell stories, tasks show truth. We value your work.",
                  },
                  {
                    title: "Outcome-Driven",
                    desc: "The end goal is a meaningful internship or job offer.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex space-x-4">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00]">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">
                        {item.title}
                      </h4>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ILLUSTRATIVE CONTENT FOR WHY VIBE - Hidden on mobile */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 lg:mt-0">
              <div className="space-y-4 sm:pt-8">
                {/* MENTORSHIP CARD */}
                <motion.div className="h-48 sm:h-64 bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 sm:p-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <div className="space-y-3 sm:space-y-4 relative z-10">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <BrainCircuit size={16} className="sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[8px] sm:text-[10px] font-black tracking-widest uppercase text-slate-400">
                        Live Mentorship
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 border-2 border-white" />
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-900">
                          Dr. Sarah Chen
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-slate-500">
                          Stanford AI Lab
                        </p>
                      </div>
                    </div>
                    <div className="p-2 sm:p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[9px] sm:text-[11px] text-slate-600 leading-relaxed italic">
                      "Your neural network architecture is excellent. Let's
                      focus on the data preprocessing step next."
                    </div>
                  </div>
                  <div className="flex justify-end relative z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 sm:h-8 px-2 sm:px-3 text-[8px] sm:text-[10px] font-black uppercase"
                    >
                      Message
                    </Button>
                  </div>
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
                </motion.div>

                {/* VERIFIED STATUS CARD */}
                <motion.div className="h-32 sm:h-48 bg-[#FF6B00]/5 border border-[#FF6B00]/10 rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF6B00] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#FF6B00]/20">
                    <UserCheck size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      100% Verified
                    </h4>
                    <p className="text-[8px] sm:text-[10px] text-slate-500 max-w-[120px] mx-auto">
                      All industries are manually vetted by VIBE Security.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4">
                {/* ANALYTICS / PROGRESS CARD */}
                <motion.div className="h-32 sm:h-48 bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-50 rounded-lg flex items-center justify-center text-[#FF6B00]">
                      <TrendingUp size={12} className="sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-bold text-green-500 bg-green-50 px-1.5 sm:px-2 py-0.5 rounded-full">
                      +12% Skill growth
                    </span>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-[10px] sm:text-xs font-bold text-slate-900">
                      Career Readiness
                    </p>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "88%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-[#FF6B00] to-orange-400"
                      />
                    </div>
                    <div className="flex justify-between text-[8px] sm:text-[10px] font-medium text-slate-400">
                      <span>Lvl 8 Senior Student</span>
                      <span>88/100</span>
                    </div>
                  </div>
                </motion.div>

                {/* SUCCESS OFFER CARD */}
                <motion.div className="h-48 sm:h-64 bg-white rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden group border border-gray-100">
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <Zap className="text-[#FF6B00]" size={16} />
                      <div className="flex -space-x-1 sm:-space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gray-100 border border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h4 className="text-xs sm:text-sm font-black text-gray-800 leading-tight">
                        Internship Secured
                      </h4>
                      <p className="text-[8px] sm:text-[10px] text-gray-500">
                        TechCorp Cloud Infrastructure
                      </p>
                    </div>
                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                        <CheckCircle className="text-green-500" size={12} />
                        <span className="text-[8px] sm:text-[10px] font-bold text-gray-800 uppercase tracking-widest">
                          Offer Accepted
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[8px] sm:text-[10px]">
                        <span className="text-gray-500">Starts In:</span>
                        <span className="text-gray-800 font-bold">14 Days</span>
                      </div>
                    </div>
                  </div>
                  {/* Background Grid Pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #333 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#FF6B00]/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Who is VIBE for?
            </h2>
            <p className="text-slate-600">
              A ecosystem built for mutual success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RoleCard
              title="Student"
              icon={<GraduationCap size={40} />}
              points={[
                "Apply via real tasks",
                "Learn from faculty mentors",
                "Build real portfolio",
                "Get verified offers",
              ]}
              cta="Join as Student"
              link="/signup/student"
            />
            <RoleCard
              title="Faculty"
              icon={<Users size={40} />}
              points={[
                "Mentor industry problems",
                "Guide future professionals",
                "Gain recognition & impact",
                "Collaborate with industry",
              ]}
              cta="Join as Faculty"
              link="/signup/faculty"
              highlight
            />
            <RoleCard
              title="Industry"
              icon={<Briefcase size={40} />}
              points={[
                "Hire skilled interns",
                "Evaluate real work",
                "Reduce hiring risk",
                "Direct talent pipeline",
              ]}
              cta="Join as Industry"
              link="/signup/industry"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600">
              Everything you need to know about the platform.
            </p>
          </div>

          <div className="space-y-4">
            <FAQAccordion
              question="Is VIBE free for students?"
              answer="Yes, VIBE is completely free for students to browse tasks, work with mentors, and apply for internships."
            />
            <FAQAccordion
              question="How are industries verified?"
              answer="We perform rigorous background checks on every company that applies to post internships, ensuring they have a physical presence and a track record of fair compensation."
            />
            <FAQAccordion
              question="What kind of mentorship is provided?"
              answer="Faculty mentors from registered colleges guide students through technical challenges while solving industry-provided tasks."
            />
            <FAQAccordion
              question="Is an internship guaranteed?"
              answer="While not guaranteed for everyone, students who successfully complete the specific industry tasks to the required standard are fast-tracked for official internship offers."
            />
          </div>
        </div>
      </section>

      {/* NEW IMMERSIVE CTA LAYOUT */}
      <section className="py-24 px-4 overflow-hidden bg-[#FAFAFA]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto relative rounded-[40px] bg-white p-8 md:p-16 lg:p-24 overflow-hidden shadow-2xl border border-slate-200"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, #FF6B00 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="w-20 h-20 bg-[#FF6B00] rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-[#FF6B00]/40 mb-10 transform -rotate-12 hover:rotate-0 transition-all duration-500"
            >
              <Sparkles size={40} className="fill-current" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-8">
              Ready to find your <span className="text-[#FF6B00]">VIBE</span>?
            </h2>

            <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed">
              Stop sending generic resumes. Start proving your potential through
              real tasks and join the top 1% of talent secured by verified
              industries.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-64 h-16 text-xl rounded-2xl shadow-2xl shadow-[#FF6B00]/20 group"
                >
                  Get Started Now
                  <ArrowRight
                    className="ml-3 group-hover:scale-110 transition-transform"
                    size={24}
                  />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-64 h-16 text-xl rounded-2xl border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-black hover:border-slate-400 group"
                >
                  Log In to Dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle size={20} />{" "}
                <span className="text-xs font-bold uppercase tracking-widest">
                  No hidden fees
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle size={20} />{" "}
                <span className="text-xs font-bold uppercase tracking-widest">
                  Secure & Vetted
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle size={20} />{" "}
                <span className="text-xs font-bold uppercase tracking-widest">
                  24/7 Support
                </span>
              </div>
            </div>
          </div>

          {/* Floating Accents - Now visible on mobile */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-10 sm:top-20 left-4 sm:left-20"
          >
            <div className="p-3 sm:p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <CheckCircle size={12} className="sm:w-4 sm:h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[8px] sm:text-[10px] font-bold text-slate-800 uppercase">
                    Profile Verified
                  </p>
                  <p className="text-[6px] sm:text-[8px] text-slate-500">
                    Secured by VIBE Protocol
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20"
          >
            <div className="p-3 sm:p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FF6B00] flex items-center justify-center text-white">
                  <Rocket size={12} className="sm:w-4 sm:h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[8px] sm:text-[10px] font-bold text-slate-800 uppercase">
                    Fast Track
                  </p>
                  <p className="text-[6px] sm:text-[8px] text-slate-500">
                    Internship Offer Active
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

const RoleCard = ({ title, icon, points, cta, link, highlight }) => (
  <GlassCard glow={highlight} className="h-full flex flex-col group">
    <div
      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 ${highlight ? "bg-[#FF6B00] text-white shadow-lg" : "bg-slate-100 text-[#FF6B00]"}`}
    >
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-6 text-slate-900">{title}</h3>
    <ul className="space-y-4 mb-10 flex-grow">
      {points.map((p, i) => (
        <li key={i} className="flex items-start space-x-3 text-slate-600">
          <CheckCircle2
            size={18}
            className="text-[#FF6B00] mt-1 flex-shrink-0"
          />
          <span>{p}</span>
        </li>
      ))}
    </ul>
    <Link to={link}>
      <Button
        variant={
          title === "Faculty" ? "faculty" : highlight ? "primary" : "outline"
        }
        fullWidth
      >
        {cta}
      </Button>
    </Link>
  </GlassCard>
);

const FAQAccordion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-[#FF6B00] transition-colors"
      >
        <span className="text-lg font-semibold text-slate-800">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} className="text-slate-400" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-slate-600 leading-relaxed">{answer}</p>
      </motion.div>
    </div>
  );
};

export default Home;
