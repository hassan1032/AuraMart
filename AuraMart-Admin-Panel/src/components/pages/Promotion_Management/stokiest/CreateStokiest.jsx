import React, { useState } from "react";
import { ApiEndpoints } from "../../../../api/apis";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { request } from "../../../../api/request";
import { showSuccess } from "../../../../utils/toastManager";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Loader } from "../../../ui/Loader";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";

const CreateStokiest = () => {
  const navigate = useNavigate();
  const [postStokiest, setPostStokiest] = useState({ name: "", email: "", address: "", city: "", country: "", shopName: "", website: "" });
  const [loading, setLoading] = useState(false);

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setPostStokiest(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", postStokiest.name);
    form.append("email", postStokiest.email);
    form.append("address", postStokiest.address);
    form.append("city", postStokiest.city);
    form.append("country", postStokiest.country);
    form.append("shopName", postStokiest.shopName);
    form.append("website", postStokiest.website);

    try {
      setLoading(true);
      const [data, error] = await request({ method: "POST", url: ApiEndpoints.PROMOTION_MANAGEMENT.ADD_STOKIEST, data: form });
      if (error) throw new Error("Failed to add stokiest" || error.message);
      if (data?.data) {
        setPostStokiest({ name: "", email: "", address: "", city: "", country: "", shopName: "", website: "" });
        navigate("/admin/stokiest");
      }
      showSuccess("Created successfully");
    } catch (error) {
      toast.error("Something went wrong" || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Stokiest"
        subtitle="Add a new stockist partner"
        breadcrumbs={[{ label: "Promotions" }, { label: "Stokiest", href: "/admin/stokiest" }, { label: "Create" }]}
        action={<Link to="/admin/stokiest"><Button variant="secondary">Cancel</Button></Link>}
      />

      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="max-w-2xl">
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
                Stokiest Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stokiest Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={postStokiest.name} onChange={handleCreateInputChange} className={inputCls} placeholder="Enter Name" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={postStokiest.email} onChange={handleCreateInputChange} className={inputCls} placeholder="Enter Email" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                  <input type="text" name="shopName" value={postStokiest.shopName} onChange={handleCreateInputChange} className={inputCls} placeholder="Enter Shop Name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stokiest Address</label>
                  <textarea name="address" value={postStokiest.address} onChange={handleCreateInputChange} rows={3} placeholder="Enter Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" name="city" value={postStokiest.city} onChange={handleCreateInputChange} className={inputCls} placeholder="Enter City" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input type="text" name="country" value={postStokiest.country} onChange={handleCreateInputChange} className={inputCls} placeholder="Enter Country" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input type="text" name="website" value={postStokiest.website} onChange={handleCreateInputChange} className={inputCls} placeholder="Enter Website URL" />
                </div>

                <div className="flex justify-between pt-2">
                  <Link to="/admin/stokiest"><Button variant="secondary" type="button">Cancel</Button></Link>
                  <Button type="submit" disabled={loading}>{loading ? <Loader size="sm" /> : "Submit"}</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CreateStokiest;
