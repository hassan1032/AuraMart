import React from "react";
import { cn } from "../../lib/utils";

const variants = {
  default: "bg-gray-100 text-gray-700",
  primary: "bg-[#FFF1F1] text-[#E63946]",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
  teal: "bg-teal-100 text-teal-700",
};

const dotColors = {
  default: "bg-gray-500",
  primary: "bg-[#E63946]",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
};

export function Badge({ children, variant = "default", dot = false, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}

// Status badge mapping
const statusMap = {
  active: { variant: "success", label: "Active" },
  inactive: { variant: "danger", label: "Inactive" },
  pending: { variant: "warning", label: "Pending" },
  confirmed: { variant: "primary", label: "Confirmed" },
  confirm: { variant: "primary", label: "Confirmed" },
  processing: { variant: "purple", label: "Processing" },
  pickup: { variant: "teal", label: "Pickup" },
  on_the_way: { variant: "orange", label: "On The Way" },
  ontheway: { variant: "orange", label: "On The Way" },
  delivered: { variant: "success", label: "Delivered" },
  return: { variant: "warning", label: "Return" },
  replacement: { variant: "purple", label: "Replacement" },
  cancelled: { variant: "danger", label: "Cancelled" },
  cancel: { variant: "danger", label: "Cancelled" },
  published: { variant: "success", label: "Published" },
  draft: { variant: "default", label: "Draft" },
  expired: { variant: "danger", label: "Expired" },
  "flash sale": { variant: "orange", label: "Flash Sale" },
  true: { variant: "success", label: "Active" },
  false: { variant: "danger", label: "Inactive" },
};

export function StatusBadge({ status }) {
  const key = String(status).toLowerCase();
  const config = statusMap[key] || { variant: "default", label: status };
  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
}
