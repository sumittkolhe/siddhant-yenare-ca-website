// Firebase initialization with graceful demo-mode fallback
// No SDK is loaded at all in demo mode to avoid console errors

// Check if real Firebase credentials are configured
const hasRealCredentials = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return apiKey && apiKey !== 'demo-api-key' && !apiKey.startsWith('demo-');
};

let isDemoMode = !hasRealCredentials();

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isDemoMode) {
  // Demo mode — provide null objects that hooks/contexts will detect
  // No Firebase SDK is imported, so no initialization errors
  console.info(
    '🔶 Firebase is running in DEMO MODE (localStorage-based).\n' +
    '   To connect a real Firebase project, set VITE_FIREBASE_* in your .env file.'
  );
  app = { name: '[DEMO]' };
  auth = null;
  db = null;
  storage = null;
} else {
  // Real Firebase — dynamically import SDK only when needed
  try {
    const fbApp = await import('firebase/app');
    const fbAuth = await import('firebase/auth');
    const fbFirestore = await import('firebase/firestore');
    const fbStorage = await import('firebase/storage');

    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const firebaseApp = fbApp.initializeApp(firebaseConfig);
    app = firebaseApp;
    auth = fbAuth.getAuth(firebaseApp);
    db = fbFirestore.getFirestore(firebaseApp);
    storage = fbStorage.getStorage(firebaseApp);

    console.info('✅ Firebase connected successfully');
  } catch (error) {
    console.error('Firebase initialization failed — falling back to demo mode:', error.message);
    isDemoMode = true;
    app = { name: '[FALLBACK-DEMO]' };
    auth = null;
    db = null;
    storage = null;
  }
}

export { auth, db, storage };
export default app;
export { isDemoMode };
