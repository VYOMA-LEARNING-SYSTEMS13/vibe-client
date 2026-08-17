import React from "react";

const GlassCard = ({ children, className = "", glow = false }) => {
  return (
    <div className={`relative group ${className}`}>
      <div
        className={`
        absolute inset-0 bg-[#FF6B00]/0 group-hover:bg-[#FF6B00]/5 transition-all duration-500 rounded-3xl blur-2xl
        ${glow ? "bg-[#FF6B00]/10 scale-105" : ""}
      `}
      />
      <div
        className={`
        relative overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 h-full
        transition-all duration-500 hover:border-[#FF6B00]/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] shadow-sm
      `}
      >
        {/* Subtle top-left light leak */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#FF6B00]/5 rounded-full blur-3xl group-hover:bg-[#FF6B00]/10 transition-all" />
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
