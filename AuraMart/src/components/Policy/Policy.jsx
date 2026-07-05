import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Truck, RefreshCw } from 'lucide-react';

const TABS = [
  { id: 'privacy',  label: 'Privacy Policy',       icon: Shield },
  { id: 'terms',    label: 'Terms & Conditions',    icon: FileText },
  { id: 'shipping', label: 'Shipping Policy',       icon: Truck },
  { id: 'refund',   label: 'Return & Refund Policy',icon: RefreshCw },
];

const Section = ({ title, children }) => (
  <div className="mb-7">
    <h3 className="text-base font-bold text-[#2B2D42] mb-2 border-l-4 border-[#E63946] pl-3">{title}</h3>
    <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
  </div>
);

const Li = ({ children }) => (
  <li className="flex gap-2 items-start">
    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E63946] flex-shrink-0" />
    <span>{children}</span>
  </li>
);

const CONTENT = {
  privacy: (
    <>
      <p className="text-sm text-gray-500 mb-6">Effective Date: 1 July 2026 &nbsp;|&nbsp; Last Updated: 3 July 2026</p>
      <Section title="1. Introduction">
        <p>AuraMart ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your personal information when you use our website auramart.in or mobile application. By accessing or using AuraMart, you agree to this Privacy Policy.</p>
      </Section>
      <Section title="2. Information We Collect">
        <ul className="space-y-1.5 list-none mt-1">
          <Li><strong>Personal Identification:</strong> Name, email address, phone number, date of birth, and profile photo when you register.</Li>
          <Li><strong>Transactional Data:</strong> Order history, payment details (card last 4 digits, UPI ID), shipping addresses, and invoices.</Li>
          <Li><strong>Device & Usage Data:</strong> IP address, browser type, pages visited, time spent, clicks, and cart activity.</Li>
          <Li><strong>Communication Data:</strong> Messages sent through customer support, reviews, and ratings.</Li>
        </ul>
      </Section>
      <Section title="3. How We Use Your Information">
        <ul className="space-y-1.5 list-none mt-1">
          <Li>To process and fulfil your orders and send shipping/delivery notifications.</Li>
          <Li>To manage your AuraMart account and personalize your shopping experience.</Li>
          <Li>To send promotional offers, new arrivals, and exclusive deals (you can opt out anytime).</Li>
          <Li>To analyse site performance, detect fraud, and improve our services.</Li>
          <Li>To comply with applicable Indian laws including the Information Technology Act, 2000 and IT (Amendment) Act, 2008.</Li>
        </ul>
      </Section>
      <Section title="4. Sharing of Information">
        <p>We do not sell your personal information. We may share your data with:</p>
        <ul className="space-y-1.5 list-none mt-2">
          <Li><strong>Logistics Partners:</strong> (BlueDart, Delhivery, Ekart) for order delivery.</Li>
          <Li><strong>Payment Processors:</strong> (Razorpay, PayU, UPI networks) for secure transactions.</Li>
          <Li><strong>Analytics Providers:</strong> Google Analytics and similar tools to improve user experience.</Li>
          <Li><strong>Legal Authorities:</strong> When required by Indian law or court orders.</Li>
        </ul>
      </Section>
      <Section title="5. Data Security">
        <p>We implement SSL/TLS encryption for all data transmission, PCI-DSS compliant payment handling, and regular security audits. No method of transmission over the internet is 100% secure, but we take reasonable industry-standard measures to protect your information.</p>
      </Section>
      <Section title="6. Your Rights">
        <ul className="space-y-1.5 list-none mt-1">
          <Li>Access and download a copy of your personal data from your account settings.</Li>
          <Li>Request correction of inaccurate personal information.</Li>
          <Li>Request deletion of your account and associated data.</Li>
          <Li>Opt out of marketing communications at any time via the unsubscribe link.</Li>
        </ul>
      </Section>
      <Section title="7. Cookies">
        <p>We use essential cookies (for authentication and cart), performance cookies (for analytics), and optional marketing cookies. You may disable non-essential cookies via your browser settings, though this may affect some features.</p>
      </Section>
      <Section title="8. Children's Privacy">
        <p>AuraMart is not intended for users under 18 years of age. We do not knowingly collect personal information from minors without parental consent.</p>
      </Section>
      <Section title="9. Contact Us">
        <p>For privacy-related queries, contact our Data Protection Officer at <strong>privacy@auramart.in</strong> or write to: AuraMart Pvt. Ltd., 12th Floor, Prestige Tech Park, Marathahalli, Bangalore – 560087.</p>
      </Section>
    </>
  ),

  terms: (
    <>
      <p className="text-sm text-gray-500 mb-6">Effective Date: 1 July 2026 &nbsp;|&nbsp; Governing Law: India</p>
      <Section title="1. Acceptance of Terms">
        <p>By creating an account, browsing, or making a purchase on AuraMart, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of our platform.</p>
      </Section>
      <Section title="2. Eligibility">
        <ul className="space-y-1.5 list-none mt-1">
          <Li>You must be at least 18 years old to use AuraMart.</Li>
          <Li>You must provide accurate, current, and complete information during registration.</Li>
          <Li>One person may not maintain more than one account.</Li>
        </ul>
      </Section>
      <Section title="3. Products & Pricing">
        <ul className="space-y-1.5 list-none mt-1">
          <Li>All prices are listed in Indian Rupees (₹) and are inclusive of GST unless stated otherwise.</Li>
          <Li>Prices may change without prior notice. The price at the time of placing the order is the final price.</Li>
          <Li>Product images are for illustrative purposes. Actual product colours may vary slightly due to display settings.</Li>
          <Li>AuraMart reserves the right to limit quantities, refuse orders, and cancel orders at its discretion.</Li>
        </ul>
      </Section>
      <Section title="4. Orders & Payments">
        <ul className="space-y-1.5 list-none mt-1">
          <Li>Orders placed on AuraMart constitute a legal contract once confirmed via email.</Li>
          <Li>We accept UPI, credit/debit cards, net banking, and popular digital wallets.</Li>
          <Li>COD (Cash on Delivery) is available for orders up to ₹5,000 in select pincodes.</Li>
          <Li>In case of payment failure, retry before contacting support; duplicate payments will be refunded within 5–7 business days.</Li>
        </ul>
      </Section>
      <Section title="5. Intellectual Property">
        <p>All content on AuraMart — including text, images, logos, product descriptions, and graphics — is the property of AuraMart Pvt. Ltd. and protected under Indian copyright law. Unauthorized use, reproduction, or distribution is strictly prohibited.</p>
      </Section>
      <Section title="6. User Conduct">
        <p>You agree NOT to:</p>
        <ul className="space-y-1.5 list-none mt-2">
          <Li>Use AuraMart for any unlawful, fraudulent, or harmful purpose.</Li>
          <Li>Post false reviews, spam, or misleading content.</Li>
          <Li>Attempt to hack, scrape, or reverse-engineer the platform.</Li>
          <Li>Resell products purchased from AuraMart without prior written consent.</Li>
        </ul>
      </Section>
      <Section title="7. Limitation of Liability">
        <p>AuraMart shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform. Our maximum liability is limited to the amount paid for the specific order in question.</p>
      </Section>
      <Section title="8. Governing Law & Disputes">
        <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka. We encourage amicable resolution before litigation.</p>
      </Section>
      <Section title="9. Changes to Terms">
        <p>We may update these Terms from time to time. Continued use of AuraMart after changes constitutes acceptance of the revised Terms. We will notify registered users of material changes via email.</p>
      </Section>
    </>
  ),

  shipping: (
    <>
      <p className="text-sm text-gray-500 mb-6">All shipments within India &nbsp;|&nbsp; Delivered by trusted logistics partners</p>
      <Section title="1. Shipping Locations">
        <p>AuraMart currently ships to all major cities and pincodes across India. We deliver to 27,000+ pincodes via our logistics partners including Delhivery, BlueDart, and Ekart Logistics.</p>
      </Section>
      <Section title="2. Delivery Timelines">
        <ul className="space-y-1.5 list-none mt-1">
          <Li><strong>Metro Cities</strong> (Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Pune): 2–3 business days.</Li>
          <Li><strong>Tier 2 & Tier 3 Cities:</strong> 4–6 business days.</Li>
          <Li><strong>Remote Areas & Northeast India:</strong> 7–10 business days.</Li>
          <Li>Express delivery (next-day) available for select pincodes — look for the "Express" tag on product pages.</Li>
        </ul>
      </Section>
      <Section title="3. Shipping Charges">
        <ul className="space-y-1.5 list-none mt-1">
          <Li><strong>Free shipping</strong> on all orders above ₹499.</Li>
          <Li>Orders below ₹499 carry a flat shipping fee of ₹49.</Li>
          <Li>Express delivery charges: ₹99 flat, regardless of order value.</Li>
          <Li>Bulky items (large appliances, TVs) may carry additional handling charges — displayed at checkout.</Li>
        </ul>
      </Section>
      <Section title="4. Order Tracking">
        <p>Once your order is shipped, you will receive an SMS and email with the tracking number. You can track your order in real time via:</p>
        <ul className="space-y-1.5 list-none mt-2">
          <Li>Your AuraMart account under "My Orders".</Li>
          <Li>The AuraMart mobile app.</Li>
          <Li>Directly on the courier partner's website using the tracking ID.</Li>
        </ul>
      </Section>
      <Section title="5. Order Processing">
        <ul className="space-y-1.5 list-none mt-1">
          <Li>Orders placed before 2:00 PM IST (Monday–Saturday) are processed the same day.</Li>
          <Li>Orders placed on Sundays or public holidays are processed the next business day.</Li>
          <Li>Processing time may be 1–2 days longer during sale events due to high volume.</Li>
        </ul>
      </Section>
      <Section title="6. Failed Delivery">
        <p>If delivery is unsuccessful due to incorrect address or unavailability of the recipient, the courier will attempt re-delivery twice. After 2 failed attempts, the package is returned to our warehouse and a refund (minus shipping charges) will be initiated.</p>
      </Section>
      <Section title="7. Damaged in Transit">
        <p>In the rare event that your order arrives damaged, please: (1) take photos of the packaging and product, (2) report within 48 hours via the Help Centre or email <strong>support@auramart.in</strong>. We will arrange a replacement or refund at no additional cost.</p>
      </Section>
    </>
  ),

  refund: (
    <>
      <p className="text-sm text-gray-500 mb-6">Easy returns &nbsp;|&nbsp; Most products eligible for 7–30 day return window</p>
      <Section title="1. Return Eligibility">
        <p>We want you to love your purchase. You may return most items within <strong>7 days</strong> of delivery (30 days for select categories) if:</p>
        <ul className="space-y-1.5 list-none mt-2">
          <Li>The item is unused, unwashed, and in original condition with all tags attached.</Li>
          <Li>The original packaging, accessories, and invoice are intact.</Li>
          <Li>The item is not from the non-returnable categories listed below.</Li>
        </ul>
      </Section>
      <Section title="2. Non-Returnable Items">
        <ul className="space-y-1.5 list-none mt-1">
          <Li>Innerwear, lingerie, swimwear, and socks (for hygiene reasons).</Li>
          <Li>Beauty & skincare products once opened or used.</Li>
          <Li>Perishable goods and customized/personalized items.</Li>
          <Li>Digital products, gift cards, and downloadable content.</Li>
          <Li>Items purchased during "Final Sale" or "Non-Returnable" promotions.</Li>
        </ul>
      </Section>
      <Section title="3. How to Initiate a Return">
        <ul className="space-y-1.5 list-none mt-1">
          <Li>Go to <strong>My Account → My Orders</strong> and click "Return / Exchange" against the relevant order.</Li>
          <Li>Select the reason for return and upload photos if required.</Li>
          <Li>Schedule a free pickup or drop off at the nearest courier centre (whichever is available in your area).</Li>
          <Li>Our team will review within 24–48 hours and confirm the return.</Li>
        </ul>
      </Section>
      <Section title="4. Refund Process">
        <ul className="space-y-1.5 list-none mt-1">
          <Li><strong>Original Payment Method:</strong> Refund within 5–7 business days after quality check at our warehouse.</Li>
          <Li><strong>AuraMart Credits:</strong> Instant credit to your wallet on return approval — use for future purchases.</Li>
          <Li>Bank account refunds for COD orders are processed within 7–10 business days via NEFT/IMPS.</Li>
        </ul>
      </Section>
      <Section title="5. Exchange Policy">
        <p>You may exchange a product for a different size or colour within 7 days of delivery, subject to availability. Exchange is free of charge for the first request. Subsequent exchanges may carry a ₹49 handling fee.</p>
      </Section>
      <Section title="6. Damaged or Wrong Item Received">
        <p>If you receive a damaged or incorrect item, report it within 48 hours via <strong>support@auramart.in</strong> or call <strong>1800-123-4567</strong> (toll-free). Include order number and photos. We will dispatch a replacement within 2 business days or process a full refund including shipping charges.</p>
      </Section>
      <Section title="7. Cancellation Policy">
        <ul className="space-y-1.5 list-none mt-1">
          <Li>Orders can be cancelled before they are shipped — go to My Orders and click "Cancel".</Li>
          <Li>For prepaid orders, refunds are processed within 3–5 business days.</Li>
          <Li>Orders in "Shipped" or "Out for Delivery" status cannot be cancelled — use the return process instead.</Li>
        </ul>
      </Section>
      <Section title="8. Contact & Support">
        <p>Questions? We're here to help 7 days a week, 9 AM – 9 PM IST:</p>
        <ul className="space-y-1.5 list-none mt-2">
          <Li>Email: <strong>support@auramart.in</strong></Li>
          <Li>Toll-Free: <strong>1800-123-4567</strong></Li>
          <Li>Live Chat: Available on the website and app</Li>
        </ul>
      </Section>
    </>
  ),
};

const Policy = () => {
  const [active, setActive] = useState('privacy');

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* breadcrumb */}
      <div className="bg-white border-b border-[#EAEAEA] px-4 sm:px-8 py-3 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#E63946]">Home</Link>
        <span className="mx-1.5">&gt;</span>
        <span className="text-[#E63946] font-semibold">Policies</span>
      </div>

      {/* header */}
      <div className="bg-[#2B2D42] py-10 text-center px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Legal & Policies</h1>
        <p className="text-gray-300 text-sm max-w-lg mx-auto">Transparency is at the heart of AuraMart. Everything you need to know about how we handle your data, orders, and returns.</p>
      </div>

      {/* tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#EAEAEA] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                active === id
                  ? 'border-[#E63946] text-[#E63946]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-sm p-6 sm:p-10">
          <h2 className="text-xl font-bold text-[#2B2D42] mb-6 pb-4 border-b border-[#EAEAEA]">
            {TABS.find(t => t.id === active)?.label}
          </h2>
          {CONTENT[active]}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          AuraMart Pvt. Ltd. · Registered in India · CIN: U74900KA2026PTC000001 · GST: 29AABCA0000A1ZD
        </p>
      </div>
    </div>
  );
};

export default Policy;
