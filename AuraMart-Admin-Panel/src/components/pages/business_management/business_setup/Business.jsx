import React, { useState } from "react";
import { Building2, Save } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";

const Business = () => {
  const [form, setForm] = useState({
    name: "AuraMart", email: "support@auramart.in", mobile: "+91 98765 43210", currencyPosition: "prefix",
    estimatedDeliveryTime: "5", timezone: "Asia/Kolkata",
    googlePlaystoreUrl: "", appStoreUrl: "",
  });
  const [rewardEnabled, setRewardEnabled] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); };

  return (
    <div className="space-y-6">
      <PageHeader title="Business Settings" subtitle="Configure your business information" breadcrumbs={[{ label: "Business" }, { label: "Settings" }]} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader><CardTitle><div className="flex items-center gap-2"><Building2 size={14} className="text-[#E63946]" /> Business Information</div></CardTitle></CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Business name" className={inputCls} maxLength={255} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="company@email.com" className={inputCls} maxLength={255} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Phone</label>
                <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className={inputCls} maxLength={15} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Days <span className="text-red-500">*</span></label>
                <input type="number" name="estimatedDeliveryTime" value={form.estimatedDeliveryTime} onChange={handleChange} min="1" placeholder="5" className={inputCls} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                <select name="timezone" value={form.timezone} onChange={handleChange} className={inputCls}>
                  <option value="Asia/Kolkata">UTC+05:30 - Asia/Kolkata (IST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Position</label>
                <div className="flex gap-4 h-10 items-center border border-gray-300 rounded-lg px-3">
                  {[["prefix", "â‚¹ Left (prefix)"], ["suffix", "Right (suffix) â‚¹"]].map(([v, l]) => (
                    <label key={v} className="flex items-center gap-1.5 cursor-pointer text-sm">
                      <input type="radio" name="currencyPosition" value={v} checked={form.currencyPosition === v} onChange={handleChange} className="accent-blue-600" />
                      {l}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment with Reward Points</label>
                <div className="flex items-center justify-between h-10 border border-gray-300 rounded-lg px-3">
                  <span className="text-sm text-gray-600">Enable/Disable</span>
                  <button type="button" onClick={() => setRewardEnabled(p => !p)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${rewardEnabled ? "bg-[#E63946]" : "bg-gray-300"}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${rewardEnabled ? "translate-x-4.5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="flex justify-end">
          <Button type="submit" icon={<Save size={14} />}>Save & Update</Button>
        </div>
      </form>
    </div>
  );
};

export default Business;
