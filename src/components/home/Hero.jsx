import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, MessageSquareCode, CalendarDays, ArrowUpRight, TrendingUp, CheckCircle, Activity } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import caHeroIllustration from '../../assets/ca_hero_illustration.png';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const stats = [
  { end: 1500, suffix: '+', label: 'Clients Served' },
  { end: 25000, suffix: '+', label: 'GST Filings Completed' },
  { end: 10, suffix: '+', label: 'Years of Experience' },
  { end: 10, suffix: ' Min', label: 'Avg. Response Time', prefix: '< ' },
];

function StatItem({ end, suffix, label, prefix = '' }) {
  const { ref: revealRef, isVisible } = useScrollReveal({ threshold: 0.3 });
  const count = useCountUp(end, 2000, isVisible);

  return (
    <div ref={revealRef} className="text-center flex-1">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300 bg-clip-text text-transparent font-display">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs md:text-sm text-navy-200 mt-1.5 font-medium tracking-wide">{label}</div>
    </div>
  );
}

export default function Hero() {
  const triggerAIChat = () => {
    // Dispatch custom event to open the chat drawer
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#050b14] pt-24"
    >
      {/* ─── Premium Animated Mesh Background ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Shifting radial gradients */}
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-gold-500/10 to-transparent blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[40%] -right-[15%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-navy-500/15 to-transparent blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[55%] h-[55%] rounded-full bg-gradient-to-tr from-gold-500/5 via-navy-800/10 to-transparent blur-[140px]" />
        
        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex-1 flex flex-col justify-center lg:grid lg:grid-cols-12 lg:gap-12 py-12 md:py-20">
        
        {/* Left column: Text content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left"
        >
          {/* AI Active Badge */}
          <motion.div variants={itemVariants} className="flex justify-center lg:justify-start mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
              <Sparkles className="w-4 h-4 text-gold-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                AI-Powered Compliance Hub
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight"
          >
            Smart Financial & Tax Solutions
            <br />
            <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300 bg-clip-text text-transparent font-medium">
              for Individuals & Businesses
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-base sm:text-lg text-navy-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
          >
            Expert CA services including Tax Planning, GST, Auditing, Financial Advisory, and Business Compliance.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <a
              href="#query"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 font-bold rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 cursor-pointer"
            >
              <CalendarDays className="w-5 h-5" />
              Book Consultation
            </a>
            <button
              onClick={triggerAIChat}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/15 hover:border-white/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <MessageSquareCode className="w-5 h-5 text-gold-400" />
              Chat with AI Assistant
            </button>
          </motion.div>
        </motion.div>

        {/* Right column: Premium 3D CA Illustration & Floating Analytics Widgets */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-center items-center relative mt-12 lg:mt-0">
          {/* Main Visual Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-[95%] xl:w-full aspect-[4/3] rounded-3xl border border-white/10 bg-gradient-to-br from-navy-900/60 to-navy-950/40 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            {/* 3D Generated Corporate Illustration */}
            <motion.img
              src={caHeroIllustration}
              alt="Chartered Accountancy & Tax solutions illustration"
              className="w-full h-full object-cover rounded-2xl opacity-85 select-none pointer-events-none"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            />

            {/* Subtle Gradient Glow Layer overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent rounded-3xl" />

            {/* floating tiny card: Tax Shield */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-3 -right-3 bg-gradient-to-br from-[#0c1c30]/90 to-[#060f1c]/90 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-lg flex items-center gap-2 max-w-[170px] z-20"
            >
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <div className="text-[10px] text-navy-300 uppercase font-bold tracking-wider leading-none font-sans">Tax Shield</div>
                <span className="text-xs text-white font-bold font-mono">Active</span>
              </div>
            </motion.div>

            {/* floating tiny card: ITC Optimized */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-3 -left-3 bg-gradient-to-br from-[#0c1c30]/90 to-[#060f1c]/90 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-lg flex items-center gap-2 max-w-[175px] z-20"
            >
              <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <div className="text-[10px] text-navy-300 uppercase font-bold tracking-wider leading-none font-sans">ITC Optimized</div>
                <span className="text-xs text-white font-bold font-mono">+₹4.2L Saved</span>
              </div>
            </motion.div>

            {/* Live compliance scan active overlay */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-4 right-4 bg-navy-900/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 shadow-md z-20"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-white font-semibold font-mono tracking-wide">GST LIVE 99.8%</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 mt-12"
      >
        <div className="bg-gradient-to-br from-[#091424] to-[#040a12] backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/15">
            {stats.map((stat, idx) => (
              <div key={stat.label} className={`flex items-center pt-6 md:pt-0 ${idx % 2 === 0 ? '' : 'pl-0 md:pl-2'}`}>
                <StatItem
                  end={stat.end}
                  suffix={stat.suffix}
                  label={stat.label}
                  prefix={stat.prefix}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ICAI Reg Badge */}
      <div className="pb-8 text-center text-xs text-navy-400 relative z-10 flex items-center gap-2 font-mono justify-center">
        <Shield className="w-4 h-4 text-gold-500" />
        <span>FRN: 158865W · Registered with the Institute of Chartered Accountants of India (ICAI)</span>
      </div>
    </section>
  );
}
