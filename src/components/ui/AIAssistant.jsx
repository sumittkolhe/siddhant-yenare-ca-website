import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Check, PhoneCall, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { getAIChatResponse } from '../../lib/ai';
import { trackEvent } from '../../lib/tracking';
import toast from 'react-hot-toast';

const PRESETS = [
  { label: 'GST filing due dates 📅', query: 'What are the upcoming GST filing due dates?' },
  { label: 'LLP register checklist 📋', query: 'What documents are required to register an LLP company?' },
  { label: 'Audit turnover limit 🔍', query: 'What is the turnover limit for a mandatory tax audit under 44AB?' },
  { label: 'Income tax slabs 💰', query: 'Show me the income tax slabs for the new tax regime.' },
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Welcome to the executive compliance desk of **Siddhant Yenare & Co.** \n\nI am your intelligent CA coordinator. Ask me any questions regarding **GST filings**, **Income Tax returns**, **Company setup**, or **Statutory audits**. \n\nHow may I optimize your compliance pipeline today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ email: '', phone: '' });
  
  const chatEndRef = useRef(null);

  // Sync scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, showLeadForm]);

  // Listen for custom trigger event (e.g. from Hero buttons)
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      trackEvent('click', 'Trigger AI Chatbot via landing CTA');
    };
    
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Track AI questions and individual chat messages
    trackEvent('ai_chat');
    trackEvent('ai_chat_message', userMsg);

    // Context trigger to capture leads: if user asks for pricing, consultations or bookings
    const lowerText = textToSend.toLowerCase();
    const isLeadIntent = 
      lowerText.includes('book') || 
      lowerText.includes('consultation') || 
      lowerText.includes('schedule') || 
      lowerText.includes('price') || 
      lowerText.includes('fee') || 
      lowerText.includes('call') || 
      lowerText.includes('contact');

    try {
      // Fetch AI response (Gemini/OpenAI or Heuristic Healer)
      const aiReplyText = await getAIChatResponse([...messages, userMsg]);
      
      const aiMsg = {
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, aiMsg]);
      trackEvent('ai_chat_message', aiMsg);

      // Trigger lead form inline if high interest detected
      if (isLeadIntent && !leadCaptured) {
        setTimeout(() => {
          setShowLeadForm(true);
        }, 1000);
      }
    } catch (err) {
      console.error('Chat AI reply error:', err);
    } finally {
      setTyping(false);
    }
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadForm.email || !leadForm.phone) {
      toast.error('Please fill in both fields.');
      return;
    }

    // Submit lead to active visitor session log
    trackEvent('query_submit', {
      name: 'AI Chat Lead',
      email: leadForm.email,
      phone: leadForm.phone,
    });

    setLeadCaptured(true);
    setShowLeadForm(false);
    
    // Add positive confirmation in chat
    setMessages((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: `✨ **Priority Request Logged!** \n\nThank you. I have registered your contact info (**${leadForm.phone}**) with our priority compliance desk. \n\nCA Siddhant Yenare's team will contact you within **1 hour** to finalize your consultation.`,
        timestamp: new Date().toISOString(),
      }
    ]);
    
    toast.success('Callback request logged! Callback in 1 hr.', { icon: '📞' });
  };

  const formatText = (txt) => {
    // Basic bold formatting support for clean heuristics rendering
    return txt.split('\n').map((paragraph, pIdx) => {
      const formattedLine = paragraph.split('**').map((chunk, cIdx) => {
        if (cIdx % 2 === 1) {
          return <strong key={cIdx} className="text-gold-500 font-bold">{chunk}</strong>;
        }
        return chunk;
      });
      return <div key={pIdx} className="mb-2 last:mb-0">{formattedLine}</div>;
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) trackEvent('click', 'Open AI Assistant floating panel');
        }}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-navy-950 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.35)] flex items-center justify-center cursor-pointer transition-all group"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-500 rounded-full border border-navy-950 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Slide-over Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-40 right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] bg-[#0c1624]/95 dark:bg-[#070e17]/95 border border-white/10 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Glassmorphic Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 font-bold shadow-md shadow-gold-500/10">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Siddhant AI Consulting Desk
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-navy-300 font-medium">CA Advisor Active</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 text-[10px] text-gold-400 font-semibold px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                ICAI Safe
              </div>
            </div>

            {/* Message Pane */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-navy-950 font-bold rounded-tr-none'
                        : 'bg-white/5 border border-white/5 text-navy-100 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold mb-1 opacity-60">
                      {msg.sender === 'user' ? (
                        <>
                          <User className="w-3 h-3" />
                          <span>Client Desk</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-gold-400" />
                          <span>Siddhant AI Desk</span>
                        </>
                      )}
                    </div>
                    <div>{formatText(msg.text)}</div>
                  </div>
                </div>
              ))}

              {/* Typing indicator bubble */}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}

              {/* Inline Lead Capture Sub-Card */}
              {showLeadForm && !leadCaptured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-[#12233c] to-[#0c1624] border border-gold-500/20 rounded-2xl p-4 shadow-lg space-y-3"
                >
                  <div className="flex items-center gap-2 text-gold-400">
                    <PhoneCall className="w-4 h-4 animate-bounce" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Book Callback In 1 Hour</h4>
                  </div>
                  <p className="text-[10px] text-navy-200">
                    Get prioritized callback scheduling with CA Siddhant Yenare. Leave details to secure priority index:
                  </p>
                  
                  <form onSubmit={handleLeadSubmit} className="space-y-2">
                    <input
                      required
                      type="email"
                      placeholder="your@email.com"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-navy-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-navy-400 outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 bg-navy-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-navy-400 outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shadow-gold-500/10 cursor-pointer"
                    >
                      Secure Priority Scheduling
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </motion.div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Presets Grid */}
            {messages.length === 1 && (
              <div className="px-4 pb-3">
                <span className="text-[9px] uppercase tracking-wider font-bold text-navy-400 block mb-1.5">
                  Suggested Prompts
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handleSendMessage(p.query)}
                      className="text-left p-2 border border-white/5 hover:border-gold-500/25 rounded-xl text-[10px] text-navy-200 hover:text-gold-400 bg-white/5 hover:bg-gold-500/5 transition-all text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask ITR, GST, or Company setup questions..."
                className="flex-1 px-3 py-2 bg-navy-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-navy-400 outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-navy-950 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
