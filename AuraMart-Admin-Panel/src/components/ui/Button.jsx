import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-[#E63946] hover:bg-[#C5303A] text-white shadow-sm focus-visible:ring-[#E63946]",
  secondary: "bg-white hover:bg-[#FAF7F2] text-[#2B2D42] border border-[#EAEAEA] shadow-sm",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm focus-visible:ring-red-500",
  success: "bg-[#7CB342] hover:bg-[#5D8E2A] text-white shadow-sm",
  warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-sm",
  ghost: "hover:bg-[#FAF7F2] text-[#6B7280]",
  outline: "border border-[#E63946] text-[#E63946] hover:bg-[#FFF1F1]",
  "danger-outline": "border border-red-300 text-red-600 hover:bg-red-50",
};

const sizes = {
  xs: "h-7 px-2.5 text-xs rounded-md gap-1",
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-9 px-4 text-sm rounded-lg gap-2",
  lg: "h-10 px-5 text-sm rounded-xl gap-2",
  xl: "h-11 px-6 text-base rounded-xl gap-2",
  icon: "h-9 w-9 rounded-lg",
  "icon-sm": "h-7 w-7 rounded-md",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  className,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={14} />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
