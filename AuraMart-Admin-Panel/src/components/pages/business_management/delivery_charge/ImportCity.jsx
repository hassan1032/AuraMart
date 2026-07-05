import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { MapPin, Upload, Download, Info, CheckCircle } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const STEPS = [
  { step: 1, title: "Download Template",      desc: "Get the JSON template with the required structure."         },
  { step: 2, title: "Fill in City Data",       desc: `Add country name and cities array.\nOnly one country at a time.` },
  { step: 3, title: "Upload & Import",         desc: "Select the .json file and click Import."                   },
];

const TEMPLATE_EXAMPLE = `{
  "country": "India",
  "cities": [
    "Mumbai",
    "Delhi",
    "Bangalore"
  ]
}`;

const ImportCity = () => {
  const fileRef   = useRef(null);
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".json")) { toast.error("Select a .json file"); return; }
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error("Select a JSON file first"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Cities imported successfully");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Import Cities"
        subtitle="Bulk import delivery cities from a JSON file"
        breadcrumbs={[{ label: "Delivery" }, { label: "Import Cities" }]}
        icon={<MapPin size={20} />}
      />

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STEPS.map(({ step, title, desc }) => (
          <Card key={step}>
            <CardBody>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF1F1] flex items-center justify-center text-[#E63946] font-bold text-sm flex-shrink-0">{step}</div>
                <div>
                  <p className="font-semibold text-[#2B2D42] text-sm">{title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5 whitespace-pre-line">{desc}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Template preview */}
      <Card>
        <CardHeader><CardTitle>JSON Template Format</CardTitle></CardHeader>
        <CardBody>
          <pre className="bg-[#FAF7F2] border border-[#EAEAEA] rounded-xl p-4 text-xs font-mono text-[#2B2D42] overflow-x-auto">{TEMPLATE_EXAMPLE}</pre>
          <div className="mt-3">
            <Button variant="secondary" size="sm" icon={<Download size={13} />} onClick={() => toast.info("Template download started")}>
              Download Template
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          <span className="font-semibold">Warning:</span> Importing will overwrite existing cities for the specified country.
        </p>
      </div>

      {/* Upload */}
      <Card>
        <CardHeader><CardTitle>Upload JSON File</CardTitle></CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              className="border-2 border-dashed border-[#EAEAEA] rounded-xl p-8 text-center hover:border-[#E63946]/40 hover:bg-[#FFF1F1]/30 transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
              onDrop={e => { e.preventDefault(); handleFile({ target: { files: e.dataTransfer.files } }); }}
              onDragOver={e => e.preventDefault()}
            >
              <Upload size={26} className="mx-auto text-[#6B7280] mb-2" />
              <p className="text-sm font-medium text-[#2B2D42]">{file ? file.name : "Drop JSON file here or click to browse"}</p>
              <p className="text-xs text-[#6B7280] mt-1">Only .json files are accepted</p>
              <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFile} />
            </div>

            {file && (
              <div className="flex items-center gap-2 text-sm text-[#7CB342] bg-[#F1F8E9] border border-[#7CB342]/20 rounded-xl px-3 py-2">
                <CheckCircle size={14} />
                <span className="font-medium">{file.name}</span>
                <span className="text-[#6B7280] text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" loading={loading} disabled={!file} icon={<Upload size={14} />}>Import Cities</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ImportCity;
