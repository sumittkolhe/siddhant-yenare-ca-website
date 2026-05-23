import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Headset, Zap, Coins, Timer, Scale } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const stats = [
  { end: 500, suffix: '+', label: 'Clients Served' },
  { end: 10, suffix: '+', label: 'Years of Experience' },
  { end: 1000, suffix: '+', label: 'Successful Filings' },
  { value: '24hrs', label: 'Response Time' },
];

const reasons = [
  {
    num: '01',
    icon: ShieldCheck,
    title: 'ICAI Registered Firm',
    desc: 'Fully registered with the Institute of Chartered Accountants of India (ICAI) under FRN 158865W, ensuring the highest professional standards.',
  },
  {
    num: '02',
    icon: Headset,
    title: 'Personal Attention',
    desc: 'Unlike large firms, we provide dedicated, personalized service to every client — ensuring your concerns are heard and addressed promptly.',
  },
  {
    num: '03',
    icon: Zap,
    title: 'Technology Driven',
    desc: 'Modern accounting tools and cloud-based solutions for seamless, efficient, and accurate financial management.',
  },
  {
    num: '04',
    icon: Coins,
    title: 'Transparent Pricing',
    desc: 'No hidden fees or surprises. We believe in clear, upfront pricing so you know exactly what you are paying for.',
  },
  {
    num: '05',
    icon: Timer,
    title: 'Deadline Commitment',
    desc: 'Every compliance deadline is treated with urgency. We ensure timely filings and submissions, every single time.',
  },
  {
    num: '06',
    icon: Scale,
    title: 'End-to-End Solutions',
    desc: 'From incorporation to compliance, audit to advisory — we provide comprehensive solutions under one roof.',
  },
];

function AnimatedStat({ end, suffix, label, value }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 });
  const count = useCountUp(end || 0, 2000, isVisible);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold text-gold-400 font-display">
        {value ? value : `${count}${suffix}`}
      </div>
      <div className="text-sm text-navy-200 mt-1">{label}</div>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-20 md:py-28 bg-gray-50 dark:bg-navy-950">
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
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-gold-700 dark:text-gold-400">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 dark:text-white">
            What Sets Us{' '}
            <span className="text-gold-500">Apart</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-navy-200 max-w-2xl mx-auto">
            Discover why hundreds of clients trust Siddhant Yenare & Co. for
            their financial needs.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 rounded-2xl p-8 mb-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
            ))}
          </div>
        </motion.div>

        {/* Reason Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.num}
                variants={itemVariants}
                className="relative bg-white dark:bg-navy-800/50 backdrop-blur-sm border border-gray-100 dark:border-navy-700/50 rounded-2xl p-6 shadow-glass"
              >
                {/* Number Badge */}
                <span className="absolute top-4 right-4 text-5xl font-bold text-navy-100/50 dark:text-navy-700/30 font-display select-none">
                  {reason.num}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-gold-500" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-navy-200">
                  {reason.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
