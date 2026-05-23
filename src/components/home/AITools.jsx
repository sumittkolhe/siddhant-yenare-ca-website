import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, HelpCircle, FileCheck, CheckSquare, RefreshCw, Landmark, ArrowRight, UserCheck, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const CHECKLISTS = {
  itr: {
    title: 'Income Tax Return (ITR) Checklist',
    description: 'Ensure you have these ready for error-free tax filing and audit preparedness.',
    items: [
      { id: 'itr-pan', label: 'PAN Card (Mandatory)' },
      { id: 'itr-aadhaar', label: 'Aadhaar Card (Linked to PAN)' },
      { id: 'itr-form16', label: 'Form 16 (From your employer, if salaried)' },
      { id: 'itr-bank', label: 'Bank Statements for all accounts (Prev Financial Year)' },
      { id: 'itr-salary', label: 'Salary Slips (For HRA and allowance cross-verification)' },
      { id: 'itr-investment', label: 'Investment Proofs (80C, 80D, NPS, Medical policies)' },
      { id: 'itr-capgains', label: 'Capital Gains statements (Mutual funds, Stocks, Crypto, Property)' }
    ]
  },
  gst: {
    title: 'GST Registration & Filings Checklist',
    description: 'Required documentation for new GSTIN registration and quarterly reconciliation audits.',
    items: [
      { id: 'gst-pan', label: 'PAN Card of the Business / Proprietor' },
      { id: 'gst-aadhaar', label: 'Aadhaar Card of the Proprietor / Authorized Signatory' },
      { id: 'gst-photo', label: 'Passport size photograph of the applicant' },
      { id: 'gst-address', label: 'Business Address Proof (Electricity bill / Property tax receipt)' },
      { id: 'gst-noc', label: 'Consent Letter / NOC from property owner (If rented)' },
      { id: 'gst-bank', label: 'Bank Account Passbook / Cancelled Cheque showing account details' }
    ]
  },
  registration: {
    title: 'Company / LLP Registration Checklist',
    description: 'Documents required for MCA portal incorporation, DSC, and DIN generation.',
    items: [
      { id: 'reg-pan', label: 'PAN Card of all Directors / Partners' },
      { id: 'reg-id', label: 'Identity Proof (Aadhaar / Voter ID / Passport) of all Directors' },
      { id: 'reg-address-dir', label: 'Address Proof (Bank statement / Electricity bill) of all Directors' },
      { id: 'reg-photo', label: 'Passport size photos of all proposed Directors' },
      { id: 'reg-biz-addr', label: 'Registered Business Address Proof (Electricity bill / Municipal Tax)' },
      { id: 'reg-rent', label: 'Rent Agreement & NOC from Landlord (If office is rented)' }
    ]
  }
};

