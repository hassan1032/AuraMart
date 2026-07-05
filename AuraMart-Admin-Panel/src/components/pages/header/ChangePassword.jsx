import React, { useState } from "react";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { request } from "../../../api/request";
import { ApiEndpoints } from "../../../api/apis";
import { setToken } from "../../../auth/authToken";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    setLoading(true);
    const [data, error] = await request({ method: "POST", url: ApiEndpoints.AUTH.UPDATE_PASSWORD, data: form });
    setLoading(false);
    if (error) { toast.error(error.message || "Failed to update password"); return; }
    if (data?.token) setToken({ token: data.token });
    setForm({ currentPassword: "", newPassword: "" });
    toast.success("Password changed successfully");
  };

  const PasswordInput = ({ label, name, show, onToggle }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type={show ? "text" : "password"}
          name={name}
          value={form[name]}
          onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
          required
          placeholder="••••••••"
          className="w-full h-10 pl-9 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:bg-white transition-all"
        />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Change Password"
        subtitle="Update your account password"
        breadcrumbs={[{ label: "Settings" }, { label: "Change Password" }]}
      />

      <div className="max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2"><KeyRound size={16} className="text-[#E63946]" /> Update Password</div>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <PasswordInput label="Current Password" name="currentPassword" show={showCurrent} onToggle={() => setShowCurrent(p => !p)} />
              <PasswordInput label="New Password" name="newPassword" show={showNew} onToggle={() => setShowNew(p => !p)} />
              <p className="text-xs text-gray-500">Password must be at least 6 characters long.</p>
              <div className="pt-2">
                <Button type="submit" loading={loading}>Update Password</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
