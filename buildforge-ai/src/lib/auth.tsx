'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, db, firebaseConfigured } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { fetchEntitlement, type Tier } from './entitlements';

interface AuthCtx {
  user: User | null;
  tier: Tier;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshTier: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<Tier>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    let unsubDoc: () => void = () => {};
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      unsubDoc();
      if (u && db) {
        // Live updates: when the backend grants a tier, the UI flips instantly.
        unsubDoc = onSnapshot(
          doc(db, 'users', u.uid),
          (snap) => {
            const t = snap.exists() ? (snap.data().tier as string) : 'free';
            setTier(t === 'pro' ? 'pro' : t === 'full' ? 'full' : 'free');
            setLoading(false);
          },
          () => setLoading(false),
        );
      } else {
        setTier('free');
        setLoading(false);
      }
    });
    return () => {
      unsub();
      unsubDoc();
    };
  }, []);

  const refreshTier = useCallback(async () => {
    if (user) setTier(await fetchEntitlement(user.uid));
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error('Authentication is not configured.');
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (!auth) throw new Error('Authentication is not configured.');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    setUser({ ...cred.user });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) throw new Error('Authentication is not configured.');
    await signInWithPopup(auth, new GoogleAuthProvider());
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    await fbSignOut(auth);
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        tier,
        loading,
        configured: firebaseConfigured,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshTier,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
}
