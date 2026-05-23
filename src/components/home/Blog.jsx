import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, Calendar, Clock, X, Sparkles, AlertCircle } from 'lucide-react';
import { blogPosts } from '../../data/blog';

// High-fidelity pre-composed corporate compliance and tax articles
const ARTICLE_BODIES = {
  1: `### Vetting 80C Deductions (Maximum Limit: ₹1,50,000)
Under Section 80C of the Income Tax Act, salaried employees can reduce taxable income by investing in:
* **Equity Linked Savings Schemes (ELSS)**: Offers the shortest lock-in period (3 years) with historic equity-beating returns.
* **Public Provident Fund (PPF) & Employee Provident Fund (EPF)**: Stable, tax-free interest options.
* **National Savings Certificate (NSC) & 5-Year Bank FDs**.

### The NPS Multiplier (Section 80CCD(1B))
Maximize your tax shield by investing an extra **₹50,000** in the **National Pension System (NPS)**. This deduction is over and above the ₹1.5 Lakhs limit of Section 80C, yielding an additional immediate tax saving of up to ₹15,600 for individuals in the 30% tax bracket.

### Vetting Medical Policies (Section 80D)
Protect your family and your capital. Premiums paid for health insurance policies allow deductions up to:
* **₹25,000**: Self, spouse, and dependent children.
* **₹50,000 (Extra)**: Senior citizen parents.
* *Total eligible shield: Up to ₹75,000 under Section 80D.*

### House Rent Allowance (HRA) Calculations
If you reside in a rented property, HRA exemption under Section 10(13A) is calculated as the minimum of:
1. Actual HRA received.
2. 50% of salary (Metros) or 40% (Non-metros).
3. Actual Rent Paid minus 10% of salary.

---
> [!IMPORTANT]
> **New vs. Old Tax Regime Planner**: With the standard deduction raised to **₹75,000** under the New Tax Regime, choosing the optimal regime requires a comparative audit. Siddhant Yenare & Co. provides customized tax planning spreadsheets to optimize your salary structure.`,

  2: `### GSTR-1 vs. GSTR-3B Triple Reconciliation Check
Filing GSTR-9 annual returns requires absolute reconciliation of tax liability across multiple sources:
1. **GSTR-1**: Outward supplies billed and uploaded.
2. **GSTR-3B**: Summary return filed and taxes paid in cash or credit.
3. **GSTR-2B**: Input Tax Credit (ITC) auto-populated from supplier filings.
*Any mismatch of even ₹1 in these ledgers triggers automated scrutiny notices from the GST system.*

### Mandatory HSN-Wise Outward Reporting
Under active GST guidelines:
* Businesses with an annual aggregate turnover (AATO) **above ₹5 Crores** must mandatorily report HSN codes at a **6-digit level** in Table 17 of GSTR-9.
* AATO up to ₹5 Crores requires HSN codes at a **4-digit level** for all B2B transactions.

### Reclaiming Blocked and Unclaimed ITC
GSTR-9 annual returns offer a final opportunity to cross-verify and claim eligible Input Tax Credit that was missed during monthly GSTR-3B submissions. However, ensure that Section 17(5) blocked credit items (e.g. food, corporate motor vehicles) are strictly excluded to avoid heavy interest penalties.

### Penalties for Non-Filing (Section 47)
The statutory deadline is **31st December** of the subsequent Financial Year. Late filing attracts a daily fee of ₹200 (₹100 CGST + ₹100 SGST) subject to a maximum cap of 0.5% of turnover in the state.`,

  3: `### Pvt Ltd vs. LLP Incorporation Matrix
Startups must evaluate their capital requirements early:
* **Private Limited Company**: Ideal for venture funding, ESOP planning, and scale. Subject to statutory audits under MCA.
* **Limited Liability Partnership (LLP)**: Excellent for boot-strapped service firms. Lower compliance costs, zero Dividend Distribution Tax, and simplified partner modifications.

### DPIIT Startup Recognition & Tax Holiday Benefits
To qualify for a 3-year absolute tax holiday under Section 80-IAC, startups must:
1. Incorporate as a Pvt Ltd or registered LLP.
2. Be recognized by the **Department for Promotion of Industry and Internal Trade (DPIIT)**.
3. Show an annual turnover of less than **₹100 Crores** since inception.
4. Work towards innovation, development, or improvement of products or services.

### Setting Up Bookkeeping Controls (Tally / Zoho Accounting)
Avoid structural compliance breakdowns. Implementing robust financial ledgers from Day One ensures you are ready for due diligence audits during seed and Series A rounds.

### Corporate Valuation Audits (Section 56(2)(viib))
Vetting angel investments requires accurate fair market valuation reports drafted by Registered Valuers. We draft compliant DCF (Discounted Cash Flow) assessments to protect your startup from "Angel Tax" scrutiny.`,

  4: `### Section 194C & 194J Thresholds
Understand active TDS thresholds to avoid domestic expenditure disallowances (under Sec 40(a)(ia)):
* **Section 194C (Contractors)**: Deduct **1%** (for individuals/HUFs) or **2%** (for firms/corporates) if a single invoice exceeds **₹30,000** or cumulative invoices exceed **₹1,00,000** in a financial year.
* **Section 194J (Professional/Technical Fees)**: Deduct **10%** (2% for call centers/technical services) for annual receipts exceeding **₹30,000**.

### E-Commerce Operators & Digital Assets (194-O & 194S)
E-commerce platform operators must deduct **1%** TDS on the gross amount of sales under Section 194-O. In addition, transactions involving Virtual Digital Assets (VDAs/Crypto) attract a flat **1%** TDS under Section 194S.

### Delayed Deductions & Penalties (Section 201(1A))
Failure to comply with TDS guidelines attracts strict interest mandates:
* **1.0% per month**: From the date tax was deductible to the date it is actually deducted.
* **1.5% per month**: From the date tax was deducted to the date it is paid to the government treasury.

### quarterly TDS Return (Form 26Q / 24Q) deadlines
returns must be filed quarterly by the **31st** of the month following the quarter (e.g. Q1 returns due by 31st July). Late filing attracts a statutory penalty of **₹200 per day** under Section 234E.`
};

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

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);

  const handleReadMoreClick = (e, post) => {
    e.preventDefault();
    setSelectedPost(post);
  };

  const handleClose = () => {
    setSelectedPost(null);
  };

  return (
    <section id="blog" className="py-20 md:py-28 bg-[#fcfdfe] dark:bg-[#050b14] transition-colors duration-300">
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
            <BookOpen className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-semibold text-gold-700 dark:text-gold-400 uppercase tracking-wider">
              Legal &amp; Tax Publications
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-navy-950 dark:text-white tracking-tight">
            Latest <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Insights &amp; Updates</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-navy-200 max-w-2xl mx-auto text-sm">
            Stay ahead of complex Indian compliance mandates with authoritative briefs compiled by CA Siddhant Yenare's expert desks.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {blogPosts.slice(0, 4).map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              className="bg-white dark:bg-[#0c1624]/60 border border-gray-250/60 dark:border-navy-800/80 rounded-2xl overflow-hidden shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between"
            >
              <div>
                {/* Visual Header Image Overlay */}
                <div className="relative h-32 bg-gradient-to-br from-navy-900 to-navy-950 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gold-500/5 opacity-40 group-hover:scale-110 transition-transform duration-500" />
                  <BookOpen className="w-8 h-8 text-gold-500/35 relative z-10" />
                  {post.category && (
                    <span className="absolute top-3.5 left-3.5 bg-gold-500 text-navy-950 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md shadow-sm">
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Content Block */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-navy-300 font-mono">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold-500" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold-500" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-navy-950 dark:text-white leading-snug group-hover:text-gold-500 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-navy-200 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-5 pb-5 pt-2">
                <button
                  onClick={(e) => handleReadMoreClick(e, post)}
                  className="inline-flex items-center gap-1 text-gold-500 text-xs font-bold uppercase tracking-wider hover:text-gold-400 transition-colors cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* ─── PREMIUM GLASSMORPHIC FULL-ARTICLE DRAWER MODAL ─── */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-navy-950/60 backdrop-blur-md">
            
            {/* Background tap dismissal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 cursor-pointer"
            />

            {/* Slide-over article canvas */}
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.98 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full sm:max-w-2xl h-full sm:h-[90vh] bg-white dark:bg-[#0c1624] border-l sm:border border-gray-200 dark:border-navy-800 rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-navy-950 dark:text-white z-10"
            >
              {/* Sticky Top Header Banner */}
              <div className="p-6 bg-gray-50 dark:bg-navy-950/40 border-b border-gray-150 dark:border-navy-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-gold-500 text-navy-950 text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                    {selectedPost.category}
                  </span>
                  <div className="text-[10px] text-gray-400 dark:text-navy-300 font-mono flex items-center gap-2">
                    <span>{selectedPost.date}</span>
                    <span>·</span>
                    <span>{selectedPost.readTime}</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full bg-gray-150 dark:bg-navy-900 border border-gray-250 dark:border-navy-800 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer"
                  title="Close article"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Article Content Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-white/5">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold font-display text-navy-950 dark:text-white leading-tight">
                    {selectedPost.title}
                  </h1>
                  <p className="mt-3.5 text-xs md:text-sm text-navy-400 dark:text-navy-200 italic leading-relaxed pl-3 border-l-2 border-gold-500">
                    "{selectedPost.excerpt}"
                  </p>
                </div>

                {/* Article body markup */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed text-gray-600 dark:text-navy-100 space-y-4 font-sans">
                  {ARTICLE_BODIES[selectedPost.id] ? (
                    // Split content by paragraphs and parse headings/lists natively to prevent markdown react parse errors
                    ARTICLE_BODIES[selectedPost.id].split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('###')) {
                        return (
                          <h3 key={pIdx} className="text-sm font-bold uppercase tracking-wider text-navy-950 dark:text-white pt-4 flex items-center gap-1.5 border-b border-gray-100 dark:border-navy-900 pb-1 font-display">
                            <Sparkles className="w-4.5 h-4.5 text-gold-500" />
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('> [!IMPORTANT]')) {
                        const blockText = paragraph.replace('> [!IMPORTANT]\n', '').replace('> ', '');
                        return (
                          <div key={pIdx} className="p-4 rounded-xl bg-gold-500/5 border border-gold-500/15 text-gold-500 flex items-start gap-2.5 my-4">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <div className="text-xs leading-relaxed font-semibold">
                              {blockText.includes('**') ? (
                                <span>
                                  {blockText.split('**').map((tok, tIdx) => tIdx % 2 === 1 ? <strong key={tIdx} className="font-bold">{tok}</strong> : tok)}
                                </span>
                              ) : blockText}
                            </div>
                          </div>
                        );
                      }
                      if (paragraph.includes('* ')) {
                        return (
                          <ul key={pIdx} className="list-disc pl-5 space-y-1.5 py-1">
                            {paragraph.split('\n').map((li, lIdx) => {
                              const cleanLi = li.replace('* ', '');
                              return (
                                <li key={lIdx} className="text-xs md:text-sm text-gray-500 dark:text-navy-200">
                                  {cleanLi.includes('**') ? (
                                    <span>
                                      {cleanLi.split('**').map((tok, tIdx) => tIdx % 2 === 1 ? <strong key={tIdx} className="font-bold text-navy-950 dark:text-white">{tok}</strong> : tok)}
                                    </span>
                                  ) : cleanLi}
                                </li>
                              );
                            })}
                          </ul>
                        );
                      }
                      return (
                        <p key={pIdx} className="leading-relaxed">
                          {paragraph.includes('**') ? (
                            paragraph.split('**').map((tok, tIdx) => tIdx % 2 === 1 ? <strong key={tIdx} className="font-bold text-navy-950 dark:text-white">{tok}</strong> : tok)
                          ) : paragraph}
                        </p>
                      );
                    })
                  ) : (
                    <p>Advisory publication is loading...</p>
                  )}
                </div>
              </div>

              {/* Sticky bottom CTA Call-to-Action */}
              <div className="p-6 bg-gray-50 dark:bg-navy-950/40 border-t border-gray-150 dark:border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left text-xs">
                  <span className="block text-[8px] uppercase tracking-wider font-extrabold text-gold-500">Advisory Desk</span>
                  <span className="font-bold text-navy-950 dark:text-white">CA Siddhant Yenare &amp; Co.</span>
                </div>
                
                <a
                  href="#query"
                  onClick={handleClose}
                  className="w-full sm:w-auto text-center px-6 py-2.5 bg-navy-950 hover:bg-navy-900 dark:bg-gold-500 dark:hover:bg-gold-600 text-white dark:text-navy-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Book Priority Consultation
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
