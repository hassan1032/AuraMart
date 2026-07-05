import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export function Pagination({ currentPage, totalPages, onPageChange, className }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const range = 2;
  let start = Math.max(1, currentPage - range);
  let end = Math.min(totalPages, currentPage + range);
  if (start > 1) pages.push(1);
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("...");
  if (end < totalPages) pages.push(totalPages);

  return (
    <div className={cn("flex items-center justify-between gap-4 px-1", className)}>
      <p className="text-xs text-gray-400">
        Page <span className="font-medium text-gray-600">{currentPage}</span> of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="h-8 w-8 flex items-center justify-center text-xs text-gray-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "h-8 w-8 text-xs font-medium rounded-lg border transition-colors",
                p === currentPage
                  ? "bg-[#E63946] text-white border-[#E63946]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
