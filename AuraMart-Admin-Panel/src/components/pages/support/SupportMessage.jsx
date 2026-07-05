import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Send, LifeBuoy } from "lucide-react";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";

const MESSAGES = [
  { id: 1, from: "customer", name: "Customer",  text: "My order arrived with the wrong item. Please help.", time: "15 Dec 2024, 10:30 AM" },
  { id: 2, from: "admin",    name: "Support",    text: "We apologise for the inconvenience. Could you share the order number and a photo of the item received?", time: "15 Dec 2024, 11:15 AM" },
  { id: 3, from: "customer", name: "Customer",  text: "Order #RC000090. I have attached photos.", time: "15 Dec 2024, 12:00 PM" },
];

const SupportMessage = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState(MESSAGES);
  const [reply, setReply]       = useState("");

  const sendReply = () => {
    if (!reply.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      from: "admin", name: "Support",
      text: reply.trim(),
      time: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    }]);
    setReply("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Ticket #${id || "—"}`}
        subtitle="Support conversation thread"
        breadcrumbs={[{ label: "Support" }, { label: "Ticket" }]}
        icon={<LifeBuoy size={20} />}
        action={
          <Link to="/admin/support">
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />}>Back</Button>
          </Link>
        }
      />

      <Card>
        <CardBody className="space-y-4 max-h-[480px] overflow-y-auto">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.from === "admin" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.from === "admin" ? "bg-[#FFF1F1] text-[#E63946]" : "bg-purple-50 text-purple-600"}`}>
                {msg.name[0]}
              </div>
              <div className={`max-w-[70%] ${msg.from === "admin" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.from === "admin" ? "bg-[#E63946] text-white rounded-tr-sm" : "bg-[#FAF7F2] text-[#2B2D42] border border-[#EAEAEA] rounded-tl-sm"}`}>
                  {msg.text}
                </div>
                <p className="text-[10px] text-[#6B7280]">{msg.time}</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Reply box */}
      <Card>
        <CardBody>
          <div className="flex gap-3">
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
              placeholder="Type your reply… (Enter to send)"
              rows={3}
              className="flex-1 px-3 py-2.5 text-sm border border-[#EAEAEA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946] resize-none bg-white text-[#2B2D42]"
            />
            <div className="flex flex-col justify-end">
              <Button icon={<Send size={14} />} onClick={sendReply} disabled={!reply.trim()}>Send</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SupportMessage;
