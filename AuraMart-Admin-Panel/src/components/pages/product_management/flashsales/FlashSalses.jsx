import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Eye, Pencil, Trash2, Zap } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../../ui/Table";
import { Pagination } from "../../../ui/Pagination";
import { ConfirmModal } from "../../../ui/Modal";
import { formatDate, truncate } from "../../../../lib/utils";

const LIMIT = 10;

const FlashSales = () => {
  const { hasPermission } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.PROMOTION_MANAGEMENT.ALL_EVENTS });
      if (!error && Array.isArray(data?.data)) setEvents(data.data);
      else if (error) toast.error("Failed to load flash sales");
      setLoading(false);
    })();
  }, []);

  const totalPages = Math.ceil(events.length / LIMIT);
  const paginated = events.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PROMOTION_MANAGEMENT.EVENT_STATUS, data: { id, status: newStatus } });
    if (error) toast.error("Failed to update status");
    else setEvents(prev => prev.map(e => e._id === id ? { ...e, status: data?.data?.status || newStatus } : e));
  };

  const handleDelete = async () => {
    const [, error] = await request({ method: "DELETE", url: ApiEndpoints.PROMOTION_MANAGEMENT.DELETE_EVENT(confirmId) });
    if (error) toast.error("Failed to delete");
    else { setEvents(prev => prev.filter(e => e._id !== confirmId)); toast.success("Flash sale deleted"); }
    setConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flash Sales"
        subtitle="Manage time-limited promotional events"
        breadcrumbs={[{ label: "Promotions" }, { label: "Flash Sales" }]}
        action={
          <Link to="/admin/products/flashsales/create">
            <Button icon={<Plus size={15} />}>Create Flash Sale</Button>
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All Flash Sales <span className="text-gray-400 font-normal text-sm">({events.length})</span></CardTitle>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Start</Th>
              <Th>End</Th>
              <Th>Status</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={4} cols={7} /> :
              paginated.length === 0 ? (
                <TableEmpty message="No flash sales yet" icon={<Zap size={24} />}
                  action={<Link to="/admin/products/flashsales/create"><Button size="sm" icon={<Plus size={13} />}>Create Flash Sale</Button></Link>} />
              ) : paginated.map((event, i) => (
                <tr key={event._id}>
                  <Td className="text-gray-400 text-xs">{(currentPage - 1) * LIMIT + i + 1}</Td>
                  <Td>
                    {event.thumbnail ? (
                      <img src={event.thumbnail} alt={event.name} className="h-12 w-20 object-cover rounded-lg border border-gray-100" />
                    ) : (
                      <div className="h-12 w-20 bg-orange-50 rounded-lg flex items-center justify-center">
                        <Zap size={16} className="text-orange-400" />
                      </div>
                    )}
                  </Td>
                  <Td className="font-medium text-gray-900">{truncate(event.name || event.title, 35)}</Td>
                  <Td className="text-gray-500 text-xs">{formatDate(event.startDate || event.start)}</Td>
                  <Td className="text-gray-500 text-xs">{formatDate(event.endDate || event.end)}</Td>
                  <Td>
                    <button
                      onClick={() => handleStatusToggle(event._id, event.status)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${event.status === "active" ? "bg-[#E63946]" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${event.status === "active" ? "translate-x-4.5" : "translate-x-0.5"}`} />
                    </button>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-center gap-1">
                      <Link to={`/admin/products/flash-sales/view/${event._id}`}>
                        <Button size="icon-sm" variant="ghost" icon={<Eye size={13} />} />
                      </Link>
                      <Link to={`/admin/products/flashsales/edit/${event._id}`}>
                        <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />} />
                      </Link>
                      <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} onClick={() => setConfirmId(event._id)} />
                    </div>
                  </Td>
                </tr>
              ))
            }
          </tbody>
        </Table>
        {!loading && totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </Card>

      <ConfirmModal open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Delete Flash Sale" message="This will permanently delete this flash sale event." />
    </div>
  );
};

export default FlashSales;
