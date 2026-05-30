'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '@/components/Effects';

const FAQS = [
  {
    q: 'How accurate are the cost and horsepower estimates?',
    a: 'Pricing is modeled per platform using typical street prices for quality parts plus reasonable labor, and horsepower uses a physics-aware model (forced induction multiplies, bolt-ons add). It is a planning tool that gets you within striking distance of a real budget — not a binding shop quote.',
  },
  {
    q: 'Do I need an account or email to use it?',
    a: 'No. Your build lives entirely in your browser. There is no login, no email wall, and no account to manage. Unlock a plan and your full roadmap and PDF export are immediately available on that device.',
  },
  {
    q: 'How do payments work?',
    a: 'Purchases are processed through Square Payment Links. When you click buy, a Square checkout opens in a new tab. After payment you are redirected back to a success page that unlocks the premium content.',
  },
  {
    q: 'Is this a subscription?',
    a: 'No. Both the Full Build Plan and Performance Build Pro are one-time payments. Pay once, keep your build.',
  },
  {
    q: 'What is the difference between Full Build and Pro?',
    a: 'Full Build gives you the complete staged roadmap, budget breakdown, HP estimates, and PDF export. Pro adds upgrade prioritization, reliability recommendations specific to your power level, and a parts sourcing checklist.',
  },
  {
    q: 'Can I plan more than one car?',
    a: 'Yes. Run the planner as many times as you like for free previews. Each generated plan can be unlocked and exported independently.',
  },
  {
    q: 'Do you store my data on a server?',
    a: 'No server-side storage. Builds, unlock status, and analytics all live in your browser using local storage. Clearing your browser data resets everything.',
  },
  {
    q: 'I run a car channel — can I earn commission?',
    a: 'Yes. BuildForge supports creator referral codes and affiliate tracking parameters. Reach out through the Contact page to set up a partner code.',
  },
];

function Item({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={`panel overflow-hidden ${open ? 'accordion-open' : ''}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-display text-lg font-semibold text-white">{q}</span>
        <svg
          className="accordion-chevron h-5 w-5 flex-none text-ignition-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-white/60">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  useEffect(() => {
    document.title = 'FAQ · BuildForge AI';
  }, []);

  return (
    <div className="px-5 py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <span className="hud-label text-ignition-400">FAQ</span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Everything, before you build.
          </h1>
        </Reveal>

        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={Math.min(i * 0.04, 0.3)}>
              <Item q={f.q} a={f.a} defaultOpen={i === 0} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-white/50">
          Still stuck?{' '}
          <Link href="/contact" className="text-spec hover:text-spec-400">
            Talk to us →
          </Link>
        </div>
      </div>
    </div>
  );
}
