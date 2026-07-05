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
const fileCls = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1] border border-gray-300 rounded-lg cursor-pointer";

const EditBanner = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [editBanner, setEditBanner] = useState({ columnName: "", description: "", Heading: "", buttonName: "", buttonLink: "", thumbnail: "", _id: "" });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const [data, error] = await request({ method: "GET", url: ApiEndpoints.PROMOTION_MANAGEMENT.ALL_BANNER });
        if (error) { toast.error(error.message || "Failed to fetch banners"); return; }
        const banners = Array.isArray(data?.data) ? data.data : [];
        const bannerToEdit = banners.find((item) => item._id === _id);
        if (bannerToEdit) {
          setEditBanner({ columnName: bannerToEdit.columnName || "", description: bannerToEdit.description || "", Heading: bannerToEdit.Heading || "", buttonName: bannerToEdit.buttonName || "", buttonLink: bannerToEdit.buttonLink || "", thumbnail: bannerToEdit.thumbnail || "", _id: bannerToEdit._id });
          setPreviewImage(bannerToEdit.thumbnail);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch banners");
      }
    };
    fetchBanners();
  }, [_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditBanner(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditBanner(prev => ({ ...prev, thumbnail: file }));
      const reader = new FileReader();
      reader.onload = (event) => setPreviewImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("Heading", editBanner.Heading);
    form.append("buttonName", editBanner.buttonName);
    form.append("buttonLink", editBanner.buttonLink);
    form.append("columnName", editBanner.columnName);
    form.append("description", editBanner.description);
    if (editBanner.thumbnail) form.append("thumbnail", editBanner.thumbnail);

    try {
      setLoading(true);
      const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PROMOTION_MANAGEMENT.UPDATE_BANNER(editBanner._id), data: form });
      if (error) { toast.error(error.message || "Failed to update"); return; }
      showSuccess("Banner updated successfully!");
      navigate("/admin/banner");
    } catch (error) {
      toast.error(error.message || "Something went wrong to update banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Banner"
        subtitle="Update banner details"
        breadcrumbs={[{ label: "Promotions" }, { label: "Banners", href: "/admin/banner" }, { label: "Edit" }]}
        action={<Link to="/admin/banner"><Button variant="secondary">Cancel</Button></Link>}
      />

      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl">
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
                Banner Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" name="Heading" value={editBanner.Heading} onChange={handleInputChange} className={inputCls} placeholder="Enter Short Title" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input type="text" name="buttonName" value={editBanner.buttonName} onChange={handleInputChange} className={inputCls} placeholder="Enter Button Text" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
                  <input type="text" name="columnName" value={editBanner.columnName} onChange={handleInputChange} className={inputCls} placeholder="Enter Banner Type" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <input type="text" name="buttonLink" value={editBanner.buttonLink} onChange={handleInputChange} className={inputCls} placeholder="Enter Button Link" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={editBanner.description} onChange={handleInputChange} rows={4} placeholder="Type here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" />
                </div>

                <div>
                  {previewImage && (
                    <div className="flex justify-center mb-3">
                      <img src={previewImage} alt="Banner Preview" className="w-full max-w-lg h-32 object-cover rounded-lg border border-gray-200" />
                    </div>
                  )}
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (Ratio 4:1 — 2000×500 px)</label>
                  <input type="file" accept="image/*" className={fileCls} onChange={handleFileChange} />
                </div>

                <div className="flex justify-between pt-2">
                  <Link to="/admin/banner"><Button variant="secondary" type="button">Cancel</Button></Link>
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

export default EditBanner;
