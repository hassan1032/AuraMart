import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../../ui/Table";
import { Pagination } from "../../../ui/Pagination";
import { ConfirmModal } from "../../../ui/Modal";
import { formatDate } from "../../../../lib/utils";

const LIMIT = 10;

const Coupon = () => {
  const { hasPermission } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.PROMOTION_MANAGEMENT.ALL_COUPON });
      if (!error && Array.isArray(data?.data)) setCoupons(data.data);
      else if (error) toast.error("Failed to load coupons");
      setLoading(false);
    })();
  }, []);

  const totalPages = Math.ceil(coupons.length / LIMIT);
  const paginated = coupons.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PROMOTION_MANAGEMENT.COUPON_STATUS, data: { id, status: newStatus } });
    if (error) toast.error("Failed to update status");
    else setCoupons(prev => prev.map(c => c._id === id ? { ...c, status: data?.data?.status || newStatus } : c));
  };

  const handleDelete = async () => {
    const [, error] = await request({ method: "DELETE", url: ApiEndpoints.PROMOTION_MANAGEMENT.DELETE_COUPON(confirmId) });
    if (error) toast.error("Failed to delete");
    else { setCoupons(prev => prev.filter(c => c._id !== confirmId)); toast.success("Coupon deleted"); }
    setConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        subtitle="Manage discount codes and promotions"
        breadcrumbs={[{ label: "Promotions" }, { label: "Coupons" }]}
        action={
          hasPermission("Coupon", "create") && (
            <Link to="/admin/coupons/create">
              <Button icon={<Plus size={15} />}>Add Coupon</Button>
            </Link>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All Coupons <span className="text-gray-400 font-normal text-sm">({coupons.length})</span></CardTitle>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Code</Th>
              <Th>Discount</Th>
              <Th>Min. Order</Th>
              <Th>Valid From</Th>
              <Th>Expires</Th>
              <Th>Status</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={4} cols={8} /> :
              paginated.length === 0 ? (
                <TableEmpty message="No coupons yet" icon={<Tag size={24} />}
                  action={<Link to="/admin/coupons/create"><Button size="sm" icon={<Plus size={13} />}>Add Coupon</Button></Link>} />
              ) : paginated.map((coupon, i) => (
                <tr key={coupon._id}>
                  <Td className="text-gray-400 text-xs">{(currentPage - 1) * LIMIT + i + 1}</Td>
                  <Td>
                    <span className="font-mono font-bold text-[#E63946] text-sm bg-[#FFF1F1] px-2 py-0.5 rounded">{coupon.couponCode || coupon.code}</span>
                  </Td>
                  <Td>
                    <span className="font-semibold text-green-700">
                      {coupon.discountType === "percentage" ? `${coupon.discount}%` : `₹${coupon.discount}`}
                    </span>
                  </Td>
                  <Td className="text-gray-600">₹{coupon.minPurchaseAmount || coupon.minimumAmount || 0}</Td>
                  <Td className="text-gray-500 text-xs">{formatDate(coupon.startDate || coupon.startedAt)}</Td>
                  <Td className="text-gray-500 text-xs">{formatDate(coupon.endDate || coupon.expiryDate)}</Td>
                  <Td>
                    <button
                      onClick={() => handleStatusToggle(coupon._id, coupon.status)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${coupon.status === "active" ? "bg-[#E63946]" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${coupon.status === "active" ? "translate-x-4.5" : "translate-x-0.5"}`} />
                    </button>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-center gap-1">
                      {hasPermission("Coupon", "edit") && (
                        <Link to={`/admin/coupons/edit/${coupon._id}`}>
                          <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />} />
                        </Link>
                      )}
                      {hasPermission("Coupon", "delete") && (
                        <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} onClick={() => setConfirmId(coupon._id)} />
                      )}
                    </div>
                  </Td>
                </tr>
              ))
            }
          </tbody>
        </Table>
        {!loading && totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </Card>

      <ConfirmModal open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Delete Coupon" message="This will permanently delete this coupon code." />
    </div>
  );
};

export default Coupon;
