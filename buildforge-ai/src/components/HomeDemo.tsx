'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { VEHICLES } from '@/lib/vehicles';
import { generatePlan, BUILD_TYPES } from '@/lib/planner';
import type { BuildType } from '@/lib/types';
import { HpGauge, LiveNumber, BudgetBars } from './Effects';

const DEMO_IDS = ['mustang-gt', 'camaro-ss', 'supra-mk5', 'wrx-sti', 'civic-type-r', 'charger-rt'];

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

const demoVehicles = DEMO_IDS
  .map((id) => VEHICLES.find((v) => v.id === id))
  .filter(Boolean) as typeof VEHICLES;

const fallback = demoVehicles.length ? demoVehicles : VEHICLES.slice(0, 6);

export default function HomeDemo() {
  const [vehicleId, setVehicleId] = useState(fallback[0].id);
  const [budget, setBudget] = useState(10000);
  const [hpGoal, setHpGoal] = useState(600);
  const [buildType, setBuildType] = useState<BuildType>('street');

  const plan = useMemo(
    () => generatePlan(vehicleId, budget, hpGoal, buildType),
    [vehicleId, budget, hpGoal, buildType],
  );

  const vehicle = fallback.find((v) => v.id === vehicleId)!;

  const segments = (plan?.stages ?? []).map((s) => ({
    label: s.mod.name,
    value: s.cost,
    color: CAT_COLORS[s.mod.category] ?? '#ff5722',
  }));

  return (
    <div className="panel relative overflow-hidden p-5 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ignition/60 to-transparent" />
      <div className="flex items-center justify-between">
        <span className="hud-label text-spec">Live Demo</span>
        <span className="flex items-center gap-2 text-[11px] text-white/40">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ignition" />
          calculating in real time
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="hud-label mb-2 block text-white/50">Vehicle</label>
            <div className="grid grid-cols-2 gap-2">
              {fallback.slice(0, 6).map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVehicleId(v.id)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                    v.id === vehicleId
                      ? 'border-ignition/60 bg-ignition/10 text-white'
                      : 'border-line bg-ink-850 text-white/60 hover:border-white/20'
                  }`}
                >
                  <div className="font-medium leading-tight">{v.model}</div>
                  <div className="text-[11px] text-white/40">{v.make}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="hud-label text-white/50">Budget</label>
              <span className="font-mono text-sm text-spec">
                $<LiveNumber value={budget} />
              </span>
            </div>
            <input
              type="range"
              min={3000}
              max={40000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="range-ignition w-full"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="hud-label text-white/50">HP Goal</label>
              <span className="font-mono text-sm text-ignition-400">
                <LiveNumber value={hpGoal} /> hp
              </span>
            </div>
            <input
              type="range"
              min={vehicle.baseHp}
              max={vehicle.baseHp + 500}
              step={10}
              value={hpGoal}
              onChange={(e) => setHpGoal(Number(e.target.value))}
              className="range-ignition w-full"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {BUILD_TYPES.slice(0, 4).map((b) => (
              <button
                key={b.id}
                onClick={() => setBuildType(b.id)}
                className={`rounded-full border px-3 py-1 text-xs transition-all ${
                  b.id === buildType
                    ? 'border-spec/60 bg-spec/10 text-spec'
                    : 'border-line text-white/50 hover:border-white/20'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="rounded-xl border border-line bg-ink-950/60 p-4">
          {plan && (
            <>
              <div className="flex items-center justify-center">
                <HpGauge value={plan.estimatedHp} max={Math.max(hpGoal, plan.estimatedHp) + 60} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-ink-850 p-2">
                  <div className="hud-label text-white/40">Est. Cost</div>
                  <div className="font-mono text-lg text-white">
                    $<LiveNumber value={plan.totalCost} />
                  </div>
                </div>
                <div className="rounded-lg bg-ink-850 p-2">
                  <div className="hud-label text-white/40">Stages</div>
                  <div className="font-mono text-lg text-white">{plan.stages.length}</div>
                </div>
              </div>
              <div className="mt-3">
                <BudgetBars segments={segments} remaining={plan.remaining} />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={plan.stages.map((s) => s.mod.id).join('-')}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 space-y-1"
                >
                  {plan.stages.slice(0, 3).map((s, i) => (
                    <div
                      key={s.mod.id}
                      className="flex items-center justify-between rounded-md bg-ink-850/70 px-3 py-1.5 text-xs"
                    >
                      <span className="text-white/70">
                        <span className="font-mono text-spec">S{i + 1}</span> {s.mod.name}
                      </span>
                      <span className="font-mono text-white/50">${s.cost.toLocaleString()}</span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      <Link
        href="/planner"
        className="btn-ignition mt-5 flex w-full items-center justify-center"
      >
        Build the full roadmap →
      </Link>
    </div>
  );
}
