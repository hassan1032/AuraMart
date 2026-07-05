import React, { useState } from "react";
import { Download, Package, Tag, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";

const EXPORT_TYPES = [
  { key: "products",    label: "Products",     icon: Package,     count: "All products" },
  { key: "collections", label: "Collections",  icon: Tag,         count: "All collections" },
  { key: "orders",      label: "Orders",       icon: ShoppingCart, count: "All orders" },
];

const BulkExport = () => {
  const [loading, setLoading] = useState(null);

  const handleExport = async (key, label) => {
    setLoading(key);
    await new Promise(r => setTimeout(r, 900));
    toast.success(`${label} export started — CSV will download shortly`);
    setLoading(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bulk Export"
        subtitle="Export your store data as CSV files for backup or migration"
        breadcrumbs={[{ label: "Import / Export" }, { label: "Bulk Export" }]}
        icon={<Download size={20} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {EXPORT_TYPES.map(({ key, label, icon: Icon, count }) => (
          <Card key={key}>
            <CardBody>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1F1] flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#E63946]" />
                </div>
                <div>
                  <p className="font-semibold text-[#2B2D42] text-sm">{label}</p>
                  <p className="text-xs text-[#6B7280]">{count}</p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                icon={<Download size={13} />}
                loading={loading === key}
                onClick={() => handleExport(key, label)}
              >
                Export {label}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BulkExport;
