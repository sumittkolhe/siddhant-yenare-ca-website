// Session Tracking and Mock Database Generator
import { db, isDemoMode } from './firebase';

const SESSION_KEY = 'ca_visitor_session_id';
const LOCAL_SESSIONS_KEY = 'ca_mock_visitor_sessions';

// Helper to generate a random IP and Location for India
const getRandomVisitorMeta = () => {
  const cities = ['Mumbai', 'Pune', 'Bengaluru', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];
  const ips = ['103.86.122.', '122.161.33.', '117.200.48.', '49.36.80.', '223.233.10.'];
  
  const city = cities[Math.floor(Math.random() * cities.length)];
  const ip = ips[Math.floor(Math.random() * ips.length)] + Math.floor(Math.random() * 254 + 1);
  return { city, ip };
};

// ─── Core Heuristic Scoring Engine ─────────────────────────────────────────────
export const calculateLeadScore = (session) => {
  let score = 0;
  
  // 1. Engagement (pages & services viewed)
  const pageViews = session.pages?.length || 0;
  const serviceViews = session.services?.length || 0;
  score += Math.min(pageViews * 5, 20); // max 20 pts
  score += Math.min(serviceViews * 8, 30); // max 30 pts
  
  // 2. Click engagement
  const clicks = session.clicks || 0;
  score += Math.min(clicks * 4, 15); // max 15 pts
  
  // 3. AI chat usage
  const aiChats = session.aiQuestions || 0;
  score += Math.min(aiChats * 8, 25); // max 25 pts
  
  // 4. Consultation attempt / form submissions (huge points)
  if (session.formSubmitted) score += 20;
  if (session.fileUploaded) score += 15;
  
  // Cap at 100
  const finalScore = Math.min(score, 100);
  
  let status = 'cold';
  if (finalScore >= 75) status = 'hot';
  else if (finalScore >= 35) status = 'warm';
  
  return { score: finalScore, status };
};

