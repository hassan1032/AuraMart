import React, { useState } from "react";
import { toast } from "react-toastify";
import { ShieldCheck, Save } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const Toggle = ({ label, name, checked, onChange }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-[#F5F0EA] last:border-0">
    <span className="text-sm text-[#2B2D42]">{label}</span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange({ target: { name, type: "checkbox", checked: !checked } })}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${checked ? "bg-[#E63946]" : "bg-gray-300"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  </div>
);

const Radio = ({ label, name, value, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange}
      className="accent-[#E63946] w-3.5 h-3.5" />
    <span className="text-sm text-[#2B2D42]">{label}</span>
  </label>
);

const Verification = () => {
  const [form, setForm] = useState({
    registerOtp:      true,
    registerOtpType:  "phone",
    forgotOtpType:    "phone",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("OTP settings saved");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="OTP Verification Settings"
        subtitle="Configure one-time password requirements for customer actions"
        breadcrumbs={[{ label: "Business" }, { label: "Verification" }]}
        icon={<ShieldCheck size={20} />}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Registration */}
        <Card>
          <CardHeader><CardTitle>Customer Registration</CardTitle></CardHeader>
          <CardBody className="space-y-2">
            <Toggle
              label="Require OTP on customer registration"
              name="registerOtp"
              checked={form.registerOtp}
              onChange={handleChange}
            />
            <div className="pt-2">
              <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wide mb-2">Delivery method</p>
              <div className="flex gap-6">
                <Radio label="Phone (SMS)" name="registerOtpType" value="phone" checked={form.registerOtpType === "phone"} onChange={handleChange} />
                <Radio label="Email" name="registerOtpType" value="email" checked={form.registerOtpType === "email"} onChange={handleChange} />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Forgot Password */}
        <Card>
          <CardHeader><CardTitle>Forgot Password</CardTitle></CardHeader>
          <CardBody>
            <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wide mb-2">Delivery method</p>
            <div className="flex gap-6">
              <Radio label="Phone (SMS)" name="forgotOtpType" value="phone" checked={form.forgotOtpType === "phone"} onChange={handleChange} />
              <Radio label="Email" name="forgotOtpType" value="email" checked={form.forgotOtpType === "email"} onChange={handleChange} />
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" icon={<Save size={14} />}>Save Settings</Button>
        </div>
      </form>
    </div>
  );
};

export default Verification;
