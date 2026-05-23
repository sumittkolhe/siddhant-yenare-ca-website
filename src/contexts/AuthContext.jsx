import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isDemoMode } from '../lib/firebase';

const AuthContext = createContext(null);

// ─── Demo mode helpers ─────────────────────────────────────────────────────────
const DEMO_EMAIL = 'admin@siddhantca.com';
const DEMO_PASSWORD = 'admin123';

const getDemoUser = () => {
  try {
    const loggedIn = localStorage.getItem('mockAdminLoggedIn');
    if (loggedIn === 'true') {
      return { email: DEMO_EMAIL, uid: 'admin-123-demo' };
    }
  } catch {}
  return null;
};

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase Auth listener
    let unsubscribe;

    if (isDemoMode || !auth || typeof auth.onAuthStateChanged !== 'function') {
      // Demo mode: check localStorage
      const demoUser = getDemoUser();
      setUser(demoUser);
      setLoading(false);
    } else {
      try {
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUser({
              email: firebaseUser.email,
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Auth listener error:', error);
        // Fall back to demo
        const demoUser = getDemoUser();
        setUser(demoUser);
        setLoading(false);
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    // Demo mode or Firebase unavailable
    if (isDemoMode || !auth || typeof auth.signInWithEmailAndPassword !== 'function') {
      await new Promise((r) => setTimeout(r, 800)); // simulate network

      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        try {
          localStorage.setItem('mockAdminLoggedIn', 'true');
        } catch {}
        const demoUser = { email: DEMO_EMAIL, uid: 'admin-123-demo' };
        setUser(demoUser); // ← THIS WAS THE BUG — never called before
        return { user: demoUser };
      }

      throw {
        code: 'auth/invalid-credential',
        message: 'Invalid credentials. Use admin@siddhantca.com / admin123',
      };
    }

    // Real Firebase Auth
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user };
    } catch (error) {
      console.error('Firebase login error:', error);
      // Fall back to demo credentials if Firebase fails
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        try {
          localStorage.setItem('mockAdminLoggedIn', 'true');
        } catch {}
        const demoUser = { email: DEMO_EMAIL, uid: 'admin-123-demo' };
        setUser(demoUser);
        return { user: demoUser };
      }
      throw error;
    }
  };

  const logout = async () => {
    // Demo mode or Firebase unavailable
    if (isDemoMode || !auth || typeof auth.signOut !== 'function') {
      try {
        localStorage.removeItem('mockAdminLoggedIn');
      } catch {}
      setUser(null);
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase logout error:', error);
    }
    try {
      localStorage.removeItem('mockAdminLoggedIn');
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
