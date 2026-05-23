import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Tag,
  Sparkles,
  Smile,
} from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Pending',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  'in-progress': {
    label: 'In Progress',
    classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
};

const QueryDetail = ({ query, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState(query?.status || 'pending');
  const [notes, setNotes] = useState(query?.notes || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (query) {
      setStatus(query.status || 'pending');
      setNotes(query.notes || '');
    }
  }, [query]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const date =
      timestamp?.toDate?.() ||
      new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSave = () => {
    onUpdateStatus?.(query.id, status, notes);
    onClose?.();
  };

  if (!query) return null;

  const fields = [
    { label: 'Full Name', value: query.fullName, icon: User },
    { label: 'Email', value: query.email, icon: Mail },
    { label: 'Phone', value: query.phone, icon: Phone },
    { label: 'Service Required', value: query.service, icon: Tag },
    { label: 'Submitted On', value: formatDate(query.createdAt), icon: Calendar },
  ];

  const getUrgencyBadge = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
            <span>High 🔥</span>
          </span>
        );
      case 'low':
        return (
          <span className="px-2.5 py-0.5 rounded bg-navy-800 text-navy-300 border border-navy-750 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <span>Low ❄</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <span>Medium ⚡</span>
          </span>
        );
    }
  };

  const name = query.fullName || 'Valued Partner';
  const category = query.aiCategory || query.service || 'Compliance Services';
  const urgency = query.aiUrgency || 'medium';
  
  let greeting = `Dear ${name},\n\nThank you for reaching out to Siddhant Yenare & Co.\n\nWe have received your query regarding ${category}. Our team is reviewing the details provided.`;
  
  if (urgency === 'high') {
    greeting += ` Given the high urgency and time-sensitive nature of your compliance request, we have escalated this to our senior CA desk.`;
  }
  
  let solution = ``;
  const lowerMsg = (query.message || '').toLowerCase();
  
  if (lowerMsg.includes('gst') || lowerMsg.includes('gstr')) {
    solution = `To ensure there are no compliance gaps, we recommend compiling your GSTR-1 sales logs and GSTR-3B filings. We can assist in reconciling your Input Tax Credit (ITC) to optimize your tax outflow and avoid late fees.`;
  } else if (lowerMsg.includes('itr') || lowerMsg.includes('income tax') || lowerMsg.includes('tax planning')) {
    solution = `We can analyze your income streams to recommend the most tax-efficient regime (New vs. Old) and help maximize standard deductions. If you are subject to a tax audit under Section 44AB, we will help prepare the required financial balances.`;
  } else if (lowerMsg.includes('company') || lowerMsg.includes('register') || lowerMsg.includes('incorporat') || lowerMsg.includes('llp')) {
    solution = `Our startup desk can incorporate your entity (Private Limited or LLP) in under 7 business days, including name approval, SPICe+ filing, and obtaining your company PAN/TAN.`;
  } else {
    solution = `We are ready to assist you with comprehensive auditing, regulatory reporting, and bookkeeping to keep your business fully compliant with all active statutes.`;
  }
  
  const draftText = `${greeting}\n\n${solution}\n\nWould you be available for a brief introductory consultation call tomorrow at 11:00 AM IST to finalize the compliance roadmap?\n\nWarm regards,\n\nExecutive Desk\nSiddhant Yenare & Co.\nChartered Accountants`;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="max-w-4xl w-full bg-navy-900 border border-navy-800 rounded-2xl shadow-glass-lg overflow-hidden relative max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-navy-800 flex items-center justify-between flex-shrink-0">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              Query Intelligence Record
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-navy-800 flex items-center justify-center text-navy-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
              
              {/* Left Column: Client Details */}
              <div className="space-y-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-300 border-b border-navy-800/60 pb-2 mb-4">
                  Client Query Info
                </h4>

                {fields.map((field) => (
                  <div key={field.label}>
                    <label className="flex items-center gap-1.5 text-xs text-navy-400 uppercase tracking-wider mb-1">
                      <field.icon className="w-3.5 h-3.5" />
                      {field.label}
                    </label>
                    <p className="text-white text-sm font-semibold">{field.value || '—'}</p>
                  </div>
                ))}

                {/* Message */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-navy-400 uppercase tracking-wider mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    Message
                  </label>
                  <p className="text-white text-sm leading-relaxed bg-navy-950/60 rounded-xl p-4 border border-navy-800/80 max-h-[160px] overflow-y-auto scrollbar-thin">
                    {query.message || 'No message provided.'}
                  </p>
                </div>

                {/* File Download */}
                {query.fileUrl && (
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-navy-450 tracking-wider mb-1.5">
                      Attachment File
                    </label>
                    <a
                      href={query.fileUrl}
                      download={query.fileName || 'attachment'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-navy-950/60 border border-navy-800 rounded-xl px-4 py-2.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-navy-800/50 transition-all font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Download: {query.fileName || 'Attachment'}
                    </a>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-navy-400 uppercase tracking-wider mb-2">
                    Query Status
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setStatus(key)}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                          status === key
                            ? config.classes + ' ring-1 ring-current bg-white/5 font-bold'
                            : 'border-navy-800 bg-navy-950/40 text-navy-400 hover:border-navy-700 hover:text-white'
                        }`}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-navy-400 uppercase tracking-wider mb-2">
                    Internal Admin Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal compliance notes about this query..."
                    rows={3}
                    className="w-full px-4 py-3 bg-navy-950/60 border border-navy-800 rounded-xl text-white text-sm placeholder-navy-500 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Right Column: AI Compliance & Draft Assistant */}
              <div className="space-y-6 md:border-l md:border-navy-800 md:pl-8">
                <div className="flex items-center gap-2 border-b border-navy-800 pb-2 mb-4">
                  <Sparkles className="w-4 h-4 text-gold-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400">
                    Siddhant AI Assistant Panel
                  </h4>
                </div>

                {/* AI Classification & Sentiment Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-navy-950/60 rounded-xl border border-navy-800/80">
                    <span className="text-[9px] uppercase font-bold text-navy-400 block mb-1">
                      AI Categorized Area
                    </span>
                    <strong className="text-white text-xs font-semibold font-mono">
                      {query.aiCategory || 'Compliance Services'}
                    </strong>
                  </div>

                  <div className="p-3.5 bg-navy-950/60 rounded-xl border border-navy-800/80">
                    <span className="text-[9px] uppercase font-bold text-navy-400 block mb-1">
                      Urgency Rating
                    </span>
                    <div className="flex items-center mt-0.5">
                      {getUrgencyBadge(query.aiUrgency)}
                    </div>
                  </div>

                  <div className="p-3.5 bg-navy-950/60 rounded-xl border border-navy-800/80 col-span-2">
                    <span className="text-[9px] uppercase font-bold text-navy-400 block mb-1">
                      Client Sentiment Index
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold uppercase flex items-center gap-1.5 ${
                        query.aiSentiment === 'positive'
                          ? 'text-green-400'
                          : query.aiSentiment === 'negative'
                          ? 'text-red-400'
                          : 'text-navy-300'
                      }`}>
                        <Smile className="w-4 h-4" />
                        {query.aiSentiment || 'Neutral'}
                      </span>
                      <span className="text-[10px] text-navy-400 font-sans">
                        ({query.aiSentiment === 'positive' ? 'High intent callback target' : query.aiSentiment === 'negative' ? 'Discrepancy / late filing alert' : 'Informational request'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Copy Draft Reply Assistant */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold text-navy-300 tracking-wider">
                      Auto-Drafted Client Response
                    </label>
                    <button
                      onClick={handleCopyDraft}
                      className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-gold-500/5 px-2.5 py-1 rounded-lg border border-gold-500/10"
                    >
                      {copied ? 'Copied! ✓' : 'Copy Response 📋'}
                    </button>
                  </div>
                  <pre className="text-xs text-navy-200 leading-relaxed font-sans bg-navy-950/80 rounded-xl p-4 border border-navy-800/80 max-h-[220px] overflow-y-auto whitespace-pre-wrap select-all scrollbar-thin">
                    {draftText}
                  </pre>
                  <p className="text-[9px] text-navy-500 italic text-center">
                    AI generated response draft based on client intent. Copy and use in your email replies.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-navy-800 flex justify-end gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="bg-navy-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-navy-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QueryDetail;
