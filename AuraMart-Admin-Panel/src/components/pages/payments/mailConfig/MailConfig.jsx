import React from "react";
import { Mail, Info } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";

const ENV_KEYS = [
  { key: "MAIL_MAILER",       example: "smtp",              desc: "Mail driver"         },
  { key: "MAIL_HOST",         example: "smtp.gmail.com",    desc: "SMTP host"           },
  { key: "MAIL_PORT",         example: "587",               desc: "SMTP port"           },
  { key: "MAIL_USERNAME",     example: "you@gmail.com",     desc: "Auth username"       },
  { key: "MAIL_PASSWORD",     example: "app-password",      desc: "Auth password"       },
  { key: "MAIL_FROM_ADDRESS", example: "no-reply@domain.in",desc: "Sender address"      },
  { key: "MAIL_FROM_NAME",    example: "AuraMart",          desc: "Sender display name" },
];

const MailConfig = () => (
  <div className="space-y-6">
    <PageHeader
      title="Mail Configuration"
      subtitle="Email delivery settings for order confirmations and notifications"
      breadcrumbs={[{ label: "Settings" }, { label: "Mail Config" }]}
      icon={<Mail size={20} />}
    />

    <Card>
      <CardHeader><CardTitle>Environment Variables</CardTitle></CardHeader>
      <CardBody>
        <p className="text-sm text-[#6B7280] mb-4">
          Mail settings are managed via server environment variables.
          Set these in your backend <code className="font-mono text-xs bg-[#EAEAEA] px-1 rounded">.env</code> file:
        </p>
        <div className="overflow-x-auto rounded-xl border border-[#EAEAEA]">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF7F2]">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#6B7280] uppercase tracking-wide w-1/3">Variable</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#6B7280] uppercase tracking-wide w-1/3">Example Value</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F0EA]">
              {ENV_KEYS.map(({ key, example, desc }) => (
                <tr key={key}>
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs bg-[#FFF1F1] text-[#E63946] px-1.5 py-0.5 rounded">{key}</code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-[#6B7280]">{example}</code>
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
        <span className="font-semibold text-[#2B2D42]">Changes require a server restart.</span>
        {" "}After updating your <code className="font-mono text-xs bg-[#EAEAEA] px-1 rounded">.env</code> file, restart Node.js for the new mail settings to take effect.
      </p>
    </div>
  </div>
);

export default MailConfig;
