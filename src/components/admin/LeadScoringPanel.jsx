import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, AlertCircle, RefreshCw, ChevronRight, User, Clock, ArrowRight, Eye, Calendar, Smile, ShieldAlert, MessageSquare, PhoneCall } from 'lucide-react';
import { getAllSessions } from '../../lib/tracking';
import toast from 'react-hot-toast';

export default function LeadScoringPanel() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await getAllSessions();
      setSessions(data);
      if (data.length > 0 && !selectedSession) {
        setSelectedSession(data[0]); // default to first session
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Filter sessions based on search & status tags
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      (s.leadName && s.leadName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.ip.includes(searchTerm) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.services && s.services.some((svc) => svc.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesStatus = statusFilter === 'all' || s.leadStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'hot':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold animate-pulse flex items-center gap-1">
            <span>Hot Lead 🔥</span>
          </span>
        );
      case 'warm':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-semibold flex items-center gap-1">
            <span>Warm Lead ⚡</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-navy-800 text-navy-300 border border-navy-700 text-xs font-semibold flex items-center gap-1">
            <span>Cold Lead ❄</span>
          </span>
        );
    }
  };

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'page_view':
        return <Eye className="w-3.5 h-3.5 text-blue-400" />;
      case 'service_view':
        return <Eye className="w-3.5 h-3.5 text-gold-400" />;
      case 'ai_chat':
      case 'ai_chat_message':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-400" />;
      case 'file_upload':
        return <Sparkles className="w-3.5 h-3.5 text-green-400 animate-spin" style={{ animationDuration: '6s' }} />;
      case 'query_submit':
        return <Calendar className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5 text-navy-400" />;
    }
  };

  const handleCallbackClick = (session) => {
    const phone = session.leadPhone || '9999999999';
    const text = `Hello ${session.leadName || 'Valued Partner'}, this is CA Siddhant Yenare's executive desk. We received your priority compliance inquiry regarding GST/Corporate services. Let's arrange a brief consultation!`;
    const waUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    toast.success('WhatsApp redirect triggered.');
  };

  return (
    <div className="space-y-6 text-white pb-12">
      
      {/* Search & Filter Header Bar */}
      <div className="bg-[#0c1624]/60 border border-navy-800/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search leads by name, service, location, or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-navy-950/60 border border-navy-800 rounded-xl text-xs placeholder-navy-400 outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-navy-300 font-semibold font-sans">Status Filter:</span>
          {['all', 'hot', 'warm', 'cold'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-gold-500 text-navy-950 font-bold'
                  : 'bg-navy-950/60 border border-navy-800 text-navy-300 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
          <button
            onClick={fetchSessions}
            className="p-2 rounded-lg bg-navy-950/60 border border-navy-800 text-navy-300 hover:text-white transition-all cursor-pointer flex-shrink-0"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Grid: Split List and Detail Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Searchable Sessions List */}
        <div className="lg:col-span-5 bg-[#0c1624]/60 border border-navy-800/80 rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-4 bg-navy-950/20 border-b border-navy-800/60 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-200">Active Leads</h3>
            <span className="text-xs text-gold-400 font-mono font-bold">{filteredSessions.length} total</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gold-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              <span className="text-xs font-semibold uppercase tracking-widest">Aggregating leads...</span>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-12 text-center text-navy-400">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 text-navy-600" />
              <h4 className="text-sm font-bold">No Leads Match Criteria</h4>
              <p className="text-xs text-navy-500 mt-1">Adjust search parameters or status filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-navy-800/60 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
              {filteredSessions.map((session) => {
                const isSelected = selectedSession?.id === session.id;
                return (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`p-4 transition-all duration-150 cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-gold-500/5 dark:bg-gold-500/5 border-l-4 border-gold-500 pl-3'
                        : 'hover:bg-navy-900/30'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">
                          {session.leadName || `Anon / IP: ${session.city}`}
                        </span>
                        {getStatusBadge(session.leadStatus)}
                      </div>
                      <div className="text-[10px] text-navy-300 flex items-center gap-2">
                        <span>IP: {session.ip}</span>
                        <span>•</span>
                        <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                      </div>
                      {session.services?.length > 0 && (
                        <div className="flex gap-1 overflow-hidden max-w-full">
                          {session.services.map((svc) => (
                            <span key={svc} className="text-[8px] uppercase tracking-wider font-semibold font-mono bg-navy-950 text-gold-400/80 border border-gold-500/10 px-1.5 py-0.5 rounded">
                              {svc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Numeric Dial Box */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs border ${
                        session.leadScore >= 75
                          ? 'bg-red-500/10 border-red-500/20 text-red-400'
                          : session.leadScore >= 35
                          ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                          : 'bg-navy-950 border-navy-800 text-navy-300'
                      }`}>
                        {session.leadScore}
                      </div>
                      <ChevronRight className="w-4 h-4 text-navy-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: High-Intent Lead Profile Details */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedSession ? (
              <motion.div
                key={selectedSession.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#0c1624]/60 border border-navy-800/80 rounded-2xl overflow-hidden backdrop-blur-xl"
              >
                
                {/* Details Header */}
                <div className="p-6 border-b border-navy-800/60 bg-navy-950/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {selectedSession.leadName || 'Unregistered Client'}
                      </h3>
                      <p className="text-xs text-navy-300 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold-500" />
                        <span>Active for {selectedSession.duration}s · Returns: {selectedSession.returnVisits}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Big Numeric Dial */}
                    <div className="text-right">
                      <div className="text-[10px] text-navy-300 font-bold uppercase tracking-wider">AI Score Index</div>
                      <div className="text-2xl font-bold font-mono text-gold-400 leading-none">{selectedSession.leadScore}<span className="text-xs text-navy-400 font-medium">/100</span></div>
                    </div>
                    
                    <div className="h-8 w-px bg-navy-800 mx-2" />
                    {getStatusBadge(selectedSession.leadStatus)}
                  </div>
                </div>

                {/* Profile Grid Details */}
                <div className="p-6 space-y-6">
                  
                  {/* Row 1: Quick Details Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 bg-navy-950/40 rounded-xl border border-navy-850/60">
                      <span className="text-[9px] uppercase font-bold text-navy-400 block mb-1">Geographic Node</span>
                      <strong className="text-white text-xs">{selectedSession.city || 'India'}</strong>
                    </div>
                    <div className="p-3 bg-navy-950/40 rounded-xl border border-navy-850/60">
                      <span className="text-[9px] uppercase font-bold text-navy-400 block mb-1">IP Address</span>
                      <strong className="text-white text-xs font-mono">{selectedSession.ip}</strong>
                    </div>
                    <div className="p-3 bg-navy-950/40 rounded-xl border border-navy-850/60">
                      <span className="text-[9px] uppercase font-bold text-navy-400 block mb-1">AI Sentiment rating</span>
                      <strong className={`text-xs capitalize flex items-center gap-1 ${
                        selectedSession.sentiment === 'positive' ? 'text-green-400' : selectedSession.sentiment === 'negative' ? 'text-red-400' : 'text-navy-300'
                      }`}>
                        <Smile className="w-3.5 h-3.5" />
                        {selectedSession.sentiment}
                      </strong>
                    </div>
                    <div className="p-3 bg-navy-950/40 rounded-xl border border-navy-850/60">
                      <span className="text-[9px] uppercase font-bold text-navy-400 block mb-1">Forms Submitted</span>
                      <strong className="text-white text-xs">{selectedSession.formSubmitted ? 'Yes (Vetted) ✔' : 'No'}</strong>
                    </div>
                  </div>

                  {/* AI Smart Summary Dashboard */}
                  <div className="p-4 bg-gold-500/5 rounded-2xl border border-gold-500/10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                      <Sparkles className="w-16 h-16 text-gold-500" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gold-400 flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI generated lead summary
                    </span>
                    <p className="text-xs text-navy-100 leading-relaxed font-sans">
                      {selectedSession.aiSummary}
                    </p>
                  </div>

                  {/* Split timelines and AI chats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Activity Timeline Scroll */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-navy-200">
                        Visitor Activity Timeline
                      </h4>
                      <div className="bg-navy-950/40 rounded-2xl p-4 border border-navy-850/60 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5 space-y-4 relative">
                        
                        {selectedSession.timeline && selectedSession.timeline.length > 0 ? (
                          <div className="relative border-l border-navy-800 pl-4 ml-2 space-y-4">
                            {selectedSession.timeline.map((event, idx) => (
                              <div key={idx} className="relative text-xs">
                                {/* Bullet indicator circle */}
                                <div className="absolute -left-[23px] w-4.5 h-4.5 rounded-full bg-navy-950 border border-navy-800 flex items-center justify-center flex-shrink-0">
                                  {getTimelineIcon(event.type)}
                                </div>
                                <div className="font-semibold text-white">{event.details}</div>
                                <div className="text-[9px] text-navy-400 font-mono mt-0.5">
                                  {new Date(event.timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-navy-500 text-xs py-8">
                            No active actions recorded on timeline.
                          </div>
                        )}
                        
                      </div>
                    </div>

                    {/* Verbatim AI Chat Transcript */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-navy-200">
                        Chat Assistant Dialogues
                      </h4>
                      <div className="bg-navy-950/40 rounded-2xl p-4 border border-navy-850/60 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5 space-y-3">
                        {selectedSession.aiChatLog && selectedSession.aiChatLog.length > 0 ? (
                          selectedSession.aiChatLog.map((log, idx) => (
                            <div key={idx} className="text-xs leading-relaxed">
                              <span className={`text-[9px] font-bold uppercase tracking-wider block mb-0.5 ${
                                log.sender === 'user' ? 'text-gold-500' : 'text-blue-400'
                              }`}>
                                {log.sender === 'user' ? 'Client Desk:' : 'Siddhant AI Desk:'}
                              </span>
                              <p className="text-navy-100 italic bg-white/5 p-2 rounded-xl border border-white/5">
                                "{log.text}"
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-navy-500 text-xs py-10 flex flex-col justify-center items-center h-full">
                            <MessageSquare className="w-8 h-8 text-navy-750 mb-2" />
                            <span>Client has not engaged the AI assistant.</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Actions CTA Communication Row */}
                  {(selectedSession.leadPhone || selectedSession.leadEmail) && (
                    <div className="pt-4 border-t border-navy-800 flex items-center justify-between gap-4">
                      <div className="text-xs">
                        <span className="text-navy-300 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Callback Coordinates</span>
                        <strong className="text-white">{selectedSession.leadPhone || selectedSession.leadEmail}</strong>
                      </div>
                      
                      <div className="flex gap-2">
                        {selectedSession.leadPhone && (
                          <button
                            onClick={() => handleCallbackClick(selectedSession)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            WhatsApp Lead
                          </button>
                        )}
                        {selectedSession.leadEmail && (
                          <a
                            href={`mailto:${selectedSession.leadEmail}?subject=Siddhant Yenare & Co. Callback - Priority Scheduling&body=Hello ${selectedSession.leadName || 'Valued Partner'},\n\nThis is CA Siddhant Yenare's office. We received your priority query and would like to arrange an introductory consultation regarding your corporate tax requirements...`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs rounded-xl shadow-md cursor-pointer hover:shadow-gold-500/10 transition-all"
                          >
                            Email Proposal
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                </div>

              </motion.div>
            ) : (
              <div className="h-64 flex items-center justify-center text-navy-500 border border-dashed border-navy-800 rounded-2xl bg-navy-950/20">
                <AlertCircle className="w-8 h-8 text-navy-700 mr-2" />
                <span className="text-sm">Select a visitor profile from the left pane to analyze intelligence.</span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
