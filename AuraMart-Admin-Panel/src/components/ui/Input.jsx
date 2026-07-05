import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef(({ className, label, error, hint, icon, iconRight, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent",
            "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
            "transition-colors",
            icon && "pl-10",
            iconRight && "pr-10",
            error && "border-red-400 focus:ring-red-400",
            "px-3",
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
});
Input.displayName = "Input";

export const Textarea = forwardRef(({ className, label, error, hint, rows = 3, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 p-3 resize-none",
          "focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent",
          "disabled:bg-gray-50 disabled:cursor-not-allowed",
          error && "border-red-400 focus:ring-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
});
Textarea.displayName = "Textarea";

export function FormGroup({ children, className }) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

export function FormRow({ children, cols = 2, className }) {
  return (
    <div className={cn(`grid grid-cols-1 gap-4`, cols === 2 && "sm:grid-cols-2", cols === 3 && "sm:grid-cols-3", className)}>
      {children}
    </div>
  );
}
