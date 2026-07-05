import React, { useRef, useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";

const STEPS = [
  { step: 1, title: "Download Template",  desc: "Get the product CSV template with required columns."  },
  { step: 2, title: "Fill in Products",   desc: "Add your product data following the column headers."   },
  { step: 3, title: "Upload CSV File",    desc: "Select and upload the completed CSV below."            },
];

const BulkImport = () => {
  const fileRef  = useRef(null);
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".csv")) { toast.error("Please select a CSV file"); return; }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) { toast.error("Select a CSV file first"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success(`"${file.name}" queued for import`);
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bulk Product Import"
        subtitle="Import multiple products at once using a CSV file"
        breadcrumbs={[{ label: "Import / Export" }, { label: "Bulk Import" }]}
        icon={<Upload size={20} />}
      />

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STEPS.map(({ step, title, desc }) => (
          <Card key={step}>
            <CardBody>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF1F1] flex items-center justify-center text-[#E63946] font-bold text-sm flex-shrink-0">
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-[#2B2D42] text-sm">{title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <Button variant="secondary" size="sm" icon={<FileText size={14} />}>
            Download Template
          </Button>

          <div
            className="border-2 border-dashed border-[#EAEAEA] rounded-xl p-8 text-center hover:border-[#E63946]/40 hover:bg-[#FFF1F1]/30 transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={28} className="mx-auto text-[#6B7280] mb-2" />
            <p className="text-sm font-medium text-[#2B2D42]">
              {file ? file.name : "Click to select CSV file"}
            </p>
            <p className="text-xs text-[#6B7280] mt-1">Only .csv files are accepted</p>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm text-[#7CB342] bg-[#F1F8E9] border border-[#7CB342]/20 rounded-xl px-3 py-2">
              <CheckCircle size={14} className="flex-shrink-0" />
              <span className="font-medium">{file.name}</span>
              <span className="text-[#6B7280] text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleUpload} loading={loading} disabled={!file} icon={<Upload size={14} />}>
              Import Products
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BulkImport;
