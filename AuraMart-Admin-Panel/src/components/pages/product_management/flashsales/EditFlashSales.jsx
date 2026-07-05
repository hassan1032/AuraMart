import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";
const fileCls = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1] border border-gray-300 rounded-lg cursor-pointer";

const EditFlashSales = () => {
  const [form, setForm] = useState({ name: "", discount: "10", start_date: "", start_time: "19:00", end_date: "", end_time: "02:30", description: "" });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "discount") {
      setForm(prev => ({ ...prev, [name]: value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1') }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Flash Sale"
        subtitle="Update flash sale details"
        breadcrumbs={[{ label: "Products" }, { label: "Flash Sales", href: "/admin/products/flash-sales" }, { label: "Edit" }]}
        action={<Link to="/admin/products/flash-sales"><Button variant="secondary">Cancel</Button></Link>}
      />

      <form onSubmit={e => e.preventDefault()} encType="multipart/form-data">
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Enter name" required maxLength={255} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Discount <span className="text-red-500">*</span></label>
                  <input type="text" name="discount" value={form.discount} onChange={handleChange} className={inputCls} placeholder="Enter discount" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                    <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className={inputCls} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time <span className="text-red-500">*</span></label>
                    <input type="time" name="start_time" value={form.start_time} onChange={handleChange} className={inputCls} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-red-500">*</span></label>
                    <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className={inputCls} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time <span className="text-red-500">*</span></label>
                    <input type="time" name="end_time" value={form.end_time} onChange={handleChange} className={inputCls} required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Enter short description" required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Thumbnail <span className="text-[#E63946]">(Ratio 3:2 — 600×400 px)</span> <span className="text-red-500">*</span>
                </p>
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-gray-200 mb-3" />
                ) : (
                  <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm mb-3">
                    No image selected
                  </div>
                )}
                <input type="file" accept="image/*" className={fileCls} onChange={handleFile} />
              </div>
            </div>
          </CardBody>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
            <Link to="/admin/products/flash-sales"><Button variant="secondary" type="button">Cancel</Button></Link>
            <Button type="submit">Update</Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default EditFlashSales;
