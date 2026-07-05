import Test from './Test';
import TestimonialsCard from './TestimonialsCard';

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* header */}
      <div className="bg-[#E63946] py-8 text-center">
        <h1 className="text-2xl font-bold text-white">Testimonials</h1>
        <p className="text-blue-200 text-sm mt-1">What our customers say about us</p>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-[#EAEAEA] mb-6">
          <Test />
        </div>
        <div className="border-t border-[#EAEAEA] pt-2">
          <TestimonialsCard />
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
