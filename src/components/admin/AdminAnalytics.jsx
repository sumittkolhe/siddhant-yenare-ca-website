import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Sparkles, RefreshCw, Layers, Clock, Smile } from 'lucide-react';
import { getAllSessions } from '../../lib/tracking';

export default function AdminAnalytics() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    const data = await getAllSessions();
    setSessions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gold-500">
        <RefreshCw className="w-8 h-8 animate-spin mr-2" />
        <span className="text-sm font-semibold uppercase tracking-wider">Compiling metrics...</span>
      </div>
    );
  }

  // ─── Calculate service popularities ─────────────────────────────────────────
  const serviceCounts = {
    'GST Filing': 0,
    'Income Tax Return': 0,
    'Audit & Assurance': 0,
    'Company Registration': 0,
    'MSME Registration': 0,
    'Financial Consulting': 0,
    'Tax Planning': 0,
    'Payroll Services': 0,
  };

  sessions.forEach((s) => {
    s.services?.forEach((svc) => {
      if (svc === 'gst') serviceCounts['GST Filing']++;
      else if (svc === 'income-tax') serviceCounts['Income Tax Return']++;
      else if (svc === 'audit') serviceCounts['Audit & Assurance']++;
      else if (svc === 'company') serviceCounts['Company Registration']++;
      else if (svc === 'compliance') serviceCounts['MSME Registration']++;
      else if (svc === 'advisory') serviceCounts['Financial Consulting']++;
      else if (svc === 'wealth') serviceCounts['Tax Planning']++;
      else if (svc === 'accounting') serviceCounts['Payroll Services']++;
    });
  });

  const popularityData = Object.entries(serviceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const maxVal = Math.max(...popularityData.map((d) => d.value), 1);

  // ─── Calculate conversion funnel values ─────────────────────────────────────
  const funnelSteps = [
    { label: 'Total Landings', desc: 'Visited home page', count: sessions.length, pct: 100 },
    {
      label: 'Service Engagement',
      desc: 'Inspected compliance services',
      count: sessions.filter((s) => s.services?.length > 0).length,
      pct: 0,
    },
    {
      label: 'AI Conversationalists',
      desc: 'Asked questions to chatbot',
      count: sessions.filter((s) => s.aiQuestions > 0).length,
      pct: 0,
    },
    {
      label: 'High-Intent Leads',
      desc: 'Form bookings & uploads logged',
      count: sessions.filter((s) => s.formSubmitted || s.fileUploaded).length,
      pct: 0,
    },
  ];

  // Calculate actual conversion percentages
  funnelSteps[1].pct = sessions.length ? Math.round((funnelSteps[1].count / sessions.length) * 100) : 0;
  funnelSteps[2].pct = sessions.length ? Math.round((funnelSteps[2].count / sessions.length) * 100) : 0;
  funnelSteps[3].pct = sessions.length ? Math.round((funnelSteps[3].count / sessions.length) * 100) : 0;

  // ─── Sentiment metrics ──────────────────────────────────────────────────────
  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  sessions.forEach((s) => {
    sentimentCounts[s.sentiment || 'neutral']++;
  });
  const totalSentiment = Math.max(sessions.length, 1);
  const positivePct = Math.round((sentimentCounts.positive / totalSentiment) * 100);
  const neutralPct = Math.round((sentimentCounts.neutral / totalSentiment) * 100);
  const negativePct = Math.round((sentimentCounts.negative / totalSentiment) * 100);

  // ─── Heatmap matrix (24 hours grid) ─────────────────────────────────────────
  const hoursGrid = Array.from({ length: 24 }, (_, i) => {
    let activityCount = 0;
    sessions.forEach((s) => {
      const date = new Date(s.createdAt);
      if (date.getHours() === i) {
        activityCount += (s.clicks || 0) + (s.aiQuestions || 0) + 1;
      }
    });
    return { hour: i, score: activityCount };
  });
  const maxHourScore = Math.max(...hoursGrid.map((h) => h.score), 1);

  return (
    <div className="space-y-8 pb-12 text-white">
      
      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Service Popularity Chart Box */}
        <div className="lg:col-span-7 bg-[#0c1624]/60 border border-navy-800/80 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-gold-400" />
            <h3 className="text-lg font-bold">Service Sector Popularity</h3>
          </div>

          <div className="space-y-4">
            {popularityData.map((d, index) => {
              const widthPct = Math.round((d.value / maxVal) * 100);
              return (
                <div key={d.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold font-sans">
                    <span className="text-navy-200">{d.name}</span>
                    <span className="text-gold-400 font-mono">{d.value} views</span>
                  </div>
                  <div className="h-4 w-full bg-navy-950/80 rounded-lg overflow-hidden border border-white/5 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: index * 0.05 }}
                      className="h-full bg-gradient-to-r from-gold-500/80 to-gold-400 rounded-lg"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversion Funnel Box */}
        <div className="lg:col-span-5 bg-[#0c1624]/60 border border-navy-800/80 rounded-2xl p-6 backdrop-blur-xl flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-gold-400" />
            <h3 className="text-lg font-bold">Conversion Funnel</h3>
          </div>

          <div className="flex-1 flex flex-col justify-between space-y-4">
            {funnelSteps.map((step, idx) => {
              // width scaling according to funnel drop-off
              const widthScale = 100 - idx * 12;
              return (
                <div key={step.label} className="relative flex flex-col items-center">
                  <div
                    style={{ width: `${widthScale}%` }}
                    className={`p-3.5 rounded-xl border flex flex-col justify-center items-center text-center relative overflow-hidden transition-all duration-300 ${
                      idx === 0
                        ? 'bg-gold-500/10 border-gold-500/35 text-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.05)]'
                        : idx === 1
                        ? 'bg-navy-900/60 border-navy-800/80 text-navy-100'
                        : idx === 2
                        ? 'bg-navy-950/40 border-navy-850/60 text-navy-200'
                        : 'bg-green-500/10 border-green-500/30 text-green-400'
                    }`}
                  >
                    <span className="text-xs font-bold font-display uppercase tracking-wider">{step.label}</span>
                    <div className="flex items-baseline gap-2 mt-1.5 font-mono">
                      <span className="text-lg font-bold">{step.count}</span>
                      <span className="text-[10px] opacity-70">({step.pct}%)</span>
                    </div>
                  </div>
                  
                  {/* Drop-off visual arrow */}
                  {idx < funnelSteps.length - 1 && (
                    <div className="w-px h-6 bg-gradient-to-b from-gold-500/30 to-navy-800 my-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid Row 2: Heatmap & Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Heatmap Hourly Box */}
        <div className="lg:col-span-8 bg-[#0c1624]/60 border border-navy-800/80 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold-400" />
              <div>
                <h3 className="text-lg font-bold">24-Hour Traffic Waves</h3>
                <p className="text-[10px] text-navy-300">Visualizing high-activity time slots across active visitor logs</p>
              </div>
            </div>
            <span className="text-xs font-mono text-gold-500 font-semibold px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/20">
              Live Index
            </span>
          </div>

          {/* Grid layout of 24 blocks */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 text-center">
            {hoursGrid.map((cell) => {
              const fraction = cell.score / maxHourScore;
              const formattedTime = cell.hour.toString().padStart(2, '0') + ':00';
              return (
                <div
                  key={cell.hour}
                  className="p-2.5 rounded-xl border border-navy-800 flex flex-col items-center justify-center bg-navy-950/40 relative overflow-hidden group hover:border-gold-500/30 transition-all duration-200"
                >
                  <div
                    className="absolute inset-0 bg-gold-500/10 opacity-0 pointer-events-none transition-all"
                    style={{
                      opacity: fraction * 0.8,
                      backgroundColor: fraction > 0.6 ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.06)'
                    }}
                  />
                  <span className="text-[9px] text-navy-300 font-mono font-bold leading-none">{formattedTime}</span>
                  <span className="text-xs font-bold text-white font-mono mt-1.5 relative z-10">{cell.score}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sentiment Analysis Box */}
        <div className="lg:col-span-4 bg-[#0c1624]/60 border border-navy-800/80 rounded-2xl p-6 backdrop-blur-xl flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Smile className="w-5 h-5 text-gold-400" />
            <h3 className="text-lg font-bold">Client AI Sentiment Analysis</h3>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-5">
            {/* Positive */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-green-400">Positive Intent (High Consultation interest)</span>
                <span className="text-green-400 font-mono">{positivePct}%</span>
              </div>
              <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${positivePct}%` }} />
              </div>
            </div>

            {/* Neutral */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-navy-300">Neutral Intent (General Informational inquiries)</span>
                <span className="text-navy-300 font-mono">{neutralPct}%</span>
              </div>
              <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden">
                <div className="h-full bg-navy-500 rounded-full" style={{ width: `${neutralPct}%` }} />
              </div>
            </div>

            {/* Negative */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-red-400">Discrepancy / Disputed Sentiment</span>
                <span className="text-red-400 font-mono">{negativePct}%</span>
              </div>
              <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${negativePct}%` }} />
              </div>
            </div>

            {/* AI Summary note */}
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] text-navy-300 leading-relaxed mt-2 text-center">
              Sentiment index indicates that **{positivePct}%** of active visitor sessions resulted in high engagement callback intents.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
