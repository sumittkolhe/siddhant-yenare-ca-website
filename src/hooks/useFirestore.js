import { useState, useCallback } from 'react';
import { db, isDemoMode } from '../lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

// ─── localStorage mock helpers (for demo mode fallback) ────────────────────────
const getMockQueries = () => {
  try {
    const stored = localStorage.getItem('mockQueries');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveMockQueries = (queries) => {
  try {
    localStorage.setItem('mockQueries', JSON.stringify(queries));
  } catch {
    console.warn('localStorage quota exceeded – cannot persist mock queries.');
  }
};

let mockListeners = [];

const notifyMockListeners = () => {
  const currentQueries = getMockQueries().map((q) => ({
    ...q,
    createdAt: new Date(q.createdAt),
    updatedAt: new Date(q.updatedAt),
  }));
  mockListeners.forEach((cb) => {
    try {
      cb(currentQueries);
    } catch (err) {
      console.error('Mock listener error:', err);
    }
  });
};

// ─── Mock CRUD helpers ─────────────────────────────────────────────────────────
const mockAddQuery = async (queryData, file) => {
  await new Promise((r) => setTimeout(r, 800)); // simulate network
  const newQuery = {
    id: Date.now().toString(),
    ...queryData,
    fileUrl: file ? 'mock-attachment-url' : null,
    fileName: file ? file.name : null,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: '',
  };
  const current = getMockQueries();
  saveMockQueries([newQuery, ...current]);
  notifyMockListeners();
  return { id: newQuery.id, fileUrl: newQuery.fileUrl };
};

const mockSubscribe = (callback) => {
  mockListeners.push(callback);
  const current = getMockQueries().map((q) => ({
    ...q,
    createdAt: new Date(q.createdAt),
    updatedAt: new Date(q.updatedAt),
  }));
  callback(current);
  return () => {
    mockListeners = mockListeners.filter((l) => l !== callback);
  };
};

const mockUpdate = async (id, updates) => {
  const current = getMockQueries();
  const updated = current.map((q) =>
    q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
  );
  saveMockQueries(updated);
  notifyMockListeners();
};

const mockDelete = async (id) => {
  const filtered = getMockQueries().filter((q) => q.id !== id);
  saveMockQueries(filtered);
  notifyMockListeners();
};

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useFirestore() {
  const [loading, setLoading] = useState(false);

  // ---------- addQuery ----------
  const addQuery = useCallback(
    async (queryData, file = null) => {
      setLoading(true);
      try {
        if (isDemoMode || !db || typeof db === 'object' && Object.keys(db).length === 0) {
          return await mockAddQuery(queryData, file);
        }

        const docData = {
          ...queryData,
          fileUrl: null,
          fileName: null,
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          notes: '',
        };

        // If there's a file, upload to Firebase Storage
        if (file) {
          const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
          const storage = getStorage();
          const storageRef = ref(storage, `client-files/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          docData.fileUrl = await getDownloadURL(storageRef);
          docData.fileName = file.name;
        }

        const docRef = await addDoc(collection(db, 'queries'), docData);
        return { id: docRef.id, fileUrl: docData.fileUrl };
      } catch (error) {
        console.error('Error adding query, falling back to localStorage:', error);
        return await mockAddQuery(queryData, file);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ---------- subscribeToQueries ----------
  const subscribeToQueries = useCallback(
    (callback) => {
      if (isDemoMode || !db || typeof db === 'object' && Object.keys(db).length === 0) {
        return mockSubscribe(callback);
      }

      try {
        const q = query(collection(db, 'queries'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const queries = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            callback(queries);
          },
          (error) => {
            console.error('Firestore subscription error, falling back to localStorage:', error);
            return mockSubscribe(callback);
          }
        );
        return unsubscribe;
      } catch (error) {
        console.error('Error subscribing to queries, falling back to localStorage:', error);
        return mockSubscribe(callback);
      }
    },
    []
  );

  // ---------- updateQuery ----------
  const updateQuery = useCallback(
    async (id, updates) => {
      try {
        if (isDemoMode || !db || typeof db === 'object' && Object.keys(db).length === 0) {
          return await mockUpdate(id, updates);
        }

        await updateDoc(doc(db, 'queries', id), {
          ...updates,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error updating query, falling back to localStorage:', error);
        return await mockUpdate(id, updates);
      }
    },
    []
  );

  // ---------- deleteQuery ----------
  const deleteQuery = useCallback(
    async (id) => {
      try {
        if (isDemoMode || !db || typeof db === 'object' && Object.keys(db).length === 0) {
          return await mockDelete(id);
        }

        await deleteDoc(doc(db, 'queries', id));
      } catch (error) {
        console.error('Error deleting query, falling back to localStorage:', error);
        return await mockDelete(id);
      }
    },
    []
  );

  return { loading, addQuery, subscribeToQueries, updateQuery, deleteQuery };
}
