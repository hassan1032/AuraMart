import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LifeBuoy, ChevronRight, Clock, CheckCircle, XCircle } from "lucide-react";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { SearchInput } from "../../ui/SearchInput";

const DEMO_TICKETS = [
  { id: 4, date: "26 Mar 2025", number: "#7923744", status: "cancelled", order: "#RC000723", issue: "Delivery Problem",     subject: "Delayed shipment"        },
  { id: 3, date: "28 Dec 2024", number: "#7734943", status: "cancelled", order: "N/A",       issue: "Product Issue",        subject: "Wrong item received"      },
  { id: 2, date: "19 Dec 2024", number: "#9430772", status: "cancelled", order: "#RC000055", issue: "Product Issue",        subject: "Damaged packaging"        },
  { id: 1, date: "15 Dec 2024", number: "#8712181", status: "confirmed", order: "#RC000090", issue: "Product Issue",        subject: "Return request"           },
];

const STATUS_STYLES = {
  confirmed:  "bg-[#FFF1F1] text-[#E63946] border-[#E63946]/30",
  pending:    "bg-amber-50   text-amber-700  border-amber-200",
  cancelled:  "bg-red-50     text-red-600    border-red-200",
  completed:  "bg-[#F1F8E9]  text-[#7CB342]  border-[#7CB342]/30",
};

const StatusIcon = ({ status }) => {
  if (status === "completed")  return <CheckCircle size={13} className="text-[#7CB342]" />;
  if (status === "pending")    return <Clock size={13} className="text-amber-500" />;
  return <XCircle size={13} className="text-red-500" />;
};

const Support = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = DEMO_TICKETS.filter(t => {
    const matchStatus = filter === "all" || t.status === filter;
    const matchSearch = !search || t.number.includes(search) || t.order.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Tickets"
        subtitle="Customer support requests and issue tracking"
        breadcrumbs={[{ label: "Support" }, { label: "All Tickets" }]}
        icon={<LifeBuoy size={20} />}
      />

      <Card>
        <CardHeader
          action={
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={setSearch} placeholder="Search tickets…" className="w-52" />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="h-9 px-3 text-sm border border-[#EAEAEA] rounded-xl text-[#2B2D42] focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 bg-white"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          }
        >
          <CardTitle>All Tickets <span className="text-[#6B7280] font-normal text-sm">({filtered.length})</span></CardTitle>
        </CardHeader>

        <CardBody className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <LifeBuoy size={32} className="mx-auto text-gray-200 mb-2" />
              <p className="text-sm text-[#6B7280]">No tickets found</p>
            </div>
          ) : filtered.map(t => (
            <Link key={t.id} to={`/admin/support/${t.id}`} className="block">
              <div className="border border-[#EAEAEA] rounded-xl p-4 hover:border-[#E63946]/30 hover:shadow-sm transition-all bg-white">
                <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#F5F0EA]">
                  <span className="text-xs text-[#6B7280]">{t.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#2B2D42] font-semibold">{t.number}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLES[t.status] || STATUS_STYLES.pending}`}>
                      <StatusIcon status={t.status} /> {t.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="grid grid-cols-3 gap-x-6 flex-1">
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-medium">Order</p>
                      <p className="text-sm font-medium text-[#2B2D42] mt-0.5">{t.order}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-medium">Issue Type</p>
                      <p className="text-sm font-medium text-[#2B2D42] mt-0.5">{t.issue}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-medium">Subject</p>
                      <p className="text-sm font-medium text-[#2B2D42] mt-0.5">{t.subject || "—"}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#6B7280] flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default Support;
