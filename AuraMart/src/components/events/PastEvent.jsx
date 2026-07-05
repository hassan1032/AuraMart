import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const PastEvent = ({ events = [] }) => {
  const navigate = useNavigate();
  if (events.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-[#EAEAEA] p-5 mt-6">
      <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-gray-400 rounded-full inline-block" />
        Past Events
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {events.map((event, i) => {
          const thumb = event.thumbnail || event.image || '/images/col5.webp';
          const dateStr = event.date
            ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
            : '';
          return (
            <div
              key={event._id || i}
              onClick={() => navigate(`/view-event/${event._id}`)}
              className="relative rounded-xl overflow-hidden cursor-pointer group aspect-[4/3]"
            >
              <img
                src={thumb}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 grayscale-[30%] group-hover:grayscale-0"
                onError={e => { e.target.src = '/images/col5.webp'; }}
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-500 text-white">Ended</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-semibold text-xs line-clamp-1 mb-1">{event.title}</p>
                {dateStr && <p className="text-white/70 text-[11px] flex items-center gap-1 mb-0.5"><Calendar size={9} /> {dateStr}</p>}
                {event.location && <p className="text-white/70 text-[11px] flex items-center gap-1"><MapPin size={9} /> {event.location}</p>}
                <span className="text-white/80 text-[11px] mt-1.5 flex items-center gap-1 hover:text-white">View <ArrowRight size={10} /></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PastEvent;
