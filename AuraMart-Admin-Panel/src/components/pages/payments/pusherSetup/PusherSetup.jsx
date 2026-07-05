import React from "react";
import { Zap, Info } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";

const ENV_KEYS = [
  { key: "PUSHER_APP_ID",      desc: "Pusher application ID"        },
  { key: "PUSHER_APP_KEY",     desc: "Public key for the client"    },
  { key: "PUSHER_APP_SECRET",  desc: "Secret key (server-side only)"},
  { key: "PUSHER_APP_CLUSTER", desc: "Data centre cluster (e.g. ap2)"},
];

const PusherSetup = () => (
  <div className="space-y-6">
    <PageHeader
      title="Pusher / Real-time"
      subtitle="WebSocket configuration for live order and notification updates"
      breadcrumbs={[{ label: "Settings" }, { label: "Pusher Setup" }]}
      icon={<Zap size={20} />}
    />

    <Card>
      <CardHeader><CardTitle>Environment Variables</CardTitle></CardHeader>
      <CardBody>
        <p className="text-sm text-[#6B7280] mb-4">
          Pusher credentials are set in the backend{" "}
          <code className="font-mono text-xs bg-[#EAEAEA] px-1 rounded">.env</code> file.
          Create a free app at <span className="font-medium text-[#2B2D42]">pusher.com</span> to get these values.
        </p>
        <div className="overflow-x-auto rounded-xl border border-[#EAEAEA]">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF7F2]">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#6B7280] uppercase tracking-wide w-1/2">Variable</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F0EA]">
              {ENV_KEYS.map(({ key, desc }) => (
                <tr key={key}>
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs bg-[#FFF1F1] text-[#E63946] px-1.5 py-0.5 rounded">{key}</code>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B7280]">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>

    <div className="flex items-start gap-3 p-4 bg-[#FFF1F1] border border-[#E63946]/20 rounded-xl">
      <Info size={16} className="text-[#E63946] flex-shrink-0 mt-0.5" />
      <p className="text-sm text-[#6B7280]">
        <span className="font-semibold text-[#2B2D42]">Real-time features require Pusher credentials.</span>
        {" "}Without them, the admin panel still functions normally — live updates will simply not appear until Pusher is configured.
      </p>
    </div>
  </div>
);

export default PusherSetup;