// ─── Generate Realistic Seed Data ─────────────────────────────────────────────
const generateMockSessions = () => {
  const mockNames = ['Aarav Sharma', 'Neha Patel', 'Vikram Singh', 'Ananya Iyer', 'Rahul Mehta', 'Sneha Reddy', 'Aditya Joshi', 'Priya Verma', 'Kabir Sen', 'Diya Malhotra'];
  const mockEmails = ['aarav@gmail.com', 'neha.patel@outlook.com', 'vikram@singh.in', 'ananya.iyer@gmail.com', 'rahul@mehtaco.com', 'sneha.reddy@yahoo.com', 'aditya@joshitech.com', 'priya@vermaconsulting.com', 'kabir@sen.org', 'diya@malhotra.me'];
  const mockPhones = ['9876543210', '8765432109', '7654321098', '9988776655', '8877665544', '9123456789', '9812345678', '9934567890', '8845678901', '7756789012'];
  
  const sampleChatLogs = [
    [
      { sender: 'user', text: 'What is the due date for GST annual return GSTR-9?', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
      { sender: 'ai', text: 'For Siddhant Yenare & Co., the standard due date for filing GST Annual Return (GSTR-9) and Reconciliation Statement (GSTR-9C) for a financial year is usually **31st December** of the subsequent financial year. However, it can sometimes be extended by the government. Would you like me to connect you with our tax specialists for professional verification?', timestamp: new Date(Date.now() - 3600000 * 2 + 5000).toISOString() },
      { sender: 'user', text: 'Yes, that would be helpful.', timestamp: new Date(Date.now() - 3600000 * 2 + 30000).toISOString() }
    ],
    [
      { sender: 'user', text: 'How do I register a private limited company in Pune?', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
      { sender: 'ai', text: 'Registering a Private Limited Company requires: \n1. Obtaining DSC (Digital Signature Certificates) for directors\n2. DIN (Director Identification Numbers)\n3. Name approval via RUN service\n4. SPICe+ filing for incorporation\n\nSiddhant Yenare & Co. handles this end-to-end in 7-10 business days. Would you like to check what documents are required?', timestamp: new Date(Date.now() - 3600000 * 5 + 6000).toISOString() },
      { sender: 'user', text: 'Yes, tell me documents needed', timestamp: new Date(Date.now() - 3600000 * 5 + 20000).toISOString() },
      { sender: 'ai', text: 'You will need: \n- PAN Card and Aadhaar of all Directors\n- Proof of Identity (Voter ID/Passport/Driving License)\n- Proof of Address (Bank statement/Electricity bill)\n- Registered Office utility bill and NOC from owner.\n\nI can schedule a dedicated setup call for your startup. May I have your phone number?', timestamp: new Date(Date.now() - 3600000 * 5 + 25000).toISOString() }
    ],
    [
      { sender: 'user', text: 'What is the limit for tax audit under Section 44AB?', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
      { sender: 'ai', text: 'Under Section 44AB of the Income Tax Act, a tax audit is mandatory if business turnover exceeds **₹1 Crore** (or **₹10 Crores** if cash transactions are less than 5% of total turnover). For professionals, the limit is **₹50 Lakhs**. Let me know if you would like Siddhant Yenare & Co. to audit your books!', timestamp: new Date(Date.now() - 3600000 * 12 + 8000).toISOString() }
    ]
  ];

  const sessions = [];
  
  for (let i = 0; i < 15; i++) {
    const isReturning = Math.random() > 0.4;
    const { city, ip } = getRandomVisitorMeta();
    const daysAgo = i * 0.8 + 0.2;
    const timeOffset = daysAgo * 24 * 3600 * 1000;
    const date = new Date(Date.now() - timeOffset);
    
    const pages = ['home'];
    if (Math.random() > 0.3) pages.push('services');
    if (Math.random() > 0.6) pages.push('document-analyzer');
    if (Math.random() > 0.8) pages.push('admin');
    
    const services = [];
    if (Math.random() > 0.2) services.push('gst');
    if (Math.random() > 0.4) services.push('income-tax');
    if (Math.random() > 0.6) services.push('company');
    if (Math.random() > 0.8) services.push('audit');
    if (Math.random() > 0.9) services.push('advisory');

    const formSubmitted = Math.random() > 0.65;
    const fileUploaded = Math.random() > 0.75;
    const clicks = Math.floor(Math.random() * 8 + 2);
    const aiQuestions = Math.random() > 0.5 ? Math.floor(Math.random() * 3 + 1) : 0;
    
    const hasChat = aiQuestions > 0;
    const chatLog = hasChat ? sampleChatLogs[Math.floor(Math.random() * sampleChatLogs.length)] : [];
    
    // Construct timeline
    const timeline = [
      { type: 'page_view', details: 'Visited Landing Page', timestamp: new Date(date.getTime()).toISOString() }
    ];
    
    services.forEach((s, idx) => {
      timeline.push({
        type: 'service_view',
        details: `Inspected Service Details: ${s.toUpperCase()}`,
        timestamp: new Date(date.getTime() + (idx + 1) * 60000).toISOString()
      });
    });

    if (clicks > 0) {
      timeline.push({
        type: 'click',
        details: `Clicked 'Book Consultation' CTA`,
        timestamp: new Date(date.getTime() + 180000).toISOString()
      });
    }

    if (hasChat) {
      timeline.push({
        type: 'ai_chat',
        details: `Initiated AI chat support (${aiQuestions} queries)`,
        timestamp: new Date(date.getTime() + 240000).toISOString()
      });
    }

    if (fileUploaded) {
      timeline.push({
        type: 'file_upload',
        details: `Uploaded GST Invoice for AI compliance audit`,
        timestamp: new Date(date.getTime() + 300000).toISOString()
      });
    }

    if (formSubmitted) {
      const name = mockNames[i % mockNames.length];
      const email = mockEmails[i % mockEmails.length];
      const phone = mockPhones[i % mockPhones.length];
      
      timeline.push({
        type: 'query_submit',
        details: `Submitted Consulting Request form (${name})`,
        timestamp: new Date(date.getTime() + 360000).toISOString()
      });
      
      var leadName = name;
      var leadEmail = email;
      var leadPhone = phone;
    }

    // Build the session entity
    const sessionObj = {
      id: `session-${i}-${Date.now()}`,
      ip,
      city,
      createdAt: date.toISOString(),
      updatedAt: new Date(date.getTime() + 450000).toISOString(),
      duration: Math.floor(Math.random() * 600 + 60), // in seconds
      pages,
      services,
      clicks,
      aiQuestions,
      aiChatLog: chatLog,
      timeline,
      formSubmitted,
      fileUploaded,
      leadName: leadName || null,
      leadEmail: leadEmail || null,
      leadPhone: leadPhone || null,
      scrollDepth: Math.random() > 0.5 ? 100 : 75,
      returnVisits: isReturning ? Math.floor(Math.random() * 3 + 1) : 0,
      sentiment: formSubmitted ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
    };

    // Calculate score
    const scoreDetails = calculateLeadScore(sessionObj);
    sessionObj.leadScore = scoreDetails.score;
    sessionObj.leadStatus = scoreDetails.status;

    // AI Smart Insights mapping
    let aiSummary = 'Cold session with casual interest in home sections. Suggest standard remarketing.';
    if (sessionObj.leadStatus === 'hot') {
      const targetService = services[0] ? services[0].toUpperCase() : 'GST Compliance';
      aiSummary = `🔥 High-intent user interested in ${targetService}. Explored processes, talked to AI, and submitted callback. Recommend callback within 1 hour.`;
    } else if (sessionObj.leadStatus === 'warm') {
      const targetService = services[0] ? services[0].toUpperCase() : 'Corporate Compliance';
      aiSummary = `⚡ Warm lead. Reviewed ${targetService} and chatted with AI. Has not completed booking. Highly responsive to customized email pitch on ${targetService}.`;
    }
    
    sessionObj.aiSummary = aiSummary;
    sessions.push(sessionObj);
  }

  // Sort descending by date
  return sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// ─── Initialization Heuristic ──────────────────────────────────────────────────
export const initializeSessions = () => {
  try {
    const existing = localStorage.getItem(LOCAL_SESSIONS_KEY);
    if (!existing) {
      const seed = generateMockSessions();
      localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(seed));
      console.info('📈 Preloaded 15 high-fidelity user analytics profiles into LocalStorage.');
    }
  } catch (error) {
    console.error('Failed to initialize session database', error);
  }
};

// ─── Get/Update Active Session ──────────────────────────────────────────────────
export const getActiveSessionId = () => {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `session-temp-${Date.now()}`;
  }
};

// Fetch all tracked sessions (Admin Panel interface)
export const getAllSessions = async () => {
  initializeSessions();
  
  if (isDemoMode || !db) {
    try {
      const local = localStorage.getItem(LOCAL_SESSIONS_KEY);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  }

  // Real Firebase Database fetching
  try {
    const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
    const q = query(collection(db, 'visitor_sessions'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const dbSessions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
    if (dbSessions.length === 0) {
      // If Firestore is empty, seed it with the mock data!
      const { addDoc } = await import('firebase/firestore');
      const seed = generateMockSessions();
      for (const sess of seed) {
        await addDoc(collection(db, 'visitor_sessions'), sess);
      }
      return seed;
    }
    return dbSessions;
  } catch (err) {
    console.error('Firestore get sessions error, falling back to LocalStorage:', err);
    const local = localStorage.getItem(LOCAL_SESSIONS_KEY);
    return local ? JSON.parse(local) : [];
  }
};

// Update or push event to the current session log
export const trackEvent = async (eventType, details = '') => {
  const sessionId = getActiveSessionId();
  initializeSessions();

  let sessions = [];
  try {
    const local = localStorage.getItem(LOCAL_SESSIONS_KEY);
    sessions = local ? JSON.parse(local) : [];
  } catch {}

  let activeSession = sessions.find((s) => s.id === sessionId);

  if (!activeSession) {
    const { city, ip } = getRandomVisitorMeta();
    activeSession = {
      id: sessionId,
      ip,
      city,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      duration: 1,
      pages: ['home'],
      services: [],
      clicks: 0,
      aiQuestions: 0,
      aiChatLog: [],
      timeline: [],
      formSubmitted: false,
      fileUploaded: false,
      scrollDepth: 0,
      returnVisits: 0,
      sentiment: 'neutral',
      leadName: null,
      leadEmail: null,
      leadPhone: null,
    };
    sessions.unshift(activeSession);
  }

  // Update timestamps and timelines
  activeSession.updatedAt = new Date().toISOString();
  
  // Calculate duration
  const start = new Date(activeSession.createdAt).getTime();
  const end = new Date(activeSession.updatedAt).getTime();
  activeSession.duration = Math.max(1, Math.floor((end - start) / 1000));

  // Handle Event updates
  let timelineDetails = details;
  if (eventType === 'ai_chat_message' && details && typeof details === 'object') {
    timelineDetails = `${details.sender === 'user' ? 'Client' : 'AI Assistant'}: "${details.text}"`;
  } else if (eventType === 'query_submit' && details && typeof details === 'object') {
    timelineDetails = `Submitted Consulting Query (${details.name || 'Anonymous'})`;
  }

  const newTimelineItem = {
    type: eventType,
    details: timelineDetails,
    timestamp: new Date().toISOString(),
  };
  activeSession.timeline.push(newTimelineItem);

  if (eventType === 'page_view') {
    if (!activeSession.pages.includes(details)) {
      activeSession.pages.push(details);
    }
  } else if (eventType === 'service_view') {
    if (!activeSession.services.includes(details)) {
      activeSession.services.push(details);
    }
  } else if (eventType === 'click') {
    activeSession.clicks += 1;
  } else if (eventType === 'ai_chat') {
    activeSession.aiQuestions += 1;
  } else if (eventType === 'ai_chat_message') {
    activeSession.aiChatLog.push(details); // details is { sender: 'user'|'ai', text: string, timestamp: string }
  } else if (eventType === 'query_submit') {
    activeSession.formSubmitted = true;
    activeSession.leadName = details.name;
    activeSession.leadEmail = details.email;
    activeSession.leadPhone = details.phone;
    activeSession.sentiment = 'positive';
  } else if (eventType === 'file_upload') {
    activeSession.fileUploaded = true;
  } else if (eventType === 'scroll') {
    activeSession.scrollDepth = Math.max(activeSession.scrollDepth, details);
  }

  // Recalculate lead scores
  const scoreDetails = calculateLeadScore(activeSession);
  activeSession.leadScore = scoreDetails.score;
  activeSession.leadStatus = scoreDetails.status;

  // Recalculate AI Smart Insights
  let aiSummary = activeSession.aiSummary || 'Casual visitor exploring primary landing page.';
  if (activeSession.leadStatus === 'hot') {
    const svcStr = activeSession.services.join(', ').toUpperCase() || 'GST & Corporate Filing';
    aiSummary = `🔥 High-intent user. Explored: ${svcStr}. Submitted detailed callback request. Immediate call recommended.`;
  } else if (activeSession.leadStatus === 'warm') {
    const svcStr = activeSession.services.join(', ').toUpperCase() || 'Compliance Services';
    aiSummary = `⚡ Warm lead. Reviewed: ${svcStr} and actively engaged AI chatbot. Follow up via email with targeted compliance proposal.`;
  }
  activeSession.aiSummary = aiSummary;

  // Persist back
  try {
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions));
  } catch {}

  // Push to Live Firestore if possible
  if (!isDemoMode && db) {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'visitor_sessions', sessionId), activeSession, { merge: true });
    } catch (err) {
      console.error('Firestore push session error:', err);
    }
  }
};
