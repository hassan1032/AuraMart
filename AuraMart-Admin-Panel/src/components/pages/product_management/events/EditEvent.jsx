import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import countryList from "react-select-country-list";
import Select from "react-select";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { toast } from "react-toastify";
import { enGB } from "date-fns/locale";
import { format, parse, isValid } from "date-fns";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Loader } from "../../../ui/Loader";

registerLocale("en-GB", enGB);

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";
const fileCls = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1] border border-gray-300 rounded-lg cursor-pointer";

const EditEvent = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [manualDate, setManualDate] = useState("");
  const [eventData, setEventData] = useState({ title: "", description: "", thumbnail: null, date: null, location: null, _id: "" });
  const options = useMemo(() => countryList().getData(), []);
  const [previewImage, setPreviewImage] = useState({ thumbnail: "" });

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const [data, error] = await request({ method: "GET", url: ApiEndpoints.PROMOTION_MANAGEMENT.SINGLE_EVENT(_id) });
        if (error) throw new Error(error?.message || "Failed to fetch event");
        const event = data?.data;
        if (event) {
          const parsedDate = event.date ? new Date(event.date) : null;
          setEventData({ title: event.title || "", description: event.description || "", thumbnail: event.thumbnail || null, date: parsedDate, location: event.location || null, _id: event._id });
          if (parsedDate) setManualDate(format(parsedDate, "dd-MM-yyyy"));
          setPreviewImage({ thumbnail: event.thumbnail || "" });
          if (event.location) {
            const selectedOption = options.find(opt => opt.label === event.location || opt.value === event.location || (typeof event.location === "string" && opt.label.toLowerCase() === event.location.toLowerCase()));
            setLocation(selectedOption || { label: String(event.location), value: String(event.location) });
          }
        }
      } catch (error) {
        toast.error("Something went wrong: " + (error?.message || ""));
      } finally {
        setLoading(false);
      }
    };
    if (_id) fetchEvent();
  }, [_id, options]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    if (!date) return;
    setEventData(prev => ({ ...prev, date }));
    setManualDate(format(date, "dd-MM-yyyy"));
  };

  const handleManualDate = (e) => {
    if (!e || !e.target) return;
    let value = e.target.value ? e.target.value.replace(/[^\d]/g, "") : "";
    if (value.length > 2 && value.length <= 4) value = `${value.slice(0, 2)}-${value.slice(2)}`;
    else if (value.length > 4) value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4, 8)}`;
    setManualDate(value);
    if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      const parsed = parse(value, "dd-MM-yyyy", new Date());
      if (isValid(parsed)) setEventData(prev => ({ ...prev, date: parsed }));
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setEventData(prev => ({ ...prev, thumbnail: file }));
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(prev => ({ ...prev, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!eventData.title || !eventData.description || !eventData.date || !location) {
      toast.error("Please fill all required fields!");
      return;
    }
    const form = new FormData();
    form.append("title", eventData.title);
    form.append("description", eventData.description);
    if (eventData.thumbnail && !(typeof eventData.thumbnail === "string")) form.append("thumbnail", eventData.thumbnail);
    try {
      const formattedDate = format(eventData.date, "yyyy-MM-dd");
      form.append("date", formattedDate);
    } catch {
      toast.error("Invalid date format");
      return;
    }
    form.append("location", (location && location.label) || eventData.location || "");
    try {
      setLoading(true);
      const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PROMOTION_MANAGEMENT.UPDATE_EVENT(_id), data: form });
      if (error) { toast.error(error?.message || "Failed to update event"); return; }
      toast.success("Event updated successfully!");
      navigate("/admin/events");
    } catch (err) {
      toast.error("Something went wrong: " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const imageSrc = previewImage.thumbnail || (typeof eventData.thumbnail === "string" ? eventData.thumbnail : "") || "https://placehold.co/600x150/f1f5f9/94a3b8?text=Event+Banner";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Event"
        subtitle="Update event details"
        breadcrumbs={[{ label: "Promotions" }, { label: "Events", href: "/admin/events" }, { label: "Edit" }]}
        action={<Link to="/admin/events"><Button variant="secondary">Back</Button></Link>}
      />

      <form onSubmit={handleUpdate}>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
                Event Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                  <input type="text" name="title" value={eventData.title} onChange={handleInputChange} className={inputCls} placeholder="Enter Title" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Event Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    selected={eventData.date}
                    onChange={handleDateChange}
                    onChangeRaw={handleManualDate}
                    value={manualDate}
                    placeholderText="Select or type date - dd-MM-yyyy"
                    className={inputCls}
                    dateFormat="dd-MM-yyyy"
                    locale="en-GB"
                    showPopperArrow={false}
                    shouldCloseOnSelect
                    wrapperClassName="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                  <Select options={options} value={location} onChange={(opt) => setLocation(opt)} placeholder="Select Country" className="react-select-container" classNamePrefix="react-select" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                  <textarea name="description" value={eventData.description} onChange={handleInputChange} placeholder="Enter Description" required rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Preview</label>
                  <div className="flex justify-center mb-3">
                    <img src={imageSrc} alt="Event Preview" className="w-full max-w-lg h-28 object-cover rounded-lg border border-gray-200" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Thumbnail (Ratio 4:1)</label>
                  <input type="file" name="thumbnail" className={fileCls} onChange={(e) => handleFileChange(e, "thumbnail")} accept="image/*" />
                </div>

                <div className="flex justify-between pt-2">
                  <Link to="/admin/events"><Button variant="secondary" type="button">Back</Button></Link>
                  <Button type="submit" disabled={loading}>{loading ? <Loader size="sm" /> : "Update"}</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
