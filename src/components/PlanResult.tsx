'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { BuildPlan } from '@/lib/types';
import { BUILD_TYPES } from '@/lib/planner';
import { HpGauge, BudgetBars, LiveNumber } from './Effects';
import { getUnlock } from '@/lib/storage';
import { buildCheckoutUrl, isConfigured, type Plan } from '@/lib/payments';
import { generatePdf } from '@/lib/pdf';

const CAT_COLORS: Record<string, string> = {
  intake: '#ff7a45',
  exhaust: '#ff5722',
  tune: '#f59e0b',
  fueling: '#fbbf24',
  'forced-induction': '#ef4444',
  internals: '#dc2626',
  suspension: '#2dd4bf',
  brakes: '#38bdf8',
  wheels: '#60a5fa',
  drivetrain: '#a78bfa',
  cooling: '#22d3ee',
  aero: '#34d399',
  cosmetic: '#f472b6',
  weight: '#94a3b8',
  offroad: '#a3a35a',
};

function money(n: number) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export default function PlanResult({ plan }: { plan: BuildPlan }) {
  const [unlock, setUnlock] = useState({ full: false, pro: false });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUnlock(getUnlock());
    setMounted(true);
  }, []);

  const fullUnlocked = unlock.full;
  const proUnlocked = unlock.pro;
  const buildLabel = BUILD_TYPES.find((b) => b.id === plan.buildType)?.label ?? plan.buildType;

  const segments = plan.stages.map((s) => ({
    label: s.mod.name,
    value: s.cost,
    color: CAT_COLORS[s.mod.category] ?? '#ff5722',
  }));

  function buy(p: Plan) {
    const url = buildCheckoutUrl(p);
    if (!isConfigured(p)) {
      alert(
        'Square payment link not configured yet.\n\nReplace FULL_BUILD_PAYMENT_LINK / PRO_BUILD_PAYMENT_LINK in src/lib/payments.ts with your real Square links to enable checkout.',
      );
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      {/* ── Roadmap ───────────────────────────────── */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="hud-label">Suggested build</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-white">
              {plan.vehicle.make} {plan.vehicle.model}
            </h2>
            <p className="mt-1 text-sm text-white/50">
              {plan.vehicle.years[0]}–{plan.vehicle.years[1]} · {buildLabel} ·{' '}
              {plan.vehicle.drivetrain.toUpperCase()} · base {plan.vehicle.baseHp} HP
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 font-mono text-xs ${
              plan.goalMet ? 'bg-spec/15 text-spec' : 'bg-ignition/15 text-ignition-400'
            }`}
          >
            {plan.goalMet ? 'GOAL REACHED' : 'GOAL NOT MET IN BUDGET'}
          </span>
        </motion.div>

        <div className="space-y-3">
          {plan.stages.map((s, i) => {
            const locked = !fullUnlocked && i >= 2;
            return (
              <motion.div
                key={s.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: locked ? 0 : 4 }}
                className="group relative panel overflow-hidden p-5"
              >
                <div className="absolute left-0 top-0 h-full w-1" style={{ background: CAT_COLORS[s.mod.category] }} />
                <div className={`flex items-start justify-between gap-4 ${locked ? 'blur-locked' : ''}`}>
                  <div className="flex gap-4">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-line bg-ink-900 font-display text-sm font-bold text-ignition">
                      {s.stage}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">{s.mod.name}</h3>
                      <p className="mt-0.5 text-sm text-white/50">{s.mod.note}</p>
                    </div>
                  </div>
                  <div className="flex-none text-right">
                    <p className="font-mono text-lg font-semibold text-white">{money(s.cost)}</p>
                    {s.hpGain > 0 && <p className="font-mono text-xs text-spec">+{s.hpGain} HP</p>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* lock overlay */}
        {mounted && !fullUnlocked && plan.stages.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex flex-col items-center gap-3 rounded-2xl border border-ignition/30 bg-ignition/5 p-6 text-center"
          >
            <p className="hud-label text-ignition-400">
              {plan.stages.length - 2} more stages locked
            </p>
            <p className="max-w-md text-sm text-white/70">
              Unlock the complete roadmap, full budget breakdown, HP curve, and a printable PDF.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => buy('full')} className="btn-ignition text-sm">
                Unlock Full Plan — $9.99
              </button>
              <Link href="/pricing" className="btn-ghost text-sm">
                Compare Plans
              </Link>
            </div>
          </motion.div>
        )}

        {/* Pro sections */}
        <AnimatePresence>
          {proUnlocked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 space-y-6"
            >
              <div className="panel p-6">
                <h3 className="hud-label mb-4 text-ignition-400">Reliability Recommendations</h3>
                <ul className="space-y-2.5 text-sm text-white/70">
                  {plan.reliabilityNotes.map((n, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-ignition" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="panel p-6">
                <h3 className="hud-label mb-4 text-spec">Parts Sourcing Checklist</h3>
                <ul className="space-y-2.5 text-sm text-white/70">
                  {plan.sourcing.map((n, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="mt-0.5 font-mono text-spec">☐</span>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Sticky stats panel ────────────────────── */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="panel overflow-hidden p-6 shadow-panel">
          <div className="flex justify-center">
            <HpGauge value={plan.estimatedHp} max={Math.max(1000, plan.hpGoal + 100)} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Stat label="Goal" value={`${plan.hpGoal} HP`} />
            <Stat label="Gain" value={`+${plan.estimatedHp - plan.vehicle.baseHp} HP`} accent />
            <Stat label="Budget" value={money(plan.budget)} />
            <Stat label="Remaining" value={money(plan.remaining)} />
          </div>

          <div className="my-6 h-px bg-line" />

          <p className="hud-label mb-3">Budget allocation</p>
          {fullUnlocked ? (
            <BudgetBars segments={segments} remaining={plan.remaining} />
          ) : (
            <div className="blur-locked">
              <BudgetBars segments={segments} remaining={plan.remaining} />
            </div>
          )}

          <div className="my-6 h-px bg-line" />

          <div className="flex items-baseline justify-between">
            <span className="hud-label">Estimated total</span>
            <LiveNumber
              value={plan.totalCost}
              prefix="$"
              className="font-display text-2xl font-bold text-white"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            {proUnlocked ? (
              <button onClick={() => generatePdf(plan, 'pro')} className="btn-ignition w-full text-sm">
                Download Pro PDF
              </button>
            ) : fullUnlocked ? (
              <>
                <button onClick={() => generatePdf(plan, 'full')} className="btn-ignition w-full text-sm">
                  Download PDF
                </button>
                <button onClick={() => buy('pro')} className="btn-ghost w-full text-sm">
                  Upgrade to Pro — $19.99
                </button>
              </>
            ) : (
              <>
                <button onClick={() => buy('full')} className="btn-ignition w-full text-sm">
                  Get Full Plan — $9.99
                </button>
                <button onClick={() => buy('pro')} className="btn-ghost w-full text-sm">
                  Get Pro — $19.99
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-ink-900/60 p-3">
      <p className="hud-label">{label}</p>
      <p className={`mt-1 font-display text-lg font-bold ${accent ? 'text-spec' : 'text-white'}`}>{value}</p>
    </div>
  );
}
