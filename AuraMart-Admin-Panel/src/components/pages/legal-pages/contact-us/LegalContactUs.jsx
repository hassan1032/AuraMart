import React, { useState } from "react";
import { Save, Phone, Mail, MessageCircle } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";

const LegalContactUs = () => {
  const [form, setForm] = useState({ phone: "9876543210", whatsapp: "9876543210", messenger: "https://m.me/auramart", email: "support@auramart.in" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "phone" || name === "whatsapp") v = value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
    setForm(p => ({ ...p, [name]: v }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Contact Us" subtitle="Configure contact information shown to customers" breadcrumbs={[{ label: "Legal" }, { label: "Contact Us" }]} />

      <div className="max-w-2xl">
        <Card>
          <CardHeader><CardTitle><div className="flex items-center gap-2"><Phone size={14} className="text-[#E63946]" /> Contact Details</div></CardTitle></CardHeader>
          <CardBody>
            <form onSubmit={e => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative"><Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className={`${inputCls} pl-9`} maxLength={15} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <div className="relative"><MessageCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className={`${inputCls} pl-9`} maxLength={15} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Messenger Link</label>
                <input type="url" name="messenger" value={form.messenger} onChange={handleChange} placeholder="https://m.me/yourpage" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="support@yourstore.com" className={`${inputCls} pl-9`} />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" icon={<Save size={14} />}>Save & Update</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LegalContactUs;
