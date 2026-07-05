import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const EditReturnRefund = () => {
  const [title, setTitle] = useState("Return and Refund Policy");
  const [content, setContent] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Return & Refund Policy" subtitle="Update your return and refund content"
        breadcrumbs={[{ label: "Legal" }, { label: "Return & Refund", href: "/admin/business/return-refund" }, { label: "Edit" }]}
        action={<Link to="/admin/business/return-refund"><Button variant="secondary" icon={<ArrowLeft size={14} />}>Back</Button></Link>}
      />
      <form onSubmit={e => e.preventDefault()}>
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" maxLength={255} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={16} placeholder="Enter return and refund policy content..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-y" />
              </div>
            </div>
          </CardBody>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <Button type="submit" icon={<Save size={14} />}>Save & Update</Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default EditReturnRefund;
