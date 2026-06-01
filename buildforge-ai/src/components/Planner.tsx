'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { MAKES, VEHICLES, findVehicle } from '@/lib/vehicles';
import { BUILD_TYPES, generatePlan } from '@/lib/planner';
import type { BuildPlan, BuildType } from '@/lib/types';
import { recordBuild } from '@/lib/storage';
import { LiveNumber } from './Effects';
import PlanResult from './PlanResult';

const STEPS = ['Vehicle', 'Targets', 'Build Type'];

export default function Planner() {
  const [step, setStep] = useState(0);
  const [make, setMake] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [budget, setBudget] = useState(10000);
  const [hpGoal, setHpGoal] = useState(500);
  const [buildType, setBuildType] = useState<BuildType>('street');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<BuildPlan | null>(null);

  const models = useMemo(() => VEHICLES.filter((v) => v.make === make), [make]);
  const vehicle = findVehicle(vehicleId);

  const canNext = step === 0 ? !!vehicleId : true;

  function run() {
    if (!vehicle) return;
    setLoading(true);
    setPlan(null);
    const label = `${vehicle.make} ${vehicle.model}`;
    setTimeout(() => {
      const result = generatePlan(vehicleId, budget, hpGoal, buildType);
      setPlan(result);
      recordBuild(label);
      setLoading(false);
      setTimeout(() => {
        document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }, 1300);
  }

  return (
    <div>
      {/* Progress steps */}
      <div className="mb-10 flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => i <= step && setStep(i)}
              className="flex items-center gap-2.5"
            >
              <motion.span
                animate={{
                  backgroundColor: i <= step ? '#ff5722' : 'rgba(255,255,255,0.06)',
                  color: i <= step ? '#06070a' : 'rgba(255,255,255,0.5)',
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold"
              >
                {i + 1}
              </motion.span>
              <span className={`hidden font-display text-sm uppercase tracking-wide sm:block ${i <= step ? 'text-white' : 'text-white/40'}`}>
                {s}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span className="h-px w-6 bg-line sm:w-12" />
            )}
          </div>
        ))}
      </div>

      <div className="panel p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {/* STEP 1 — Vehicle */}
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="hud-label">Step 1</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-white">Pick your platform</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="hud-label mb-2 block">Make</label>
                  <select
                    className="field"
                    value={make}
                    onChange={(e) => {
                      setMake(e.target.value);
                      setVehicleId('');
                    }}
                  >
                    <option value="">Select make…</option>
                    {MAKES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="hud-label mb-2 block">Model</label>
                  <select
                    className="field disabled:opacity-40"
                    value={vehicleId}
                    disabled={!make}
                    onChange={(e) => setVehicleId(e.target.value)}
                  >
                    <option value="">Select model…</option>
                    {models.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.model} ({v.years[0]}–{v.years[1]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <AnimatePresence>
                {vehicle && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
                  >
                    <Spec label="Base HP" value={`${vehicle.baseHp}`} />
                    <Spec label="Aspiration" value={vehicle.aspiration} />
                    <Spec label="Drivetrain" value={vehicle.drivetrain.toUpperCase()} />
                    <Spec label="Class" value={vehicle.category} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 2 — Targets */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="hud-label">Step 2</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-white">Set your targets</h2>

              <div className="mt-8 space-y-10">
                <div>
                  <div className="flex items-baseline justify-between">
                    <label className="hud-label">Budget</label>
                    <LiveNumber value={budget} prefix="$" className="font-display text-2xl font-bold text-ignition" />
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={60000}
                    step={250}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="mt-4 w-full accent-ignition"
                  />
                  <div className="mt-2 flex gap-2">
                    {[5000, 10000, 20000, 40000].map((b) => (
                      <button
                        key={b}
                        onClick={() => setBudget(b)}
                        className="rounded-full border border-line px-3 py-1 font-mono text-xs text-white/60 transition hover:border-ignition/50 hover:text-white"
                      >
                        ${b.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <label className="hud-label">Horsepower goal</label>
                    <LiveNumber value={hpGoal} suffix=" HP" className="font-display text-2xl font-bold text-spec" />
                  </div>
                  <input
                    type="range"
                    min={150}
                    max={1500}
                    step={10}
                    value={hpGoal}
                    onChange={(e) => setHpGoal(Number(e.target.value))}
                    className="mt-4 w-full accent-spec"
                  />
                  <div className="mt-2 flex gap-2">
                    {[300, 500, 700, 1000].map((h) => (
                      <button
                        key={h}
                        onClick={() => setHpGoal(h)}
                        className="rounded-full border border-line px-3 py-1 font-mono text-xs text-white/60 transition hover:border-spec/50 hover:text-white"
                      >
                        {h} HP
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Build type */}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="hud-label">Step 3</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-white">Choose your build type</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {BUILD_TYPES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBuildType(b.id)}
                    className={`group rounded-xl border p-4 text-left transition-all duration-200 ${
                      buildType === b.id
                        ? 'border-ignition bg-ignition/10 shadow-glow'
                        : 'border-line bg-ink-900/50 hover:border-white/25'
                    }`}
                  >
                    <h3 className="font-display text-lg font-semibold text-white">{b.label}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/50">{b.blurb}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-ghost text-sm disabled:cursor-not-allowed disabled:opacity-30"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className="btn-ignition text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button onClick={run} disabled={loading} className="btn-ignition text-sm">
              {loading ? 'Forging…' : 'Generate Roadmap'}
            </button>
          )}
        </div>
      </div>

      {/* Loading + result */}
      <div id="plan-result" className="mt-12 scroll-mt-28">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="panel flex flex-col items-center justify-center gap-5 p-16"
            >
              <div className="relative h-16 w-16">
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-ignition/30 border-t-ignition"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <div className="text-center">
                <p className="font-display text-lg font-semibold text-white">Forging your build…</p>
                <p className="mt-1 font-mono text-xs text-white/40">
                  Matching parts · estimating gains · allocating budget
                </p>
              </div>
            </motion.div>
          )}
          {!loading && plan && (
            <motion.div key="result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <PlanResult plan={plan} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-ink-900/60 p-3">
      <p className="hud-label">{label}</p>
      <p className="mt-1 font-display text-base font-semibold capitalize text-white">{value}</p>
    </div>
  );
}
