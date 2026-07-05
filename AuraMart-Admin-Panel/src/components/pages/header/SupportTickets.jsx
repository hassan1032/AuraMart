import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LifeBuoy, ChevronDown, MessageSquare, ChevronRight } from "lucide-react";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";

const TICKET_ID = "7923744";
const STATUS_OPTIONS = ["Cancel", "Pending", "Confirm", "Completed"];

const STATUS_STYLES = {
  cancel:    "bg-red-50   text-red-600   border-red-200",
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  confirm:   "bg-[#FFF1F1] text-[#E63946] border-[#E63946]/30",
  completed: "bg-[#F1F8E9] text-[#7CB342] border-[#7CB342]/30",
};

const MESSAGES = [
  { id: 1, from: "customer", name: "Customer",   text: "I received the wrong item. Please help resolve.",    time: "26 Mar 2025, 10:14 AM" },
  { id: 2, from: "admin",    name: "Support",    text: "Apologies! Please share your order number and a photo.", time: "26 Mar 2025, 11:00 AM" },
];

const SupportTickets = () => {
  const [status, setStatus]   = useState("cancel");
  const [ddOpen, setDdOpen]   = useState(false);
  const [reply, setReply]     = useState("");
  const [msgs, setMsgs]       = useState(MESSAGES);

  const sendReply = () => {
    if (!reply.trim()) return;
    setMsgs(prev => [...prev, {
      id: prev.length + 1, from: "admin", name: "Support", text: reply.trim(),
      time: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    }]);
    setReply("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Ticket #${TICKET_ID}`}
        subtitle="Support conversation detail"
        breadcrumbs={[{ label: "Support", href: "/admin/support" }, { label: `#${TICKET_ID}` }]}
        icon={<LifeBuoy size={20} />}
        action={
          <Link to="/admin/support">
            <Button variant="secondary" size="sm">Back</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket meta */}
        <Card>
          <CardHeader><CardTitle>Ticket Info</CardTitle></CardHeader>
          <CardBody className="space-y-3 text-sm">
            {[
              { label: "Ticket No",    value: `#${TICKET_ID}` },
              { label: "Date",         value: "26 Mar 2025" },
              { label: "Order No",     value: "#RC000723" },
              { label: "Issue Type",   value: "Delivery Problem" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-2 py-1.5 border-b border-[#F5F0EA] last:border-0">
                <span className="text-[#6B7280] min-w-[90px]">{label}</span>
                <span className="font-medium text-[#2B2D42]">{value}</span>
              </div>
            ))}
            <div className="pt-1">
              <p className="text-xs text-[#6B7280] mb-1.5">Status</p>
              <div className="relative">
                <button
                  onClick={() => setDdOpen(p => !p)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border capitalize w-full justify-between ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}
                >
                  {status} <ChevronDown size={12} className={`transition-transform ${ddOpen ? "rotate-180" : ""}`} />
                </button>
                {ddOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#EAEAEA] rounded-xl shadow-lg overflow-hidden z-10">
                    {STATUS_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-[#FAF7F2] text-[#2B2D42] capitalize"
                        onClick={() => { setStatus(opt.toLowerCase()); setDdOpen(false); }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Chat */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Messages</CardTitle></CardHeader>
            <CardBody className="space-y-4 max-h-80 overflow-y-auto">
              {msgs.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.from === "admin" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.from === "admin" ? "bg-[#FFF1F1] text-[#E63946]" : "bg-purple-50 text-purple-600"}`}>
                    {msg.name[0]}
                  </div>
                  <div className={`max-w-[70%] flex flex-col gap-1 ${msg.from === "admin" ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.from === "admin" ? "bg-[#E63946] text-white rounded-tr-sm" : "bg-[#FAF7F2] text-[#2B2D42] border border-[#EAEAEA] rounded-tl-sm"}`}>
                      {msg.text}
                    </div>
                    <p className="text-[10px] text-[#6B7280]">{msg.time}</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex gap-3">
                <textarea
                  value={reply} onChange={e => setReply(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                  placeholder="Type a reply… (Enter to send)"
                  rows={3}
                  className="flex-1 px-3 py-2.5 text-sm border border-[#EAEAEA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946] resize-none bg-white"
                />
                <div className="flex flex-col justify-end">
                  <Button icon={<MessageSquare size={14} />} onClick={sendReply} disabled={!reply.trim()}>Reply</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
