'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import HomeDemo from '@/components/HomeDemo';
import { Reveal, Parallax, CountUp, TiltCard, Magnetic } from '@/components/Effects';
import { PLAN_PRICE } from '@/lib/payments';

const STATS = [
  { label: 'Vehicles in database', value: 64, suffix: '+' },
  { label: 'Modifications mapped', value: 42, suffix: '+' },
  { label: 'Build types', value: 7, suffix: '' },
  { label: 'Avg. plan time', value: 8, prefix: '~', suffix: 's' },
];

const FEATURES = [
  {
    tag: 'Roadmaps',
    title: 'Staged build planning',
    body: 'Every plan is sequenced the way a real shop would do it — intake and tune before the power adders, supporting mods before the boost.',
  },
  {
    tag: 'Cost engine',
    title: 'Pricing tuned per platform',
    body: 'Parts pricing scales to your specific chassis, so a Supra estimate is not a Miata estimate. No guesswork, no vague ranges.',
  },
  {
    tag: 'Power model',
    title: 'Honest horsepower math',
    body: 'Forced induction multiplies, bolt-ons add, and we stop spending once your goal is met. The number you see is the number to chase.',
  },
  {
    tag: 'Export',
    title: 'Shop-ready PDF output',
    body: 'Hand your builder a clean, printable spec sheet with stages, costs, budget allocation, and sourcing notes.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'I stopped buying parts at random. Mapped the whole 500-whp plan in one sitting and actually stuck to the budget.',
    name: 'Marcus T.',
    car: 'WRX STI',
  },
  {
    quote:
      'The staging order alone saved me from re-tuning twice. Felt like having a shop foreman in my browser.',
    name: 'Devon R.',
    car: 'Mustang GT',
  },
  {
    quote:
      'Sent the PDF straight to my builder. He said it was cleaner than most quotes he gets from customers.',
    name: 'Priya N.',
    car: 'GR Supra',
  },
];

