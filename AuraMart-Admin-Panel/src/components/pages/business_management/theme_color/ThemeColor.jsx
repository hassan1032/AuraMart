import React, { useState } from "react";
import { Palette, Save } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const PALETTES = [
  { primary: "#2563EB", secondary: "#EFF6FF", name: "Blue" },
  { primary: "#22C55E", secondary: "#F0FDF4", name: "Green" },
  { primary: "#8B5CF6", secondary: "#F5F3FF", name: "Purple" },
  { primary: "#F59E0B", secondary: "#FFFBEB", name: "Amber" },
  { primary: "#EF4444", secondary: "#FEF2F2", name: "Red" },
  { primary: "#06B6D4", secondary: "#ECFEFF", name: "Cyan" },
];

const ThemeColor = () => {
  const [primary, setPrimary] = useState("#2563EB");
  const [secondary, setSecondary] = useState("#EFF6FF");

  const handleSave = (e) => { e.preventDefault(); };

  return (
    <div className="space-y-6">
      <PageHeader title="Theme Color" subtitle="Customize your storefront color scheme" breadcrumbs={[{ label: "Business" }, { label: "Theme Color" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Colors */}
        <Card>
          <CardHeader><CardTitle><div className="flex items-center gap-2"><Palette size={14} className="text-[#E63946]" /> Current Colors</div></CardTitle></CardHeader>
          <CardBody>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg border border-gray-200 overflow-hidden">
                      <input type="color" value={primary} onChange={e => setPrimary(e.target.value)} className="w-full h-full cursor-pointer border-0 p-0" />
                    </div>
                    <div>
                      <div className="w-8 h-8 rounded-lg border border-gray-200" style={{ background: primary }} />
                      <p className="text-xs text-gray-500 mt-1 font-mono">{primary}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg border border-gray-200 overflow-hidden">
                      <input type="color" value={secondary} onChange={e => setSecondary(e.target.value)} className="w-full h-full cursor-pointer border-0 p-0" />
                    </div>
                    <div>
                      <div className="w-8 h-8 rounded-lg border border-gray-200" style={{ background: secondary }} />
                      <p className="text-xs text-gray-500 mt-1 font-mono">{secondary}</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button type="submit" icon={<Save size={14} />}>Save Colors</Button>
            </form>
          </CardBody>
        </Card>

        {/* Available Palettes */}
        <Card>
          <CardHeader><CardTitle>Available Palettes</CardTitle></CardHeader>
          <CardBody>
            <div className="grid grid-cols-3 gap-3">
              {PALETTES.map(p => (
                <button key={p.name} type="button" onClick={() => { setPrimary(p.primary); setSecondary(p.secondary); }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${primary === p.primary ? "border-[#E63946] bg-[#FFF1F1]" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-full" style={{ background: p.primary }} />
                    <div className="w-6 h-6 rounded-full border border-gray-200" style={{ background: p.secondary }} />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{p.name}</span>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ThemeColor;
