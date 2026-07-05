import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { showSuccess } from "../../../../utils/toastManager";
import { ApiEndpoints } from "../../../../api/apis";
import { request } from "../../../../api/request";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Loader } from "../../../ui/Loader";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";
const fileCls = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1] border border-gray-300 rounded-lg cursor-pointer";

const CreateAccessoriesType = () => {
  const navigate = useNavigate();
  const [accessories, setAccessories] = useState({ name: "", description: "", accessorybanner: null, thumbnail: null });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState({ thumbnail: "", accessorybanner: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccessories(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setAccessories(prev => ({ ...prev, [field]: file }));
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(prev => ({ ...prev, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessories.accessorybanner) { toast.error("Accessory banner is required"); return; }
    if (!accessories.thumbnail) { toast.error("At least one thumbnail is required"); return; }

    const form = new FormData();
    form.append("name", accessories.name);
    form.append("description", accessories.description);
    if (accessories.thumbnail instanceof File) form.append("thumbnail", accessories.thumbnail);
    else if (typeof accessories.thumbnail === "string") form.append("thumbnail", accessories.thumbnail);
    if (accessories.accessorybanner instanceof File) form.append("accessorybanner", accessories.accessorybanner);
    else if (typeof accessories.accessorybanner === "string") form.append("accessorybanner", accessories.accessorybanner);

    try {
      setLoading(true);
      const [data, error] = await request({ method: "POST", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ADD_ACCESSORY_TYPE, data: form });
      if (error) { toast.error(error.message || "Failed to add accessory"); return; }
      if (data?.data) {
        setAccessories({ name: "", description: "", accessorybanner: "", thumbnail: "" });
        setPreviewImage({ thumbnail: "", accessorybanner: "" });
        showSuccess("Accessory type added successfully!");
        navigate("/admin/product/accessories-type");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Accessory Type"
        subtitle="Add a new accessory category"
        breadcrumbs={[{ label: "Products" }, { label: "Accessory Types", href: "/admin/product/accessories-type" }, { label: "Create" }]}
        action={<Link to="/admin/product/accessories-type"><Button variant="secondary">Back</Button></Link>}
      />

      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
                Accessory Type Information
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={accessories.name} onChange={handleInputChange} className={inputCls} placeholder="Enter Name" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Preview (1:1)</label>
                  <div className="flex justify-center mb-3">
                    <img
                      src={previewImage.thumbnail || "https://placehold.co/200x200/f1f5f9/94a3b8?text=1:1"}
                      alt="Thumbnail Preview"
                      className="w-40 h-40 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail (Ratio 1:1) <span className="text-red-500">*</span></label>
                  <input type="file" name="thumbnail" className={fileCls} onChange={(e) => handleFileChange(e, "thumbnail")} accept="image/*" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Preview (4:1)</label>
                  <div className="flex justify-center mb-3">
                    <img
                      src={previewImage.accessorybanner || "https://placehold.co/600x150/f1f5f9/94a3b8?text=4:1"}
                      alt="Banner Preview"
                      className="w-full max-w-lg h-28 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Thumbnail (Ratio 4:1) <span className="text-red-500">*</span></label>
                  <input type="file" name="accessorybanner" className={fileCls} onChange={(e) => handleFileChange(e, "accessorybanner")} accept="image/*" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={accessories.description} onChange={handleInputChange} rows={3} placeholder="Enter description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" />
                </div>

                <div className="flex justify-between pt-2">
                  <Link to="/admin/product/accessories-type"><Button variant="secondary" type="button">Back</Button></Link>
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

export default CreateAccessoriesType;
