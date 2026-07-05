import { useEffect, useState } from "react";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormatDate } from "../../../../hooks/useDateTimeFromat";
import { useAuth } from "../../../../context/AuthContext";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Loader } from "../../../ui/Loader";
import { MapPin, Calendar } from "lucide-react";

const ViewEvent = () => {
  const { hasPermission } = useAuth();
  const { _id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const formattedDate = useFormatDate();

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const [data, error] = await request({ method: "GET", url: ApiEndpoints.PROMOTION_MANAGEMENT.SINGLE_EVENT(_id) });
        if (error) throw new Error("Failed to fetch event data: " + error.message);
        let event = data?.data;
        if (event && typeof event === "object" && !Array.isArray(event)) {
          const values = Object.values(event);
          if (values.length === 1) event = values[0];
        }
        if (Array.isArray(event)) event = event[0];
        setEventData(event ? { ...event, formattedDate: formattedDate(event?.date) } : null);
      } catch (error) {
        toast.error("Something went wrong while fetching event data: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [_id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader size="lg" />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Details"
        subtitle="View event information"
        breadcrumbs={[{ label: "Promotions" }, { label: "Events", href: "/admin/events" }, { label: "Details" }]}
      />

      {hasPermission("Events", "view") && (
        <Card>
          <CardBody>
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{eventData?.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> {eventData?.formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {eventData?.location}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <img
                  src={eventData?.thumbnail}
                  alt="Event"
                  className="w-full max-h-80 object-cover rounded-xl shadow-sm"
                />
              </div>

              <div className="flex flex-col justify-center">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Description</h4>
                <div className="max-h-72 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed text-sm" style={{ textAlign: "justify" }}>
                    {eventData?.description}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ViewEvent;
