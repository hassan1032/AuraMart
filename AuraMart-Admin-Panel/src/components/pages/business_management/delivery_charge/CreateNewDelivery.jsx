import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Truck, Save } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";

const CITIES = [{ id: "1", name: "Kerala" }, { id: "2", name: "Tamil Nadu" }, { id: "3", name: "Karnataka" }, { id: "4", name: "Maharashtra" }, { id: "5", name: "Delhi" }];

const CreateNewDelivery = () => {
  const navigate = useNavigate();
  const [cityId, setCityId] = useState("");
  const [charge, setCharge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cityId || !charge) { toast.error("Please fill all fields"); return; }
    toast.success("Delivery charge created");
    navigate("/admin/Business/delivery-charges/cities");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Delivery Charge" subtitle="Set delivery pricing for a city" breadcrumbs={[{ label: "Business" }, { label: "Delivery" }, { label: "Create" }]} />

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Card>
          <CardHeader><CardTitle><div className="flex items-center gap-2"><Truck size={14} className="text-[#E63946]" /> Delivery Details</div></CardTitle></CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                <select value={cityId} onChange={e => setCityId(e.target.value)} className={inputCls} required>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Charge (â‚¹) <span className="text-red-500">*</span></label>
                <input type="text" value={charge} onChange={e => setCharge(e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1"))} placeholder="e.g. 50" className={inputCls} required />
              </div>
            </div>
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Back</Button>
              <Button type="submit" icon={<Save size={14} />}>Create Charge</Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default CreateNewDelivery;