const FAQ = [
  {
    q: 'How accurate are the cost estimates?',
    a: 'Pricing is modeled per platform using typical street prices for quality parts and labor. It is a planning tool, not a binding quote — but it gets you within striking distance of a real budget.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. Your build lives in your browser. Buy a plan to unlock the full roadmap and PDF export — no login, no email wall.',
  },
  {
    q: 'Is my purchase a subscription?',
    a: 'No. Both the Full Build Plan and Performance Build Pro are one-time payments processed through Square.',
  },
];

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative px-5 pt-16 sm:pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-850 px-3 py-1"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ignition" />
                <span className="hud-label text-white/60">Build planning, forged in the garage</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl"
              >
                Plan Your Dream Build{' '}
                <span className="gradient-text">Before Spending a Dollar.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mt-5 max-w-xl text-lg leading-relaxed text-white/60"
              >
                Get realistic modification roadmaps, cost estimates, and horsepower
                projections in seconds — tuned to your exact platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Magnetic>
                  <Link href="/planner" className="btn-ignition">
                    Start building free
                  </Link>
                </Magnetic>
                <Link href="/pricing" className="btn-ghost">
                  See pricing
                </Link>
              </motion.div>

              <div className="mt-10 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label} className="bg-ink-900 p-4">
                    <div className="font-mono text-2xl font-semibold text-white">
                      {s.prefix}
                      <CountUp to={s.value} />
                      {s.suffix}
                    </div>
                    <div className="mt-1 text-[11px] leading-tight text-white/40">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <HomeDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative px-5 py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="hud-label text-ignition-400">The engine room</span>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Not a parts list. A plan that respects order, budget, and physics.
            </h2>
          </Reveal>

          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={card}>
                <TiltCard className="panel h-full p-6">
                  <span className="hud-label text-spec">{f.tag}</span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{f.body}</p>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PARALLAX BAND */}
      <section className="relative px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="panel relative overflow-hidden px-6 py-16 text-center sm:py-20">
            <Parallax speed={-0.5} className="pointer-events-none absolute inset-0 opacity-40">
              <div className="absolute -left-10 top-0 h-64 w-64 rounded-full bg-ignition/20 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-spec/20 blur-3xl" />
            </Parallax>
            <Reveal>
              <h2 className="relative font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                From <span className="text-white/40">&quot;I think it&apos;s around ten grand&quot;</span> to a
                line-by-line spec sheet.
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-white/55">
                Pick your platform, set your budget and power goal, choose how you drive.
                We do the rest.
              </p>
              <Link href="/planner" className="btn-ignition relative mt-8 inline-flex">
                Open the planner
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="hud-label text-ignition-400">From the paddock</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Builders who stopped guessing.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <figure className="panel flex h-full flex-col p-6">
                  <div className="font-display text-3xl leading-none text-ignition/50">&ldquo;</div>
                  <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-white/70">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ignition/15 font-mono text-sm text-ignition-400">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{t.name}</div>
                      <div className="text-[11px] text-white/40">{t.car}</div>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="hud-label text-ignition-400">Pricing</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              One-time unlock. No subscription.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            <Reveal>
              <div className="panel flex h-full flex-col p-6">
                <span className="hud-label text-white/50">Free Build Preview</span>
                <div className="mt-3 font-display text-4xl font-bold text-white">$0</div>
                <p className="mt-2 text-sm text-white/55">See the shape of your build at no cost.</p>
                <ul className="mt-6 space-y-2 text-sm text-white/60">
                  <li>First 2 modifications visible</li>
                  <li>Live cost + HP preview</li>
                  <li>Remaining stages blurred</li>
                </ul>
                <Link href="/planner" className="btn-ghost mt-auto flex w-full justify-center">
                  Try it now
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="panel relative flex h-full flex-col p-6 ring-1 ring-ignition/40">
                <div className="absolute -top-3 left-6 rounded-full bg-ignition px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-950">
                  Most popular
                </div>
                <span className="hud-label text-ignition-400">Full Build Plan</span>
                <div className="mt-3 font-display text-4xl font-bold text-white">
                  ${PLAN_PRICE.full}
                </div>
                <p className="mt-2 text-sm text-white/55">The complete roadmap, yours to keep.</p>
                <ul className="mt-6 space-y-2 text-sm text-white/70">
                  <li>Complete modification roadmap</li>
                  <li>Full budget breakdown</li>
                  <li>HP estimates per stage</li>
                  <li>Printable PDF export</li>
                </ul>
                <Link href="/pricing" className="btn-ignition mt-auto flex w-full justify-center">
                  Get Full Build
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="panel flex h-full flex-col p-6">
                <span className="hud-label text-spec">Performance Build Pro</span>
                <div className="mt-3 font-display text-4xl font-bold text-white">
                  ${PLAN_PRICE.pro}
                </div>
                <p className="mt-2 text-sm text-white/55">For builds where reliability matters.</p>
                <ul className="mt-6 space-y-2 text-sm text-white/70">
                  <li>Everything in Full Build</li>
                  <li>Upgrade prioritization</li>
                  <li>Reliability recommendations</li>
                  <li>Parts sourcing checklist</li>
                </ul>
                <Link href="/pricing" className="btn-ghost mt-auto flex w-full justify-center">
                  Go Pro
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <span className="hud-label text-ignition-400">Questions</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Before you build.
            </h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.06}>
                <div className="panel p-5">
                  <h3 className="font-display text-lg font-semibold text-white">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/faq" className="text-sm text-spec hover:text-spec-400">
              Read all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative px-5 pb-28 pt-10">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Your build starts with a plan.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/55">
              Stop buying parts twice. Map the whole thing first.
            </p>
            <Magnetic>
              <Link href="/planner" className="btn-ignition mt-8 inline-flex">
                Build my roadmap →
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
