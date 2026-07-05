import React, { useState } from "react";
import { Globe, Info, Download, AlignEndVertical, Save } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";

const ImagePreview = ({ label, name }) => {
  const [src, setSrc] = useState("");
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="w-28 h-14 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
        {src ? <img src={src} alt={label} className="w-full h-full object-contain" /> : <span className="text-xs text-gray-400">No image</span>}
      </div>
      <div className="w-full">
        <label className="block text-xs text-gray-500 mb-0.5">{label}</label>
        <input type="file" name={name} accept="image/*"
          onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onloadend = () => setSrc(r.result); r.readAsDataURL(f); } }}
          className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-[#FFF1F1] file:text-[#E63946]" />
      </div>
    </div>
  );
};

const Toggle = ({ label, name }) => {
  const [on, setOn] = useState(true);
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

const General = () => {
  const [form, setForm] = useState({
    name: "", title: "", currency: "", currencyPosition: "prefix",
    mobile: "", email: "", address: "",
    googlePlaystoreUrl: "", appStoreUrl: "",
    footerPhone: "", footerEmail: "", footerText: "All right reserved",
    footerDescription: "The ultimate all-in-one solution for your eCommerce business.",
  });

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="space-y-4">
      <PageHeader title="General Settings" subtitle="Configure website appearance and content" breadcrumbs={[{ label: "Business" }, { label: "General" }]} />

      <form onSubmit={e => e.preventDefault()} className="space-y-4">
        {/* Website Info */}
        <Card>
          <CardHeader><CardTitle><div className="flex items-center gap-2"><Globe size={14} className="text-[#E63946]" /> Website Information</div></CardTitle></CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Website name" className={inputCls} maxLength={255} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website Title</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title bar text" className={inputCls} maxLength={255} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                    <input type="text" name="currency" value={form.currency} onChange={handleChange} placeholder="â‚¹" className={inputCls} maxLength={10} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency Position</label>
                    <select name="currencyPosition" value={form.currencyPosition} onChange={handleChange} className={inputCls}>
                      <option value="prefix">Prefix (â‚¹ Left)</option>
                      <option value="suffix">Suffix (Right â‚¹)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ImagePreview label="Logo (4:1, 200Ã—50)" name="logo" />
                <ImagePreview label="Favicon (300Ã—300)" name="favicon" />
                <ImagePreview label="App Logo (300Ã—300)" name="app_logo" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Other Info */}
        <Card>
          <CardHeader><CardTitle><div className="flex items-center gap-2"><Info size={14} className="text-[#E63946]" /> Other Information</div></CardTitle></CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="info@site.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Business address" className={inputCls} />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Download App */}
        <Card>
          <CardHeader action={<Toggle label="Show Download App" name="show_download_app" />}>
            <CardTitle><div className="flex items-center gap-2"><Download size={14} className="text-[#E63946]" /> Download App Links</div></CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Playstore URL</label>
                <textarea name="googlePlaystoreUrl" value={form.googlePlaystoreUrl} onChange={handleChange} rows={3} placeholder="https://play.google.com/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apple App Store URL</label>
                <textarea name="appStoreUrl" value={form.appStoreUrl} onChange={handleChange} rows={3} placeholder="https://apps.apple.com/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-none" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        <Card>
          <CardHeader action={<Toggle label="Show Footer" name="show_footer" />}>
            <CardTitle><div className="flex items-center gap-2"><AlignEndVertical size={14} className="text-[#E63946]" /> Footer Section</div></CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Phone</label>
                <input type="tel" name="footerPhone" value={form.footerPhone} onChange={handleChange} placeholder="Footer contact" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Email</label>
                <input type="email" name="footerEmail" value={form.footerEmail} onChange={handleChange} placeholder="footer@site.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
                <input type="text" name="footerText" value={form.footerText} onChange={handleChange} placeholder="Copyright text" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Description</label>
                <textarea name="footerDescription" value={form.footerDescription} onChange={handleChange} rows={3} placeholder="Short description" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-none" />
              </div>
              <ImagePreview label="Footer Logo (4:1)" name="footer_logo" />
              <ImagePreview label="QR Code (200Ã—200)" name="footer_qrcode" />
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end pb-4">
          <Button type="submit" icon={<Save size={14} />}>Save & Update</Button>
        </div>
      </form>
    </div>
  );
};

export default General;
