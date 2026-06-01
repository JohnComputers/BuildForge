'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <span className="font-display text-xl font-bold tracking-tight text-white">
              BUILD<span className="text-ignition">FORGE</span> <span className="text-white/40">AI</span>
            </span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              Plan your dream build before spending a dollar. Realistic modification roadmaps, cost
              estimates, and horsepower projections — generated instantly from a curated parts database.
            </p>
          </div>
          <div>
            <h4 className="hud-label mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link href="/planner" className="transition hover:text-ignition">Build Planner</Link></li>
              <li><Link href="/pricing" className="transition hover:text-ignition">Pricing</Link></li>
              <li><Link href="/faq" className="transition hover:text-ignition">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="hud-label mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link href="/about" className="transition hover:text-ignition">About</Link></li>
              <li><Link href="/contact" className="transition hover:text-ignition">Contact</Link></li>
              <li><Link href="/contact" className="transition hover:text-ignition">Become a Creator Partner</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} BuildForge AI. Estimates only — verify with vendors before purchasing.</p>
          <p className="font-mono">FORGED IN MIAMI · BUILT FOR ENTHUSIASTS</p>
        </div>
      </div>
    </footer>
  );
}
