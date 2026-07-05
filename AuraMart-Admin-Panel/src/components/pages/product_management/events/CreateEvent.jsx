import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import countryList from "react-select-country-list";
import Select from "react-select";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { toast } from "react-toastify";
import { registerLocale } from "react-datepicker";
import enGB from "date-fns/locale/en-GB";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Loader } from "../../../ui/Loader";

registerLocale("en-GB", enGB);

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";
const fileCls = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1] border border-gray-300 rounded-lg cursor-pointer";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualDate, setManualDate] = useState("");
  const [eventData, setEventData] = useState({ title: "", description: "", thumbnail: "", date: null, location: null });
  const options = useMemo(() => countryList().getData(), []);
  const [previewImage, setPreviewImage] = useState({ thumbnail: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setEventData(prev => ({ ...prev, date }));
  };

  const handleKeyDown = (e) => {
    const allowedKeys = ["Delete", "Backspace", "ArrowLeft", "ArrowRight", "Tab", "Minus", "Subtract"];
    if (/^[0-9]$/.test(e.key)) {
      if (e.target.value.replace(/-/g, "").length >= 8) e.preventDefault();
      return;
    }
    if (!allowedKeys.includes(e.key)) e.preventDefault();
  };

  const handleManualDate = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 2 && value.length <= 4) value = value.slice(0, 2) + "-" + value.slice(2);
    else if (value.length > 4) value = value.slice(0, 2) + "-" + value.slice(2, 4) + "-" + value.slice(4, 8);
    setManualDate(value);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setEventData(prev => ({ ...prev, thumbnail: file }));
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(prev => ({ ...prev, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventData.title || !eventData.description || !eventData.date || !location) {
      toast.error("Please fill all required fields!");
      return;
    }
    const form = new FormData();
    form.append("title", eventData.title);
    form.append("description", eventData.description);
    form.append("thumbnail", eventData.thumbnail);
    form.append("date", eventData.date);
    form.append("location", location.label);
    try {
      setLoading(true);
      const [data, error] = await request({ method: "POST", url: ApiEndpoints.PROMOTION_MANAGEMENT.ADD_EVENT, data: form });
      if (error || !data?.success) throw new Error("Failed to create event");
      toast.success(data.message || "Event added successfully!");
      setEventData({ title: "", description: "", thumbnail: null, date: null, location: null });
      setLocation(null);
      navigate("/admin/events");
    } catch (err) {
      toast.error("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Event"
        subtitle="Add a new promotional event"
        breadcrumbs={[{ label: "Promotions" }, { label: "Events", href: "/admin/events" }, { label: "Create" }]}
        action={<Link to="/admin/events"><Button variant="secondary">Back</Button></Link>}
      />

      <form onSubmit={handleSubmit}>
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
                    onKeyDown={handleKeyDown}
                    onChange={handleDateChange}
                    onChangeRaw={handleManualDate}
                    value={manualDate}
                    placeholderText="Select end date - dd-MM-yyyy"
                    className={inputCls}
                    popperPlacement="bottom-start"
                    shouldCloseOnSelect
                    showPopperArrow={false}
                    dateFormat="dd-MM-yyyy"
                    locale="en-GB"
                    wrapperClassName="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                  <Select
                    options={options}
                    value={location}
                    onChange={setLocation}
                    placeholder="Select Country"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                  <textarea name="description" value={eventData.description} onChange={handleInputChange} placeholder="Enter Description" required rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Preview (4:1)</label>
                  <div className="flex justify-center mb-3">
                    <img
                      src={previewImage.thumbnail || "https://placehold.co/600x150/f1f5f9/94a3b8?text=Event+Banner"}
                      alt="Event Preview"
                      className="w-full max-w-lg h-28 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Thumbnail (Ratio 4:1) <span className="text-red-500">*</span></label>
                  <input type="file" name="thumbnail" className={fileCls} onChange={(e) => handleFileChange(e, "thumbnail")} accept="image/*" />
                </div>

                <div className="flex justify-between pt-2">
                  <Link to="/admin/events"><Button variant="secondary" type="button">Back</Button></Link>
                  <Button type="submit" disabled={loading}>{loading ? <Loader size="sm" /> : "Submit"}</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
