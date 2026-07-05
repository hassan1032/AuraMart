import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { ApiUrl } from '../../utils/api';
import PastEvent from './PastEvent';
import UpcomingEvent from './UpcomingEvent';

const Event = () => {
  const navigate = useNavigate();
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    axios.get(ApiUrl.getAllEvents)
      .then(res => {
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data.filter(e => e.status !== 'inactive'));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const prev = () => setCurrent(p => (p - 1 + Math.max(events.length, 1)) % Math.max(events.length, 1));
  const next = () => setCurrent(p => (p + 1) % Math.max(events.length, 1));

  const getDate = (ev) => {
    if (ev?.eventDate || ev?.date) {
      try {
        return new Date(ev.eventDate || ev.date).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'long', year: 'numeric',
        });
      } catch { return ''; }
    }
    return ev?.dateText || ev?.location || '';
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="bg-[#E63946] py-8 text-center">
        <h1 className="text-2xl font-bold text-white">Events</h1>
        <p className="text-blue-200 text-sm mt-1">Stay updated with our latest events</p>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-6">

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 rounded-2xl overflow-hidden h-[380px] skeleton" />
            <div className="lg:w-72 flex-shrink-0 flex flex-col gap-4">
              <div className="flex-1 rounded-xl skeleton" />
              <div className="flex-1 rounded-xl skeleton" />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && events.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#EAEAEA] py-20 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No events yet</h3>
            <p className="text-[#6B7280] text-sm">Check back soon for upcoming events.</p>
          </div>
        )}

        {/* Events hero */}
        {!loading && events.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Featured */}
            <div className="flex-1 relative rounded-2xl overflow-hidden h-[380px] group">
              <img
                src={events[current]?.thumbnail || events[current]?.image || '/images/col1.webp'}
                alt={events[current]?.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = '/images/col1.webp'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/70 text-xs flex items-center gap-1 mb-1">
                  <Calendar size={11} /> {getDate(events[current])}
                </p>
                <h2 className="text-white text-xl font-bold mb-1">{events[current]?.title}</h2>
                <p className="text-white/80 text-sm mb-4 line-clamp-2">
                  {events[current]?.description || events[current]?.shortDescription}
                </p>
                <button
                  onClick={() => navigate(`/view-event/${events[current]?._id}`)}
                  className="flex items-center gap-2 px-5 py-2 bg-white text-gray-800 font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors"
                >
                  View Event <ArrowRight size={14} />
                </button>
              </div>

              {events.length > 1 && (
                <div className="absolute top-4 left-4 flex gap-1.5">
                  {events.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                    />
                  ))}
                </div>
              )}

              {events.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Sidebar */}
            {events.length > 1 && (
              <div className="lg:w-72 flex-shrink-0 flex flex-col gap-4">
                {events.slice(1, 3).map((ev, i) => (
                  <div
                    key={ev._id || i}
                    onClick={() => navigate(`/view-event/${ev._id}`)}
                    className="relative rounded-xl overflow-hidden h-[176px] cursor-pointer group flex-1"
                  >
                    <img
                      src={ev.thumbnail || ev.image || '/images/col2.webp'}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { e.target.src = '/images/col2.webp'; }}
                    />
                    <div className="absolute inset-0 bg-black/45 group-hover:bg-black/55 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white/70 text-xs flex items-center gap-1 mb-0.5">
                        <Calendar size={10} /> {getDate(ev)}
                      </p>
                      <p className="text-white text-sm font-semibold line-clamp-2">{ev.title}</p>
                      <span className="text-white/70 text-xs flex items-center gap-1 mt-1 hover:text-white">
                        View Event <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <UpcomingEvent events={events.filter(e => new Date(e.date || e.eventDate) >= new Date())} />
        <PastEvent    events={events.filter(e => new Date(e.date || e.eventDate) <  new Date())} />
      </div>
    </div>
  );
};

export default Event;
