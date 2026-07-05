import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Truck } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const ShippingAndDelivery = () => (
  <div className="space-y-6">
    <PageHeader title="Shipping & Delivery" subtitle="Manage your shipping and delivery policy"
      breadcrumbs={[{ label: "Legal" }, { label: "Shipping & Delivery" }]}
      action={<Link to="/admin/business/edit-shipping-delivery"><Button icon={<Pencil size={14} />}>Edit</Button></Link>}
    />
    <Card>
      <CardHeader><CardTitle><div className="flex items-center gap-2"><Truck size={14} className="text-[#E63946]" /> Content</div></CardTitle></CardHeader>
      <CardBody>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <p className="text-xs text-gray-400">Last updated: 1 July 2026</p>
          <p>AuraMart delivers across India via our trusted logistics partners. Below are the details of our shipping and delivery process.</p>

          <h3 className="text-base font-semibold text-gray-900">1. Delivery Coverage</h3>
          <p>We currently ship to <strong>25,000+ pin codes</strong> across all states and union territories of India. Enter your pin code at checkout to confirm serviceability for your location.</p>

          <h3 className="text-base font-semibold text-gray-900">2. Shipping Options & Timelines</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-gray-700">Shipping Type</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-700">Estimated Delivery</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-700">Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="px-3 py-2">Standard Delivery</td><td className="px-3 py-2">5–7 business days</td><td className="px-3 py-2">₹49 (Free above ₹999)</td></tr>
                <tr><td className="px-3 py-2">Express Delivery</td><td className="px-3 py-2">2–3 business days</td><td className="px-3 py-2">₹99 (select pin codes)</td></tr>
                <tr><td className="px-3 py-2">Same-Day Delivery</td><td className="px-3 py-2">Within 24 hours</td><td className="px-3 py-2">₹149 (Mumbai & Delhi only)</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold text-gray-900">3. Free Shipping</h3>
          <p>Enjoy free standard shipping on all orders above <strong>₹999</strong>. Free shipping is automatically applied at checkout when the cart value meets the threshold.</p>

          <h3 className="text-base font-semibold text-gray-900">4. Order Processing</h3>
          <p>Orders are processed and dispatched within <strong>1–2 business days</strong> of payment confirmation (excluding Sundays and public holidays). You will receive an email and SMS notification with your tracking details once the order is shipped.</p>

          <h3 className="text-base font-semibold text-gray-900">5. Order Tracking</h3>
          <p>Track your order in real-time via the <strong>My Orders</strong> section in your account, or use the tracking link sent to your registered email and mobile number.</p>

          <h3 className="text-base font-semibold text-gray-900">6. Delivery Attempts</h3>
          <p>Our logistics partner will make up to <strong>3 delivery attempts</strong>. If the delivery fails due to an incorrect address or unavailability, the order will be returned to our warehouse. A re-delivery charge may apply.</p>

          <h3 className="text-base font-semibold text-gray-900">7. Cash on Delivery (COD)</h3>
          <p>COD is available on orders up to <strong>₹5,000</strong> at select pin codes. A COD handling fee of ₹29 may be charged. COD orders require a valid phone number for OTP confirmation at the time of delivery.</p>

          <h3 className="text-base font-semibold text-gray-900">8. Delayed Deliveries</h3>
          <p>Delivery timelines may be affected by natural calamities, strikes, public holidays, or high-volume periods (sale seasons). AuraMart is not liable for delays caused by third-party logistics partners or force majeure events.</p>

          <h3 className="text-base font-semibold text-gray-900">9. Contact for Shipping Issues</h3>
          <p>For delivery queries: <strong>support@auramart.in</strong> | <strong>+91 98765 43210</strong> (Mon–Sat, 10 AM – 7 PM IST).</p>
        </div>
      </CardBody>
    </Card>
  </div>
);

export default ShippingAndDelivery;
