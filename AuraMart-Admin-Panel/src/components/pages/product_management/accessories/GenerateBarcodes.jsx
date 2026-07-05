import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Barcode as BarcodeIcon, Printer, RotateCcw, ArrowLeft } from "lucide-react";
import Barcode from "react-barcode";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const GenerateBarcodes = () => {
  const { _id }               = useParams();
  const [searchParams]        = useSearchParams();
  const [count, setCount]     = useState(Number(searchParams.get("count") || 4));
  const [accessory, setAccessory] = useState(null);
  const [barcodeData, setBarcodeData] = useState({ sku: "", labels: [] });
  const [genLoading, setGenLoading]   = useState(false);

  const printBarcodes = () => {
    const el = document.getElementById("printelement");
    if (!el) return;
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Barcodes</title><style>body{font-family:sans-serif;}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:16px;}@media print{@page{size:A4;margin:8mm;}}</style></head><body><div class="grid">${el.innerHTML}</div></body></html>`);
    win.document.close();
    win.print();
  };

  const generateBarcodes = async () => {
    if (!count || count <= 0) { toast.error("Enter a valid quantity"); return; }
    setGenLoading(true);
    const [data, error] = await request({
      method: "POST",
      url: `${ApiEndpoints.PRODUCTS_MANAGEMENT.GENERATE_BARCODE_ACCESSORY(_id)}${count}`,
    });
    if (error) toast.error(error.message || "Failed to generate barcodes");
    else setBarcodeData(data || { sku: "", labels: [] });
    setGenLoading(false);
  };

  useEffect(() => { generateBarcodes(); }, [_id]);

  useEffect(() => {
    (async () => {
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.GET_ACCESSORY(_id) });
      if (error) { toast.error("Failed to fetch accessory"); return; }
      if (Array.isArray(data?.data) && data.data.length > 0) setAccessory(data.data[0]);
    })();
  }, [_id]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generate Barcodes"
        subtitle={accessory?.accessoryName || "Loading accessory…"}
        breadcrumbs={[{ label: "Accessories" }, { label: "Barcode" }]}
        icon={<BarcodeIcon size={20} />}
        action={
          <Link to="/admin/accessories">
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />}>Back</Button>
          </Link>
        }
      />

      <Card>
        <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
        <CardBody>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1 uppercase tracking-wide">SKU</label>
              <p className="font-mono text-sm font-semibold text-[#2B2D42]">{accessory?.accessorySKU || "—"}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1 uppercase tracking-wide">Accessory</label>
              <p className="text-sm font-semibold text-[#2B2D42]">{accessory?.accessoryName || "—"}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1 uppercase tracking-wide">Quantity</label>
              <input
                type="number" min={1} max={100} value={count ?? ""}
                onChange={e => { const v = e.target.value; if (v === "") setCount(null); else { const n = Number(v); if (!isNaN(n) && n > 0) setCount(Math.floor(n)); } }}
                className="w-28 h-10 px-3 border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946] bg-white"
              />
            </div>
            <div className="flex gap-2">
              <Button icon={<BarcodeIcon size={14} />} loading={genLoading} onClick={generateBarcodes}>Generate</Button>
              <Button variant="secondary" icon={<RotateCcw size={14} />} onClick={() => setBarcodeData({ sku: "", labels: [] })}>Reset</Button>
              {barcodeData.labels?.length > 0 && (
                <Button variant="secondary" icon={<Printer size={14} />} onClick={printBarcodes}>Print</Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {barcodeData.labels?.length > 0 && (
        <Card>
          <CardHeader><CardTitle>{barcodeData.labels.length} Barcode{barcodeData.labels.length > 1 ? "s" : ""} Generated</CardTitle></CardHeader>
          <CardBody>
            <div id="printelement" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {barcodeData.labels.map((label, i) => (
                <div key={i} className="border border-[#EAEAEA] rounded-xl p-3 text-center bg-white">
                  <p className="text-xs font-bold text-[#2B2D42] mb-1">AuraMart</p>
                  <p className="text-[10px] text-[#6B7280] mb-2 truncate">{accessory?.accessoryName}</p>
                  <div className="flex justify-center">
                    <Barcode value={label} height={52} width={1.5} fontSize={11} font="monospace" fontOptions="bold" />
                  </div>
                  <p className="text-[9px] text-[#6B7280] mt-1 font-mono">{label}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default GenerateBarcodes;
