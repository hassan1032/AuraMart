import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Bell, Users, CheckSquare, Square, Send } from "lucide-react";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../../ui/Table";
import { getInitials } from "../../../../lib/utils";

const Notification = () => {
  const [customers, setCustomers]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [sending, setSending]           = useState(false);
  const [selectedIds, setSelectedIds]   = useState([]);
  const [form, setForm]                 = useState({ title: "", message: "" });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.ORDERS.ALL_ORDERS });
      if (!error && Array.isArray(data?.data)) {
        const map = new Map();
        data.data.forEach(order => {
          const user = order.user;
          if (!user) return;
          const key = user.email || user._id;
          if (key && !map.has(key)) {
            map.set(key, {
              _id: user._id || key,
              name: user.name || user.firstName || user.email?.split("@")[0] || "Customer",
              email: user.email || "—",
              phone: user.contact || user.phone || "—",
            });
          }
        });
        setCustomers(Array.from(map.values()));
      } else if (error) {
        toast.error("Failed to load customer list");
      }
      setLoading(false);
    })();
  }, []);

  const allSelected = customers.length > 0 && selectedIds.length === customers.length;

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : customers.map(c => c._id));
  };

  const toggleOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.message.trim()) { toast.error("Message is required"); return; }
    if (selectedIds.length === 0) { toast.error("Select at least one customer"); return; }
    setSending(true);
    toast.success(`Notification queued for ${selectedIds.length} customer${selectedIds.length > 1 ? "s" : ""}`);
    setForm({ title: "", message: "" });
    setSelectedIds([]);
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Send Notification"
        subtitle="Broadcast messages to selected customers"
        breadcrumbs={[{ label: "Promotions" }, { label: "Notifications" }]}
        icon={<Bell size={20} />}
      />

      <form onSubmit={handleSend} className="space-y-6">
        {/* Compose card */}
        <Card>
          <CardHeader><CardTitle>Compose Message</CardTitle></CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2B2D42] mb-1.5">
                Title <span className="text-[#E63946]">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. New collection just dropped!"
                maxLength={100}
                className="w-full h-10 px-3 border border-[#EAEAEA] rounded-xl text-sm text-[#2B2D42] focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946] bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2B2D42] mb-1.5">
                Message <span className="text-[#E63946]">*</span>
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Write your notification message here…"
                className="w-full px-3 py-2.5 border border-[#EAEAEA] rounded-xl text-sm text-[#2B2D42] focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946] bg-white resize-none"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={sending} icon={<Send size={14} />}>
                Send to {selectedIds.length > 0 ? `${selectedIds.length} Customer${selectedIds.length > 1 ? "s" : ""}` : "Selected"}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Customer selector */}
        <Card>
          <CardHeader
            action={
              <button
                type="button"
                onClick={toggleAll}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#E63946] hover:text-[#C5303A]"
              >
                {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            }
          >
            <CardTitle className="flex items-center gap-2">
              <Users size={16} className="text-[#6B7280]" />
              Select Recipients
              {selectedIds.length > 0 && (
                <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFF1F1] text-[#E63946]">
                  {selectedIds.length} selected
                </span>
              )}
            </CardTitle>
          </CardHeader>

          <Table>
            <thead>
              <tr>
                <Th className="w-10"></Th>
                <Th>Customer</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={4} />
              ) : customers.length === 0 ? (
                <TableEmpty message="No customers found — they appear once orders are placed" icon={<Users size={22} />} />
              ) : (
                customers.map(c => (
                  <tr
                    key={c._id}
                    className={`cursor-pointer ${selectedIds.includes(c._id) ? "bg-[#FFF1F1]/50" : ""}`}
                    onClick={() => toggleOne(c._id)}
                  >
                    <Td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c._id)}
                        onChange={() => toggleOne(c._id)}
                        onClick={e => e.stopPropagation()}
                        className="w-4 h-4 accent-[#E63946] rounded cursor-pointer"
                      />
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#E63946] text-xs font-bold flex-shrink-0">
                          {getInitials(c.name) || "?"}
                        </div>
                        <span className="font-medium text-[#2B2D42] text-sm">{c.name}</span>
                      </div>
                    </Td>
                    <Td className="text-[#6B7280] text-sm">{c.email}</Td>
                    <Td className="text-[#6B7280] text-sm">{c.phone}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      </form>
    </div>
  );
};

export default Notification;
