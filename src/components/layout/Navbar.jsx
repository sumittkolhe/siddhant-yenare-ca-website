import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.replace('#', ''));
    const observers = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = useCallback(
    (e, href) => {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    },
    []
  );

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, staggerChildren: 0.05 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const mobileLinkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 dark:bg-navy-950/80 backdrop-blur-xl shadow-sm border-b border-gray-100/50 dark:border-navy-800/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-gold/20 shadow-lg group-hover:shadow-gold/40 transition-shadow">
              <Landmark className="w-5 h-5 text-navy-950" />
            </div>
            <div>
              <div className="font-semibold text-navy-900 dark:text-white text-sm leading-tight">
                Siddhant Yenare & Co.
              </div>
              <div className="text-xs text-gold-500 leading-tight">
                Chartered Accountants
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-gold-500'
                      : 'text-navy-700 dark:text-navy-200 hover:text-gold-500'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-navy-700 dark:text-navy-200 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* CTA Button */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="hidden lg:block bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-gold-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Book Consultation
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-0.5 bg-navy-900 dark:bg-white rounded-full transition-all duration-300 ${
                  mobileMenuOpen
                    ? 'rotate-45 translate-y-2'
                    : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-navy-900 dark:bg-white rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 scale-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-navy-900 dark:bg-white rounded-full transition-all duration-300 ${
                  mobileMenuOpen
                    ? '-rotate-45 -translate-y-2'
                    : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 top-20 bg-white dark:bg-navy-950 z-40 lg:hidden overflow-y-auto"
          >
            <div className="p-6 space-y-2">
              {navLinks.map((link) => {
                const sectionId = link.href.replace('#', '');
                const isActive = activeSection === sectionId;
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    variants={mobileLinkVariants}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`block text-lg font-medium py-3 px-4 rounded-xl transition-all ${
                      isActive
                        ? 'text-gold-500 bg-gold-50 dark:bg-gold-500/10'
                        : 'text-navy-700 dark:text-navy-200 hover:bg-gray-50 dark:hover:bg-navy-800'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                );
              })}
              <motion.div variants={mobileLinkVariants} className="pt-4">
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="block text-center bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-base px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-gold-500/25 transition-all"
                >
                  Book Consultation
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
