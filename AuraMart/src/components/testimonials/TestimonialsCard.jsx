import { useState } from 'react';
import { Quote } from 'lucide-react';

const testimonialsData = [
  { name: 'Sadbhh', message: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
  { name: 'Sadbhh', message: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
  { name: 'Sadbhh', message: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
  { name: 'Sadbhh', message: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
  { name: 'Sadbhh', message: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
  { name: 'Sadbhh', message: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
  { name: 'Sadbhh', message: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
  { name: 'Sadbhh', message: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
];

const TestimonialsCard = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const visible = testimonialsData.slice(0, visibleCount);

  return (
    <section className="py-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {visible.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#EAEAEA] p-4 flex gap-3 shadow-sm hover:shadow-md transition-shadow">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-20 rounded-lg object-cover flex-shrink-0"
              onError={(e) => { e.target.src = '/images/col8.jpg'; }}
            />
            <div>
              <Quote size={14} className="text-[#F4A261] mb-1" />
              <p className="font-semibold text-[#F4A261] text-sm">{item.name}</p>
              <p className="text-gray-600 text-xs leading-relaxed mt-1">{item.message}</p>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < testimonialsData.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount(p => Math.min(p + 2, testimonialsData.length))}
            className="px-6 py-2.5 border border-[#E63946] text-[#E63946] font-semibold rounded-lg text-sm hover:bg-[#FFF1F1] transition-colors"
          >
            Load More →
          </button>
        </div>
      )}
    </section>
  );
};

export default TestimonialsCard;
