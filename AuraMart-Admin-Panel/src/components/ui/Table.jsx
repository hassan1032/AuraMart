import React from "react";
import { cn } from "../../lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export function Table({ children, className }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full text-sm data-table", className)}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className, sortable, sorted, onSort }) {
  return (
    <th
      className={cn(
        "whitespace-nowrap select-none",
        sortable && "cursor-pointer hover:text-gray-800 hover:bg-gray-100",
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <span className="text-gray-400">
            {sorted === "asc" ? <ChevronUp size={12} /> : sorted === "desc" ? <ChevronDown size={12} /> : <ChevronsUpDown size={12} />}
          </span>
        )}
      </div>
    </th>
  );
}

export function Td({ children, className }) {
  return <td className={cn("whitespace-nowrap", className)}>{children}</td>;
}

// Skeleton loader for table rows
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className={cn("skeleton h-4 rounded", j === 0 ? "w-8" : j === 1 ? "w-10 h-10 rounded-lg" : "w-24")} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// Empty state for tables
export function TableEmpty({ message = "No data found", icon, action }) {
  return (
    <tr>
      <td colSpan={100} className="text-center py-16">
        <div className="flex flex-col items-center gap-3">
          {icon ? (
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              {icon}
            </div>
          ) : (
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">{message}</p>
            <p className="text-xs text-gray-400 mt-0.5">Try adjusting your search or filters</p>
          </div>
          {action && <div className="mt-2">{action}</div>}
        </div>
      </td>
    </tr>
  );
}
