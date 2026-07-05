import React from "react";
import { cn } from "../../lib/utils";

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-[#EAEAEA] shadow-sm",
        hover && "hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, action }) {
  return (
    <div className={cn("flex items-center justify-between px-6 py-4 border-b border-[#F5F0EA]", className)}>
      <div className="flex-1 min-w-0">{children}</div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn("text-base font-semibold text-gray-900", className)}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className }) {
  return (
    <div className={cn("px-6 py-4", className)}>{children}</div>
  );
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn("px-6 py-3 border-t border-[#F5F0EA] bg-[#FAF7F2]/50 rounded-b-xl", className)}>
      {children}
    </div>
  );
}