export default function AITools() {
  const [activeTab, setActiveTab] = useState('recommendation'); // recommendation or checklist
  
  // Recommendation Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardAnswers, setWizardAnswers] = useState({
    entity: '', // individual or business
    incomeType: '', // salary, professional, or corporate
    needGst: '', // yes or no
    auditNeeded: '' // yes or no
  });

  // Checklist State
  const [activeChecklist, setActiveChecklist] = useState('itr');
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheckItem = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleRecommendationReset = () => {
    setWizardStep(1);
    setWizardAnswers({
      entity: '',
      incomeType: '',
      needGst: '',
      auditNeeded: ''
    });
  };

  const selectAnswer = (field, value) => {
    setWizardAnswers(prev => {
      const updated = { ...prev, [field]: value };
      return updated;
    });

    // Advance wizard logic
    if (field === 'entity') {
      if (value === 'individual') {
        setWizardStep(2); // Ask income type for individual
      } else {
        setWizardStep(3); // Ask GST needs for business
      }
    } else if (field === 'incomeType') {
      if (value === 'professional') {
        setWizardStep(3); // Ask GST needs for professionals
      } else {
        setWizardStep(5); // Render recommendation directly for salaried
      }
    } else if (field === 'needGst') {
      if (value === 'yes' || wizardAnswers.entity === 'business') {
        setWizardStep(4); // Ask about audits
      } else {
        setWizardStep(5); // Render recommendation for simple business/professional
      }
    } else if (field === 'auditNeeded') {
      setWizardStep(5); // Render final recommendation
    }
  };

  const getRecommendedPackage = () => {
    const { entity, incomeType, needGst, auditNeeded } = wizardAnswers;

    if (entity === 'individual' && incomeType === 'salary') {
      return {
        title: 'Salary Saver Plan',
        price: 'Optimal Pricing',
        desc: 'Perfect tax filing package customized for salaried executives seeking compliance and maximum deductions.',
        features: [
          'ITR-1 / ITR-2 Return Filing',
          'Section 80C & 80D Audit & Planning',
          'HRA & Allowances Restructuring',
          'Form 26AS & AIS Reconciliation'
        ],
        ctaText: 'Book Salaried Package',
        targetId: '#query'
      };
    }

    if (entity === 'individual' && incomeType === 'professional') {
      if (needGst === 'yes') {
        return {
          title: 'Professional Growth & GST Plus Pack',
          price: 'Premium Pricing',
          desc: 'End-to-end tax filing and ongoing monthly GST compliance package designed for freelancers and independent consultants.',
          features: [
            'ITR-3 / ITR-4 Presumptive Return',
            'Monthly & Quarterly GSTR-1, 3B Filings',
            'Presumptive Taxation audit (Sec 44ADA)',
            'Document bookkeeping advisory'
          ],
          ctaText: 'Enquire for Professional Pack',
          targetId: '#query'
        };
      }
      return {
        title: 'Freelancer / Consultant Tax Plan',
        price: 'Optimal Pricing',
        desc: 'Hassle-free taxation service leveraging Section 44ADA to slash tax burden for independent professionals.',
        features: [
          'ITR-4 Presumptive Return Filing',
          'Professional Tax (PT) Registration',
          'Tax Liability Projections',
          'Deduction Vetting & Optimization'
        ],
        ctaText: 'Book Consultant Package',
        targetId: '#query'
      };
    }

    // Business flow
    if (entity === 'business') {
      if (auditNeeded === 'yes') {
        return {
          title: 'Corporate Compliance & Statutory Audit Elite',
          price: 'Premium Pricing',
          desc: 'Our maximum audit shielding package for established LLPs, Private Limited firms, and high-turnover traders.',
          features: [
            'MCA Portal Incorporation / LLP Compliance',
            'Mandatory Tax Audit under Sec 44AB',
            'Full Statutory MCA Audits',
            'Reconciliation of GSTR-1, 3B, and GSTR-2B',
            'Representations before Tax authorities'
          ],
          ctaText: 'Book Corporate Audit Desk',
          targetId: '#query'
        };
      }
      return {
        title: 'Business Startup & GST Compliance Package',
        price: 'Optimal Pricing',
        desc: 'Ideal all-in-one package for startups and SMEs, covering registration, GST filing, and bookkeeping setup.',
        features: [
          'Pvt Ltd / LLP MCA Incorporation',
          'GST Registration & Regular Filings',
          'ROC Annual Filing & Resolutions',
          'Tally / Zoho Ledger Setups'
        ],
        ctaText: 'Enquire for Startup Package',
        targetId: '#query'
      };
    }

    return {
      title: 'Custom Financial Architecture Package',
      price: 'Custom Estimate',
      desc: 'Our senior CA desk will audit your profile to construct a customized package tailored to your exact business size.',
      features: [
        'Custom Tax Auditing Solutions',
        'Direct and Indirect Tax Planning',
        'Corporate Restructuring Consultations'
      ],
      ctaText: 'Request Custom CA Consultation',
      targetId: '#query'
    };
  };

  const currentChecklist = CHECKLISTS[activeChecklist];
  const recommendedPack = getRecommendedPackage();

  const handlePrintChecklist = () => {
    window.print();
  };

  return (
    <section id="ai-desk" className="py-20 md:py-28 bg-[#070e17] text-white relative overflow-hidden border-t border-b border-white/5">
      {/* Abstract glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-15%] w-[45%] h-[45%] bg-gold-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-15%] w-[45%] h-[45%] bg-navy-500/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-4 animate-pulse">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold font-mono">
              AI Interactive Workspace
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
            Compliance Made <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Intelligent</span>
          </h2>
          <p className="mt-4 text-navy-200 max-w-2xl mx-auto text-sm">
            Leverage our smart interactive calculators to identify your optimal compliance package and instantly compile your necessary documents checklists.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-navy-950/80 border border-white/10 rounded-2xl p-1.5 flex gap-2 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('recommendation')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'recommendation'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 shadow-md'
                  : 'text-navy-300 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Service Advisor
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'checklist'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 shadow-md'
                  : 'text-navy-300 hover:text-white'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Checklist Generator
            </button>
          </div>
        </div>

        {/* Tab Content Canvas */}
        <div className="bg-gradient-to-br from-navy-900/60 to-navy-950/40 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            
            {/* TAB 1: SERVICE RECOMMENDATION WIZARD */}
            {activeTab === 'recommendation' && (
              <motion.div
                key="recommendation"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left side: Questions */}
                <div className="lg:col-span-7 space-y-6 min-h-[250px] flex flex-col justify-center">
                  
                  {wizardStep === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-gold-400 font-mono uppercase tracking-widest">Step 1 of 4</span>
                        <h3 className="text-xl sm:text-2xl font-bold font-display">Who are we tax planning for today?</h3>
                        <p className="text-xs text-navy-300">Choose your entity type to begin sorting applicable legal frameworks.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => selectAnswer('entity', 'individual')}
                          className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 text-left hover:bg-gold-500/5 transition-all group cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                            <UserCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">Individual Taxpayer</h4>
                            <p className="text-[10px] text-navy-300 mt-0.5">Salary, Professional, Freelance, or Rental Income.</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => selectAnswer('entity', 'business')}
                          className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 text-left hover:bg-gold-500/5 transition-all group cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">Business / Corporate</h4>
                            <p className="text-[10px] text-navy-300 mt-0.5">Proprietorship, LLP, Pvt Ltd, or Registered Partnership.</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-gold-400 font-mono uppercase tracking-widest">Step 2 of 4</span>
                        <h3 className="text-xl sm:text-2xl font-bold font-display">What is your primary source of income?</h3>
                        <p className="text-xs text-navy-300">This helps determine the correct ITR form (ITR-1, 2 vs ITR-3, 4 Presumptive).</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => selectAnswer('incomeType', 'salary')}
                          className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 text-left hover:bg-gold-500/5 transition-all group cursor-pointer"
                        >
                          <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">Salaried Executive</h4>
                          <p className="text-[10px] text-navy-300">Receives monthly payroll and Form 16 from employer.</p>
                        </button>
                        <button
                          onClick={() => selectAnswer('incomeType', 'professional')}
                          className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 text-left hover:bg-gold-500/5 transition-all group cursor-pointer"
                        >
                          <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">Freelancer / Consultant</h4>
                          <p className="text-[10px] text-navy-300">Independent consulting, contract development, or agency income.</p>
                        </button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-gold-400 font-mono uppercase tracking-widest">Step 3 of 4</span>
                        <h3 className="text-xl sm:text-2xl font-bold font-display">Do you require monthly/quarterly GST filing?</h3>
                        <p className="text-xs text-navy-300">GST is mandatory for inter-state services and businesses crossing specific limits.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => selectAnswer('needGst', 'yes')}
                          className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 text-left hover:bg-gold-500/5 transition-all group cursor-pointer"
                        >
                          <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">Yes, GST compliance required</h4>
                          <p className="text-[10px] text-navy-300">Requires registration or active return filings (GSTR-1, 3B).</p>
                        </button>
                        <button
                          onClick={() => selectAnswer('needGst', 'no')}
                          className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 text-left hover:bg-gold-500/5 transition-all group cursor-pointer"
                        >
                          <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">No GST required</h4>
                          <p className="text-[10px] text-navy-300">No GST transactions, only standard annual Direct Taxation.</p>
                        </button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 4 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-gold-400 font-mono uppercase tracking-widest">Step 4 of 4</span>
                        <h3 className="text-xl sm:text-2xl font-bold font-display">Is your annual turnover above statutory audit limits?</h3>
                        <p className="text-xs text-navy-300">Audit limits stand at ₹10 Crore for businesses (95% digital transactions) or ₹75 Lakh for professionals.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => selectAnswer('auditNeeded', 'yes')}
                          className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 text-left hover:bg-gold-500/5 transition-all group cursor-pointer"
                        >
                          <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">Yes, Audit is required</h4>
                          <p className="text-[10px] text-navy-300">We require full statutory auditing under MCA / Income Tax Sec 44AB.</p>
                        </button>
                        <button
                          onClick={() => selectAnswer('auditNeeded', 'no')}
                          className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 text-left hover:bg-gold-500/5 transition-all group cursor-pointer"
                        >
                          <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">No Audit required</h4>
                          <p className="text-[10px] text-navy-300">Our turnover sits safely underneath mandatory audit brackets.</p>
                        </button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 5 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-green-400 font-mono uppercase tracking-widest">Assessment Complete</span>
                        <h3 className="text-xl sm:text-2xl font-bold font-display">Siddhant AI Analysis Complete</h3>
                        <p className="text-xs text-navy-300">Based on your entity type and income parameters, we have constructed an optimal compliance package for you.</p>
                      </div>

                      <div>
                        <button
                          onClick={handleRecommendationReset}
                          className="inline-flex items-center gap-1.5 text-xs text-gold-500 hover:text-gold-400 font-bold uppercase tracking-wider cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Re-run AI Assessment
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Right side: Recommendation Output */}
                <div className="lg:col-span-5">
                  <div className="relative p-6 rounded-2xl border border-gold-500/25 bg-gradient-to-br from-[#0c1624]/90 to-[#060f1c]/90 shadow-gold/5 shadow-2xl space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-500 flex items-center justify-center">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-widest text-gold-400 font-bold font-mono">Recommended Bundle</div>
                        <h4 className="text-base font-bold text-white leading-tight">
                          {wizardStep < 5 ? 'Calculating...' : recommendedPack.title}
                        </h4>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="space-y-4 min-h-[140px] flex flex-col justify-center">
                      {wizardStep < 5 ? (
                        <div className="text-center space-y-3 py-6">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto" />
                          <p className="text-xs text-navy-300">Answer the interactive questionnaire on the left to compile your bundle recommendation...</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-navy-200 leading-relaxed italic">
                            "{recommendedPack.desc}"
                          </p>
                          <ul className="space-y-2">
                            {recommendedPack.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs text-navy-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    {/* Footer */}
                    <div>
                      {wizardStep < 5 ? (
                        <button
                          disabled
                          className="w-full py-3.5 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-navy-400 cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          Awaiting Assessment
                        </button>
                      ) : (
                        <a
                          href={recommendedPack.targetId}
                          onClick={(e) => {
                            const target = document.querySelector(recommendedPack.targetId);
                            if (target) {
                              e.preventDefault();
                              target.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-gold-500/10 hover:shadow-gold-500/25 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                        >
                          {recommendedPack.ctaText}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 2: DOCUMENT CHECKLIST GENERATOR */}
            {activeTab === 'checklist' && (
              <motion.div
                key="checklist"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Left side: Checklist selector */}
                <div className="lg:col-span-4 flex flex-col justify-center space-y-3">
                  <div className="space-y-1.5 mb-3 text-left">
                    <span className="text-[10px] font-bold text-gold-400 font-mono uppercase tracking-widest">Select Service</span>
                    <h3 className="text-xl font-bold font-display">Document Library</h3>
                    <p className="text-xs text-navy-300">Generate document requirement sheets instantly to prepare for direct filings.</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setActiveChecklist('itr')}
                      className={`w-full p-4 rounded-xl text-left text-xs font-bold border transition-all flex items-center gap-3 cursor-pointer ${
                        activeChecklist === 'itr'
                          ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                          : 'bg-white/5 border-white/5 hover:border-white/10 text-navy-200'
                      }`}
                    >
                      <CheckSquare className="w-4 h-4" />
                      Income Tax (ITR) Checklist
                    </button>
                    <button
                      onClick={() => setActiveChecklist('gst')}
                      className={`w-full p-4 rounded-xl text-left text-xs font-bold border transition-all flex items-center gap-3 cursor-pointer ${
                        activeChecklist === 'gst'
                          ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                          : 'bg-white/5 border-white/5 hover:border-white/10 text-navy-200'
                      }`}
                    >
                      <CheckSquare className="w-4 h-4" />
                      GST Registration Checklist
                    </button>
                    <button
                      onClick={() => setActiveChecklist('registration')}
                      className={`w-full p-4 rounded-xl text-left text-xs font-bold border transition-all flex items-center gap-3 cursor-pointer ${
                        activeChecklist === 'registration'
                          ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                          : 'bg-white/5 border-white/5 hover:border-white/10 text-navy-200'
                      }`}
                    >
                      <CheckSquare className="w-4 h-4" />
                      Company / LLP Registration
                    </button>
                  </div>
                </div>

                {/* Right side: Interactive Checklist Panel */}
                <div className="lg:col-span-8">
                  <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-[#0c1624]/60 space-y-6 text-left">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/10 gap-3">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-white">
                          {currentChecklist.title}
                        </h4>
                        <p className="text-xs text-navy-300 mt-1">
                          {currentChecklist.description}
                        </p>
                      </div>
                      
                      <button
                        onClick={handlePrintChecklist}
                        className="self-start sm:self-auto px-4 py-2 border border-white/10 hover:border-white/20 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-white/5 transition-all"
                      >
                        Print / Save Checklist
                      </button>
                    </div>

                    {/* Checklist items list */}
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
                      {currentChecklist.items.map((item) => {
                        const isChecked = !!checkedItems[item.id];
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleCheckItem(item.id)}
                            className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                              isChecked
                                ? 'bg-green-500/5 border-green-500/30 text-green-300'
                                : 'bg-white/5 border-white/5 hover:border-white/10 text-navy-100 hover:text-white'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isChecked
                                ? 'bg-green-500 border-green-500 text-navy-950'
                                : 'border-white/30 bg-transparent'
                            }`}>
                              {isChecked && <CheckSquare className="w-4 h-4 text-white" />}
                            </div>
                            <span className="text-xs font-medium">
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Progress tracking indicator bar */}
                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-navy-300">
                        <span>Checklist Audit Progress</span>
                        <span>
                          {Object.keys(checkedItems).filter(id => id.startsWith(activeChecklist) && checkedItems[id]).length} / {currentChecklist.items.length} Completed
                        </span>
                      </div>
                      
                      <div className="h-1.5 w-full bg-navy-950 border border-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-300 rounded-full"
                          style={{
                            width: `${(Object.keys(checkedItems).filter(id => id.startsWith(activeChecklist) && checkedItems[id]).length / currentChecklist.items.length) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
