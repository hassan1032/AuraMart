import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="bg-[#E63946] py-10 text-center">
        <h1 className="text-2xl font-bold text-white">Contact Us</h1>
        <p className="text-blue-200 text-sm mt-1">We'd love to hear from you — reach out anytime</p>
      </div>

      <div className="max-w-[960px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Info cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#EAEAEA] p-5 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FFF1F1] flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-[#E63946]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Office</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                AuraMart India,<br />
                42, Commerce House, 3rd Floor,<br />
                Nariman Point, Mumbai — 400 021
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#EAEAEA] p-5 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FFF1F1] flex items-center justify-center flex-shrink-0">
              <Mail size={18} className="text-[#E63946]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Email</h3>
              <p className="text-sm text-gray-600">
                General Inquiries &amp; Orders<br />
                <a href="mailto:support@auramart.in" className="text-[#E63946] hover:underline">
                  support@auramart.in
                </a>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#EAEAEA] p-5 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FFF1F1] flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-[#E63946]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Phone &amp; WhatsApp</h3>
              <p className="text-sm text-gray-600">
                +91 98765 43210<br />
                <span className="text-xs text-[#6B7280]">Mon–Sat, 10 AM – 7 PM IST</span>
              </p>
            </div>
          </div>

          <div className="bg-[#FAF7F2] rounded-xl border border-[#EAEAEA] p-5">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Business Hours</h3>
            <div className="space-y-1.5">
              {[
                ['Monday – Friday', '10:00 AM – 7:00 PM'],
                ['Saturday',        '11:00 AM – 5:00 PM'],
                ['Sunday',          'Closed'],
              ].map(([day, hrs]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="text-gray-600">{day}</span>
                  <span className="font-medium text-gray-800">{hrs}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-xl border border-[#EAEAEA] p-6">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare size={18} className="text-[#E63946]" />
            <h2 className="font-bold text-gray-800">Send a Message</h2>
          </div>

          {sent ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <Send size={24} className="text-[#7CB342]" />
              </div>
              <h3 className="font-bold text-gray-800">Message Sent!</h3>
              <p className="text-sm text-[#6B7280] mt-1">We'll get back to you within 24 hours.</p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 text-sm text-[#E63946] hover:underline font-semibold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Full Name"
                  className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-sm focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="Email Address"
                  className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-sm focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                <textarea
                  required rows={5}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-sm focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#E63946] hover:bg-[#C5303A] text-white font-bold rounded-lg transition-colors text-sm"
              >
                <Send size={15} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
