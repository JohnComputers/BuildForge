'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { setUnlock, recordPurchase } from '@/lib/storage';
import { PLAN_PRICE, type Plan } from '@/lib/payments';

function parsePlan(): Plan {
  if (typeof window === 'undefined') return 'full';
  const p = new URLSearchParams(window.location.search).get('plan');
  return p === 'pro' ? 'pro' : 'full';
}

export default function SuccessPage() {
  const [plan, setPlan] = useState<Plan>('full');
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.title = 'Purchase complete · BuildForge AI';
    const p = parsePlan();
    setPlan(p);
    setUnlock(p);
    recordPurchase(p, PLAN_PRICE[p]);
    setDone(true);
  }, []);

  const label = plan === 'pro' ? 'Performance Build Pro' : 'Full Build Plan';

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
          <svg
            className="h-8 w-8 text-ignition-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        <span className="hud-label mt-6 block text-spec">Payment confirmed</span>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          {label} unlocked.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-white/55">
          Your full roadmap, budget breakdown, and PDF export are now available. Head back to the
          planner and generate your build to see everything unlocked.
        </p>

        {done && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/planner" className="btn-ignition flex justify-center">
              Go to my build
            </Link>
            <Link href="/" className="btn-ghost flex justify-center">
              Back home
            </Link>
          </div>
        )}

        <p className="mt-6 text-xs text-white/35">
          Unlock is stored on this device. Use the same browser to access your plan.
        </p>
      </motion.div>
    </div>
  );
}
