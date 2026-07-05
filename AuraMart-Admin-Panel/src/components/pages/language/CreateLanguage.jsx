import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Globe, ArrowLeft, Save } from "lucide-react";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";

const CreateLanguage = () => {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ title: "", name: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "name" ? value.replace(/[^a-zA-Z]/g, "").toLowerCase() : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Short name is required"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    toast.success("Language created successfully");
    navigate("/admin/language");
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Language"
        subtitle="Add a new display language to the storefront"
        breadcrumbs={[{ label: "Settings" }, { label: "Languages", href: "/admin/language" }, { label: "Create" }]}
        icon={<Globe size={20} />}
        action={
          <Link to="/admin/language">
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />}>Back</Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardBody className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-[#2B2D42] mb-1.5">
                Language Title
              </label>
              <input
                type="text" name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. English" maxLength={100}
                className="w-full h-10 px-3 border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946] bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2B2D42] mb-1.5">
                Short Code <span className="text-[#E63946]">*</span>{" "}
                <span className="text-[#6B7280] font-normal text-xs">(letters only, e.g. en)</span>
              </label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="en" maxLength={10} required
                className="w-full h-10 px-3 border border-[#EAEAEA] rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946] bg-white uppercase"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Link to="/admin/language">
                <Button variant="secondary" type="button">Cancel</Button>
              </Link>
              <Button type="submit" loading={loading} icon={<Save size={14} />}>Create Language</Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default CreateLanguage;
