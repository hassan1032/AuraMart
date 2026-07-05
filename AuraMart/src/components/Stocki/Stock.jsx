import { useState } from 'react';
import { Search, MapPin, Phone, Mail, Clock } from 'lucide-react';

const CITIES = ['All Cities', 'New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Jaipur', 'Ahmedabad', 'Chennai', 'Lucknow'];

const STORES = [
  { name: 'AuraMart Delhi Flagship', city: 'New Delhi', address: 'Shop 12, Select City Walk Mall, Saket, New Delhi – 110017', phone: '+91 11 4567 8901', email: 'delhi@auramart.in', hours: 'Mon–Sun: 10 AM – 10 PM' },
  { name: 'AuraMart Connaught Place', city: 'New Delhi', address: 'N-Block, Inner Circle, Connaught Place, New Delhi – 110001', phone: '+91 11 4567 8902', email: 'cp@auramart.in', hours: 'Mon–Sun: 11 AM – 9 PM' },
  { name: 'AuraMart Mumbai BKC', city: 'Mumbai', address: 'Unit 204, Maker Maxity, Bandra Kurla Complex, Mumbai – 400051', phone: '+91 22 6789 0123', email: 'mumbai@auramart.in', hours: 'Mon–Sat: 10 AM – 9 PM, Sun: 11 AM – 8 PM' },
  { name: 'AuraMart Powai', city: 'Mumbai', address: 'Shop 8, Galleria Mall, Hiranandani Gardens, Powai, Mumbai – 400076', phone: '+91 22 6789 0124', email: 'powai@auramart.in', hours: 'Mon–Sun: 10 AM – 10 PM' },
  { name: 'AuraMart Indiranagar', city: 'Bangalore', address: '12th Main Road, HAL 2nd Stage, Indiranagar, Bangalore – 560038', phone: '+91 80 2345 6789', email: 'blr@auramart.in', hours: 'Mon–Sun: 10 AM – 10 PM' },
  { name: 'AuraMart Koramangala', city: 'Bangalore', address: '80 Feet Road, 4th Block, Koramangala, Bangalore – 560034', phone: '+91 80 2345 6790', email: 'koramangala@auramart.in', hours: 'Mon–Sun: 10 AM – 10 PM' },
  { name: 'AuraMart Jubilee Hills', city: 'Hyderabad', address: 'Road No. 36, Jubilee Hills, Hyderabad – 500033', phone: '+91 40 3456 7890', email: 'hyd@auramart.in', hours: 'Mon–Sat: 10 AM – 9 PM, Sun: 11 AM – 8 PM' },
  { name: 'AuraMart Koregaon Park', city: 'Pune', address: 'Lane 7, North Main Road, Koregaon Park, Pune – 411001', phone: '+91 20 4567 8901', email: 'pune@auramart.in', hours: 'Mon–Sun: 10 AM – 9 PM' },
  { name: 'AuraMart Pink City', city: 'Jaipur', address: 'Shop 22, World Trade Park, JLN Marg, Jaipur – 302017', phone: '+91 141 5678 901', email: 'jaipur@auramart.in', hours: 'Mon–Sun: 10 AM – 9 PM' },
  { name: 'AuraMart Alpha One', city: 'Ahmedabad', address: 'Ground Floor, Alpha One Mall, Vastrapur, Ahmedabad – 380015', phone: '+91 79 6789 0123', email: 'ahmedabad@auramart.in', hours: 'Mon–Sun: 10 AM – 10 PM' },
];

const Stock = () => {
  const [selected, setSelected] = useState('All Cities');
  const [query, setQuery] = useState('');

  const filtered = STORES.filter(s => {
    const matchCity = selected === 'All Cities' || s.city === selected;
    const q = query.toLowerCase();
    const matchQuery = !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
    return matchCity && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* hero */}
      <div
        className="relative py-16 text-center px-4 overflow-hidden"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=1400&h=400&q=60&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#2B2D42]/75" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin size={24} className="text-[#F4A261]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Find a Store Near You</h1>
          </div>
          <p className="text-gray-300 text-sm max-w-md mx-auto mb-8">
            Visit one of our 10 experience stores across India. Try products, get expert advice, and pick up your order in-store.
          </p>

          {/* search */}
          <div className="flex max-w-md mx-auto rounded-full overflow-hidden border border-white/20 shadow-lg bg-white/95 backdrop-blur-sm">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by city or store name..."
              className="flex-1 px-5 py-3 text-sm text-gray-800 bg-transparent focus:outline-none"
            />
            <button className="flex items-center gap-2 px-5 py-3 bg-[#E63946] hover:bg-[#C5303A] text-white text-sm font-semibold transition-colors flex-shrink-0">
              <Search size={15} /> Search
            </button>
          </div>
        </div>
      </div>

      {/* city filter */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <div className="flex flex-wrap gap-2">
          {CITIES.map(city => (
            <button
              key={city}
              onClick={() => setSelected(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${selected === city
                  ? 'bg-[#E63946] text-white border-[#E63946] shadow-md'
                  : 'bg-white text-[#E63946] border-[#E63946]/40 hover:border-[#E63946]'
                }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* store grid */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <MapPin size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No stores found for your search.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">{filtered.length} store{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((store, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#EAEAEA] p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EAEAEA] flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-[#E63946]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm leading-snug">{store.name}</h3>
                      <span className="text-xs text-[#E63946] font-semibold">{store.city}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex gap-2">
                      <MapPin size={12} className="mt-0.5 flex-shrink-0 text-gray-400" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Phone size={12} className="flex-shrink-0 text-gray-400" />
                      <a href={`tel:${store.phone}`} className="hover:text-[#E63946]">{store.phone}</a>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Mail size={12} className="flex-shrink-0 text-gray-400" />
                      <a href={`mailto:${store.email}`} className="hover:text-[#E63946]">{store.email}</a>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Clock size={12} className="flex-shrink-0 text-gray-400" />
                      <span>{store.hours}</span>
                    </div>
                  </div>
                  <a
                    href={`https://maps.google.com/maps/search/${encodeURIComponent(store.name + ' ' + store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block w-full text-center py-2 rounded-full border border-[#E63946] text-[#E63946] text-xs font-semibold hover:bg-[#E63946] hover:text-white transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* bottom note */}
      <div className="text-center py-6 text-xs text-gray-400 px-4">
        Can't visit a store? &nbsp;
        <a href="tel:18001234567" className="text-[#E63946] font-semibold hover:underline">Call 1800-123-4567</a>
        &nbsp;to speak with a shopping advisor.
      </div>
    </div>
  );
};

export default Stock;
