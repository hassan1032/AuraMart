import React from "react";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

export function PageHeader({ title, subtitle, action, breadcrumbs, className }) {
  return (
    <div className={cn("mb-6 page-enter", className)}>
      {breadcrumbs && (
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight size={12} />}
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-gray-600 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-600 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon, trend, trendLabel, color = "blue", loading }) {
  const colorMap = {
    blue: { bg: "bg-[#FFF1F1]", icon: "text-[#E63946]", badge: "text-[#E63946] bg-[#FFF1F1]" },
    green: { bg: "bg-green-50", icon: "text-green-600", badge: "text-green-700 bg-green-100" },
    amber: { bg: "bg-amber-50", icon: "text-amber-600", badge: "text-amber-700 bg-amber-100" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", badge: "text-purple-700 bg-purple-100" },
    red: { bg: "bg-red-50", icon: "text-red-600", badge: "text-red-700 bg-red-100" },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl border border-[#EAEAEA] shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          {loading ? (
            <div className="skeleton h-8 w-24 mt-2 rounded" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-1">{value ?? "—"}</p>
          )}
          {trend != null && (
            <div className={cn("inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium", c.badge)}>
              <span>{trend >= 0 ? "↑" : "↓"}</span>
              <span>{Math.abs(trend)}%</span>
              {trendLabel && <span className="text-gray-400 font-normal ml-1">{trendLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", c.bg)}>
            <span className={c.icon}>{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}
