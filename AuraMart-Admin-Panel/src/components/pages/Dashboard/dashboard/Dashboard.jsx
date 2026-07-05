import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Package, ShoppingCart, CheckCircle, Clock, XCircle,
  ArrowRight, TrendingUp, IndianRupee, RefreshCcw,
} from "lucide-react";
import { ApiEndpoints } from "../../../../api/apis";
import { request } from "../../../../api/request";
import { formatINR, formatDate } from "../../../../lib/utils";
import { StatusBadge } from "../../../ui/Badge";
import { SkeletonCard } from "../../../ui/Loader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const ORDER_STATUSES = [
  { label: "Pending",    key: "pending",    path: "pending",    color: "bg-amber-50  text-amber-700  border-amber-200"   },
  { label: "Confirmed",  key: "confirm",    path: "confirm",    color: "bg-[#FFF1F1] text-[#E63946] border-[#E63946]/30" },
  { label: "Processing", key: "processing", path: "processing", color: "bg-purple-50 text-purple-700 border-purple-200"  },
  { label: "Pickup",     key: "pickup",     path: "pickup",     color: "bg-teal-50   text-teal-700   border-teal-200"    },
  { label: "On The Way", key: "on_the_way", path: "on-the-way", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { label: "Delivered",  key: "delivered",  path: "delivered",  color: "bg-green-50  text-green-700  border-green-200"  },
  { label: "Cancelled",  key: "cancelled",  path: "cancel",     color: "bg-red-50    text-red-700    border-red-200"    },
];

const colorMap = {
  red:    "bg-[#FFF1F1] text-[#E63946] ring-1 ring-[#E63946]/25",
  purple: "bg-purple-50 text-purple-600 ring-1 ring-purple-200",
  green:  "bg-[#F1F8E9] text-[#7CB342]  ring-1 ring-[#7CB342]/25",
  amber:  "bg-amber-50  text-amber-600  ring-1 ring-amber-200",
  indigo: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200",
  danger: "bg-red-50    text-red-600    ring-1 ring-red-200",
  teal:   "bg-teal-50   text-teal-600   ring-1 ring-teal-200",
};

