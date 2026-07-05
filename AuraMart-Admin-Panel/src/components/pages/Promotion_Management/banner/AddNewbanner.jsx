import React, { useRef, useState } from "react";
import { ApiEndpoints } from "../../../../api/apis";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { request } from "../../../../api/request";
import { showSuccess } from "../../../../utils/toastManager";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Loader } from "../../../ui/Loader";
import { X } from "lucide-react";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";
const fileCls = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1] border border-gray-300 rounded-lg cursor-pointer";

const AddNewbanner = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [postBanner, setPostBanner] = useState({ columnName: "", description: "", Heading: "", buttonName: "", buttonLink: "", thumbnail: [] });
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setPostBanner(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = files.map((file) => ({ url: URL.createObjectURL(file), file }));
      setPreviewImages(prev => [...prev, ...newPreviews]);
      setPostBanner(prev => ({ ...prev, thumbnail: [...prev.thumbnail, ...files] }));
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setPostBanner(prev => ({ ...prev, thumbnail: prev.thumbnail.filter((_, i) => i !== index) }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postBanner.thumbnail.length === 0) { toast.error("At least one thumbnail is required"); return; }

    const form = new FormData();
    form.append("Heading", postBanner.Heading);
    form.append("buttonName", postBanner.buttonName);
    form.append("buttonLink", postBanner.buttonLink);
    form.append("columnName", postBanner.columnName);
    form.append("description", postBanner.description);
    postBanner.thumbnail.forEach((file) => form.append("thumbnail", file));

    try {
      setLoading(true);
      const [data, error] = await request({ method: "POST", url: ApiEndpoints.PROMOTION_MANAGEMENT.ADD_BANNER, data: form });
      if (error) throw new Error("Failed to add banner" || error.message);
      if (data?.data) {
        setPostBanner({ columnName: "", description: "", Heading: "", buttonName: "", buttonLink: "", thumbnail: [] });
        setPreviewImages([]);
        navigate("/admin/banner");
      }
      showSuccess("Created successfully");
    } catch (error) {
      toast.error("Something went wrong to add banner" || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Banner"
        subtitle="Create a promotional banner"
        breadcrumbs={[{ label: "Promotions" }, { label: "Banners", href: "/admin/banner" }, { label: "Add New" }]}
        action={<Link to="/admin/banner"><Button variant="secondary">Cancel</Button></Link>}
      />

      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="max-w-2xl">
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
                Banner Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                  <input type="text" name="Heading" value={postBanner.Heading} onChange={handleCreateInputChange} className={inputCls} placeholder="Enter Short Title" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input type="text" name="buttonName" value={postBanner.buttonName} onChange={handleCreateInputChange} className={inputCls} placeholder="Enter Button Text" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
                  <input type="text" name="columnName" value={postBanner.columnName} onChange={handleCreateInputChange} className={inputCls} placeholder="Enter Banner Type" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <input type="text" name="buttonLink" value={postBanner.buttonLink} onChange={handleCreateInputChange} className={inputCls} placeholder="Enter Banner Link" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={postBanner.description} onChange={handleCreateInputChange} rows={4} placeholder="Type here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" />
                </div>

                <div>
                  {previewImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {previewImages.map((item, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200" style={{ width: "200px", height: "100px" }}>
                          <img src={item?.url} alt={`Banner Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (Ratio 4:1 — 2000×500 px)</label>
                  <input type="file" id="banner" accept="image/*" className={fileCls} onChange={handleFileChange} multiple ref={fileInputRef} />
                </div>

                <div className="flex justify-between pt-2">
                  <Link to="/admin/banner"><Button variant="secondary" type="button">Cancel</Button></Link>
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

export default AddNewbanner;
