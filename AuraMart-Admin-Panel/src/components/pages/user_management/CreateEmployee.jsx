import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserPlus, User } from "lucide-react";
import { request } from "../../../api/request";
import { ApiEndpoints } from "../../../api/apis";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";

const INIT = { firstName: "", lastName: "", contact: "", email: "", role: "", gender: "", password: "", confirmPassword: "", profileImage: null };

export const CreateEmployee = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    (async () => {
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.ROLE.GET_ROLE });
      if (!error && Array.isArray(data?.data)) setRoles(data.data);
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setPreview(URL.createObjectURL(file)); setForm(p => ({ ...p, profileImage: file })); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v && k !== "confirmPassword") fd.append(k, v); });
    fd.append("confirmPassword", form.confirmPassword);
    setLoading(true);
    try {
      const [, error] = await request({ method: "POST", url: ApiEndpoints.EMPLOYEE.ADD_EMPLOYEE, data: fd });
      if (error) throw new Error(error?.message || "Failed to add employee");
      toast.success("Employee added successfully");
      setForm(INIT); setPreview("");
      navigate("/admin/employees");
    } catch (err) { toast.error(err.message); } finally { setLoading(false); }
  };

  const Field = ({ label, required: req, children }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{req && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );

  const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";

  return (
    <div className="space-y-6">
      <PageHeader title="Create Employee" subtitle="Add a new employee account" breadcrumbs={[{ label: "Users" }, { label: "Employees", href: "/admin/employees" }, { label: "Create" }]} />

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <Card>
          <CardHeader><CardTitle><div className="flex items-center gap-2"><User size={15} className="text-[#E63946]" /> Employee Information</div></CardTitle></CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" required>
                    <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" className={inputCls} required />
                  </Field>
                  <Field label="Last Name">
                    <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className={inputCls} />
                  </Field>
                </div>
                <Field label="Phone Number" required>
                  <input type="tel" name="contact" value={form.contact} onChange={handleChange} placeholder="10-digit mobile number" className={inputCls} required maxLength={15} />
                </Field>
                <Field label="Gender">
                  <select name="gender" value={form.gender} onChange={handleChange} className={inputCls}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </Field>
                <Field label="Email" required>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="employee@email.com" className={inputCls} required />
                </Field>
              </div>

              {/* Right */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  {preview ? (
                    <img src={preview} alt="Profile preview" className="w-32 h-32 rounded-xl object-cover border-2 border-[#E63946]/30" />
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <User size={32} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <Field label="Profile Photo (1:1 ratio)">
                  <input type="file" name="profileImage" accept="image/*" onChange={handleImage}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1]" />
                </Field>
                <Field label="Role" required>
                  <select name="role" value={form.role} onChange={handleChange} className={inputCls} required>
                    <option value="">Select role</option>
                    {roles.map(r => <option key={r._id} value={r._id}>{r.roleName}</option>)}
                  </select>
                </Field>
              </div>

              {/* Password row */}
              <Field label="Password" required>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputCls} required />
              </Field>
              <Field label="Confirm Password" required>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className={inputCls} required />
              </Field>
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <Button type="button" variant="secondary" onClick={() => navigate("/admin/employees")}>Back</Button>
              <Button type="submit" loading={loading} icon={<UserPlus size={15} />}>Create Employee</Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default CreateEmployee;
