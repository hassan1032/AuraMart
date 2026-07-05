import { Link } from 'react-router-dom';

const colours = [
  { name: "White",        hex: "#FFFFFF" },
  { name: "Ivory",        hex: "#FFFFF0" },
  { name: "Shell",        hex: "#FFF5EE" },
  { name: "Almond",       hex: "#EFDECD" },
  { name: "Blossom",      hex: "#FFB7C5" },
  { name: "Sky",          hex: "#87CEEB" },
  { name: "Larkspur",     hex: "#9457EB" },
  { name: "Silver",       hex: "#C0C0C0" },
  { name: "Vintage Rose", hex: "#C08081" },
  { name: "Raspberry",    hex: "#E30B5C" },
  { name: "Jelly",        hex: "#DA614E" },
  { name: "Sage",         hex: "#BCB88A" },
  { name: "Gold",         hex: "#FFD700" },
  { name: "Wisteria",     hex: "#C9A0DC" },
  { name: "Violet",       hex: "#7F00FF" },
  { name: "Lawn",         hex: "#7CFC00" },
  { name: "Pebble",       hex: "#C0B098" },
  { name: "RoseGold",     hex: "#B76E79" },
  { name: "Strawberry",   hex: "#FC5A8D" },
  { name: "Sunset",       hex: "#FD5E53" },
  { name: "Leaf",         hex: "#71BC78" },
  { name: "Willow",       hex: "#9DC183" },
  { name: "Pink",         hex: "#FFC0CB" },
  { name: "Japanica",     hex: "#A8516E" },
];

const ShopByColours = () => {
  return (
    <div className="w-full bg-[#F8F4F0] rounded-xl p-6 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* heading */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <span className="flex-1 h-px bg-[#E0D0C0] max-w-[80px]" />
            Shop by Colours
            <span className="flex-1 h-px bg-[#E0D0C0] max-w-[80px]" />
          </h2>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            The colour ranges for our current collection. These are for illustrative purposes only.
            For fabric samples, email{' '}
            <a href="mailto:charlotte.r@nickimacfarlane.com" className="text-[#E63946] hover:underline">
              charlotte.r@nickimacfarlane.com
            </a>.
          </p>
        </div>

        {/* colour grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {colours.map((c, i) => (
            <Link to="/collections" key={i}>
              <button
                className="flex flex-col items-center gap-1.5 group"
                title={c.name}
              >
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: c.hex, outline: '1px solid #EAEAEA' }}
                />
                <span className="text-[10px] text-gray-600 text-center leading-tight">{c.name}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopByColours;
