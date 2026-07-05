import React, { useRef, useState } from "react";
import { Image, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";

const GalleryImport = () => {
  const inputRef  = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading]   = useState(false);

  const handleFiles = (files) => {
    const imgs = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!imgs.length) { toast.error("Select image files only"); return; }
    const newPreviews = imgs.map(f => ({ file: f, url: URL.createObjectURL(f), id: `${f.name}-${Date.now()}` }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const remove = (id) => setPreviews(prev => prev.filter(p => p.id !== id));

  const handleUpload = async () => {
    if (!previews.length) { toast.error("Add images first"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success(`${previews.length} image${previews.length > 1 ? "s" : ""} uploaded to gallery`);
    previews.forEach(p => URL.revokeObjectURL(p.url));
    setPreviews([]);
    setLoading(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery Images"
        subtitle="Upload product images to the media gallery"
        breadcrumbs={[{ label: "Import / Export" }, { label: "Gallery" }]}
        icon={<Image size={20} />}
        action={
          <Button icon={<Plus size={15} />} onClick={() => inputRef.current?.click()}>
            Add Images
          </Button>
        }
      />

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />

      {/* Drop zone */}
      <Card>
        <CardBody>
          <div
            className="border-2 border-dashed border-[#EAEAEA] rounded-xl p-10 text-center hover:border-[#E63946]/40 hover:bg-[#FFF1F1]/20 transition-colors cursor-pointer"
            onClick={() => inputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
          >
            <Image size={32} className="mx-auto text-[#6B7280] mb-3" />
            <p className="text-sm font-semibold text-[#2B2D42]">Drop images here or click to browse</p>
            <p className="text-xs text-[#6B7280] mt-1">Supports JPG, PNG, WEBP — multiple files allowed</p>
          </div>
        </CardBody>
      </Card>

      {/* Preview grid */}
      {previews.length > 0 && (
        <Card>
          <CardHeader
            action={
              <Button size="sm" loading={loading} icon={<Upload size={13} />} onClick={handleUpload}>
                Upload {previews.length} Image{previews.length > 1 ? "s" : ""}
              </Button>
            }
          >
            <CardTitle>Selected Images ({previews.length})</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
              {previews.map(p => (
                <div key={p.id} className="relative group aspect-square">
                  <img src={p.url} alt={p.file.name} className="w-full h-full object-cover rounded-xl border border-[#EAEAEA]" />
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#E63946] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default GalleryImport;
