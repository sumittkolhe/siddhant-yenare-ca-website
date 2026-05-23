import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Clock, Phone, Send } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import toast from 'react-hot-toast';

const SERVICE_OPTIONS = [
  'Income Tax Services',
  'GST Services',
  'Audit & Assurance',
  'Accounting & Bookkeeping',
  'Company / LLP Registration',
  'Business Advisory',
  'Compliance & Registrations',
  'Wealth Advisory',
  'Other',
];

const inputClasses =
  'w-full px-4 py-3 bg-gray-50 dark:bg-navy-700/50 border border-gray-200 dark:border-navy-600 rounded-xl text-navy-900 dark:text-white placeholder-gray-400 dark:placeholder-navy-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all';

const labelClasses =
  'text-sm font-medium text-navy-800 dark:text-navy-100 mb-1.5 block';

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
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Our Office',
    content:
      'Office No. 107, 1st Floor, Joy Hub, Near Nagar Parishad, Station Road, Ambernath (West) – 421501, Maharashtra',
    link: null,
  },
  {
    icon: Mail,
    title: 'Email Us',
    content: 'Info.casiddhantyenare@gmail.com',
    link: 'mailto:Info.casiddhantyenare@gmail.com',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    content: 'Monday – Saturday: 10:00 AM – 7:00 PM',
    subContent: 'Sunday: Closed',
    link: null,
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { addQuery } = useFirestore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message');
      return;
    }

    setLoading(true);
    try {
      await addQuery({
        ...formData,
        submittedAt: new Date().toISOString(),
        source: 'contact-form',
      });

      toast.success('Message sent successfully! We will respond within 24 hours.', {
        duration: 5000,
        icon: '✅',
      });

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Contact form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-gray-50 dark:bg-navy-950">
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
            <Phone className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-gold-700 dark:text-gold-400">
              Contact Us
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 dark:text-white">
            Get in{' '}
            <span className="text-gold-500">Touch</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-navy-200 max-w-2xl mx-auto">
            Have a question or need professional financial guidance? Reach out to
            us — we&apos;re here to help.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* LEFT — Contact Info */}
          <motion.div variants={itemVariants}>
            {/* Contact Cards */}
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.title}
                  className="bg-white dark:bg-navy-800/50 backdrop-blur-sm border border-gray-100 dark:border-navy-700/50 rounded-xl p-5 flex items-start gap-4 mb-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900 dark:text-white mb-1">
                      {info.title}
                    </h4>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-sm text-gray-600 dark:text-navy-200 hover:text-gold-500 dark:hover:text-gold-400 transition-colors"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600 dark:text-navy-200">
                          {info.content}
                        </p>
                        {info.subContent && (
                          <p className="text-sm text-gray-500 dark:text-navy-300 mt-0.5">
                            {info.subContent}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Google Maps */}
            <div className="rounded-xl overflow-hidden mt-4 border border-gray-100 dark:border-navy-700/50">
              <iframe
                title="Siddhant Yenare & Co. Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.123456789!2d73.1871989!3d19.2118818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEyJzQyLjgiTiA3M8KwMTEnMTMuOSJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* RIGHT — Quick Contact Form */}
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-navy-800/50 backdrop-blur-sm border border-gray-100 dark:border-navy-700/50 rounded-2xl p-8 shadow-glass">
              <h3 className="font-semibold text-xl text-navy-900 dark:text-white mb-6">
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-5">
                  <label htmlFor="contact-fullName" className={labelClasses}>
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={inputClasses}
                  />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label htmlFor="contact-email" className={labelClasses}>
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className={labelClasses}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Service */}
                <div className="mb-5">
                  <label htmlFor="contact-service" className={labelClasses}>
                    Service Required
                  </label>
                  <select
                    id="contact-service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label htmlFor="contact-message" className={labelClasses}>
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="How can we help you?"
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
