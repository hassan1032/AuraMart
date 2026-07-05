import React, { useState } from 'react';
import { PageHeader } from '../../ui/PageHeader';
import { Card, CardBody } from '../../ui/Card';
import { Button } from '../../ui/Button';

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";
const fileCls = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1] border border-gray-300 rounded-lg cursor-pointer";

const General = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    currency: '',
    currencyPosition: 'prefix',
    mobile: '',
    email: '',
    address: '',
    googlePlaystoreUrl: '',
    appStoreUrl: '',
    footerPhone: '',
    footerEmail: '',
    footerText: 'All right reserved by RazinSoft',
    footerDescription: 'The ultimate all-in-one solution for your eCommerce business worldwide.',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="General Settings"
        subtitle="Configure website name, logo, and contact details"
        breadcrumbs={[{ label: "Settings" }, { label: "General" }]}
      />

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: text fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className={labelCls}>Website Name</label>
                  <input type="text" name="name" id="name" className={inputCls} value={formData.name} placeholder="Enter Website Name" maxLength="255" onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="title" className={labelCls}>Website Title</label>
                  <input type="text" name="title" id="title" className={inputCls} value={formData.title} placeholder="Enter Website Title for title bar" maxLength="255" onChange={handleChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="currency" className={labelCls}>Currency Symbol</label>
                    <input type="text" name="currency" id="currency" className={inputCls} value={formData.currency} placeholder="e.g. ₹" maxLength="255" onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="currency_position" className={labelCls}>Currency Position</label>
                    <select name="currencyPosition" id="currency_position" className={inputCls} value={formData.currencyPosition} onChange={handleChange}>
                      <option value="prefix">Prefix</option>
                      <option value="suffix">Suffix</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right: logo uploads */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2" style={{ aspectRatio: "4/1" }}>
                    <img src="https://placehold.co/200x50/f1f5f9/png" alt="Logo preview" className="max-h-full object-contain" />
                  </div>
                  <label htmlFor="logo" className={labelCls}>Logo (Ratio 4:1 – 200×50)</label>
                  <input type="file" name="logo" id="logo" className={fileCls} />
                </div>
                <div>
                  <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2" style={{ aspectRatio: "1/1" }}>
                    <img src="https://placehold.co/80x80/f1f5f9/png" alt="Favicon preview" className="max-h-full object-contain" />
                  </div>
                  <label htmlFor="favicon" className={labelCls}>Favicon (300×300)</label>
                  <input type="file" name="favicon" id="favicon" className={fileCls} />
                </div>
              </div>
            </div>

            {/* App Logo */}
            <div className="mt-4 max-w-xs">
              <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2" style={{ width: 80, height: 80 }}>
                <img src="https://placehold.co/80x80/f1f5f9/png" alt="App logo preview" className="max-h-full object-contain" />
              </div>
              <label htmlFor="app_logo" className={labelCls}>App Logo (300×300)</label>
              <input type="file" name="app_logo" id="app_logo" className={fileCls} />
            </div>
          </CardBody>
        </Card>

        {/* Other Information */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
              Other Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="mobile" className={labelCls}>Mobile Number</label>
                <input type="number" name="mobile" id="mobile" className={inputCls} value={formData.mobile} placeholder="Enter Mobile Number" onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="email" className={labelCls}>Email Address</label>
                <input type="email" name="email" id="email" className={inputCls} value={formData.email} placeholder="Enter Email Address" onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="address" className={labelCls}>Address</label>
                <input type="text" name="address" id="address" className={inputCls} value={formData.address} placeholder="Enter Address" onChange={handleChange} />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Download App Link */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Download App Link</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Show/Hide</span>
                <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
                  <input type="checkbox" name="show_download_app" className="sr-only peer" />
                  <span className="h-5 w-9 rounded-full bg-gray-300 peer-checked:bg-[#E63946] transition-colors" />
                  <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Google Playstore App Link</label>
                <textarea name="google_playstore_url" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" rows={3} placeholder="Enter Google Playstore App Link" value={formData.googlePlaystoreUrl} onChange={handleChange} />
              </div>
              <div>
                <label className={labelCls}>Apple Store App Link</label>
                <textarea name="app_store_url" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" rows={3} placeholder="Enter Apple Store App Link" value={formData.appStoreUrl} onChange={handleChange} />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Footer Information */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Footer Section Info</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Show/Hide</span>
                <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
                  <input type="checkbox" name="show_footer" className="sr-only peer" />
                  <span className="h-5 w-9 rounded-full bg-gray-300 peer-checked:bg-[#E63946] transition-colors" />
                  <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="footer_phone" className={labelCls}>Footer Mobile Number</label>
                <input type="number" name="footer_phone" id="footer_phone" className={inputCls} value={formData.footerPhone} placeholder="Enter Mobile Number" onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="footer_email" className={labelCls}>Footer Email Address</label>
                <input type="email" name="footer_email" id="footer_email" className={inputCls} value={formData.footerEmail} placeholder="Enter Email Address" onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="footer_text" className={labelCls}>Footer Text</label>
                <input type="text" name="footer_text" id="footer_text" className={inputCls} value={formData.footerText} placeholder="Enter Footer Text" onChange={handleChange} />
              </div>
              <div>
                <label className={labelCls}>Footer Short Description</label>
                <textarea name="footer_description" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" rows={3} placeholder="Frontend Footer Short Description" value={formData.footerDescription} onChange={handleChange} />
              </div>
              <div>
                <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2" style={{ aspectRatio: "4/1" }}>
                  <img src="https://placehold.co/200x50/1e293b/png" alt="Footer logo" className="max-h-full object-contain" />
                </div>
                <label htmlFor="footer_logo" className={labelCls}>Footer Logo (Ratio 4:1)</label>
                <input type="file" name="footer_logo" id="footer_logo" className={fileCls} />
              </div>
              <div>
                <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2" style={{ width: 80, height: 80 }}>
                  <img src="https://placehold.co/80x80/f1f5f9/png" alt="QR code" className="max-h-full object-contain" />
                </div>
                <label htmlFor="footer_qrcode" className={labelCls}>Scan the QR (200×200)</label>
                <input type="file" name="footer_qrcode" id="footer_qrcode" className={fileCls} />
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end pb-4">
          <Button type="submit">Save And Update</Button>
        </div>
      </form>
    </div>
  );
};

export default General;
