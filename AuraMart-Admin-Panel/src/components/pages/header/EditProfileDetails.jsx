import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, ArrowLeft, Save } from "lucide-react";
import { request } from "../../../api/request";
import { ApiEndpoints } from "../../../api/apis";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";

const EditProfileDetails = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", contact: "", profileImage: "" });
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.AUTH.GET_ADMIN_PROFILE });
      if (error || !data?.data) { toast.error(error?.message || "Failed to load profile"); return; }
      const user = data.data;
      setFormData({ firstName: user.firstName || "", lastName: user.lastName || "", contact: user.contact || "", profileImage: user.profileImage || "" });
      const url = user.profileImage?.startsWith("http") ? user.profileImage : `${import.meta.env.VITE_IMAGE_BASE_URL || ""}/${user.profileImage}`;
      setPreviewUrl(url || "/default-avatar.png");
    })();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(p => ({ ...p, profileImage: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("firstName", formData.firstName);
    form.append("lastName", formData.lastName);
    form.append("contact", formData.contact);
    if (formData.profileImage && typeof formData.profileImage !== "string") form.append("profileImage", formData.profileImage);
    const [, error] = await request({ method: "PUT", url: ApiEndpoints.AUTH.UPDATE_PROFILE, data: form, headers: { "Content-Type": "multipart/form-data" } });
    if (error) { toast.error(error.message || "Failed to update profile"); return; }
    toast.success("Profile updated successfully");
    navigate("/admin/profile");
  };

  const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Profile" subtitle="Update your personal information" breadcrumbs={[{ label: "Profile" }, { label: "Edit" }]} />

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="max-w-3xl">
        <Card>
          <CardHeader><CardTitle><div className="flex items-center gap-2"><User size={15} className="text-[#E63946]" /> User Information</div></CardTitle></CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" className={inputCls} required maxLength={255} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" className={inputCls} required maxLength={255} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="contact" value={formData.contact} onChange={handleChange} placeholder="Mobile number" className={inputCls} required />
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img src={previewUrl || "/default-avatar.png"} alt="Profile" onError={e => { e.target.src = "/default-avatar.png"; }}
                    className="w-36 h-36 rounded-xl object-cover border-2 border-gray-200 shadow-sm" />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image (1:1 ratio)</label>
                  <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1]" />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <Link to="/admin/profile">
                <Button type="button" variant="secondary" icon={<ArrowLeft size={14} />}>Back</Button>
              </Link>
              <Button type="submit" icon={<Save size={14} />}>Update Profile</Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default EditProfileDetails;
