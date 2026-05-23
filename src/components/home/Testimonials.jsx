import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

function StarRating({ rating = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'fill-gold-400 text-gold-400'
              : 'fill-gray-200 text-gray-200 dark:fill-navy-600 dark:text-navy-600'
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, isActive }) {
  return (
    <div
      className={`bg-white dark:bg-navy-800/50 backdrop-blur-sm border rounded-2xl p-8 shadow-glass transition-all duration-300 ${
        isActive
          ? 'border-gold-300 dark:border-gold-500/30 scale-105 shadow-glass-lg'
          : 'border-gray-100 dark:border-navy-700/50 opacity-70'
      }`}
    >
      <Quote className="w-8 h-8 text-gold-400/30 mb-4" />
      <StarRating rating={testimonial.rating} />
      <p className="text-gray-600 dark:text-navy-200 italic leading-relaxed mt-4 mb-6">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 font-semibold text-sm flex-shrink-0">
          {testimonial.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </div>
        <div>
          <p className="font-semibold text-navy-900 dark:text-white">
            {testimonial.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-navy-300">
            {testimonial.role}
            {testimonial.location ? `, ${testimonial.location}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = testimonials.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const goToSlide = (idx) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  };

  // Get visible testimonials (3 on desktop, centered on activeIndex)
  const getVisibleIndices = () => {
    const indices = [];
    for (let i = -1; i <= 1; i++) {
      indices.push((activeIndex + i + totalSlides) % totalSlides);
    }
    return indices;
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 bg-white dark:bg-navy-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 dark:bg-gold-500/10 border border-gold-200 dark:border-gold-500/20 mb-4">
            <Star className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-gold-700 dark:text-gold-400">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 dark:text-white">
            What Our{' '}
            <span className="text-gold-500">Clients Say</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-navy-200 max-w-2xl mx-auto">
            Hear from the businesses and individuals who trust us with their
            financial well-being.
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Desktop: show 3 cards */}
          <div className="hidden md:grid grid-cols-3 gap-6 mb-8">
            {visibleIndices.map((idx) => (
              <TestimonialCard
                key={`${idx}-${testimonials[idx].name}`}
                testimonial={testimonials[idx]}
                isActive={idx === activeIndex}
              />
            ))}
          </div>

          {/* Mobile: show 1 card with animation */}
          <div className="md:hidden relative overflow-hidden mb-8">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <TestimonialCard
                  testimonial={testimonials[activeIndex]}
                  isActive={true}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? 'bg-gold-500 w-8'
                    : 'bg-gray-300 dark:bg-navy-600 hover:bg-gray-400 dark:hover:bg-navy-500'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