const Dashboard = () => {
  const [stats, setStats]           = useState({ products: null, orders: null, revenue: null });
  const [recentOrders, setRecent]   = useState([]);
  const [counts, setCounts]         = useState({});
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    const [productsRes, ordersRes] = await Promise.allSettled([
      request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_PRODUCT }),
      request({ method: "GET", url: ApiEndpoints.ORDERS.ALL_ORDERS }),
    ]);

    const [productData] = productsRes.status === "fulfilled" ? productsRes.value : [null];
    const [orderData]   = ordersRes.status   === "fulfilled" ? ordersRes.value   : [null];

    const orders = orderData?.data || [];
    const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);

    const statusCounts = {};
    ORDER_STATUSES.forEach(s => { statusCounts[s.key] = 0; });
    orders.forEach(o => {
      const key = (o.status || "").toLowerCase().replace(/\s+/g, "_");
      if (key in statusCounts) statusCounts[key]++;
    });

    setStats({
      products: productData?.data?.length ?? productData?.total ?? 0,
      orders:   orders.length,
      revenue:  totalRevenue,
    });
    setCounts(statusCounts);
    setRecent(orders.slice(0, 10));

    if (silent) { toast.success("Dashboard refreshed"); setRefreshing(false); }
    else setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const STAT_CARDS = [
    { label: "Total Products", value: stats.products,               icon: Package,       color: "red",    href: "/admin/products"         },
    { label: "Total Orders",   value: stats.orders,                 icon: ShoppingCart,  color: "purple", href: "/admin/all-orders"        },
    { label: "Revenue (INR)",  value: stats.revenue != null ? formatINR(stats.revenue) : null, icon: IndianRupee, color: "teal", href: "/admin/all-orders" },
    { label: "Delivered",      value: counts.delivered ?? 0,        icon: CheckCircle,   color: "green",  href: "/admin/orders/delivered"  },
    { label: "Pending",        value: counts.pending ?? 0,          icon: Clock,         color: "amber",  href: "/admin/orders/pending"    },
    { label: "Cancelled",      value: counts.cancelled ?? 0,        icon: XCircle,       color: "danger", href: "/admin/orders/cancel"     },
  ];

  const chartOptions = {
    chart: { type: "donut", toolbar: { show: false }, animations: { enabled: true, speed: 700 } },
    labels: ["Delivered", "Pending", "Cancelled", "Processing", "On The Way"],
    colors: ["#7CB342", "#F59E0B", "#EF4444", "#A855F7", "#F97316"],
    legend: { position: "bottom", fontSize: "12px", fontFamily: "Inter, sans-serif", markers: { radius: 4 } },
    dataLabels: { enabled: false },
    stroke: { width: 2 },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            total: {
              show: true, label: "Total Orders", fontFamily: "Inter",
              fontSize: "12px", fontWeight: 400, color: "#6B7280",
              formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0).toString(),
            },
            value: { fontFamily: "Inter", fontSize: "22px", fontWeight: 700, color: "#2B2D42" },
          },
        },
      },
    },
    responsive: [{ breakpoint: 480, options: { legend: { position: "bottom" } } }],
  };

  const chartSeries = [
    counts.delivered  || 0,
    counts.pending    || 0,
    counts.cancelled  || 0,
    counts.processing || 0,
    counts.on_the_way || 0,
  ];

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">

      {/* Welcome bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2B2D42]">{greeting}, Admin 👋</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            {now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCcw size={13} className={refreshing ? "animate-spin" : ""} />}
          onClick={() => loadData(true)}
          disabled={refreshing || loading}
        >
          Refresh
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : STAT_CARDS.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.label} to={s.href} className="block group">
                  <div className="bg-white rounded-xl border border-[#EAEAEA] p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[s.color]}`}>
                      <Icon size={18} />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-[#2B2D42] leading-tight truncate">
                      {s.value ?? "—"}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5 font-medium">{s.label}</p>
                  </div>
                </Link>
              );
            })}
      </div>

      {/* Order status strip */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Overview</CardTitle>
        </CardHeader>
        <CardBody className="py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {ORDER_STATUSES.map(({ label, key, path, color }) => (
              <Link key={key} to={`/admin/orders/${path}`}>
                <div className={`rounded-xl border px-3 py-3 text-center hover:-translate-y-0.5 hover:shadow-sm transition-all cursor-pointer ${color}`}>
                  <p className="text-xl font-bold">{loading ? "—" : (counts[key] ?? 0)}</p>
                  <p className="text-[10px] font-semibold mt-0.5 uppercase tracking-wide opacity-80">{label}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Recent orders + chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent orders table */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader
              action={
                <Link to="/admin/all-orders" className="text-xs text-[#E63946] hover:text-[#C5303A] flex items-center gap-1 font-semibold">
                  View all <ArrowRight size={12} />
                </Link>
              }
            >
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>

            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-10 rounded" />)}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingCart size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-[#6B7280]">No orders yet</p>
                <p className="text-xs text-gray-400 mt-1">Orders will appear here once customers start purchasing</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr key={order._id || i}>
                        <td>
                          <Link
                            to={`/admin/orders/order-details/${order._id}`}
                            className="font-mono text-xs font-semibold text-[#E63946] hover:underline"
                          >
                            #{(order.orderCode || order._id?.slice(-8) || `ORD${i + 1}`).toString().toUpperCase()}
                          </Link>
                        </td>
                        <td className="text-[#6B7280] text-xs max-w-[120px] truncate">
                          {order.user?.email || order.user?.name || "—"}
                        </td>
                        <td className="text-[#6B7280]">{order.items?.length || 1}</td>
                        <td className="text-[#6B7280] text-xs">{formatDate(order.createdAt)}</td>
                        <td><StatusBadge status={order.status || "pending"} /></td>
                        <td className="text-right font-semibold text-[#2B2D42]">
                          {formatINR(order.totalAmount || order.total || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Donut chart */}
        <div>
          <Card className="h-full">
            <CardHeader><CardTitle>Order Distribution</CardTitle></CardHeader>
            <CardBody>
              {loading ? (
                <div className="skeleton h-64 rounded-lg" />
              ) : chartSeries.every(v => v === 0) ? (
                <div className="flex flex-col items-center justify-center h-56 text-center">
                  <TrendingUp size={32} className="text-gray-200 mb-3" />
                  <p className="text-sm text-[#6B7280]">No order data yet</p>
                  <p className="text-xs text-gray-400 mt-1">Chart will populate once orders come in</p>
                </div>
              ) : (
                <Chart options={chartOptions} series={chartSeries} type="donut" height={280} />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
