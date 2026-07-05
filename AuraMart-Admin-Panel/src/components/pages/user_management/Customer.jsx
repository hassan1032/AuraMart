import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Users, ShoppingBag, TrendingUp, DollarSign, Mail, Phone, Calendar } from "lucide-react";
import { request } from "../../../api/request";
import { ApiEndpoints } from "../../../api/apis";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../ui/Table";
import { Pagination } from "../../ui/Pagination";
import { SearchInput } from "../../ui/SearchInput";
import { formatINR, formatDate, getInitials } from "../../../lib/utils";

const LIMIT = 10;

const StatCard = ({ icon, label, value, color, bg }) => (
  <div className="bg-white rounded-xl border border-[#EAEAEA] p-4 shadow-sm">
    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
      {React.cloneElement(icon, { size: 18, className: color })}
    </div>
    <p className="text-2xl font-bold text-[#2B2D42]">{value}</p>
    <p className="text-xs text-[#6B7280] mt-0.5 font-medium">{label}</p>
  </div>
);

const Customer = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.ORDERS.ALL_ORDERS });
      if (!error && data?.data) {
        setOrders(Array.isArray(data.data) ? data.data : []);
        toast.success(`Loaded ${Array.isArray(data.data) ? data.data.length : 0} orders`);
      } else if (error) {
        toast.error(error.message || "Failed to load customer data");
      }
      setLoading(false);
    })();
  }, []);

  // Derive unique customers from orders
  const customers = useMemo(() => {
    const map = new Map();
    orders.forEach(order => {
      const user = order.user;
      if (!user) return;
      const key = user.email || user._id;
      if (!key) return;

      const name = user.name
        || (`${user.firstName || ""} ${user.lastName || ""}`.trim())
        || (user.email?.split("@")[0] || "Customer");

      if (map.has(key)) {
        const c = map.get(key);
        c.orderCount += 1;
        c.totalSpent += (order.totalAmount || 0);
        if (new Date(order.createdAt) > new Date(c.lastOrderDate)) {
          c.lastOrderDate = order.createdAt;
          c.lastOrderStatus = order.status;
        }
      } else {
        map.set(key, {
          _id: user._id || key,
          email: user.email || "—",
          name,
          phone: user.contact || user.phone || "—",
          orderCount: 1,
          totalSpent: order.totalAmount || 0,
          lastOrderDate: order.createdAt,
          lastOrderStatus: order.status || "pending",
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(c =>
      c.email?.toLowerCase().includes(q) ||
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  }, [customers, search]);

  const totalRevenue = useMemo(() => customers.reduce((s, c) => s + c.totalSpent, 0), [customers]);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

  const totalPages = Math.ceil(filtered.length / LIMIT);
  const paginated = filtered.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const statusColor = (s) => {
    const map = {
      delivered: "bg-[#F1F8E9] text-[#7CB342]",
      cancelled: "bg-red-50 text-red-600",
      pending: "bg-amber-50 text-amber-600",
      processing: "bg-purple-50 text-purple-600",
      confirmed: "bg-[#FFF1F1] text-[#E63946]",
    };
    return map[(s || "").toLowerCase()] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle="Customers who placed orders through the AuraMart storefront"
        breadcrumbs={[{ label: "Users" }, { label: "Customers" }]}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<Users />} label="Total Customers" value={loading ? "—" : customers.length} color="text-[#E63946]" bg="bg-[#FFF1F1]" />
        <StatCard icon={<ShoppingBag />} label="Total Orders" value={loading ? "—" : orders.length} color="text-purple-600" bg="bg-purple-50" />
        <StatCard icon={<TrendingUp />} label="Total Revenue" value={loading ? "—" : formatINR(totalRevenue)} color="text-[#7CB342]" bg="bg-[#F1F8E9]" />
        <StatCard icon={<DollarSign />} label="Avg. Order Value" value={loading ? "—" : formatINR(avgOrderValue)} color="text-amber-600" bg="bg-amber-50" />
      </div>

      {/* Table */}
      <Card>
        <CardHeader
          action={
            <SearchInput
              value={search}
              onChange={v => { setSearch(v); setCurrentPage(1); }}
              placeholder="Search by name or email…"
              className="w-64"
            />
          }
        >
          <CardTitle>
            All Customers{" "}
            <span className="text-[#6B7280] font-normal text-sm">({filtered.length})</span>
          </CardTitle>
        </CardHeader>

        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Customer</Th>
              <Th>Contact</Th>
              <Th className="text-center">Orders</Th>
              <Th className="text-right">Total Spent</Th>
              <Th>Last Order</Th>
              <Th>Last Status</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={6} cols={7} />
            ) : paginated.length === 0 ? (
              <TableEmpty
                message={search ? "No customers match your search" : "No customers yet — they appear once orders are placed"}
                icon={<Users size={24} />}
              />
            ) : (
              paginated.map((customer, i) => (
                <tr key={customer._id}>
                  <Td className="text-[#6B7280] text-xs">{(currentPage - 1) * LIMIT + i + 1}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#E63946] text-xs font-bold flex-shrink-0">
                        {getInitials(customer.name) || customer.email?.[0]?.toUpperCase() || "C"}
                      </div>
                      <div>
                        <p className="font-medium text-[#2B2D42] text-sm leading-tight">{customer.name}</p>
                        <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5">
                          <Mail size={10} /> {customer.email}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                      <Phone size={11} className="flex-shrink-0" />
                      {customer.phone}
                    </div>
                  </Td>
                  <Td className="text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FFF1F1] text-[#E63946] text-xs font-bold">
                      {customer.orderCount}
                    </span>
                  </Td>
                  <Td className="text-right font-semibold text-[#2B2D42]">
                    {formatINR(customer.totalSpent)}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                      <Calendar size={10} className="flex-shrink-0" />
                      {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : "—"}
                    </div>
                  </Td>
                  <Td>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor(customer.lastOrderStatus)}`}>
                      {(customer.lastOrderStatus || "—").replace(/_/g, " ")}
                    </span>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {!loading && totalPages > 1 && (
          <div className="px-6 py-3 border-t border-[#F5F0EA]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={p => { setCurrentPage(p); window.scrollTo(0, 0); }}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Customer;
