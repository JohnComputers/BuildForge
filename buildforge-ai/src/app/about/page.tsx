'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Reveal, Parallax } from '@/components/Effects';

const PRINCIPLES = [
  {
    n: '01',
    title: 'Order is everything',
    body: 'A supercharger before a fuel system is a paperweight. We sequence mods the way a competent shop would — supporting upgrades first, power adders last.',
  },
  {
    n: '02',
    title: 'Numbers you can defend',
    body: 'Forced induction multiplies output, bolt-ons add to it, and we stop spending once your goal is comfortably met instead of selling you parts you don&apos;t need.',
  },
  {
    n: '03',
    title: 'Built to stay free',
    body: 'Everything runs in your browser on local data. No accounts, no tracking pixels, no AI subscription burning a hole in your wallet.',
  },
];

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About · BuildForge AI';
  }, []);

  return (
    <div className="px-5 py-16">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <span className="hud-label text-ignition-400">About</span>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            We built the planning tool we wished we&apos;d had before the first parts order.
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 text-lg leading-relaxed text-white/60">
            Most builds die in a spreadsheet — or worse, in a pile of mismatched boxes in the
            garage. BuildForge AI turns a vague power goal into a staged, costed roadmap tuned to
            your exact platform, so you spend once and build in the right order.
          </p>
        </Reveal>

        <div className="relative my-16">
          <Parallax speed={0.4} className="pointer-events-none absolute -inset-x-10 -inset-y-6 opacity-30">
            <div className="absolute left-1/4 h-48 w-48 rounded-full bg-ignition/20 blur-3xl" />
            <div className="absolute right-1/4 top-10 h-48 w-48 rounded-full bg-spec/20 blur-3xl" />
          </Parallax>
          <div className="relative grid gap-4 sm:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.1}>
                <div className="panel h-full p-6">
                  <div className="font-mono text-2xl text-ignition/70">{p.n}</div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-white">{p.title}</h3>
                  <p
                    className="mt-2 text-sm leading-relaxed text-white/55"
                    dangerouslySetInnerHTML={{ __html: p.body }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="panel p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-white">Ready to spec yours?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/55">
              Free to preview. Unlock the full roadmap whenever you&apos;re ready to commit.
            </p>
            <Link href="/planner" className="btn-ignition mt-6 inline-flex">
              Open the planner →
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
