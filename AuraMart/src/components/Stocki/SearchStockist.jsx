import { useState } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';

const locations = ['National','UK South','UK South East','UK South West','UK East Anglia','UK Midlands','UK North'];

const searchResults = [
  { id: 1, name: 'Bridal Regine Gallery', address: '26 Chiltern Street, London W1U 7QD, United Kingdom', distance: '1.4 Mi' },
  { id: 2, name: 'Bridal Regine Gallery', address: '26 Chiltern Street, London W1U 7QD, United Kingdom', distance: '1.4 Mi' },
  { id: 3, name: 'Bridal Regine Gallery', address: '26 Chiltern Street, London W1U 7QD, United Kingdom', distance: '1.4 Mi' },
  { id: 4, name: 'Bridal Regine Gallery', address: '26 Chiltern Street, London W1U 7QD, United Kingdom', distance: '1.4 Mi' },
];

const SearchStockist = () => {
  const [query, setQuery]   = useState('South');
  const [selected, setSelected] = useState('National');

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* header */}
      <div className="bg-white border-b border-[#EAEAEA] px-4 py-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Locate a Stockist Near You</h2>
        <p className="text-sm text-[#E63946] font-semibold mb-4">UK Regions & International</p>

        {/* region tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {locations.map(loc => (
            <button
              key={loc}
              onClick={() => setSelected(loc)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                selected === loc
                  ? 'bg-[#E63946] text-white border-[#E63946]'
                  : 'bg-white text-[#E63946] border-[#E63946] hover:bg-[#FFF1F1]'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* main: map + results */}
      <div className="relative h-[80vh]">
        {/* map image */}
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=800&fit=crop&crop=center"
          alt="Map"
          className="w-full h-full object-cover"
        />

        {/* floating results panel */}
        <div className="absolute top-4 left-4 w-80 flex flex-col gap-3 max-h-[calc(100%-32px)] overflow-hidden">
          {/* search input */}
          <div className="flex rounded-lg overflow-hidden border border-[#EAEAEA] shadow bg-white">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm focus:outline-none bg-white"
              placeholder="Search locations..."
            />
            <button className="px-4 py-2.5 bg-[#E63946] hover:bg-[#C5303A] text-white text-sm font-semibold transition-colors">
              <Search size={15} />
            </button>
          </div>

          {/* results */}
          <div className="overflow-y-auto space-y-2 scrollbar-hide">
            {searchResults.map(r => (
              <div key={r.id} className="bg-white rounded-lg border border-[#EAEAEA] p-3 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm">{r.name}</h3>
                  <span className="text-xs text-[#6B7280] flex-shrink-0">{r.distance}</span>
                </div>
                <div className="flex items-start gap-1 mb-2">
                  <MapPin size={11} className="text-[#6B7280] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 leading-relaxed">{r.address}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-1 border border-[#EAEAEA] text-xs font-semibold text-gray-600 rounded hover:bg-gray-50 transition-colors">Map Info</button>
                  <button className="flex-1 py-1 border border-[#E63946] text-[#E63946] text-xs font-semibold rounded hover:bg-[#FFF1F1] transition-colors flex items-center justify-center gap-1">
                    <Navigation size={10} /> Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchStockist;
