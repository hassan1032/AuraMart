import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { showSuccess } from "../../../../utils/toastManager";
import { useFormatDate } from "../../../../hooks/useDateTimeFromat";
import { useAuth } from "../../../../context/AuthContext";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../../ui/Table";
import { Button } from "../../../ui/Button";
import { StatusBadge } from "../../../ui/Badge";
import { ConfirmModal } from "../../../ui/Modal";
import { Pagination } from "../../../ui/Pagination";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

const Event = () => {
  const { hasPermission } = useAuth();
  const [events, setEvents] = useState([]);
  const formattedDate = useFormatDate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const limit = 10;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(events.length / limit)) setCurrentPage(newPage);
  };

  useEffect(() => { getEvents(); }, []);

  useEffect(() => {
    const start = (currentPage - 1) * limit;
    setPaginatedData(events.slice(start, start + limit));
  }, [events, currentPage]);

  const getEvents = async () => {
    setLoading(true);
    try {
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.PROMOTION_MANAGEMENT.ALL_EVENTS });
      if (error) throw new Error("Failed to fetch events: " || error.message);
      const allEvents = data.data?.map(event => ({ ...event, formattedDate: formattedDate(event?.date) }));
      setEvents(allEvents);
      setCurrentPage(1);
      showSuccess("Events fetched successfully!" || data.message, true);
    } catch (error) {
      console.error("Error fetching events:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleEventStatus = async (eventId, currentStatus) => {
    if (!eventId) { toast.error("Invalid Event ID"); return; }
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      setLoading(true);
      const [data, error] = await request({
        method: "PUT",
        url: ApiEndpoints.PROMOTION_MANAGEMENT.EVENT_STATUS,
        data: { id: eventId, status: newStatus }
      });
      if (error) throw new Error("Failed to toggle event status: " + error.message);
      if (data?.data) setEvents(prev => prev.map(e => e._id === eventId ? { ...e, status: newStatus } : e));
      showSuccess("Event status updated successfully!");
    } catch (error) {
      toast.error("Something went wrong while toggling event status" || error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const [data, error] = await request({ method: "DELETE", url: ApiEndpoints.PROMOTION_MANAGEMENT.DELETE_EVENT(selectedEventId) });
      if (error) { toast.error("Failed to delete event" || error.message); return; }
      showSuccess("Event deleted successfully!");
      getEvents();
    } catch (error) {
      toast.error("Something went wrong while deleting event" || error.message);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setSelectedEventId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        subtitle="Manage promotional events"
        breadcrumbs={[{ label: "Promotions" }, { label: "Events" }]}
        action={hasPermission("Events", "create") && (
          <Link to="/admin/events/create">
            <Button icon={<Plus size={14} />}>Create New</Button>
          </Link>
        )}
      />

      <Card>
        <CardBody className="p-0">
          {hasPermission("Events", "list") && (
            <Table>
              <thead>
                <tr>
                  <Th>SL</Th>
                  <Th>Thumbnail</Th>
                  <Th>Title</Th>
                  <Th>Date</Th>
                  <Th>Description</Th>
                  <Th className="text-center">Status</Th>
                  <Th className="text-center">Action</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton rows={5} cols={7} />
                ) : !paginatedData || paginatedData.length === 0 ? (
                  <TableEmpty colSpan={7} message="No events found" />
                ) : (
                  paginatedData.map((event, index) => (
                    <tr key={event._id}>
                      <Td>{(currentPage - 1) * limit + index + 1}</Td>
                      <Td>
                        <img src={event.thumbnail} height={50} width={90} alt={event.title} className="rounded object-cover" />
                      </Td>
                      <Td className="font-medium text-gray-900">{event.title}</Td>
                      <Td>{formattedDate(event.date)}</Td>
                      <Td className="max-w-xs">
                        <span className="text-gray-600 text-sm">
                          {event.description?.length > 50 ? event.description.slice(0, 50) + "..." : event.description}
                        </span>
                      </Td>
                      <Td className="text-center">
                        <button
                          onClick={() => toggleEventStatus(event?._id, event?.status)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${event.status === "active" ? "bg-[#E63946]" : "bg-gray-300"}`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${event.status === "active" ? "translate-x-4.5" : "translate-x-0.5"}`} />
                        </button>
                      </Td>
                      <Td className="text-center">
                        <div className="flex gap-1 justify-center">
                          {hasPermission("Events", "view") && (
                            <Link to={`/admin/events/view/${event._id}`}>
                              <button className="w-8 h-8 rounded-full border border-[#E63946]/30 text-[#E63946] hover:bg-[#FFF1F1] flex items-center justify-center">
                                <Eye size={13} />
                              </button>
                            </Link>
                          )}
                          {hasPermission("Events", "edit") && (
                            <Link to={`/admin/events/edit/${event._id}`}>
                              <button className="w-8 h-8 rounded-full border border-[#E63946]/30 text-[#E63946] hover:bg-[#FFF1F1] flex items-center justify-center">
                                <Pencil size={13} />
                              </button>
                            </Link>
                          )}
                          {hasPermission("Events", "delete") && (
                            <button
                              onClick={() => { setSelectedEventId(event._id); setShowConfirmModal(true); }}
                              className="w-8 h-8 rounded-full border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Pagination currentPage={currentPage} totalItems={events.length} limit={limit} onPageChange={handlePageChange} />

      {showConfirmModal && (
        <ConfirmModal onConfirm={confirmDelete} onCancel={() => { setShowConfirmModal(false); setSelectedEventId(null); }} />
      )}
    </div>
  );
};

export default Event;
