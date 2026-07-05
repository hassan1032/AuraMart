import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const STATUS_CLS = {
  active:   'bg-green-500 text-white',
  upcoming: 'bg-blue-500 text-white',
  inactive: 'bg-gray-400 text-white',
};

const UpcomingEvent = ({ events = [] }) => {
  const navigate = useNavigate();
  if (events.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-[#EAEAEA] p-5 mt-6">
      <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#E63946] rounded-full inline-block" />
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {events.map((event, i) => {
          const thumb = event.thumbnail || event.image || '/images/col1.webp';
          const statusCls = STATUS_CLS[event.status] || STATUS_CLS.upcoming;
          const statusLabel = event.status === 'active' ? 'Live Now' : 'Upcoming';
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => { e.target.src = '/images/col1.webp'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCls}`}>{statusLabel}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-semibold text-sm line-clamp-1 mb-1">{event.title}</p>
                {dateStr && <p className="text-white/70 text-xs flex items-center gap-1 mb-0.5"><Calendar size={10} /> {dateStr}</p>}
                {event.location && <p className="text-white/70 text-xs flex items-center gap-1"><MapPin size={10} /> {event.location}</p>}
                <span className="text-white/80 text-xs mt-2 flex items-center gap-1 hover:text-white">View Event <ArrowRight size={11} /></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingEvent;
