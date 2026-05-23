import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Upload, X, CheckCircle, Sparkles, AlertTriangle } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { categorizeQuery } from '../../lib/ai';
import { trackEvent } from '../../lib/tracking';
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

export default function ClientQueryForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const fileInputRef = useRef(null);
  const { addQuery } = useFirestore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'message') {
      if (value.trim().length > 8) {
        setAiInsights(categorizeQuery(value));
      } else {
        setAiInsights(null);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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
      const aiMeta = categorizeQuery(formData.message);

      await addQuery({
        ...formData,
        aiCategory: aiMeta.category,
        aiUrgency: aiMeta.urgency,
        aiSentiment: aiMeta.sentiment,
        submittedAt: new Date().toISOString(),
        source: 'query-form',
      }, selectedFile);

      // Log consulting lead event in timeline
      trackEvent('query_submit', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });

      toast.success(
        'Your query has been submitted successfully! We will get back to you within 24 hours.',
        { duration: 5000, icon: '✅' }
      );

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="query" className="py-20 md:py-28 bg-white dark:bg-navy-900">
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
            <Send className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-gold-700 dark:text-gold-400">
              Submit Your Query
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 dark:text-white">
            Have a Financial{' '}
            <span className="text-gold-500">Question</span>?
          </h2>
          <p className="mt-4 text-gray-600 dark:text-navy-200 max-w-2xl mx-auto">
            Submit your query below and our team will get back to you within 24
            hours.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-white dark:bg-navy-800/50 backdrop-blur-sm border border-gray-100 dark:border-navy-700/50 rounded-2xl p-8 md:p-10 shadow-glass"
          >
            {/* Full Name */}
            <div className="mb-5">
              <label htmlFor="query-fullName" className={labelClasses}>
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="query-fullName"
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
                <label htmlFor="query-email" className={labelClasses}>
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="query-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="query-phone" className={labelClasses}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="query-phone"
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
              <label htmlFor="query-service" className={labelClasses}>
                Service Required
              </label>
              <select
                id="query-service"
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
            <div className="mb-5">
              <label htmlFor="query-message" className={labelClasses}>
                Your Message <span className="text-red-400">*</span>
              </label>
              <textarea
                id="query-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your query or requirement..."
                className={`${inputClasses} resize-none`}
              />

              {/* Reactive AI Categorization & Urgency HUD */}
              <AnimatePresence>
                {aiInsights && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mt-3 p-3.5 rounded-xl border border-gold-500/20 bg-gold-500/5 backdrop-blur-md flex items-center justify-between gap-3 text-xs shadow-sm shadow-gold-500/5 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0 text-gold-500">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                      </div>
                      <div>
                        <div className="text-[10px] text-navy-400 dark:text-navy-300 font-bold uppercase tracking-wider">AI Category Vetted</div>
                        <span className="font-semibold text-navy-950 dark:text-white">{aiInsights.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 font-semibold font-mono">
                      <span className="text-[10px] text-navy-400 dark:text-navy-300 uppercase tracking-wider font-sans font-bold">Urgency:</span>
                      <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] border ${
                        aiInsights.urgency === 'high'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse'
                          : aiInsights.urgency === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          : 'bg-green-500/10 text-green-500 border-green-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          aiInsights.urgency === 'high' ? 'bg-red-500' : aiInsights.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        {aiInsights.urgency.toUpperCase()}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className={labelClasses}>Attach Document (Optional)</label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="query-file"
                />
                {!selectedFile ? (
                  <label
                    htmlFor="query-file"
                    className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-gray-200 dark:border-navy-600 rounded-xl cursor-pointer hover:border-gold-400 dark:hover:border-gold-500/50 transition-colors bg-gray-50 dark:bg-navy-700/30"
                  >
                    <Upload className="w-8 h-8 text-gray-400 dark:text-navy-400 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-navy-300">
                      Click to upload or drag file
                    </span>
                    <span className="text-xs text-gray-400 dark:text-navy-400 mt-1">
                      PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between w-full py-3 px-4 border border-green-200 dark:border-green-500/30 rounded-xl bg-green-50 dark:bg-green-500/10">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-700 dark:text-green-300 truncate max-w-xs">
                        {selectedFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
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
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Query
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
