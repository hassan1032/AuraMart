import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Award, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ApiUrl } from '../../utils/api';

const FALLBACK_SLIDES = [
  {
    image:        '/images/hero1.jpg',
    eyebrow:      '✦ New Collection 2025',
    title:        'Elegant Occasion Wear\nFor Every Moment',
    subtitle:     'Premium handcrafted dresses for every special celebration in your life',
    cta:          'Explore Collection',
    ctaSecondary: 'View Accessories',
    to:           '/collections',
  },
  {
    image:        '/images/hero1.jpg',
    eyebrow:      '✦ Bestseller',
    title:        'Timeless Designs\nFor Special Days',
    subtitle:     'Exquisite fabrics, impeccable craftsmanship, and styles for every occasion',
    cta:          'Shop Now',
    ctaSecondary: 'All Collections',
    to:           '/collections',
  },
];

const FEATURES = [
  { Icon: Award,    label: 'Premium Quality' },
  { Icon: Sparkles, label: 'Handcrafted' },
  { Icon: Truck,    label: 'Free Delivery' },
];

export default function HeroSection() {
  const [slides,  setSlides]  = useState(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    axios.get(ApiUrl.getAllBanners)
      .then(res => {
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data
            .filter(b => b.status !== 'inactive')
            .map(b => ({
              image:        b.image || b.bannerImage || b.thumbnail || '/images/hero1.jpg',
              eyebrow:      b.tag || b.eyebrow || '✦ AuraMart',
              title:        b.title || 'AuraMart\nCollections',
              subtitle:     b.description || b.subtitle || 'Discover our premium collections',
              cta:          b.ctaText || b.buttonText || 'Explore Now',
              ctaSecondary: 'View All',
              to:           b.link || b.ctaLink || '/collections',
            }));
          if (mapped.length > 0) setSlides(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const goTo = useCallback((idx) => setCurrent(idx), []);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, slides.length, goTo]);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-950"
      style={{ minHeight: 'clamp(460px, 88vh, 720px)' }}
    >
      {/* Background */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
      <div className="absolute -left-24 top-0 w-[500px] h-[500px] bg-[#E63946]/20 rounded-full blur-[130px] pointer-events-none" />

      {/* Slide counter */}
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 z-10">
        {current + 1} / {slides.length}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-6 sm:px-12 lg:px-24" style={{ minHeight: 'inherit' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current + '-content'}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="max-w-[560px] py-16"
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 bg-[#E63946] text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg shadow-red-900/30"
            >
              {slide.eyebrow}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="font-extrabold text-white leading-[1.08] mb-5 tracking-tight"
              style={{ fontSize: 'clamp(2.1rem, 5.5vw, 4rem)' }}
            >
              {slide.title.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.32, duration: 0.5 }}
              className="origin-left h-1 w-20 rounded-full mb-5"
              style={{ background: 'linear-gradient(to right, #E63946, #F4A261)' }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="text-white/80 leading-relaxed mb-9"
              style={{ fontSize: 'clamp(0.9rem, 1.7vw, 1.1rem)' }}
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link
                to={slide.to}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#E63946] hover:bg-[#C5303A] text-white font-bold text-sm rounded-2xl shadow-xl shadow-red-900/40 transition-all duration-200 hover:-translate-y-0.5"
              >
                {slide.cta}
                <ChevronRight size={16} />
              </Link>
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-sm rounded-2xl border border-white/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                {slide.ctaSecondary}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.56 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              {FEATURES.map(({ Icon, label }, i) => (
                <div key={label} className="flex items-center gap-1.5 text-white/65 text-xs font-medium">
                  {i > 0 && <span className="text-white/20 -ml-1.5 mr-1.5 hidden sm:inline">|</span>}
                  <Icon size={13} className="text-[#F4A261] flex-shrink-0" />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`border-0 cursor-pointer rounded-full transition-all duration-300 ${
              i === current ? 'w-9 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/35 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
