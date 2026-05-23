import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, Sparkles, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { services } from '../../data/services';
import { trackEvent } from '../../lib/tracking';

// Complete document checklists and compliance process mappings for all services
const serviceDetailsMapping = {
  'income-tax': {
    process: ['1. Submission of Form 16 / Salary Certificates', '2. Income deductions & asset allocation planning', '3. Preliminary computation draft generation', '4. E-verification & ITR receipt sharing'],
    documents: ['PAN Card & Aadhaar Card', 'Form 16 / Form 16A from employer', 'Form 26AS & Annual Information Statement (AIS)', 'Investment proofs (80C, 80D, Housing loan, etc.)', 'Bank statements for all accounts'],
  },
  'gst': {
    process: ['1. GSTIN registration / invoice compilation', '2. Purchase register reconciliation with GSTR-2B', '3. Monthly/Quarterly Return filing (GSTR-1, 3B)', '4. Reconciliation audit & annual return compliance (GSTR-9)'],
    documents: ['PAN Card of business & owners', 'Aadhaar of proprietor / authorized signatory', 'Business Address Proof (Electricity bill / rent agreement)', 'Bank account cancelled cheque', 'List of HSN / SAC codes'],
  },
  'audit': {
    process: ['1. Pre-engagement audit scoping and planning', '2. Field work, ledger check, & transaction audit trails', '3. Finding disclosure meetings with management', '4. Signing and uploading of statutory tax audit report'],
    documents: ['Trial Balance, General Ledgers, & Balance Sheet', 'Bank Reconciliation statements', 'Invoices for purchases & sales ledgers', 'Previous year Tax Audit report', 'Director / Partner minutes log book'],
  },
  'accounting': {
    process: ['1. Monthly bank statement ingestion', '2. Chart of accounts creation & categorization', '3. Payroll, TDS, & Professional Tax compliance', '4. Financial statement & monthly MIS delivery'],
    documents: ['Bank statements in Excel/PDF', 'Purchase & sales registers', 'Employee attendance & wage registers', 'TDS deduction logs', 'Cash expense vouchers'],
  },
  'company': {
    process: ['1. Director Digital Signature (DSC) issuance', '2. Unique Name reservation via MCA SPICe+', '3. Drafting Memorandum (MoA) & Articles (AoA)', '4. Certificate of Incorporation & PAN/TAN issuance'],
    documents: ['PAN & Aadhaar of all Directors/Partners', 'Voter ID / Passport of promoters', 'Latest bank statement (address proof of directors)', 'Registered office utility bill', 'NOC from property owner'],
  },
  'advisory': {
    process: ['1. Discovery consultation call', '2. Business projections & capital forecasting', '3. Funding readiness & presentation deck planning', '4. Structured growth review audits'],
    documents: ['3 years audited financials (if applicable)', 'Current business project report', 'Asset list & valuation estimates', 'Proposed business plan draft', 'Company PAN & KYC'],
  },
  'compliance': {
    process: ['1. Regulatory registration vetting', '2. MSME / Import Export portal filing', '3. Profile creation and government validation', '4. License issuance & framing'],
    documents: ['Proprietor / Entity PAN & Aadhaar', 'Active Mobile linked to Aadhaar (for OTP)', 'Cancelled Cheque', 'Partnership deed / Incorporation letter'],
  },
  'wealth': {
    process: ['1. Asset under management (AUM) review', '2. Short & long-term capital gains planning', '3. Tax-efficient reinvestment routes audit', '4. Family succession trust planning'],
    documents: ['Mutual fund / stock ledger reports', 'Property purchase deeds (for capital gains)', 'Existing insurance policies', 'PAN and active tax assessment filings'],
  },
};

