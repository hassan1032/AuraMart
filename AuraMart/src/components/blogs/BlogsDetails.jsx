import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Share2, Calendar, Tag, ArrowLeft, ArrowRight } from 'lucide-react';

const relatedBlogs = [
  {
    title: 'The Ultimate Laptop Buying Guide 2026',
    date: 'June 28, 2026',
    category: 'Electronics',
    description: 'Choosing a laptop is harder than ever — more cores, more GPUs, more display tech.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=350&q=80&auto=format&fit=crop',
  },
  {
    title: 'Your Complete Guide to Korean Skincare for Indian Skin Tones',
    date: 'May 20, 2026',
    category: 'Beauty',
    description: 'Dermatologists explain what actually works on Indian skin in Indian summers.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=350&q=80&auto=format&fit=crop',
  },
  {
    title: 'Ethnic Wear Guide: How to Nail Festive Dressing in 2026',
    date: 'May 28, 2026',
    category: 'Fashion',
    description: 'Mix Manyavar, Biba, and FabIndia to create looks that impress every time.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=350&q=80&auto=format&fit=crop',
  },
];

const BlogsDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const blog = state?.blog;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* breadcrumb */}
      <div className="bg-white border-b border-[#EAEAEA] px-4 sm:px-8 py-3 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#E63946]">Home</Link>
        <span className="mx-1.5">&gt;</span>
        <Link to="/blogs" className="hover:text-[#E63946]">Blogs</Link>
        <span className="mx-1.5">&gt;</span>
        <span className="text-[#E63946] font-semibold line-clamp-1">{blog?.title || 'Blog Detail'}</span>
      </div>

      <div className="max-w-[860px] mx-auto px-4 py-8">

        {/* No state fallback */}
        {!blog && (
          <div className="bg-white rounded-xl border border-[#EAEAEA] py-20 text-center mb-6">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Blog not found</h3>
            <p className="text-[#6B7280] text-sm mb-5">Please go back and click Read More on a blog post.</p>
            <button
              onClick={() => navigate('/blogs')}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#E63946] text-white rounded-lg text-sm font-semibold hover:bg-[#c0303b] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Blogs
            </button>
          </div>
        )}

        {/* Blog detail */}
        {blog && (
          <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden mb-6">
            {/* hero image */}
            <div className="w-full h-[280px] sm:h-[360px] overflow-hidden">
              <img
                src={blog.image || '/images/col1.webp'}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = '/images/col1.webp'; }}
              />
            </div>

            <div className="p-6">
              {blog.category && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#E63946] text-xs font-semibold border border-[#E63946]/20 mb-3">
                  {blog.category}
                </span>
              )}

              <h1 className="text-2xl font-bold text-gray-800 mb-3">{blog.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-5">
                {blog.date && (
                  <span className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <Calendar size={13} /> {blog.date}
                  </span>
                )}
                {blog.category && (
                  <span className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <Tag size={13} /> {blog.category}
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-600 leading-relaxed space-y-4">
                {blog.description
                  ? blog.description.split('\n').filter(p => p.trim()).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  : null
                }
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
                  onClick={() => navigate('/blogs')}
                  className="ml-auto flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#E63946] transition-colors"
                >
                  <ArrowLeft size={12} /> All Blogs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* You might also like */}
        <div>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-3">
            <span className="flex-1 h-px bg-[#EAEAEA]" />
            You might also like
            <span className="flex-1 h-px bg-[#EAEAEA]" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedBlogs
              .filter(b => b.title !== blog?.title)
              .slice(0, 3)
              .map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate('/view-blog', { state: { blog: item } })}
                  className="block cursor-pointer"
                >
                  <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={e => { e.target.src = '/images/col1.webp'; }}
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-[#6B7280]">{item.category}</span>
                      <h3 className="font-bold text-gray-800 text-sm mt-1 mb-1 line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-1 text-[#E63946] text-xs font-semibold mt-3 hover:underline">
                        Read More <ArrowRight size={11} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsDetails;
