import React from "react";
import { Bell, ShoppingCart, Package, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";

const DEMO_NOTIFICATIONS = [
  { id: 1, icon: ShoppingCart, iconBg: "bg-[#FFF1F1] text-[#E63946]", title: "New order placed",         message: "Order #RC000901 placed by a customer",   time: "2 min ago",  read: false },
  { id: 2, icon: Package,      iconBg: "bg-purple-50 text-purple-600", title: "Order delivered",          message: "Order #RC000875 has been delivered",      time: "1 hour ago", read: false },
  { id: 3, icon: Tag,          iconBg: "bg-[#F1F8E9] text-[#7CB342]", title: "Coupon about to expire",   message: "Coupon SAVE20 expires in 24 hours",       time: "3 hours ago",read: true  },
  { id: 4, icon: ShoppingCart, iconBg: "bg-amber-50 text-amber-600",  title: "Order pending — 2 hours",  message: "3 orders have been pending for 2+ hours", time: "5 hours ago",read: true  },
];

const Notifications = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Recent system alerts and activity"
        breadcrumbs={[{ label: "Notifications" }]}
        icon={<Bell size={20} />}
      />

      <Card>
        <CardHeader><CardTitle>All Notifications</CardTitle></CardHeader>
        <CardBody className="divide-y divide-[#F5F0EA]">
          {DEMO_NOTIFICATIONS.map(({ id, icon: Icon, iconBg, title, message, time, read }) => (
            <div key={id} className={`flex items-start gap-3 py-3 ${!read ? "bg-[#FFF8F8]/60 -mx-6 px-6" : ""}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${!read ? "font-semibold text-[#2B2D42]" : "font-medium text-[#6B7280]"}`}>{title}</p>
                  {!read && <span className="w-2 h-2 rounded-full bg-[#E63946] flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">{message}</p>
                <p className="text-[10px] text-gray-400 mt-1">{time}</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default Notifications;
