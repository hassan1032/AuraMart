import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  { id: 1, author: 'Sadbhh',  text: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
  { id: 2, author: 'Jessica', text: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
  { id: 3, author: 'Michael', text: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
  { id: 4, author: 'Sarah',   text: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
  { id: 5, author: 'Emma',    text: 'To Nikki, Thank you for a very special day. I love all your dresses. You were like my very own fairy godmother.', image: '/images/thnk.jpg' },
];

const Test = () => {
  const [current, setCurrent] = useState(0);
  const cur = testimonials[current];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4">
        {/* prev */}
        <button
          onClick={() => setCurrent(p => (p - 1 + testimonials.length) % testimonials.length)}
          className="w-10 h-10 rounded-full bg-[#FAF7F2] hover:bg-[#FFF1F1] flex items-center justify-center text-gray-600 flex-shrink-0 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        {/* card */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[#EAEAEA] p-5 flex gap-4">
          <div className="flex-shrink-0">
            <img src={cur.image} alt={cur.author} className="w-28 h-32 rounded-xl object-cover" onError={(e) => { e.target.src = '/images/col8.jpg'; }} />
          </div>
          <div className="flex flex-col justify-center">
            <Quote size={20} className="text-[#F4A261] mb-2" />
            <p className="text-orange-500 font-semibold text-sm mb-1">{cur.author}</p>
            <p className="text-gray-600 text-sm leading-relaxed">{cur.text}</p>
          </div>
        </div>

        {/* next */}
        <button
          onClick={() => setCurrent(p => (p + 1) % testimonials.length)}
          className="w-10 h-10 rounded-full bg-[#FAF7F2] hover:bg-[#FFF1F1] flex items-center justify-center text-gray-600 flex-shrink-0 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* dots */}
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-4 h-2.5 bg-[#F4A261]' : 'w-2.5 h-2.5 bg-[#D0D0D0]'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Test;
