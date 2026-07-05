import React, { useRef, useState } from "react";
import { Archive, Upload, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";

const UploadZipFile = () => {
  const inputRef  = useRef(null);
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".zip")) { toast.error("Only .zip files are accepted"); return; }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) { toast.error("Select a zip file first"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success(`"${file.name}" uploaded successfully`);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Zip File"
        subtitle="Bulk upload product images packaged as a ZIP archive"
        breadcrumbs={[{ label: "Import / Export" }, { label: "Upload ZIP" }]}
        icon={<Archive size={20} />}
      />

      <Card>
        <CardBody className="space-y-4">
          <div
            className="border-2 border-dashed border-[#EAEAEA] rounded-xl p-10 text-center hover:border-[#E63946]/40 hover:bg-[#FFF1F1]/20 transition-colors cursor-pointer"
            onClick={() => inputRef.current?.click()}
            onDrop={e => { e.preventDefault(); handleFile({ target: { files: e.dataTransfer.files } }); }}
            onDragOver={e => e.preventDefault()}
          >
            <Archive size={32} className="mx-auto text-[#6B7280] mb-3" />
            <p className="text-sm font-semibold text-[#2B2D42]">
              {file ? file.name : "Drop ZIP file here or click to browse"}
            </p>
            <p className="text-xs text-[#6B7280] mt-1">Only .zip archives are accepted</p>
            <input ref={inputRef} type="file" accept=".zip" className="hidden" onChange={handleFile} />
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm text-[#7CB342] bg-[#F1F8E9] border border-[#7CB342]/20 rounded-xl px-3 py-2">
              <CheckCircle size={14} className="flex-shrink-0" />
              <span className="font-medium">{file.name}</span>
              <span className="text-[#6B7280] text-xs">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleUpload} loading={loading} disabled={!file} icon={<Upload size={14} />}>
              Upload ZIP
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default UploadZipFile;
