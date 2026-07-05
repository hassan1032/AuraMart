import React, { useRef, useState } from "react";
import { Globe, Info, Download, AlignEndVertical, Save } from "lucide-react";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";

const ImageUpload = ({ label, previewSrc, inputName, aspectClass }) => {
  const [preview, setPreview] = useState(previewSrc || "");
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setPreview(reader.result); reader.readAsDataURL(file); }
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center ${aspectClass}`}>
        {preview ? <img src={preview} alt={label} className="w-full h-full object-contain" /> : <span className="text-xs text-gray-400">No image</span>}
      </div>
      <div className="w-full">
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
        <input type="file" name={inputName} accept="image/*" onChange={handleChange}
          className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1]" />
      </div>
    </div>
  );
};

const Toggle = ({ label, name, defaultChecked }) => {
  const [on, setOn] = useState(defaultChecked ?? true);
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{label}</span>
      <button type="button" onClick={() => setOn(p => !p)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${on ? "bg-[#E63946]" : "bg-gray-300"}`}>
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${on ? "translate-x-4.5" : "translate-x-0.5"}`} />
        <input type="hidden" name={name} value={on ? "1" : "0"} />
      </button>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
    <Icon size={15} className="text-[#E63946]" />
    <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
  </div>
);

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";

const AdminSetting = () => (
  <div className="space-y-6">
    <PageHeader title="Admin Settings" subtitle="Configure website appearance and information" breadcrumbs={[{ label: "Settings" }, { label: "Admin" }]} />

    <form onSubmit={e => e.preventDefault()}>
      {/* Website Info */}
      <Card className="mb-4">
        <CardHeader><CardTitle><div className="flex items-center gap-2"><Globe size={14} className="text-[#E63946]" /> Website Information</div></CardTitle></CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website Name</label>
                <input type="text" name="name" placeholder="Enter website name" className={inputCls} maxLength={255} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website Title</label>
                <input type="text" name="title" placeholder="Enter website title for title bar" className={inputCls} maxLength={255} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                  <input type="text" name="currency" placeholder="₹" className={inputCls} maxLength={10} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency Position</label>
                  <select name="currency_position" className={inputCls}>
                    <option value="prefix">Prefix</option>
                    <option value="suffix">Suffix</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <ImageUpload label="Logo (4:1 ratio, 200x50)" inputName="logo" aspectClass="w-full h-20" />
              <ImageUpload label="Favicon (300x300)" inputName="favicon" aspectClass="w-20 h-20" />
              <ImageUpload label="App Logo (300x300)" inputName="app_logo" aspectClass="w-20 h-20" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Other Info */}
      <Card className="mb-4">
        <CardHeader><CardTitle><div className="flex items-center gap-2"><Info size={14} className="text-[#E63946]" /> Other Information</div></CardTitle></CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input type="tel" name="mobile" placeholder="Contact number" className={inputCls} maxLength={15} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" placeholder="info@yoursite.com" className={inputCls} maxLength={255} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" name="address" placeholder="Business address" className={inputCls} maxLength={255} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Download App */}
      <Card className="mb-4">
        <CardHeader action={<Toggle label="Show Download App" name="show_download_app" defaultChecked />}>
          <CardTitle><div className="flex items-center gap-2"><Download size={14} className="text-[#E63946]" /> Download App Links</div></CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Playstore URL</label>
              <textarea name="google_playstore_url" rows={3} placeholder="https://play.google.com/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apple App Store URL</label>
              <textarea name="app_store_url" rows={3} placeholder="https://apps.apple.com/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-none" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Footer */}
      <Card className="mb-6">
        <CardHeader action={<Toggle label="Show Footer" name="show_footer" defaultChecked />}>
          <CardTitle><div className="flex items-center gap-2"><AlignEndVertical size={14} className="text-[#E63946]" /> Footer Section</div></CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Phone</label>
              <input type="tel" name="footer_phone" placeholder="Footer contact number" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Email</label>
              <input type="email" name="footer_email" placeholder="footer@yoursite.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
              <input type="text" name="footer_text" defaultValue="All right reserved" placeholder="Copyright text" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Description</label>
              <textarea name="footer_description" rows={3} placeholder="Short description" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-none" />
            </div>
            <ImageUpload label="Footer Logo (4:1)" inputName="footer_logo" aspectClass="w-full h-16" />
            <ImageUpload label="QR Code (200x200)" inputName="footer_qrcode" aspectClass="w-24 h-24" />
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end mb-4">
        <Button type="submit" icon={<Save size={14} />}>Save & Update</Button>
      </div>
    </form>
  </div>
);

export default AdminSetting;
