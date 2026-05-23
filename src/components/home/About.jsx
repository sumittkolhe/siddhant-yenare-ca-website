import { motion } from 'framer-motion';
import {
  Building2,
  GraduationCap,
  Target,
  Handshake,
  Lightbulb,
  Clock,
  Users,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
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

const cards = [
  {
    icon: Building2,
    title: 'The Firm',
    span: true,
    content:
      'Siddhant Yenare & Co. is a professionally managed Chartered Accountancy firm based in Ambernath, Maharashtra. Registered with the Institute of Chartered Accountants of India (ICAI) under FRN 158865W, we provide a comprehensive range of financial services including taxation, audit & assurance, accounting, business advisory, and compliance services. Our firm is built on the principles of integrity, professionalism, and client-centric service delivery, catering to individuals, small businesses, MSMEs, and growing enterprises.',
  },
  {
    icon: GraduationCap,
    title: 'The Proprietor',
    content:
      'CA Siddhant Yenare, the founder and proprietor, is a qualified Chartered Accountant with deep expertise in direct & indirect taxation, statutory audits, and financial advisory. With a passion for empowering businesses and individuals with sound financial guidance, he leads the firm with a hands-on approach — ensuring every client receives personalized attention and expert solutions tailored to their unique needs.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    content:
      'To simplify finance for our clients by delivering accurate, timely, and transparent professional services. We strive to be a trusted financial partner that helps businesses grow, stay compliant, and make informed decisions — while maintaining the highest standards of ethics and quality.',
  },
];

const values = [
  {
    icon: Handshake,
    title: 'Integrity',
    desc: 'Unwavering commitment to ethical practices and transparency in every engagement.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'Leveraging modern tools and technology to deliver efficient, cutting-edge solutions.',
  },
  {
    icon: Clock,
    title: 'Timeliness',
    desc: 'Meeting every deadline with precision — because your compliance cannot wait.',
  },
  {
    icon: Users,
    title: 'Client Focus',
    desc: 'Your goals are our priority. We listen, understand, and deliver results that matter.',
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-gray-50 dark:bg-navy-950">
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
            <Building2 className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-gold-700 dark:text-gold-400">
              About Us
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 dark:text-white">
            Built on{' '}
            <span className="text-gold-500">Trust</span>, Driven by{' '}
            <span className="text-gold-500">Expertise</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-navy-200 max-w-2xl mx-auto">
            A professionally managed CA firm committed to delivering excellence
            in every financial service we offer.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={itemVariants}
                className={`bg-white dark:bg-navy-800/50 backdrop-blur-sm border border-gray-100 dark:border-navy-700/50 rounded-2xl p-8 shadow-glass ${
                  card.span ? 'lg:col-span-2' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gold-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-900 dark:text-white">
                    {card.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-navy-200 leading-relaxed">
                  {card.content}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Values Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-2xl p-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">{value.title}</h4>
                  <p className="text-navy-200 text-sm">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
