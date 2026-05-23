import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BackToTop from '../components/layout/BackToTop';
import WhatsAppButton from '../components/layout/WhatsAppButton';
import AIAssistant from '../components/ui/AIAssistant';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Services from '../components/home/Services';
import DocumentAnalyzer from '../components/home/DocumentAnalyzer';
import WhyChooseUs from '../components/home/WhyChooseUs';
import AITools from '../components/home/AITools';
import ClientQueryForm from '../components/home/ClientQueryForm';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import Blog from '../components/home/Blog';
import CTABanner from '../components/home/CTABanner';
import Contact from '../components/home/Contact';
import { Sparkles, BarChart2, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('services');

  // Interactive Hub Tab configuration
  const tabs = [
    { 
      id: 'services', 
      label: 'Suite & Tools', 
      icon: BarChart2, 
      desc: 'Interactive compliance parser & corporate advisory services' 
    },
    { 
      id: 'booking', 
      label: 'AI Booking Desk', 
      icon: MessageSquare, 
      desc: 'Priority compliance routing & intelligent query engine' 
    },
    { 
      id: 'about', 
      label: 'Firm Credibility', 
      icon: ShieldCheck, 
      desc: 'Advisory standard of care, partner profiles & client trust' 
    },
    { 
      id: 'resources', 
      label: 'Insights & Help', 
      icon: HelpCircle, 
      desc: 'Regulatory updates, corporate FAQ grids & tax guides' 
    }
  ];

  // Flawless SPA hash listener for absolute anchor-scroll integration
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#about' || hash === '#why-choose-us' || hash === '#testimonials') {
        setActiveTab('about');
        setTimeout(() => {
          document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (hash === '#services' || hash === '#document-analyzer' || hash === '#ai-desk') {
        setActiveTab('services');
        setTimeout(() => {
          document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (hash === '#query' || hash === '#contact') {
        setActiveTab('booking');
        setTimeout(() => {
          document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (hash === '#faq' || hash === '#blog') {
        setActiveTab('resources');
        setTimeout(() => {
          document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check hash on mount for deep link handling
    if (window.location.hash) {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#fcfdfe] dark:bg-[#050b14] text-navy-950 dark:text-white transition-colors duration-300 antialiased font-sans">
      <Navbar />
      
      <main className="w-full">
        {/* Hero Section remains statically loaded at the top for premium onboarding */}
        <Hero />

        {/* ─── SIDDHANT INTERACTIVE ENTERPRISE ADVISORY SUITE ─── */}
        <section className="py-8 md:py-12 bg-white dark:bg-[#060e1b] border-t border-b border-gray-100 dark:border-navy-900 transition-colors duration-300 relative">
          <div className="max-w-6xl mx-auto px-6">
            
            {/* Dashboard Controls Bar */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 dark:bg-gold-500/10 border border-gold-200 dark:border-gold-500/20 mb-3.5">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span className="text-xs font-semibold text-gold-700 dark:text-gold-400 tracking-wider uppercase">
                  Siddhant Interactive Hub
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-display font-bold text-navy-950 dark:text-white tracking-tight">
                Corporate Advisory <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Console</span>
              </h2>
              <p className="mt-2.5 text-xs text-gray-500 dark:text-navy-300 max-w-xl mx-auto">
                Navigate our tools, advisory divisions, credentials, and legal resource center using the high-fidelity SaaS controls below.
              </p>
            </div>

            {/* Glassmorphic Tab Selector Header */}
            <div className="bg-gray-50/50 dark:bg-[#0c1624]/60 border border-gray-150 dark:border-navy-800/80 rounded-2xl p-2.5 backdrop-blur-2xl shadow-glass flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-navy-950 dark:bg-gold-500 text-white dark:text-navy-950 shadow-md font-extrabold'
                          : 'bg-white/10 dark:bg-navy-950/20 text-gray-500 dark:text-navy-300 hover:text-navy-950 dark:hover:text-white border border-transparent hover:border-gray-200 dark:hover:border-navy-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400 dark:text-navy-950' : 'text-gray-400 dark:text-navy-400'}`} />
                      <span>{tab.label}</span>
                      
                      {/* Interactive slide indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabGlow"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gold-500 dark:bg-navy-950 rounded-full"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Tab Pane Render using AnimatePresence */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {activeTab === 'services' && (
                    <div className="space-y-4">
                      {/* Suite: Services & Automated Document Scan Vetting */}
                      <Services />
                      <DocumentAnalyzer />
                      <AITools />
                    </div>
                  )}

                  {activeTab === 'booking' && (
                    <div className="space-y-4">
                      {/* Booking desk: Real-time categorizer form & Contact details */}
                      <ClientQueryForm />
                      <Contact />
                    </div>
                  )}

                  {activeTab === 'about' && (
                    <div className="space-y-4">
                      {/* Credibility: Corporate Bio, Why Choose Us, & Testimonials */}
                      <About />
                      <WhyChooseUs />
                      <Testimonials />
                    </div>
                  )}

                  {activeTab === 'resources' && (
                    <div className="space-y-4">
                      {/* Insights: Regulatory articles & FAQ directories */}
                      <FAQ />
                      <Blog />
                      <CTABanner />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

      </main>

      <Footer />
      <BackToTop />
      <WhatsAppButton />
      <AIAssistant />
    </div>
  );
}
