import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const videos = [
  { id: 0, poster: 'https://i.pinimg.com/736x/1e/4e/a1/1e4ea189fd9d9ccac5521d3f6854f84d.jpg', videoUrl: '/images/vid1.mp4', title: 'Les Trois Soeurs Bridal Exclusive Interview with Nicki Macfarlane', description: "One of our resident 'Les Trois Soeurs', and the lovely business of Nicki and Charlotte." },
  { id: 1, poster: 'https://modsele.com/cdn/shop/products/on.jpg?v=1659941602&width=180',      videoUrl: '/images/vid2.mp4', title: 'Bridal Fashion Trends 2024 Designer Collection',               description: 'Discover the latest trends in bridal fashion with our exclusive designer showcase.' },
  { id: 2, poster: 'https://i.pinimg.com/736x/5c/cd/f6/5ccdf6f2c1aef0d4c97e4911cbcbf0e3.jpg', videoUrl: '/images/vid3.mp4', title: 'Behind the Scenes: Bridal Boutique Experience',               description: 'An intimate look at the craftsmanship and attention to detail in our atelier.' },
  { id: 3, poster: 'https://4.imimg.com/data4/PV/OW/ANDROID-7619203/product-500x500.jpeg',    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', title: 'Luxury Bridal Accessories Collection Showcase', description: 'Explore our exquisite collection of bridal accessories and finishing touches.' },
];

const Media = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const switchTo = (index) => {
    setCurrentVideo(index);
    setIsPlaying(false);
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  };

  const prev = () => switchTo((currentVideo - 1 + videos.length) % videos.length);
  const next = () => switchTo((currentVideo + 1) % videos.length);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
    else            { videoRef.current.play();  setIsPlaying(true);  }
  };

  useEffect(() => { if (videoRef.current) videoRef.current.load(); }, [currentVideo]);

  const cur = videos[currentVideo];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* header */}
      <div className="bg-[#E63946] py-8 text-center">
        <h1 className="text-2xl font-bold text-white">Media</h1>
        <p className="text-blue-200 text-sm mt-1">Watch our latest videos and features</p>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-8 space-y-6">

        {/* featured video player */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] overflow-hidden shadow-sm">
          <div className="relative aspect-video bg-black">
            {/* poster */}
            <img
              src={cur.poster}
              alt={cur.title}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            />
            {/* video element */}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
            >
              <source src={cur.videoUrl} type="video/mp4" />
            </video>

            {/* dark overlay (when paused) */}
            {!isPlaying && <div className="absolute inset-0 bg-black/30" />}

            {/* title overlay */}
            {!isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-6 py-5">
                <h2 className="text-white font-bold text-lg leading-snug">{cur.title}</h2>
                <p className="text-white/70 text-sm mt-1">{cur.description}</p>
              </div>
            )}

            {/* nav arrows */}
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors z-10">
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors z-10">
              <ChevronRight size={18} />
            </button>

            {/* play/pause button */}
            <button
              onClick={togglePlay}
              className="absolute bottom-5 right-5 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
            >
              {isPlaying ? <Pause size={20} className="text-gray-800" /> : <Play size={20} className="text-gray-800 ml-0.5" />}
            </button>
          </div>

          {/* dots */}
          <div className="flex justify-center gap-2 py-3">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => switchTo(i)}
                className={`rounded-full transition-all ${i === currentVideo ? 'w-4 h-3 bg-[#E63946]' : 'w-3 h-3 bg-[#D0D0D0]'}`}
              />
            ))}
          </div>
        </div>

        {/* video thumbnail grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {videos.map((v) => (
            <button
              key={v.id}
              onClick={() => switchTo(v.id)}
              className={`relative rounded-xl overflow-hidden aspect-video text-left group border-2 transition-all ${v.id === currentVideo ? 'border-[#E63946] shadow-md' : 'border-transparent'}`}
            >
              <img src={v.poster} alt={v.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                  <Play size={14} className="text-gray-800 ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white text-[10px] font-semibold line-clamp-2 leading-tight">{v.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Media;
