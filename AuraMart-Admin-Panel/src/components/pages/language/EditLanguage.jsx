import React, { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Globe, ArrowLeft, Download, Upload, Search, Save } from "lucide-react";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { SearchInput } from "../../ui/SearchInput";

const DEMO_KEYS = [
  { key: "Dashboard",    value: "Dashboard"    },
  { key: "Products",     value: "Products"     },
  { key: "Orders",       value: "Orders"       },
  { key: "Collections",  value: "Collections"  },
  { key: "Customers",    value: "Customers"    },
];

const EditLanguage = () => {
  const { id } = useParams();
  const fileRef = useRef(null);
  const [search, setSearch]   = useState("");
  const [title, setTitle]     = useState("en");
  const [saving, setSaving]   = useState(false);

  const filtered = DEMO_KEYS.filter(k =>
    k.key.toLowerCase().includes(search.toLowerCase()) ||
    k.value.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveTitle = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    toast.success("Language title updated");
    setSaving(false);
  };

  const handleImport = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".json")) { toast.error("Select a JSON file"); return; }
    toast.success(`"${f.name}" imported successfully`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Language (${id || "en"})`}
        subtitle="Update language title and translation keys"
        breadcrumbs={[{ label: "Settings" }, { label: "Languages", href: "/admin/language" }, { label: "Edit" }]}
        icon={<Globe size={20} />}
        action={
          <Link to="/admin/language">
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />}>Back</Button>
          </Link>
        }
      />

      {/* Title */}
      <Card>
        <CardHeader><CardTitle>Language Title</CardTitle></CardHeader>
        <CardBody>
          <form onSubmit={handleSaveTitle} className="flex gap-2 max-w-sm">
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Language title"
              className="flex-1 h-10 px-3 border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946] bg-white"
            />
            <Button type="submit" loading={saving} icon={<Save size={14} />}>Update</Button>
          </form>
        </CardBody>
      </Card>

      {/* Import / Export */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardBody>
            <div
              className="border-2 border-dashed border-[#EAEAEA] rounded-xl p-6 text-center hover:border-[#E63946]/40 hover:bg-[#FFF1F1]/20 transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={24} className="mx-auto text-[#6B7280] mb-2" />
              <p className="text-sm font-semibold text-[#2B2D42]">Import JSON</p>
              <p className="text-xs text-[#6B7280] mt-0.5">Upload a .json translation file</p>
              <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex flex-col items-center justify-center h-full gap-3 py-4">
              <Download size={28} className="text-[#6B7280]" />
              <p className="text-sm font-semibold text-[#2B2D42]">Export JSON</p>
              <p className="text-xs text-[#6B7280]">Download current translation as .json</p>
              <Button variant="secondary" size="sm" icon={<Download size={13} />} onClick={() => toast.success("JSON export downloaded")}>
                Export
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* JSON viewer */}
      <Card>
        <CardHeader
          action={<SearchInput value={search} onChange={setSearch} placeholder="Search keys…" className="w-52" />}
        >
          <CardTitle>Translation Keys ({filtered.length})</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm data-table">
            <thead><tr><th className="text-left">Key</th><th className="text-left">Value</th></tr></thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={i}>
                  <td className="font-mono text-xs text-[#E63946]">"{item.key}"</td>
                  <td className="text-[#6B7280]">"{item.value}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EditLanguage;
