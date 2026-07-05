import React from "react";
import { Link } from "react-router-dom";
import { Pencil, FileText } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const TermAndCondition = () => (
  <div className="space-y-6">
    <PageHeader title="Terms & Conditions" subtitle="Manage your terms and conditions"
      breadcrumbs={[{ label: "Legal" }, { label: "Terms & Conditions" }]}
      action={<Link to="/admin/business/term-and-condition/edit"><Button icon={<Pencil size={14} />}>Edit</Button></Link>}
    />
    <Card>
      <CardHeader><CardTitle><div className="flex items-center gap-2"><FileText size={14} className="text-[#E63946]" /> Content</div></CardTitle></CardHeader>
      <CardBody>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <p className="text-xs text-gray-400">Last updated: 1 July 2026</p>
          <p>By accessing or using AuraMart's website and services, you agree to be bound by the following Terms and Conditions. Please read them carefully before placing any order.</p>

          <h3 className="text-base font-semibold text-gray-900">1. Eligibility</h3>
          <p>You must be at least 18 years of age to use our services. By using AuraMart, you represent and warrant that you meet this age requirement and that the information you provide is accurate and complete.</p>

          <h3 className="text-base font-semibold text-gray-900">2. Account Responsibility</h3>
          <p>You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility. Notify us immediately at <strong>support@auramart.in</strong> if you suspect unauthorised access.</p>

          <h3 className="text-base font-semibold text-gray-900">3. Product Information</h3>
          <p>We strive to display accurate product descriptions, images, and prices. However, AuraMart reserves the right to correct errors, inaccuracies, or omissions at any time without prior notice. Colours may appear slightly different on screen due to monitor calibration.</p>

          <h3 className="text-base font-semibold text-gray-900">4. Pricing & Payment</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</li>
            <li>AuraMart reserves the right to change prices without notice.</li>
            <li>Payment must be completed at the time of placing the order through our supported payment methods.</li>
            <li>In case of a pricing error, we will notify you and give you the option to cancel or confirm the order at the correct price.</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-900">5. Order Cancellation</h3>
          <p>You may cancel an order before it is shipped. Once dispatched, the order cannot be cancelled and must be processed as a return. AuraMart reserves the right to cancel any order at its discretion (e.g., due to stock unavailability or payment failure), with a full refund issued within 5–7 business days.</p>

          <h3 className="text-base font-semibold text-gray-900">6. Intellectual Property</h3>
          <p>All content on AuraMart — including logos, images, text, and design — is the intellectual property of AuraMart or its content suppliers. Unauthorised use, reproduction, or distribution is strictly prohibited.</p>

          <h3 className="text-base font-semibold text-gray-900">7. Limitation of Liability</h3>
          <p>AuraMart shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services, including loss of data, revenue, or profits, to the fullest extent permitted by Indian law.</p>

          <h3 className="text-base font-semibold text-gray-900">8. Governing Law</h3>
          <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.</p>

          <h3 className="text-base font-semibold text-gray-900">9. Changes to Terms</h3>
          <p>We reserve the right to update these Terms at any time. Continued use of our services after changes are posted constitutes your acceptance of the revised Terms.</p>

          <h3 className="text-base font-semibold text-gray-900">10. Contact</h3>
          <p>For questions regarding these Terms, email us at <strong>legal@auramart.in</strong>.</p>
        </div>
      </CardBody>
    </Card>
  </div>
);

export default TermAndCondition;
