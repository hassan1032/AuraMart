import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Star, Shield, Truck } from 'lucide-react';

const PILLARS = [
  { Icon: Heart,  title: 'Crafted with Love',    desc: 'Every piece is thoughtfully designed and made with the finest materials for lasting quality.' },
  { Icon: Star,   title: 'Premium Quality',       desc: 'We source only the best fabrics and trims, ensuring each garment meets our exacting standards.' },
  { Icon: Shield, title: 'Trusted by Thousands',  desc: 'Over 10,000 happy customers across India trust AuraMart for their most special occasions.' },
  { Icon: Truck,  title: 'Delivered to Your Door', desc: 'Free delivery across all of India — your orders arrive safely and on time, every time.' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero */}
      <div className="bg-[#E63946] py-12 text-center px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">About AuraMart</h1>
        <p className="text-blue-200 text-sm max-w-lg mx-auto">Our story, our passion, our craft</p>
      </div>

      {/* Story section */}
      <div className="max-w-[1000px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-14">
          <div>
            <div className="w-12 h-1 bg-[#E63946] rounded mb-5" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Where Elegance Meets Indian Fashion
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              AuraMart was born from a simple belief: every occasion deserves something beautiful.
              Founded in Mumbai, we curate and craft premium occasion wear — from festive lehengas
              to elegant gowns — bringing timeless style to doorsteps across India.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Our collection spans weddings, festivals, parties, and everyday celebrations. Each
              piece is selected for quality, comfort, and that unmistakable wow factor. We work
              directly with skilled artisans across India to bring you styles that honour traditional
              craftsmanship while embracing modern aesthetics.
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E63946] hover:bg-[#C5303A] text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Explore Collections
            </Link>
          </div>

          {/* Images — overlapping card layout */}
          <div className="relative h-[420px] hidden md:block">
            <motion.div
              whileHover={{ y: -4 }}
              className="absolute top-0 left-0 w-[190px] h-[270px] rounded-2xl overflow-hidden shadow-lg z-20"
            >
              <img src="/images/col2.webp" alt="AuraMart fashion" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="absolute top-28 left-[130px] w-[260px] h-[360px] rounded-2xl overflow-hidden shadow-xl z-10"
            >
              <img src="/images/col5.webp" alt="AuraMart collection" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Mobile: stacked */}
          <div className="flex gap-3 md:hidden">
            <div className="flex-1 rounded-xl overflow-hidden aspect-[3/4]">
              <img src="/images/col2.webp" alt="AuraMart fashion" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 rounded-xl overflow-hidden aspect-[3/4]">
              <img src="/images/col5.webp" alt="AuraMart collection" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map(({ Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-[#EAEAEA] p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FFF1F1] flex items-center justify-center mx-auto mb-3">
                <Icon size={20} className="text-[#E63946]" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-2">{title}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="mt-10 bg-gradient-to-br from-[#E63946] to-[#C5303A] rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-3">Our Mission</h3>
          <p className="text-white/85 text-sm leading-relaxed max-w-2xl mx-auto">
            To make premium occasion wear accessible to every Indian family — celebrating the moments
            that matter most with clothes as special as the memories you create.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 bg-white text-[#E63946] font-bold rounded-xl text-sm hover:bg-[#FAF7F2] transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
