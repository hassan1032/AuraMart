import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Loader } from "../../../ui/Loader";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";
const fileCls = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1] border border-gray-300 rounded-lg cursor-pointer";

const EditCollection = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [editCollections, setEditCollections] = useState({ name: "", description: "", thumbnail: "", bannerThumnail: "", _id: "" });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState({ thumbnail: "", bannerThumnail: "" });

  useEffect(() => {
    const getCollection = async () => {
      try {
        const [data, error] = await request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_COLLECTION });
        if (error) { toast.error("Failed to fetch data" || error.message); return; }
        const collection = Array.isArray(data?.data) ? data.data : [];
        const collectionToEdit = collection.find((coll) => coll._id === _id);
        if (collectionToEdit) {
          setEditCollections({ name: collectionToEdit.name || "", description: collectionToEdit.description || "", thumbnail: collectionToEdit.thumbnail || "", bannerThumnail: collectionToEdit.bannerThumnail || "", _id: collectionToEdit._id });
          setPreviewImage({ thumbnail: collectionToEdit.thumbnail || "", bannerThumnail: collectionToEdit.bannerThumnail || "" });
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch collection");
      }
    };
    getCollection();
  }, [_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditCollections(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditCollections(prev => ({ ...prev, [field]: file }));
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(prev => ({ ...prev, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", editCollections.name);
    form.append("description", editCollections.description);
    if (editCollections.thumbnail instanceof File) form.append("thumbnail", editCollections.thumbnail);
    else if (typeof editCollections.thumbnail === "string") form.append("thumbnail", editCollections.thumbnail);
    if (editCollections.bannerThumnail instanceof File) form.append("bannerThumnail", editCollections.bannerThumnail);
    else if (typeof editCollections.bannerThumnail === "string") form.append("bannerThumnail", editCollections.bannerThumnail);

    try {
      setLoading(true);
      const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PRODUCTS_MANAGEMENT.UPDATE_COLLECTION(editCollections._id), data: form });
      if (error) { toast.error("Failed to update data" || error.message); return; }
      toast.success("Updated successfully!");
      navigate("/admin/product/collection");
    } catch (error) {
      toast.error(error.message || "Something went wrong to update data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Collection"
        subtitle="Update product collection details"
        breadcrumbs={[{ label: "Products" }, { label: "Collections", href: "/admin/product/collection" }, { label: "Edit" }]}
        action={<Link to="/admin/product/collection"><Button variant="secondary">Back</Button></Link>}
      />

      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
                Collection Information
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={editCollections.name} onChange={handleInputChange} className={inputCls} placeholder="Enter Name" required />
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
                      src={previewImage.bannerThumnail || "https://placehold.co/600x150/f1f5f9/94a3b8?text=4:1"}
                      alt="Banner Preview"
                      className="w-full max-w-lg h-28 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Thumbnail (Ratio 4:1)</label>
                  <input type="file" name="bannerThumnail" className={fileCls} onChange={(e) => handleFileChange(e, "bannerThumnail")} accept="image/*" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={editCollections.description} onChange={handleInputChange} rows={3} placeholder="Enter description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" />
                </div>

                <div className="flex justify-between pt-2">
                  <Link to="/admin/product/collection"><Button variant="secondary" type="button">Back</Button></Link>
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

export default EditCollection;
