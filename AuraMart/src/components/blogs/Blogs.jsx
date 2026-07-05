import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight, Tag } from 'lucide-react';

const slides = [
  {
    id: 0,
    title: 'Top Fashion Trends of 2026 — India Edition',
    description: 'From maximalist kurta sets to sleek Indo-western fusion, Indian fashion is having its biggest moment yet. Here\'s what\'s ruling the runways and your wardrobe this season.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&h=600&q=80&auto=format&fit=crop',
  },
  {
    id: 1,
    title: 'Best Smartphones of 2026 — Comprehensive Buyer\'s Guide',
    description: 'iPhone 16 Pro vs Galaxy S25 Ultra vs OnePlus 13 — we break down specs, cameras, battery life, and value for money to help you choose the perfect phone.',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1400&h=600&q=80&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Beauty Essentials Every Indian Woman Needs in Her Kit',
    description: 'From SPF-rich moisturizers to long-wear kajal that survives monsoon heat, we rounded up the absolute must-haves that dermatologists and beauty editors swear by.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVuEIM3U3HVOEw-b2kP2Xvs9y9xe8X6NqlMgBAd8ifwZRwrE1THhs8U_s&s=10',
  },
];

const blogList = [
  {
    title: 'The Ultimate Laptop Buying Guide 2026',
    date: 'June 28, 2026',
    category: 'Electronics',
    description: 'Choosing a laptop is harder than ever — more cores, more GPUs, more display tech. Whether you\'re a student, designer, or hardcore gamer, we have the perfect pick for you. MacBook M3 for creatives, Dell XPS 15 for professionals, ASUS ROG for gamers.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=350&q=80&auto=format&fit=crop',
  },
  {
    title: '10 Books That Will Change the Way You Think About Money',
    date: 'June 12, 2026',
    category: 'Books',
    description: 'From The Psychology of Money to Rich Dad Poor Dad — these 10 books have collectively shifted how millions think about wealth, investing, and financial freedom. We reviewed all of them, so you don\'t have to pick blindly.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=350&q=80&auto=format&fit=crop',
  },
  {
    title: 'How to Choose the Perfect Running Shoes for Indian Terrain',
    date: 'June 5, 2026',
    category: 'Footwear',
    description: 'Mumbai\'s potholed streets, Bangalore\'s uneven footpaths, Delhi\'s heat — running in India demands specific shoe features. Podiatrists share what to look for in cushioning, grip, and breathability.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=350&q=80&auto=format&fit=crop',
  },
  {
    title: 'Ethnic Wear Guide: How to Nail Festive Dressing in 2026',
    date: 'May 28, 2026',
    category: 'Fashion',
    description: 'Navratri, Diwali, weddings — India\'s festive calendar is packed. But dressing well doesn\'t have to drain your wallet. We show you how to mix Manyavar, Biba, and FabIndia to create looks that impress every time.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=350&q=80&auto=format&fit=crop',
  },
  {
    title: 'Your Complete Guide to Korean Skincare for Indian Skin Tones',
    date: 'May 20, 2026',
    category: 'Beauty',
    description: 'The 10-step Korean skincare routine isn\'t just K-pop hype. Dermatologists explain what actually works on Indian skin, which ingredients to avoid in Indian summers, and how to adapt the routine to your budget.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=350&q=80&auto=format&fit=crop',
  },
];

const categories = ['Fashion', 'Electronics', 'Beauty', 'Footwear', 'Books', 'Accessories', 'Laptops', 'Mobiles', 'Lifestyle', 'Buying Guides', 'Sale & Deals', 'New Arrivals'];

const Blogs = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);

  const prev = () => setCurrent(p => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent(p => (p + 1) % slides.length);

  const filtered = activeCategory
    ? blogList.filter(b => b.category === activeCategory)
    : blogList;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* breadcrumb */}
      <div className="bg-white border-b border-[#EAEAEA] px-4 sm:px-8 py-3 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#E63946]">Home</Link>
        <span className="mx-1.5">&gt;</span>
        <span className="text-[#E63946] font-semibold">Blog</span>
      </div>

      {/* hero carousel */}
      <div className="relative w-full h-[340px] sm:h-[420px] overflow-hidden">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-500 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 flex flex-col items-start">
              <h2 className="text-white text-xl sm:text-2xl font-bold mb-2 max-w-2xl leading-snug">{s.title}</h2>
              <p className="text-white/80 text-sm max-w-lg leading-relaxed mb-4 hidden sm:block">{s.description}</p>
              <button
                onClick={() => navigate('/view-blog', { state: { blog: slides[current] } })}
                className="px-5 py-2 bg-[#E63946] text-white font-semibold rounded-full text-sm hover:bg-[#C5303A] transition-colors"
              >
                Read More
              </button>
            </div>
          </div>
        ))}
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors">
          <ChevronLeft size={18} />
        </button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors">
          <ChevronRight size={18} />
        </button>
        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* content */}
      <div className="max-w-[1100px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        {/* articles */}
        <div className="flex-1 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-lg">Latest Posts</h2>
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="text-xs text-[#E63946] hover:underline"
              >
                Clear filter ✕
              </button>
            )}
          </div>
          {filtered.map((blog, i) => (
            <div
              key={i}
              onClick={() => navigate('/view-blog', { state: { blog } })}
              className="block cursor-pointer"
            >
              <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                <div className="sm:w-52 h-44 sm:h-auto flex-shrink-0 overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#E63946] text-xs font-semibold border border-[#E63946]/20">
                        {blog.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 leading-snug">{blog.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-3">
                      <Calendar size={12} /> {blog.date}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{blog.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#E63946] text-xs font-semibold mt-3 hover:underline">
                    Read More <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* sidebar */}
        <aside className="lg:w-56 flex-shrink-0 space-y-4">
          {/* categories */}
          <div className="bg-white rounded-xl border border-[#EAEAEA] p-5 sticky top-20">
            <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-1.5">
              <Tag size={14} className="text-[#E63946]" /> Categories
            </h4>
            <div className="space-y-1">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                  className={`flex items-center gap-2 w-full py-1.5 text-sm transition-colors text-left ${cat === activeCategory ? 'text-[#E63946] font-semibold' : 'text-gray-600 hover:text-[#E63946]'
                    }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cat === activeCategory ? 'bg-[#E63946]' : 'bg-gray-300'}`} />
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* newsletter */}
          <div className="bg-[#E63946] rounded-xl p-5 text-white">
            <h4 className="font-bold text-sm mb-1">Stay in the loop</h4>
            <p className="text-xs text-white/80 mb-3">Get the latest deals, trends, and guides straight to your inbox.</p>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-3 py-2 rounded-lg text-sm text-gray-800 bg-white focus:outline-none mb-2"
            />
            <button className="w-full py-2 bg-[#2B2D42] text-white text-sm font-semibold rounded-lg hover:bg-black transition-colors">
              Subscribe
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Blogs;
