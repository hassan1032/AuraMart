import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sliderImages = [
  { id: 1, title: 'Title of the event goes here', date: '25 July 2025, London', description: 'Short description of the event goes here...', image: 'https://images.unsplash.com/photo-1518066431792-2d5c6c04749e?w=800&h=600&fit=crop&crop=center' },
  { id: 2, title: 'Summer Collection Launch',    date: '15 August 2025, Mumbai', description: 'Discover our latest summer collection with exclusive designs...', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=600&fit=crop&crop=center' },
  { id: 3, title: 'Autumn Fashion Showcase',     date: '10 September 2025, Delhi', description: 'Join us for an elegant autumn fashion presentation...', image: 'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?w=800&h=600&fit=crop&crop=center' },
];

const staticImages = [
  { date: '25 July 2025, London', description: 'Short description of the event goes here...', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center' },
  { date: '25 July 2025, London', description: 'Short description of the event goes here...', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center' },
];

const EventHero = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % sliderImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const cur = sliderImages[current];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 h-auto lg:h-[400px]">
      {/* main slider */}
      <div className="relative rounded-2xl overflow-hidden h-[340px] lg:h-full">
        <img src={cur.image} alt={cur.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* content */}
        <div className="absolute bottom-0 left-0 right-16 p-6">
          <p className="text-white/70 text-xs flex items-center gap-1 mb-1"><Calendar size={11} /> {cur.date}</p>
          <h2 className="text-white text-xl font-bold mb-1 leading-snug">{cur.title}</h2>
          <p className="text-white/70 text-sm mb-4">{cur.description}</p>
          <button
            onClick={() => navigate('/view-event')}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-800 font-semibold rounded-full text-sm transition-all"
          >
            View Event <ArrowUpRight size={14} />
          </button>
        </div>

        {/* corner cutout */}
        <div className="absolute bottom-0 right-0 w-16 h-14 bg-[#FAF7F2] rounded-tl-3xl" />

        {/* dots */}
        <div className="absolute top-4 left-4 flex gap-1.5">
          {sliderImages.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`} />
          ))}
        </div>

        {/* arrows */}
        <button onClick={() => setCurrent(p => (p - 1 + sliderImages.length) % sliderImages.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors">
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => setCurrent(p => (p + 1) % sliderImages.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* static sidebar images */}
      <div className="flex flex-row lg:flex-col gap-4">
        {staticImages.map((img, i) => (
          <div key={i} onClick={() => navigate('/view-event')} className="relative flex-1 rounded-xl overflow-hidden cursor-pointer group min-h-[160px]">
            <img src={img.image} alt="event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors" />
            <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-700 z-10">
              <ArrowUpRight size={13} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-[11px]">{img.date}</p>
              <p className="text-white/75 text-[11px] mt-0.5 line-clamp-2">{img.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventHero;
