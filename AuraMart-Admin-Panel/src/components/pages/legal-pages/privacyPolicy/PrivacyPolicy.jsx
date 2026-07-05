import React from "react";
import { Link } from "react-router-dom";
import { Pencil, ShieldCheck } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const PrivacyPolicy = () => (
  <div className="space-y-6">
    <PageHeader title="Privacy Policy" subtitle="Manage your privacy policy content"
      breadcrumbs={[{ label: "Legal" }, { label: "Privacy Policy" }]}
      action={<Link to="/admin/business/edit-privacy-policy"><Button icon={<Pencil size={14} />}>Edit</Button></Link>}
    />
    <Card>
      <CardHeader><CardTitle><div className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#E63946]" /> Content</div></CardTitle></CardHeader>
      <CardBody>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <p className="text-xs text-gray-400">Last updated: 1 July 2026</p>

          <p>AuraMart ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or place an order with us.</p>

          <h3 className="text-base font-semibold text-gray-900">1. Information We Collect</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Personal Identification:</strong> Name, email address, phone number, and delivery address provided at registration or checkout.</li>
            <li><strong>Payment Information:</strong> We do not store full payment card details. All transactions are processed through RBI-compliant payment gateways.</li>
            <li><strong>Device & Usage Data:</strong> IP address, browser type, pages visited, and session duration collected automatically via cookies.</li>
            <li><strong>Order History:</strong> Details of products purchased, returns, and support interactions.</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-900">2. How We Use Your Information</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and fulfil your orders and send shipping updates.</li>
            <li>To personalise product recommendations and offers.</li>
            <li>To respond to customer support queries.</li>
            <li>To send promotional emails and SMS (you may opt out at any time).</li>
            <li>To detect and prevent fraud and unauthorised access.</li>
            <li>To comply with applicable laws and regulations in India.</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-900">3. Sharing of Information</h3>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share data with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Logistics partners for order delivery.</li>
            <li>Payment processors for secure transactions.</li>
            <li>Analytics providers to improve our services (data is anonymised).</li>
            <li>Law enforcement authorities when required by law.</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-900">4. Cookies</h3>
          <p>We use cookies and similar tracking technologies to improve your browsing experience. You can disable cookies through your browser settings, but some features of our website may not function correctly.</p>

          <h3 className="text-base font-semibold text-gray-900">5. Data Retention</h3>
          <p>We retain your personal data for as long as your account is active or as required to provide services. You may request deletion of your account and associated data by writing to us at <strong>privacy@auramart.in</strong>.</p>

          <h3 className="text-base font-semibold text-gray-900">6. Security</h3>
          <p>We implement industry-standard security measures including SSL encryption, access controls, and regular audits to protect your information from unauthorised access, alteration, or disclosure.</p>

          <h3 className="text-base font-semibold text-gray-900">7. Children's Privacy</h3>
          <p>AuraMart does not knowingly collect personal information from children under the age of 18. If you believe a child has provided us personal data, please contact us immediately.</p>

          <h3 className="text-base font-semibold text-gray-900">8. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of our services after changes constitutes acceptance of the revised policy.</p>

          <h3 className="text-base font-semibold text-gray-900">9. Contact</h3>
          <p>For privacy-related queries, contact us at <strong>privacy@auramart.in</strong> or write to: AuraMart, 42 Commerce Park, Andheri East, Mumbai – 400069, Maharashtra, India.</p>
        </div>
      </CardBody>
    </Card>
  </div>
);

export default PrivacyPolicy;
