import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Info } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

const LegalAboutUs = () => (
  <div className="space-y-6">
    <PageHeader title="About Us" subtitle="Manage your about us page content"
      breadcrumbs={[{ label: "Legal" }, { label: "About Us" }]}
      action={<Link to="/admin/business/about-us/edit"><Button icon={<Pencil size={14} />}>Edit</Button></Link>}
    />
    <Card>
      <CardHeader><CardTitle><div className="flex items-center gap-2"><Info size={14} className="text-[#E63946]" /> Content</div></CardTitle></CardHeader>
      <CardBody>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <h3 className="text-base font-semibold text-gray-900">Welcome to AuraMart</h3>
          <p>AuraMart is India's fastest-growing online fashion and lifestyle destination, offering a curated selection of premium clothing, accessories, jewellery, and home décor. Founded with a passion for quality and style, we bring the finest products from trusted artisans and brands directly to your doorstep.</p>

          <h3 className="text-base font-semibold text-gray-900">Our Mission</h3>
          <p>Our mission is simple — to make premium fashion accessible to every Indian. We believe that style should not be a luxury reserved for the few. Through our platform, we empower customers across every city and town in India to discover, explore, and shop the latest trends with complete confidence.</p>

          <h3 className="text-base font-semibold text-gray-900">What We Offer</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Exclusive collections of ethnic wear, western wear, and fusion fashion</li>
            <li>Handpicked accessories including jewellery, bags, and footwear</li>
            <li>Customisable products tailored to your preferences</li>
            <li>Flash sales and seasonal promotions with unbeatable discounts</li>
            <li>Easy returns and 7-day refund guarantee on all eligible orders</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-900">Why Choose AuraMart?</h3>
          <p>We partner only with verified sellers and artisans who meet our strict quality standards. Every product listed on AuraMart undergoes quality checks before it reaches you. Our dedicated customer support team is available 7 days a week to resolve any concerns promptly.</p>

          <h3 className="text-base font-semibold text-gray-900">Our Reach</h3>
          <p>AuraMart delivers across 25,000+ pin codes in India. Whether you're in Mumbai, Delhi, Bengaluru, or a smaller town, we ensure timely and safe delivery of your orders through our network of trusted logistics partners.</p>

          <h3 className="text-base font-semibold text-gray-900">Contact Us</h3>
          <p>Have questions? We'd love to hear from you. Reach us at <strong>support@auramart.in</strong> or call us at <strong>+91 98765 43210</strong> (Mon–Sat, 10 AM – 7 PM IST).</p>
        </div>
      </CardBody>
    </Card>
  </div>
);

export default LegalAboutUs;
