import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Share2, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { ApiUrl } from '../../utils/api';

const ViewEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    axios.get(ApiUrl.getAllEvents)
      .then(res => {
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        const found = data.find(e => e._id === id);
        if (found) setEvent(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (val) => {
    if (!val) return '';
    try {
      return new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return ''; }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* breadcrumb */}
      <div className="bg-white border-b border-[#EAEAEA] px-4 sm:px-8 py-3 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#E63946]">Home</Link>
        <span className="mx-1.5">&gt;</span>
        <Link to="/events" className="hover:text-[#E63946]">Events</Link>
        <span className="mx-1.5">&gt;</span>
        <span className="text-[#E63946] font-semibold">{event?.title || 'Event Detail'}</span>
      </div>

      <div className="max-w-[860px] mx-auto px-4 py-8">

        {/* Loading skeleton */}
        {loading && (
          <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden">
            <div className="skeleton w-full h-[280px] sm:h-[360px]" />
            <div className="p-6 space-y-3">
              <div className="skeleton h-7 rounded w-2/3" />
              <div className="skeleton h-4 rounded w-1/3" />
              <div className="skeleton h-4 rounded w-full" />
              <div className="skeleton h-4 rounded w-full" />
              <div className="skeleton h-4 rounded w-3/4" />
            </div>
          </div>
        )}

        {/* Not found */}
        {!loading && notFound && (
          <div className="bg-white rounded-xl border border-[#EAEAEA] py-20 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Event not found</h3>
            <p className="text-[#6B7280] text-sm mb-5">The event you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#E63946] text-white rounded-lg text-sm font-semibold hover:bg-[#c0303b] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Events
            </button>
          </div>
        )}

        {/* Event detail */}
        {!loading && event && (
          <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden">
            {/* hero image */}
            <div className="w-full h-[280px] sm:h-[360px] overflow-hidden">
              <img
                src={event.thumbnail || event.image || '/images/col1.webp'}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = '/images/col1.webp'; }}
              />
            </div>

            <div className="p-6">
              {event.status && (
                <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-3 ${
                  event.status === 'active' ? 'bg-green-100 text-green-700' :
                  event.status === 'inactive' ? 'bg-gray-100 text-gray-600' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {event.status === 'active' ? 'Live Now' : event.status === 'inactive' ? 'Ended' : 'Upcoming'}
                </span>
              )}

              <h1 className="text-2xl font-bold text-gray-800 mb-3">{event.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-5">
                {(event.eventDate || event.date) && (
                  <span className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <Calendar size={13} /> {formatDate(event.eventDate || event.date)}
                  </span>
                )}
                {event.location && (
                  <span className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <MapPin size={13} /> {event.location}
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-600 leading-relaxed space-y-4">
                {(event.longDescription || event.description || event.shortDescription) ? (
                  (event.longDescription || event.description || event.shortDescription)
                    .split('\n')
                    .filter(p => p.trim())
                    .map((para, i) => <p key={i}>{para}</p>)
                ) : (
                  <p className="text-gray-400 italic">No description available for this event.</p>
                )}
              </div>

              {/* share */}
              <div className="flex items-center gap-4 mt-6 pt-5 border-t border-[#FAF7F2]">
                <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                  <Share2 size={13} /> Share
                </span>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAF7F2] hover:bg-[#FFF1F1] text-gray-600 hover:text-[#E63946] transition-colors">
                  <Instagram size={14} />
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAF7F2] hover:bg-[#FFF1F1] text-gray-600 hover:text-[#E63946] transition-colors">
                  <Facebook size={14} />
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAF7F2] hover:bg-[#FFF1F1] text-gray-600 hover:text-[#E63946] transition-colors">
                  <Twitter size={14} />
                </a>
                <button
                  onClick={() => navigate('/events')}
                  className="ml-auto flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#E63946] transition-colors"
                >
                  <ArrowLeft size={12} /> All Events
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEvent;
