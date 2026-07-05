import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { toast } from "react-toastify";
import { useBackendDateFormat, useConvertAmPmToHHMM, useDateFormat, useFormatTimeToAmPm } from "../../../../hooks/useDateTimeFromat";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Loader } from "../../../ui/Loader";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";
const selectCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";

const EditCoupon = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formatTimeToAmPm = useFormatTimeToAmPm();
  const convertAmPmToHHMM = useConvertAmPmToHHMM();
  const formatDate = useDateFormat();
  const formatBackendDate = useBackendDateFormat();

  const [editCoupon, setEditCoupon] = useState({
    couponCode: "", discountType: "", discount: "", minimumOrderAmount: "",
    limitSingleUser: "", maximumDiscountAmount: "", startDate: "", expiredDate: "",
    startTime: "", expiredTime: "", _id: ""
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const [data, error] = await request({ method: "GET", url: ApiEndpoints.PROMOTION_MANAGEMENT.ALL_COUPON });
        if (error) { toast.error(error.message || "Failed to fetch"); return; }
        const coupon = Array.isArray(data?.data) ? data.data : [];
        const couponToEdit = coupon.find(item => item._id === _id);
        if (couponToEdit) {
          setEditCoupon({
            couponCode: couponToEdit.couponCode || "",
            discountType: couponToEdit.discountType || "",
            discount: couponToEdit.discount || "",
            minimumOrderAmount: couponToEdit.minimumOrderAmount || "",
            limitSingleUser: couponToEdit.limitSingleUser || "",
            maximumDiscountAmount: couponToEdit.maximumDiscountAmount || "",
            startDate: couponToEdit.startDate ? formatDate(couponToEdit.startDate) : "",
            expiredDate: couponToEdit.expiredDate ? formatBackendDate(couponToEdit.expiredDate) : "",
            startTime: couponToEdit.startTime ? convertAmPmToHHMM(couponToEdit.startTime) : "",
            expiredTime: couponToEdit.expiredTime ? convertAmPmToHHMM(couponToEdit.expiredTime) : "",
            _id: couponToEdit._id || ""
          });
        } else {
          toast.error("Coupon not found");
        }
      } catch (err) {
        toast.error(err.message || "Something went wrong");
      }
    };
    fetchCoupons();
  }, [_id, convertAmPmToHHMM]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditCoupon(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("couponCode", editCoupon.couponCode);
    form.append("discountType", editCoupon.discountType);
    form.append("discount", editCoupon.discount);
    form.append("minimumOrderAmount", editCoupon.minimumOrderAmount);
    form.append("limitSingleUser", editCoupon.limitSingleUser);
    form.append("maximumDiscountAmount", editCoupon.maximumDiscountAmount);
    form.append("startDate", formatBackendDate(editCoupon.startDate));
    form.append("expiredDate", formatBackendDate(editCoupon.expiredDate));
    form.append("startTime", formatTimeToAmPm(editCoupon.startTime));
    form.append("expiredTime", formatTimeToAmPm(editCoupon.expiredTime));

    try {
      setLoading(true);
      const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PROMOTION_MANAGEMENT.UPDATE_COUPON(editCoupon._id), data: form });
      if (error) { toast.error(error.message || "Failed to update"); return; }
      toast.success("Coupon updated successfully!");
      navigate("/admin/coupon");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Voucher"
        subtitle="Update coupon / voucher details"
        breadcrumbs={[{ label: "Promotions" }, { label: "Coupons", href: "/admin/coupon" }, { label: "Edit" }]}
        action={<Link to="/admin/coupon"><Button variant="secondary">Cancel</Button></Link>}
      />

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
                Voucher Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Code <span className="text-red-500">*</span></label>
                  <input type="text" name="couponCode" value={editCoupon.couponCode} onChange={handleInputChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type <span className="text-red-500">*</span></label>
                  <select name="discountType" value={editCoupon.discountType} onChange={handleInputChange} className={selectCls}>
                    <option value="Amount">Amount</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount <span className="text-red-500">*</span></label>
                  <input type="text" name="discount" value={editCoupon.discount} onChange={handleInputChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount <span className="text-red-500">*</span></label>
                  <input type="text" name="minimumOrderAmount" value={editCoupon.minimumOrderAmount} onChange={handleInputChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Limit For Single User</label>
                  <input type="text" name="limitSingleUser" value={editCoupon.limitSingleUser} onChange={handleInputChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount Amount</label>
                  <input type="text" name="maximumDiscountAmount" value={editCoupon.maximumDiscountAmount} onChange={handleInputChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                  <input type="date" name="startDate" value={editCoupon.startDate} onChange={handleInputChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time <span className="text-red-500">*</span></label>
                  <input type="time" name="startTime" value={editCoupon.startTime} onChange={handleInputChange} className={inputCls} />
                  {editCoupon.startTime && <p className="text-xs text-gray-400 mt-1">{formatTimeToAmPm(editCoupon.startTime)}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expired Date <span className="text-red-500">*</span></label>
                  <input type="date" name="expiredDate" value={editCoupon.expiredDate} onChange={handleInputChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expired Time <span className="text-red-500">*</span></label>
                  <input type="time" name="expiredTime" value={editCoupon.expiredTime} onChange={handleInputChange} className={inputCls} />
                  {editCoupon.expiredTime && <p className="text-xs text-gray-400 mt-1">{formatTimeToAmPm(editCoupon.expiredTime)}</p>}
                </div>
              </div>
            </CardBody>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
              <Link to="/admin/coupon"><Button variant="secondary" type="button">Cancel</Button></Link>
              <Button type="submit" disabled={loading}>{loading ? <Loader size="sm" /> : "Update"}</Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default EditCoupon;
