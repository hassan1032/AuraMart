import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Package, MapPin, User, ChevronDown, Printer } from "lucide-react";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { StatusBadge } from "../../../ui/Badge";
import { Button } from "../../../ui/Button";
import { formatINR, formatDate } from "../../../../lib/utils";

const ORDER_STATUSES = ["pending", "confirmed", "processing", "pickup", "on_the_way", "delivered", "return", "replacement", "cancelled"];

const InfoRow = ({ label, value }) => (
  <div className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-500 min-w-[120px]">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value || "—"}</span>
  </div>
);

const OrderDetails = () => {
  const { _id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);

  const fetchOrder = async () => {
    if (!_id) return;
    setLoading(true);
    const [data, error] = await request({ method: "POST", url: ApiEndpoints.ORDERS.GET_SINGLE_ORDER, data: { idOrSlug: _id } });
    if (error) { toast.error("Failed to load order"); setLoading(false); return; }
    const o = data?.data || {};
    setOrder(o);
    setSelectedStatus(o.status || "pending");
    setLoading(false);
  };

  useEffect(() => { fetchOrder(); }, [_id]);

  const updateStatus = async (newStatus) => {
    setStatusLoading(true);
    const [, error] = await request({ method: "PUT", url: ApiEndpoints.ORDERS.ORDER_STATUS(_id), data: { status: newStatus } });
    if (error) toast.error("Failed to update status");
    else { setSelectedStatus(newStatus); setOrder(prev => ({ ...prev, status: newStatus })); toast.success("Status updated"); }
    setStatusLoading(false);
    setStatusOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 skeleton h-64 rounded-xl" />
          <div className="skeleton h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) return (
    <div className="text-center py-16">
      <Package size={48} className="mx-auto text-gray-300 mb-3" />
      <p className="text-gray-500">Order not found</p>
      <Link to="/admin/all-orders"><Button className="mt-4" variant="secondary">Back to Orders</Button></Link>
    </div>
  );

  const items = order.items || [];
  const shipping = order.shippingAddress || {};
  const subtotal = items.reduce((s, i) => s + (i.totalPrice || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Order #${order.orderCode || _id?.slice(-8)?.toUpperCase()}`}
        subtitle={`Placed on ${formatDate(order.createdAt)}`}
        breadcrumbs={[{ label: "Orders" }, { label: "Details" }]}
        action={
          <div className="flex items-center gap-2">
            <Link to="/admin/all-orders">
              <Button variant="secondary" size="sm" icon={<ArrowLeft size={13} />}>Back</Button>
            </Link>
            <Button variant="secondary" size="sm" icon={<Printer size={13} />} onClick={() => window.print()}>Print</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - items + summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({items.length})</CardTitle>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedStatus} />
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-y border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Variant</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-gray-400 text-sm">No items</td></tr>
                  ) : items.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.selectedImage && (
                            <img src={item.selectedImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                          )}
                          <span className="font-medium text-gray-900">{item.productData?.productName || item.accessoryData?.accessoryName || "Product"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-500 space-y-0.5">
                          {item.selectedColor && <div>Color: {item.selectedColor}</div>}
                          {item.selectedSize && <div>Size: {item.selectedSize}</div>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{formatINR(item.unitPrice || 0)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatINR(item.totalPrice || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price summary */}
            <div className="px-4 py-4 border-t border-gray-100">
              <div className="ml-auto max-w-xs space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Coupon Discount</span><span>—</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Charge</span><span>{formatINR(order.deliveryCharge || 0)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Grand Total</span><span>{formatINR(order.totalAmount || subtotal)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Order status control */}
          <Card>
            <CardHeader><CardTitle>Order Status</CardTitle></CardHeader>
            <CardBody>
              <div className="relative">
                <button
                  onClick={() => setStatusOpen(p => !p)}
                  disabled={statusLoading}
                  className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <StatusBadge status={selectedStatus} />
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                </button>
                {statusOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                    {ORDER_STATUSES.map(s => (
                      <button key={s} onClick={() => updateStatus(s)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 capitalize transition-colors ${s === selectedStatus ? "bg-[#FFF1F1] text-[#E63946] font-medium" : "text-gray-700"}`}>
                        {s.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Payment</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                  {order.paymentStatus || "COD"}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Shipping address */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> Shipping Address</div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-0">
                <InfoRow label="Name" value={shipping.name} />
                <InfoRow label="Phone" value={shipping.phone} />
                <InfoRow label="Type" value={shipping.addressType} />
                <InfoRow label="City" value={shipping.city} />
                <InfoRow label="PIN Code" value={shipping.countryCode || shipping.pinCode} />
                <InfoRow label="Address" value={shipping.addressLine} />
              </div>
            </CardBody>
          </Card>

          {/* Customer info */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-1.5"><User size={14} className="text-gray-400" /> Customer</div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <InfoRow label="Email" value={order.user?.email} />
              <InfoRow label="Phone" value={order.user?.contact || order.user?.phone} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
