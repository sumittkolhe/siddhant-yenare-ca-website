import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-gold-500/5 blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Ready to Take Control of Your{' '}
            <span className="text-gold-400">Finances</span>?
          </h2>
          <p className="text-navy-200 mt-4 text-lg">
            Let us handle the numbers while you focus on growing your business.
            Get in touch today for a free initial consultation.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919999999999"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            <a
              href="mailto:Info.casiddhantyenare@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
