import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { toast } from "react-toastify";
import { showSuccess } from "../../../../utils/toastManager";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Loader } from "../../../ui/Loader";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";

const EditStokiest = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [editStokiest, setEditStokiest] = useState({ name: "", email: "", address: "", city: "", country: "", shopName: "", website: "", _id: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStokiest = async () => {
      try {
        const [data, error] = await request({ method: "GET", url: ApiEndpoints.PROMOTION_MANAGEMENT.ALL_STOKIEST });
        if (error) { toast.error(error.message || "Failed to fetch"); return; }
        const stokiests = Array.isArray(data?.data) ? data.data : [];
        const stokiestToEdit = stokiests.find((item) => item._id === _id);
        if (stokiestToEdit) {
          setEditStokiest({ name: stokiestToEdit.name || "", email: stokiestToEdit.email || "", address: stokiestToEdit.address || "", city: stokiestToEdit.city || "", country: stokiestToEdit.country || "", shopName: stokiestToEdit.shopName || "", website: stokiestToEdit.website || "", _id: stokiestToEdit._id });
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch stokiest");
      }
    };
    fetchStokiest();
  }, [_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditStokiest(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", editStokiest.name);
    form.append("email", editStokiest.email);
    form.append("address", editStokiest.address);
    form.append("city", editStokiest.city);
    form.append("country", editStokiest.country);
    form.append("shopName", editStokiest.shopName);
    form.append("website", editStokiest.website);

    try {
      setLoading(true);
      const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PROMOTION_MANAGEMENT.UPDATE_STOKIEST(editStokiest._id), data: form });
      if (error) { toast.error(error.message || "Failed to update"); return; }
      showSuccess("Stokiest updated successfully!");
      navigate("/admin/stokiest");
    } catch (error) {
      toast.error(error.message || "Something went wrong to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Stokiest"
        subtitle="Update stockist partner details"
        breadcrumbs={[{ label: "Promotions" }, { label: "Stokiest", href: "/admin/stokiest" }, { label: "Edit" }]}
        action={<Link to="/admin/stokiest"><Button variant="secondary">Cancel</Button></Link>}
      />

      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl">
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
                Stokiest Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stokiest Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={editStokiest.name} onChange={handleInputChange} className={inputCls} placeholder="Enter Name" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={editStokiest.email} onChange={handleInputChange} className={inputCls} placeholder="Enter Email" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                  <input type="text" name="shopName" value={editStokiest.shopName} onChange={handleInputChange} className={inputCls} placeholder="Enter Shop Name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stokiest Address</label>
                  <textarea name="address" value={editStokiest.address} onChange={handleInputChange} rows={3} placeholder="Enter Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" name="city" value={editStokiest.city} onChange={handleInputChange} className={inputCls} placeholder="Enter City" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input type="text" name="country" value={editStokiest.country} onChange={handleInputChange} className={inputCls} placeholder="Enter Country" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input type="text" name="website" value={editStokiest.website} onChange={handleInputChange} className={inputCls} placeholder="Enter Website URL" />
                </div>

                <div className="flex justify-between pt-2">
                  <Link to="/admin/stokiest"><Button variant="secondary" type="button">Cancel</Button></Link>
                  <Button type="submit" disabled={loading}>{loading ? <Loader size="sm" /> : "Update"}</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default EditStokiest;
