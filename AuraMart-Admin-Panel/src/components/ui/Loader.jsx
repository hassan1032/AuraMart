import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export function Spinner({ size = 20, className }) {
  return <Loader2 size={size} className={cn("animate-spin text-[#E63946]", className)} />;
}

const sizeMap = { xs: 12, sm: 16, md: 20, lg: 28, xl: 36 };

export function Loader({ size = "md", className }) {
  return <Spinner size={sizeMap[size] ?? 20} className={className} />;
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={32} />
        <p className="text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={28} />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export function InlineLoader({ text = "Loading..." }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 py-8 justify-center">
      <Spinner size={16} />
      <span>{text}</span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-[#EAEAEA] p-6 space-y-3">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton h-8 w-16 rounded" />
      <div className="skeleton h-3 w-32 rounded" />
    </div>
  );
}

export function EmptyState({ title, message, icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
        {icon || (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title || "Nothing here yet"}</h3>
      <p className="text-sm text-gray-400 max-w-xs">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
