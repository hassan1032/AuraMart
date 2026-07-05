import React from "react";
import { Link } from "react-router-dom";
import { Pencil, RotateCcw } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const ReturnRefundPolicy = () => (
  <div className="space-y-6">
    <PageHeader title="Return & Refund Policy" subtitle="Manage your return and refund policy"
      breadcrumbs={[{ label: "Legal" }, { label: "Return & Refund" }]}
      action={<Link to="/admin/business/edit-return-refund"><Button icon={<Pencil size={14} />}>Edit</Button></Link>}
    />
    <Card>
      <CardHeader><CardTitle><div className="flex items-center gap-2"><RotateCcw size={14} className="text-[#E63946]" /> Content</div></CardTitle></CardHeader>
      <CardBody>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <p className="text-xs text-gray-400">Last updated: 1 July 2026</p>
          <p>At AuraMart, your satisfaction is our priority. If you are not completely happy with your purchase, we're here to help.</p>

          <h3 className="text-base font-semibold text-gray-900">1. Return Window</h3>
          <p>You may request a return within <strong>7 days</strong> of delivery for most items. Some categories (such as customised products, innerwear, and perishables) are non-returnable due to hygiene and personalisation reasons.</p>

          <h3 className="text-base font-semibold text-gray-900">2. Eligibility Conditions</h3>
          <p>To be eligible for a return:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The item must be unused, unwashed, and in its original condition.</li>
            <li>All original tags, labels, and packaging must be intact.</li>
            <li>Proof of purchase (order ID or invoice) must be provided.</li>
            <li>Items returned due to size or colour mismatch must not show signs of wear.</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-900">3. Non-Returnable Items</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Customised or personalised products</li>
            <li>Innerwear, lingerie, and swimwear</li>
            <li>Jewellery sets (for hygiene reasons)</li>
            <li>Items marked "Final Sale" or "Non-Returnable" on the product page</li>
            <li>Items damaged due to misuse or improper care</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-900">4. How to Initiate a Return</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Log in to your AuraMart account and go to <strong>My Orders</strong>.</li>
            <li>Select the item you wish to return and click <strong>Request Return</strong>.</li>
            <li>Choose a reason for return and upload photos if the item is damaged or defective.</li>
            <li>Our team will review the request within 24–48 hours and schedule a reverse pickup.</li>
          </ol>

          <h3 className="text-base font-semibold text-gray-900">5. Refund Policy</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Once the returned item is received and inspected, we will notify you of the approval or rejection of your refund.</li>
            <li>Approved refunds are processed within <strong>5–7 business days</strong> to the original payment method.</li>
            <li>For Cash on Delivery (COD) orders, refunds are issued as AuraMart store credit or via NEFT to your bank account within 7–10 business days.</li>
            <li>Original shipping charges are non-refundable unless the return is due to a defect or wrong item shipped.</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-900">6. Damaged or Defective Items</h3>
          <p>If you receive a damaged or defective item, please contact us within <strong>48 hours</strong> of delivery at <strong>support@auramart.in</strong> with your order ID and photos. We will arrange an immediate replacement or full refund at no extra cost.</p>

          <h3 className="text-base font-semibold text-gray-900">7. Exchange Policy</h3>
          <p>Exchanges are subject to stock availability. If the desired size or colour is unavailable, a refund will be issued instead. To request an exchange, follow the same process as a return and specify the preferred replacement.</p>

          <h3 className="text-base font-semibold text-gray-900">8. Contact Us</h3>
          <p>For return and refund queries: <strong>support@auramart.in</strong> | <strong>+91 98765 43210</strong> (Mon–Sat, 10 AM – 7 PM IST).</p>
        </div>
      </CardBody>
    </Card>
  </div>
);

export default ReturnRefundPolicy;
