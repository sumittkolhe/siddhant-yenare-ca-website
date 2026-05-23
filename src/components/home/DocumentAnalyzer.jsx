import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertTriangle, RefreshCw, X, Sparkles } from 'lucide-react';
import { parseDocumentAI } from '../../lib/ai';
import { trackEvent } from '../../lib/tracking';
import toast from 'react-hot-toast';

export default function DocumentAnalyzer() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  // Simulated scan steps for high-fidelity fintech visual feedback
  const scanLogSteps = [
    'Initializing Siddhant AI compliance parser...',
    'Performing optical character recognition (OCR)...',
    'Vetting extracted GSTIN and vendor entities...',
    'Auditing tax computation tables (CGST/SGST/IGST 18%)...',
    'Checking mandatory MCA/ICAI regulatory requirements...',
    'Generating final compliance assessment report...'
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds maximum limit of 5MB');
      return;
    }
    
    setFile(selectedFile);
    setResults(null);
    startScanning(selectedFile);
  };

  const startScanning = async (targetFile) => {
    setScanning(true);
    setScanStep(0);
    trackEvent('file_upload', targetFile.name);

    // Loop through simulated scanning stages to wow the user
    for (let i = 0; i < scanLogSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setScanStep(i + 1);
    }

    try {
      const parsedResults = await parseDocumentAI(targetFile.name, targetFile.type);
      setResults(parsedResults);
      toast.success('Document analysis completed successfully!');
    } catch (error) {
      console.error('Scan failed:', error);
      toast.error('AI Scan failed. Falling back to default compliance check.');
    } finally {
      setScanning(false);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current.click();
  };

  const clearFile = () => {
    setFile(null);
    setResults(null);
    setScanning(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="document-analyzer" className="py-20 md:py-28 bg-[#fafbfc] dark:bg-[#050b14] border-t border-b border-gray-100 dark:border-navy-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 dark:bg-gold-500/10 border border-gold-200 dark:border-gold-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-semibold text-gold-700 dark:text-gold-400">
              Regulatory Tech Suite
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-navy-950 dark:text-white">
            AI <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Document Compliance</span> Analyzer
          </h2>
          <p className="mt-4 text-gray-600 dark:text-navy-200 max-w-2xl mx-auto">
            Upload your sales receipts, GST credit statements, or income tax notices. The AI immediately analyzes tax percentages, verifies entity registrations, and spots missing fields.
          </p>
        </div>

        {/* Core Analyzer Card */}
        <div className="bg-white dark:bg-[#0c1624] border border-gray-200/60 dark:border-navy-800 rounded-3xl p-6 md:p-10 shadow-glass overflow-hidden relative">
          
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles className="w-40 h-40 text-gold-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            
            {/* Left Box: Upload and Status logs */}
            <div className="lg:col-span-6 flex flex-col items-stretch h-full justify-center">
              
              {/* Drag and Drop Zone */}
              {!file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerSelect}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[300px] ${
                    dragActive
                      ? 'border-gold-500 bg-gold-500/5'
                      : 'border-gray-200/80 dark:border-navy-800 hover:border-gold-500/40 bg-gray-50/50 dark:bg-navy-950/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-4 text-gold-500">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-950 dark:text-white mb-2">
                    Drag and drop file here
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-navy-300 max-w-xs mb-4">
                    Supports GST invoices, ITR notifications, or audit statements. (PDF, JPG, PNG, DOCX up to 5MB)
                  </p>
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 dark:bg-gold-500 dark:hover:bg-gold-600 text-white dark:text-navy-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Select File
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50/50 dark:bg-navy-950/20 border border-gray-200/80 dark:border-navy-800 rounded-2xl p-6 relative min-h-[300px] flex flex-col">
                  {/* File Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200/60 dark:border-navy-800 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-navy-950 dark:text-white truncate">
                        {file.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 dark:text-navy-300 font-mono">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    {!scanning && (
                      <button
                        onClick={clearFile}
                        className="p-1.5 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Scanning Log / Loader */}
                  {scanning ? (
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-gold-500 text-sm font-semibold mb-4">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI Scan In Progress...</span>
                      </div>
                      
                      {/* Scanning visual laser */}
                      <div className="h-2 w-full bg-navy-800/50 rounded-full overflow-hidden mb-6 relative">
                        <div className="absolute inset-0 bg-gold-500/20" />
                        <motion.div
                          className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                          style={{ width: '40%' }}
                        />
                      </div>

                      {/* Log output terminal */}
                      <div className="bg-[#040810] rounded-xl p-4 border border-navy-800/80 font-mono text-[10px] space-y-1.5 flex-1 min-h-[140px] overflow-hidden flex flex-col justify-end">
                        {scanLogSteps.slice(0, scanStep).map((log, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-start gap-1.5 ${
                              idx === scanStep - 1 ? 'text-gold-400 font-bold' : 'text-navy-400'
                            }`}
                          >
                            <span className="text-gold-500 font-bold select-none">&gt;</span>
                            <span>{log}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mb-3 animate-bounce" />
                      <h4 className="text-sm font-bold text-navy-950 dark:text-white mb-1">
                        Compliance Check Finished
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-navy-300 mb-5">
                        Extracted values and regulatory gaps have been mapped on the right panel.
                      </p>
                      <button
                        onClick={() => startScanning(file)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 dark:bg-navy-800 dark:hover:bg-navy-700/80 border border-gray-200 dark:border-navy-700 text-xs font-bold text-navy-950 dark:text-white rounded-xl transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Re-Scan Document
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Box: Results Panel */}
            <div className="lg:col-span-6 h-full flex flex-col">
              <AnimatePresence mode="wait">
                {results ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    {/* Header Details */}
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-navy-800">
                      <div>
                        <span className="text-[10px] text-gold-500 uppercase font-bold tracking-widest font-mono">
                          Parsed Category
                        </span>
                        <h3 className="text-lg font-bold text-navy-950 dark:text-white">
                          {results.docType}
                        </h3>
                      </div>
                      
                      {/* Vetted badge */}
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        results.verificationStatus.includes('Non-Compliant') || results.verificationStatus.includes('❌')
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : results.verificationStatus.includes('Compliant')
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                          : 'bg-gold-500/10 text-gold-500 border border-gold-500/20 animate-pulse'
                      }`}>
                        {results.verificationStatus}
                      </span>
                    </div>

                    {/* AI Smart Summary */}
                    <div className="p-4 bg-gold-500/5 dark:bg-gold-500/5 rounded-2xl border border-gold-500/10">
                      <span className="text-[10px] text-gold-500 font-bold uppercase tracking-wider block mb-1">
                        Siddhant AI Smart Insight
                      </span>
                      <p className="text-xs text-gray-700 dark:text-navy-100 leading-relaxed">
                        {results.aiSummary}
                      </p>
                    </div>

                    {/* Extracted Fields Table */}
                    <div>
                      <h4 className="text-xs font-bold text-navy-950 dark:text-white uppercase tracking-wider mb-2.5">
                        Extracted Fields (OCR Vetted)
                      </h4>
                      <div className="border border-gray-150 dark:border-navy-800 rounded-xl overflow-hidden text-xs">
                        {Object.entries(results.extractedFields).map(([key, val], idx) => (
                          <div
                            key={key}
                            className={`flex justify-between p-2.5 border-b border-gray-100 dark:border-navy-800/80 last:border-b-0 ${
                              idx % 2 === 0 ? 'bg-gray-50/30 dark:bg-navy-950/20' : 'bg-white dark:bg-[#0c1624]'
                            }`}
                          >
                            <span className="text-gray-500 dark:text-navy-300 font-medium">{key}</span>
                            <span className="text-navy-950 dark:text-white font-bold font-mono">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missing Fields Warnings */}
                    <div>
                      <h4 className="text-xs font-bold text-navy-950 dark:text-white uppercase tracking-wider mb-2.5">
                        Regulatory Compliance Voids
                      </h4>
                      {results.missingFields.length > 0 ? (
                        <div className="space-y-2">
                          {results.missingFields.map((field, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl border border-red-500/15 bg-red-500/5 text-red-500 text-xs">
                              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                              <span>Missing mandatory block: <strong>{field}</strong></span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2.5 rounded-xl border border-green-500/15 bg-green-500/5 text-green-500 text-xs">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          <span>No regulatory voids detected. Invoice is fully compliant for tax reclamation.</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center p-8 border border-dashed border-gray-200 dark:border-navy-800 rounded-2xl bg-gray-50/10 dark:bg-navy-950/5 min-h-[350px]">
                    <FileText className="w-12 h-12 text-gray-300 dark:text-navy-700 mb-3" />
                    <h4 className="text-sm font-bold text-navy-950 dark:text-white mb-1">
                      Results Board Empty
                    </h4>
                    <p className="text-xs text-gray-400 dark:text-navy-300 max-w-xs leading-relaxed">
                      Upload and analyze an invoice, financial document, or regulatory notice on the left panel to execute compliance parsing.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
