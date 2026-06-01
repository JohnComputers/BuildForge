'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Reveal } from '@/components/Effects';

function friendlyError(code: string): string {
  if (code.includes('invalid-credential') || code.includes('wrong-password'))
    return 'Email or password is incorrect.';
  if (code.includes('email-already-in-use')) return 'An account with that email already exists.';
  if (code.includes('weak-password')) return 'Password should be at least 6 characters.';
  if (code.includes('invalid-email')) return 'That email address looks invalid.';
  if (code.includes('popup-closed')) return 'Google sign-in was cancelled.';
  return 'Something went wrong. Please try again.';
}

export default function LoginPage() {
  const { user, configured, signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Account · BuildForge AI';
  }, []);

  useEffect(() => {
    if (user) router.replace('/planner');
  }, [user, router]);

  async function submit() {
    setErr('');
    if (!email || !password || (mode === 'signup' && !name)) {
      setErr('Please fill in all fields.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'login') await signIn(email, password);
      else await signUp(name, email, password);
      router.replace('/planner');
    } catch (e: unknown) {
      const code = e && typeof e === 'object' && 'code' in e ? String((e as { code: string }).code) : '';
      setErr(friendlyError(code));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setErr('');
    setBusy(true);
    try {
      await signInWithGoogle();
      router.replace('/planner');
    } catch (e: unknown) {
      const code = e && typeof e === 'object' && 'code' in e ? String((e as { code: string }).code) : '';
      setErr(friendlyError(code));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-5 py-16">
      <Reveal>
        <div className="panel w-full max-w-md p-8">
          <span className="hud-label text-ignition-400">Account</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            {mode === 'login' ? 'Welcome back' : 'Create your garage'}
          </h1>
          <p className="mt-2 text-sm text-white/55">
            {mode === 'login'
              ? 'Log in to access your unlocked builds on any device.'
              : 'Save your purchases to your account and access them anywhere.'}
          </p>

          {!configured && (
            <div className="mt-5 rounded-lg border border-ignition/30 bg-ignition/5 p-3 text-xs text-white/70">
              Authentication isn&apos;t configured in this deployment yet. Add your Firebase keys to
              <span className="font-mono"> .env.local</span> (see README) to enable accounts.
            </div>
          )}

          <div className="mt-6 space-y-4">
            <AnimatePresence mode="popLayout">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="hud-label mb-1.5 block text-white/50">Name</label>
                  <input
                    className="field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    disabled={!configured || busy}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="hud-label mb-1.5 block text-white/50">Email</label>
              <input
                className="field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="you@email.com"
                disabled={!configured || busy}
              />
            </div>

            <div>
              <label className="hud-label mb-1.5 block text-white/50">Password</label>
              <input
                className="field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="••••••••"
                disabled={!configured || busy}
              />
            </div>

            {err && <p className="text-xs text-ignition-400">{err}</p>}

            <button
              onClick={submit}
              disabled={!configured || busy}
              className="btn-ignition flex w-full justify-center disabled:opacity-50"
            >
              {busy ? 'Working…' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>

            <div className="flex items-center gap-3 text-[11px] text-white/30">
              <span className="h-px flex-1 bg-line" />
              OR
              <span className="h-px flex-1 bg-line" />
            </div>

            <button
              onClick={google}
              disabled={!configured || busy}
              className="btn-ghost flex w-full items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#fff"
                  d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.37-1.6 4.02-5.27 4.02a5.96 5.96 0 0 1 0-11.92c1.7 0 2.84.72 3.49 1.34l2.38-2.3C18.51 3.65 16.6 2.8 14.17 2.8a9.2 9.2 0 1 0 0 18.4c5.31 0 8.83-3.73 8.83-8.99 0-.6-.06-1.06-.15-1.51z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/55">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setErr('');
              }}
              className="text-spec hover:text-spec-400"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

          <p className="mt-4 text-center text-xs text-white/30">
            <Link href="/" className="hover:text-white/50">
              ← Back home
            </Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
}
