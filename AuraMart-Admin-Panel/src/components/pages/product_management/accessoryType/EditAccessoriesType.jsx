import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { showSuccess } from "../../../../utils/toastManager";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Loader } from "../../../ui/Loader";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";
const fileCls = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1] border border-gray-300 rounded-lg cursor-pointer";

const EditAccessoriesType = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [editAccessories, setEditAccessories] = useState({ name: "", description: "", thumbnail: "", accessorybanner: "", _id: "" });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState({ thumbnail: "", accessorybanner: "" });

  useEffect(() => {
    const getAccessories = async () => {
      try {
        const [data, error] = await request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_ACCESSORY_TYPE });
        if (error) { toast.error(error.message || "Failed to fetch data"); return; }
        const accessoryList = Array.isArray(data?.data) ? data.data : [];
        const accessoryToEdit = accessoryList.find((acc) => acc._id === _id);
        if (accessoryToEdit) {
          setEditAccessories({ name: accessoryToEdit.name || "", description: accessoryToEdit.description || "", thumbnail: accessoryToEdit.thumbnail || "", accessorybanner: accessoryToEdit.accessorybanner || "", _id: accessoryToEdit._id });
          setPreviewImage({ thumbnail: accessoryToEdit.thumbnail || "", accessorybanner: accessoryToEdit.accessorybanner || "" });
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch accessories");
      }
    };
    getAccessories();
  }, [_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditAccessories(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditAccessories(prev => ({ ...prev, [field]: file }));
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(prev => ({ ...prev, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", editAccessories.name);
    form.append("description", editAccessories.description);
    if (editAccessories.thumbnail instanceof File) form.append("thumbnail", editAccessories.thumbnail);
    else if (typeof editAccessories.thumbnail === "string") form.append("thumbnail", editAccessories.thumbnail);
    if (editAccessories.accessorybanner instanceof File) form.append("accessorybanner", editAccessories.accessorybanner);
    else if (typeof editAccessories.accessorybanner === "string") form.append("accessorybanner", editAccessories.accessorybanner);

    try {
      setLoading(true);
      const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PRODUCTS_MANAGEMENT.UPDATE_ACCESSORY_TYPE(editAccessories._id), data: form });
      if (error) { toast.error(error.message || "Failed to update"); return; }
      showSuccess("Updated successfully!");
      sessionStorage.setItem("editAccessoryType", true);
      navigate("/admin/product/accessories-type");
    } catch (error) {
      toast.error(error.message || "Something went wrong while updating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Accessory Type"
        subtitle="Update accessory category details"
        breadcrumbs={[{ label: "Products" }, { label: "Accessory Types", href: "/admin/product/accessories-type" }, { label: "Edit" }]}
        action={<Button variant="secondary" type="button" onClick={() => navigate("/admin/product/accessories-type")}>Back</Button>}
      />

      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
                Accessory Type Information
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={editAccessories.name} onChange={handleInputChange} className={inputCls} placeholder="Enter Name" required />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail (Ratio 1:1)</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Thumbnail (Ratio 4:1)</label>
                  <input type="file" name="accessorybanner" className={fileCls} onChange={(e) => handleFileChange(e, "accessorybanner")} accept="image/*" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={editAccessories.description} onChange={handleInputChange} rows={3} placeholder="Enter description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" />
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="secondary" type="button" onClick={() => navigate("/admin/product/accessories-type")}>Back</Button>
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

export default EditAccessoriesType;