export default function Services() {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (serviceId) => {
    if (expandedCard === serviceId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(serviceId);
      trackEvent('service_view', serviceId);
    }
  };

  const handleAnalyzeClick = (e) => {
    e.stopPropagation(); // prevent card toggling
    trackEvent('click', 'Navigate to Document Analyzer');
    const target = document.querySelector('#document-analyzer');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-[#fafbfc] dark:bg-[#070e17] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 dark:bg-gold-500/10 border border-gold-200 dark:border-gold-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
            <span className="text-sm font-semibold text-gold-700 dark:text-gold-400">
              Siddhant Suite of Services
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-navy-950 dark:text-white">
            Futuristic <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">Financial Consulting</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-navy-200 max-w-2xl mx-auto text-base">
            Click on any card to explore the full compliance pipeline, review mandatory documents, or run an automated compliance scan.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            const isExpanded = expandedCard === service.id;
            const details = serviceDetailsMapping[service.id] || { process: [], documents: [] };

            return (
              <motion.div
                key={service.id}
                layout
                onClick={() => handleCardClick(service.id)}
                className={`group relative bg-white dark:bg-[#0c1624] border ${
                  isExpanded
                    ? 'border-gold-500/50 shadow-[0_10px_30px_rgba(212,175,55,0.15)] md:col-span-2 lg:col-span-3 xl:col-span-4'
                    : 'border-gray-200/60 dark:border-navy-800 hover:border-gold-500/40 hover:shadow-[0_10px_25px_rgba(212,175,55,0.08)]'
                } rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col`}
              >
                {/* Glow border background top line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Primary Card View (Icon + Title + Brief description) */}
                <div className={`flex flex-col ${isExpanded ? 'lg:flex-row lg:items-start lg:gap-8' : ''}`}>
                  {/* Left component block */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      {/* Service Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center border border-gold-500/20 group-hover:bg-gold-500 group-hover:text-navy-950 text-gold-500 transition-all duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      {/* Premium Badge */}
                      {isExpanded && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-xs font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Compliance Vetted
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-navy-950 dark:text-white group-hover:text-gold-500 dark:group-hover:text-gold-400 transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="mt-3 text-sm text-gray-600 dark:text-navy-200 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Expand/Collapse Trigger */}
                    <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-gold-600 dark:text-gold-400 uppercase tracking-widest">
                      <span>{isExpanded ? 'Collapse' : 'Explore compliance process'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-185' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Content View (Visible only when clicked) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex-1 mt-6 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-200/80 dark:border-navy-800 lg:pl-8 flex flex-col md:flex-row gap-6 w-full"
                      >
                        {/* Column 1: Compliance Steps */}
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-navy-950 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                            Filing Process Overview
                          </h4>
                          <ul className="space-y-2.5">
                            {details.process.map((step, idx) => (
                              <li key={idx} className="text-xs text-gray-600 dark:text-navy-200 flex items-start gap-2">
                                <span className="font-mono text-gold-500 font-bold">{idx + 1}.</span>
                                <span>{step.substring(3)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Column 2: Mandatory Documents Checklist */}
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-navy-950 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                            Required Documents
                          </h4>
                          <ul className="space-y-2">
                            {details.documents.map((doc, idx) => (
                              <li key={idx} className="text-xs text-gray-600 dark:text-navy-200 flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Column 3: AI compliance trigger */}
                        <div className="md:w-56 flex flex-col justify-center items-stretch gap-3">
                          <div className="p-3 rounded-2xl bg-gold-500/5 border border-gold-500/10 text-center">
                            <FileText className="w-8 h-8 text-gold-500 mx-auto mb-2" />
                            <div className="text-[10px] text-navy-400 dark:text-navy-200 uppercase font-bold tracking-wider mb-1">
                              Instant AI Scanning
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-navy-300">
                              Upload invoices/tax documents to scan for audit errors.
                            </p>
                          </div>
                          <button
                            onClick={handleAnalyzeClick}
                            className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs hover:shadow-lg hover:shadow-gold-500/25 transition-all cursor-pointer"
                          >
                            Analyse Document
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
