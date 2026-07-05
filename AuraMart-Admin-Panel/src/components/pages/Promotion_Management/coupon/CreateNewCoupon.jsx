import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiEndpoints } from "../../../../api/apis";
import { toast } from "react-toastify";
import { request } from "../../../../api/request";
import { useDateFormat, useFormatTimeToAmPm } from "../../../../hooks/useDateTimeFromat";
import { showSuccess } from "../../../../utils/toastManager";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Loader } from "../../../ui/Loader";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";
const selectCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";

const CreateNewCoupon = () => {
  const navigate = useNavigate();
  const formatDate = useDateFormat();
  const formatTimeToAmPm = useFormatTimeToAmPm();
  const [loading, setLoading] = useState(false);

  const [coupon, setCoupon] = useState({
    couponCode: "", discountType: "Amount", discount: "", minimumOrderAmount: "",
    limitSingleUser: "", maximumDiscountAmount: "", startDate: "", startTime: "", expiredDate: "", expiredTime: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "discount") {
      setCoupon(prev => ({ ...prev, [name]: prev.discountType === "Percentage" ? value.replace(/%/g, "") + "%" : value.replace(/%/g, "") }));
    } else {
      setCoupon(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("couponCode", coupon.couponCode);
    form.append("discountType", coupon.discountType);
    form.append("discount", coupon.discount);
    form.append("minimumOrderAmount", coupon.minimumOrderAmount);
    form.append("limitSingleUser", coupon.limitSingleUser);
    form.append("maximumDiscountAmount", coupon.maximumDiscountAmount);
    form.append("startDate", formatDate(coupon.startDate));
    form.append("expiredDate", formatDate(coupon.expiredDate));
    form.append("startTime", formatTimeToAmPm(coupon.startTime));
    form.append("expiredTime", formatTimeToAmPm(coupon.expiredTime));

    try {
      setLoading(true);
      const [data, error] = await request({ method: "POST", url: ApiEndpoints.PROMOTION_MANAGEMENT.ADD_COUPON, data: form });
      if (error) { toast.error("Failed to create coupon" || error.message); return; }
      setCoupon({ couponCode: "", discountType: "Amount", discount: "", minimumOrderAmount: "", limitSingleUser: "", maximumDiscountAmount: "", startDate: "", expiredDate: "", startTime: "", expiredTime: "" });
      navigate("/admin/coupon");
      showSuccess("Created successfully!");
    } catch (err) {
      toast.error("Something went wrong while creating coupon" || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Coupon"
        subtitle="Create a discount coupon for customers"
        breadcrumbs={[{ label: "Promotions" }, { label: "Coupons", href: "/admin/coupon" }, { label: "Add New" }]}
        action={<Link to="/admin/coupon"><Button variant="secondary">Cancel</Button></Link>}
      />

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
                Coupon Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code <span className="text-red-500">*</span></label>
                  <input type="text" name="couponCode" value={coupon.couponCode} onChange={handleInputChange} className={inputCls} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type <span className="text-red-500">*</span></label>
                  <select name="discountType" value={coupon.discountType} onChange={handleInputChange} className={selectCls} required>
                    <option value="Amount">Amount</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount <span className="text-red-500">*</span></label>
                  <input type="text" name="discount" value={coupon.discount} onChange={handleInputChange} className={inputCls} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount <span className="text-red-500">*</span></label>
                  <input type="text" name="minimumOrderAmount" value={coupon.minimumOrderAmount} onChange={handleInputChange} className={inputCls} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Limit For Single User</label>
                  <input type="text" name="limitSingleUser" value={coupon.limitSingleUser} onChange={handleInputChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount Amount</label>
                  <input type="text" name="maximumDiscountAmount" value={coupon.maximumDiscountAmount} onChange={handleInputChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                  <input type="date" name="startDate" value={coupon.startDate} onChange={handleInputChange} className={inputCls} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time <span className="text-red-500">*</span></label>
                  <input type="time" name="startTime" value={coupon.startTime} onChange={handleInputChange} className={inputCls} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expired Date <span className="text-red-500">*</span></label>
                  <input type="date" name="expiredDate" value={coupon.expiredDate} onChange={handleInputChange} className={inputCls} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expired Time <span className="text-red-500">*</span></label>
                  <input type="time" name="expiredTime" value={coupon.expiredTime} onChange={handleInputChange} className={inputCls} required />
                </div>
              </div>
            </CardBody>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
              <Link to="/admin/coupon"><Button variant="secondary" type="button">Cancel</Button></Link>
              <Button type="submit" disabled={loading}>{loading ? <Loader size="sm" /> : "Create"}</Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default CreateNewCoupon;
