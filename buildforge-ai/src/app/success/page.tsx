'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { setUnlock, recordPurchase } from '@/lib/storage';
import { PLAN_PRICE, type Plan } from '@/lib/payments';
import { grantEntitlement } from '@/lib/entitlements';
import { useAuth } from '@/lib/auth';
import { useBackend } from '@/lib/firebase';

function parsePlan(): Plan {
  if (typeof window === 'undefined') return 'full';
  const p = new URLSearchParams(window.location.search).get('plan');
  return p === 'pro' ? 'pro' : 'full';
}

export default function SuccessPage() {
  const { user, tier, loading, configured, refreshTier } = useAuth();
  const [plan, setPlan] = useState<Plan>('full');
  const [savedToAccount, setSavedToAccount] = useState(false);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    document.title = 'Purchase complete · BuildForge AI';
    const p = parsePlan();
    setPlan(p);
    recordPurchase(p, PLAN_PRICE[p]);

    // In legacy (no-backend) mode, unlock locally so the buyer gets access now.
    // In secure mode we do NOT trust the browser — the webhook grants the tier.
    if (!useBackend) setUnlock(p);
  }, []);

  // Legacy mode only: persist to the account from the client if logged in.
  useEffect(() => {
    if (useBackend || loading || processed) return;
    const p = parsePlan();
    (async () => {
      if (user) {
        await grantEntitlement(user.uid, p);
        await refreshTier();
        setSavedToAccount(true);
      }
      setProcessed(true);
    })();
  }, [loading, user, processed, refreshTier]);

  const label = plan === 'pro' ? 'Performance Build Pro' : 'Full Build Plan';

  // In secure mode, the unlock is confirmed when the account tier covers the plan.
  const rank = { free: 0, full: 1, pro: 2 } as const;
  const confirmed = useBackend ? rank[tier] >= rank[plan] : true;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="panel w-full max-w-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ignition/15"
        >
          {confirmed ? (
            <svg
              className="h-8 w-8 text-ignition-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-ignition/30 border-t-ignition" />
          )}
        </motion.div>

        <span className="hud-label mt-6 block text-spec">
          {confirmed ? 'Payment confirmed' : 'Confirming payment'}
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          {confirmed ? `${label} unlocked.` : 'Finalizing your purchase…'}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-white/55">
          {confirmed
            ? 'Your full roadmap, budget breakdown, and PDF export are now available. Head to the planner and generate your build.'
            : 'We’re verifying your payment with Square. This usually takes a few seconds and updates here automatically.'}
        </p>

        {/* Account status */}
        {configured && (
          <div className="mt-5 rounded-lg border border-line bg-ink-850/60 p-3 text-sm">
            {useBackend ? (
              confirmed ? (
                <span className="text-spec">✓ Saved to your account — available on any device.</span>
              ) : (
                <span className="text-white/50">Waiting for confirmation…</span>
              )
            ) : savedToAccount ? (
              <span className="text-spec">✓ Saved to your account — available on any device.</span>
            ) : user ? (
              <span className="text-white/50">Syncing to your account…</span>
            ) : (
              <span className="text-white/70">
                Unlocked on this device.{' '}
                <Link href="/login" className="text-spec hover:text-spec-400">
                  Log in
                </Link>{' '}
                to save this purchase to your account.
              </span>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/planner" className="btn-ignition flex justify-center">
            Go to my build
          </Link>
          <Link href="/" className="btn-ghost flex justify-center">
            Back home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
