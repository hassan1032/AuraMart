import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MapPin, Save } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";

const AddNewCity = () => {
  const navigate = useNavigate();
  const [countryId, setCountryId] = useState("41");
  const [cityName, setCityName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cityName.trim()) { toast.error("Enter a city name"); return; }
    toast.success("City added successfully");
    navigate("/admin/business/delivery-charges/cities/cities");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add New City" subtitle="Add a city for delivery coverage" breadcrumbs={[{ label: "Business" }, { label: "Cities" }, { label: "Add" }]} />

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Card>
          <CardHeader><CardTitle><div className="flex items-center gap-2"><MapPin size={14} className="text-[#E63946]" /> City Details</div></CardTitle></CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
                <select value={countryId} onChange={e => setCountryId(e.target.value)} className={inputCls} required>
                  <option value="41">India</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City Name <span className="text-red-500">*</span></label>
                <input type="text" value={cityName} onChange={e => setCityName(e.target.value)} placeholder="Enter city name" className={inputCls} maxLength={255} required />
              </div>
            </div>
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Back</Button>
              <Button type="submit" icon={<Save size={14} />}>Add City</Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default AddNewCity;
