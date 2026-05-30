'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Reveal, TiltCard } from '@/components/Effects';
import { PLAN_PRICE, buildCheckoutUrl, isConfigured, type Plan } from '@/lib/payments';

const PLANS = [
  {
    id: 'free' as const,
    name: 'Free Build Preview',
    price: 0,
    blurb: 'See the shape of your build before committing a dollar.',
    features: [
      'First 2 modifications visible',
      'Live cost + HP preview',
      'Remaining stages blurred',
      'Unlimited previews',
    ],
    cta: 'Start free',
    highlight: false,
  },
  {
    id: 'full' as const,
    name: 'Full Build Plan',
    price: PLAN_PRICE.full,
    blurb: 'The complete roadmap, budget, and a printable spec sheet.',
    features: [
      'Complete modification roadmap',
      'Full budget breakdown',
      'HP estimate per stage',
      'Printable PDF export',
    ],
    cta: 'Unlock Full Build',
    highlight: true,
  },
  {
    id: 'pro' as const,
    name: 'Performance Build Pro',
    price: PLAN_PRICE.pro,
    blurb: 'For builds where reliability and sourcing matter.',
    features: [
      'Everything in Full Build',
      'Upgrade prioritization',
      'Reliability recommendations',
      'Parts sourcing checklist',
    ],
    cta: 'Unlock Pro',
    highlight: false,
  },
];

export default function PricingPage() {
  const [note, setNote] = useState('');

  useEffect(() => {
    document.title = 'Pricing · BuildForge AI';
  }, []);

  function buy(plan: Plan) {
    if (!isConfigured(plan)) {
      setNote(
        'Payment links are not configured in this deployment yet. Replace FULL_BUILD_PAYMENT_LINK / PRO_BUILD_PAYMENT_LINK in src/lib/payments.ts with your Square links.',
      );
      return;
    }
    window.open(buildCheckoutUrl(plan), '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <span className="hud-label text-ignition-400">Pricing</span>
            <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Pay once. Keep your build forever.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-white/55">
              No subscriptions, no accounts. Unlock the full roadmap when you&apos;re ready and
              export it to PDF.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <TiltCard
                className={`panel relative flex h-full flex-col p-7 ${
                  p.highlight ? 'ring-1 ring-ignition/50' : ''
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-7 rounded-full bg-ignition px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-950">
                    Most popular
                  </div>
                )}
                <span
                  className={`hud-label ${p.highlight ? 'text-ignition-400' : 'text-spec'}`}
                >
                  {p.name}
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-bold text-white">${p.price}</span>
                  {p.price > 0 && <span className="text-sm text-white/40">one-time</span>}
                </div>
                <p className="mt-3 text-sm text-white/55">{p.blurb}</p>

                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-white/70">
                      <span
                        className={`mt-0.5 inline-block h-4 w-4 flex-none rounded-full ${
                          p.highlight ? 'bg-ignition/20 text-ignition-400' : 'bg-spec/15 text-spec'
                        } text-center text-[10px] leading-4`}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {p.id === 'free' ? (
                  <Link
                    href="/planner"
                    className="btn-ghost mt-7 flex w-full justify-center"
                  >
                    {p.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => buy(p.id as Plan)}
                    className={`mt-7 flex w-full justify-center ${
                      p.highlight ? 'btn-ignition' : 'btn-ghost'
                    }`}
                  >
                    {p.cta}
                  </button>
                )}
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {note && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-8 max-w-xl rounded-lg border border-ignition/30 bg-ignition/5 p-4 text-center text-sm text-white/70"
          >
            {note}
          </motion.p>
        )}

        <p className="mt-10 text-center text-xs text-white/35">
          Payments processed securely by Square. Estimates are planning tools, not binding quotes.
        </p>
      </div>
    </div>
  );
}
