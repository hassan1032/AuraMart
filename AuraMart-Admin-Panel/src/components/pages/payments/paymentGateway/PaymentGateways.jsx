import React from "react";
import { IndianRupee, CheckCircle, Info, Truck } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";

const PaymentGateways = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Methods"
        subtitle="Payment configuration for AuraMart India storefront"
        breadcrumbs={[{ label: "Settings" }, { label: "Payment Methods" }]}
        color="teal"
        icon={<IndianRupee size={20} />}
      />

      {/* Active Method */}
      <Card>
        <CardHeader>
          <CardTitle>Active Payment Method</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F1F8E9] border border-[#7CB342]/30">
            <div className="w-12 h-12 rounded-xl bg-[#7CB342]/10 flex items-center justify-center flex-shrink-0">
              <Truck size={22} className="text-[#7CB342]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-[#2B2D42] text-base">Cash on Delivery (COD)</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7CB342]/15 text-[#5D8E2A] uppercase tracking-wide">
                  <CheckCircle size={9} /> Active
                </span>
              </div>
              <p className="text-sm text-[#6B7280]">
                Customers pay in cash when their order is delivered to their doorstep. This is the
                only payment method supported for AuraMart India.
              </p>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Currency", value: "Indian Rupee (₹ INR)" },
                  { label: "Country", value: "India" },
                  { label: "Collection", value: "At delivery" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-lg border border-[#EAEAEA] px-3 py-2">
                    <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-[#2B2D42] mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-[#FFF1F1] border border-[#E63946]/20 rounded-xl">
        <Info size={16} className="text-[#E63946] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-[#6B7280]">
          <span className="font-semibold text-[#2B2D42]">Online payment gateways are not configured.</span>
          {" "}AuraMart currently operates on a Cash on Delivery model across India.
          All payment credentials are managed via environment variables on the server.
        </div>
      </div>
    </div>
  );
};

export default PaymentGateways;
