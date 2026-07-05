import React from "react";
import { MessageSquare, Info, CheckCircle } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";

const SMS_PROVIDERS = [
  { name: "Twilio", region: "Global", status: "Not configured" },
  { name: "MSG91",  region: "India",  status: "Not configured" },
];

const SMSGateways = () => (
  <div className="space-y-6">
    <PageHeader
      title="SMS Gateway"
      subtitle="SMS provider configuration for order & OTP notifications"
      breadcrumbs={[{ label: "Settings" }, { label: "SMS Gateway" }]}
      icon={<MessageSquare size={20} />}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {SMS_PROVIDERS.map(p => (
        <Card key={p.name}>
          <CardHeader><CardTitle>{p.name}</CardTitle></CardHeader>
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-[#6B7280] font-medium">{p.region}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-[#6B7280] font-medium">{p.status}</span>
            </div>
            <div className="flex items-start gap-2 bg-[#FAF7F2] border border-[#EAEAEA] rounded-xl px-3 py-2.5 text-sm text-[#6B7280]">
              <Info size={13} className="mt-0.5 flex-shrink-0 text-[#6B7280]" />
              Configure credentials in the server <code className="font-mono text-xs bg-[#EAEAEA] px-1 rounded">.env</code> file.
            </div>
          </CardBody>
        </Card>
      ))}
    </div>

    <div className="flex items-start gap-3 p-4 bg-[#FFF1F1] border border-[#E63946]/20 rounded-xl">
      <Info size={16} className="text-[#E63946] flex-shrink-0 mt-0.5" />
      <p className="text-sm text-[#6B7280]">
        <span className="font-semibold text-[#2B2D42]">SMS credentials are managed server-side.</span>
        {" "}Update your <code className="font-mono text-xs bg-[#EAEAEA] px-1 rounded">.env</code> variables and restart the server to apply changes.
      </p>
    </div>
  </div>
);

export default SMSGateways;
