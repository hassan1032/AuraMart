import React from "react";
import { Megaphone, Info } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";

const Ads = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotional Ads"
        subtitle="In-app promotional advertisement slots"
        breadcrumbs={[{ label: "Promotions" }, { label: "Ads" }]}
        icon={<Megaphone size={20} />}
      />

      <Card>
        <CardBody>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF1F1] flex items-center justify-center mb-4">
              <Megaphone size={28} className="text-[#E63946]" />
            </div>
            <h3 className="text-base font-semibold text-[#2B2D42] mb-1">No Ads Configured</h3>
            <p className="text-sm text-[#6B7280] max-w-sm">
              Promotional ad slots will appear here once the ads module is connected to the backend.
            </p>
            <div className="mt-6 flex items-start gap-2 bg-[#FAF7F2] border border-[#EAEAEA] rounded-xl px-4 py-3 max-w-sm text-left">
              <Info size={14} className="text-[#6B7280] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#6B7280]">
                Use <span className="font-semibold text-[#2B2D42]">Banners</span> to manage storefront promotions in the meantime.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Ads;
