import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ShoppingCart, Eye, Package } from "lucide-react";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle } from "../../../ui/Card";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../../ui/Table";
import { Pagination } from "../../../ui/Pagination";
import { SearchInput } from "../../../ui/SearchInput";
import { StatusBadge } from "../../../ui/Badge";
import { formatINR, formatDate } from "../../../../lib/utils";

const LIMIT = 10;

const OrderListPage = ({ title, subtitle, statusFilter, breadcrumb }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.ORDERS.ALL_ORDERS });
      if (!error && Array.isArray(data?.data)) {
        const all = data.data;
        setOrders(statusFilter ? all.filter(o => (o.status || "").toLowerCase() === statusFilter.toLowerCase()) : all);
      } else if (error) toast.error("Failed to load orders");
      setLoading(false);
    })();
  }, [statusFilter]);

  const filtered = orders.filter(o =>
    !search || (o.orderCode || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.user?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / LIMIT);
  const paginated = filtered.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={[{ label: "Orders" }, { label: breadcrumb || title }]}
      />

      <Card>
        <CardHeader
          action={
            <SearchInput
              value={search}
              onChange={v => { setSearch(v); setCurrentPage(1); }}
              placeholder="Search by order ID or email..."
              className="w-64"
            />
          }
        >
          <CardTitle>
            {title} <span className="text-gray-400 font-normal text-sm">({filtered.length})</span>
          </CardTitle>
        </CardHeader>

        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Order ID</Th>
              <Th>Date</Th>
              <Th>Customer</Th>
              <Th>Status</Th>
              <Th>Payment</Th>
              <Th className="text-right">Amount</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={6} cols={8} /> :
              paginated.length === 0 ? (
                <TableEmpty
                  message={search ? "No orders match your search" : `No ${title.toLowerCase()} found`}
                  icon={<ShoppingCart size={24} />}
                />
              ) : (
                paginated.map((order, i) => (
                  <tr key={order._id}>
                    <Td className="text-gray-400 text-xs">{(currentPage - 1) * LIMIT + i + 1}</Td>
                    <Td>
                      <span className="font-mono text-xs font-semibold text-[#E63946]">
                        #{order.orderCode || order._id?.slice(-8)?.toUpperCase()}
                      </span>
                    </Td>
                    <Td className="text-gray-500 text-xs">{formatDate(order.createdAt)}</Td>
                    <Td className="text-gray-700">{order.user?.email || order.user?.name || "—"}</Td>
                    <Td><StatusBadge status={order.status || "pending"} /></Td>
                    <Td>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${order.paymentStatus === "paid" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {order.paymentStatus || "COD"}
                      </span>
                    </Td>
                    <Td className="text-right font-semibold text-gray-900">{formatINR(order.totalAmount || 0)}</Td>
                    <Td>
                      <div className="flex items-center justify-center">
                        <Link to={`/admin/orders/order-details/${order._id}`}>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#E63946] transition-colors">
                            <Eye size={14} />
                          </button>
                        </Link>
                      </div>
                    </Td>
                  </tr>
                ))
              )
            }
          </tbody>
        </Table>

        {!loading && totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={p => { setCurrentPage(p); window.scrollTo(0, 0); }} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrderListPage;
