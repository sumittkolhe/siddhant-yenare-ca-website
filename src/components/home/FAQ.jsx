import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../../data/faq';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-gray-50 dark:bg-navy-950">
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
            <ChevronDown className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-gold-700 dark:text-gold-400">
              FAQs
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 dark:text-white">
            Frequently Asked{' '}
            <span className="text-gold-500">Questions</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-navy-200 max-w-2xl mx-auto">
            Find answers to common queries about our services, processes, and
            how we can help you.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`bg-white dark:bg-navy-800/50 border rounded-xl mb-3 overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'border-gray-100 dark:border-navy-700/50 border-l-2 border-l-gold-500'
                    : 'border-gray-100 dark:border-navy-700/50'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-navy-900 dark:text-white font-medium pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-500 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 text-gray-600 dark:text-navy-200 text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
