import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'Fashion',     to: '/collections' },
    { label: 'Beauty',      to: '/collections' },
    { label: 'Footwear',    to: '/collections' },
    { label: 'Electronics', to: '/collections' },
    { label: 'Laptops',     to: '/collections' },
    { label: 'Mobiles',     to: '/collections' },
    { label: 'Books',       to: '/collections' },
    { label: 'Accessories', to: '/accessories' },
  ],
  Discover: [
    { label: 'About Us',       to: '/about' },
    { label: 'Blog',           to: '/blogs' },
    { label: 'Events',         to: '/events' },
    { label: 'Find a Store',   to: '/stockist' },
  ],
  Support: [
    { label: 'Track Order',    to: '/track-orders' },
    { label: 'Contact Us',     to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'My Account',     to: '/account' },
  ],
};

const social = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Facebook,  href: '#', label: 'Facebook' },
  { Icon: Twitter,   href: '#', label: 'Twitter' },
  { Icon: Youtube,   href: '#', label: 'YouTube' },
];

const PAYMENT_METHODS = ['UPI', 'RuPay', 'Visa', 'Mastercard', 'Net Banking'];

export default function Footer() {
  const [email, setEmail]         = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="bg-white border-t border-[#EAEAEA]">

      {/* ── Trust bar ─────────────────────────────────────────────── */}
      <div className="bg-[#FAF7F2] border-b border-[#EAEAEA]">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center sm:justify-between gap-4 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1.5">🚚 <strong className="text-gray-700">Free delivery</strong> on orders above ₹499</span>
            <span className="flex items-center gap-1.5">🔄 <strong className="text-gray-700">Easy 7-day returns</strong> on all products</span>
            <span className="flex items-center gap-1.5">🔒 <strong className="text-gray-700">Secure payments</strong> via UPI, Cards & Net Banking</span>
            <span className="flex items-center gap-1.5">⭐ <strong className="text-gray-700">1 Cr+ happy customers</strong> across India</span>
          </div>
        </div>
      </div>

      {/* ── Main Footer ──────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">

          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-3">
              <span className="text-xl font-bold text-[#E63946]">Aura</span>
              <span className="text-xl font-bold text-gray-800">Mart</span>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-4 max-w-[200px]">
              India's favourite multi-brand store — fashion, electronics, beauty &amp; more, delivered to your door.
            </p>
            <div className="flex gap-2">
              {social.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-[#EAEAEA] flex items-center justify-center text-[#6B7280] hover:bg-[#E63946] hover:text-white hover:border-[#E63946] transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">{heading}</h4>
              <ul className="space-y-2">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-[#6B7280] hover:text-[#E63946] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Newsletter</h4>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-3">
              Get exclusive deals &amp; 10% off your first order.
            </p>
            {subscribed ? (
              <p className="text-sm text-[#7CB342] font-semibold">✓ Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-9 px-3 text-sm border border-[#EAEAEA] rounded mb-2 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
                />
                <button
                  type="submit"
                  className="w-full h-9 bg-[#E63946] text-white text-sm font-semibold rounded hover:bg-[#C5303A] transition-colors"
                >
                  Subscribe →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────────────────── */}
      <div className="border-t border-[#EAEAEA] bg-[#F8F9FA]">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#6B7280]">
            © 2026 AuraMart. All Rights Reserved. Made with ❤️ in India.
          </p>
          <div className="flex items-center gap-1.5">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="text-[10px] px-2 py-0.5 border border-[#D1D5DB] rounded text-[#6B7280] font-medium bg-white"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
