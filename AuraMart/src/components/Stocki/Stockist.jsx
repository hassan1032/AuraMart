import { useNavigate } from 'react-router-dom';
import Stock from './Stock';

const Stockist = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Stock />
      <div className="text-center py-6">
        <button
          onClick={() => navigate('/stock-search')}
          className="px-8 py-3 bg-[#E63946] hover:bg-[#C5303A] text-white font-semibold rounded-lg text-sm transition-colors"
        >
          View Interactive Map
        </button>
      </div>
    </div>
  );
};

export default Stockist;
