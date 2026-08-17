import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#FF6B00] text-white hover:bg-[#e65a00] hover:shadow-[0_8px_20px_rgba(255,107,0,0.3)]",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200",
    outline:
      "border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    faculty:
      "bg-white text-[#FF6B00] border-2 border-[#FF6B00] hover:bg-[#FF6B00] hover:text-white active:bg-white active:text-[#FF6B00]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
