'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getAnalytics,
  revenue,
  topVehicles,
  resetAnalytics,
  type Analytics,
} from '@/lib/storage';
import { CountUp } from '@/components/Effects';

const PASSCODE = 'forge';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [code, setCode] = useState('');
  const [err, setErr] = useState(false);
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    document.title = 'Admin · BuildForge AI';
  }, []);

  function load() {
    setData(getAnalytics());
  }

  function unlock() {
    if (code.trim().toLowerCase() === PASSCODE) {
      setAuthed(true);
      setErr(false);
      load();
    } else {
      setErr(true);
    }
  }

  const top = useMemo(() => (data ? topVehicles(data, 8) : []), [data]);
  const rev = data ? revenue(data) : 0;
  const fullCount = data ? data.purchases.filter((p) => p.plan === 'full').length : 0;
  const proCount = data ? data.purchases.filter((p) => p.plan === 'pro').length : 0;
  const maxTop = top.length ? top[0].count : 1;

  if (!authed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="panel w-full max-w-sm p-8">
          <span className="hud-label text-ignition-400">Restricted</span>
          <h1 className="mt-2 font-display text-2xl font-bold text-white">Operations console</h1>
          <p className="mt-2 text-sm text-white/50">Enter the access code to continue.</p>
          <input
            className="field mt-5"
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && unlock()}
            placeholder="Access code"
          />
          {err && <p className="mt-2 text-xs text-ignition-400">Incorrect code.</p>}
          <button onClick={unlock} className="btn-ignition mt-4 flex w-full justify-center">
            Enter
          </button>
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Builds created', value: data?.buildsCreated ?? 0, accent: 'text-white' },
    { label: 'Total purchases', value: data?.purchases.length ?? 0, accent: 'text-spec' },
    { label: 'Full unlocks', value: fullCount, accent: 'text-ignition-400' },
    { label: 'Pro unlocks', value: proCount, accent: 'text-ignition-400' },
  ];

  return (
    <div className="px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="hud-label text-ignition-400">Admin · Live</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-white">Operations dashboard</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="btn-ghost">
              Refresh
            </button>
            <button
              onClick={() => {
                if (confirm('Reset all local analytics? This cannot be undone.')) {
                  resetAnalytics();
                  load();
                }
              }}
              className="btn-ghost text-ignition-400"
            >
              Reset data
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="panel p-5">
              <div className="hud-label text-white/40">{c.label}</div>
              <div className={`mt-2 font-mono text-3xl font-semibold ${c.accent}`}>
                <CountUp to={c.value} duration={0.8} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="panel p-6">
            <div className="hud-label text-spec">Revenue (local)</div>
            <div className="mt-2 font-mono text-4xl font-bold text-white">
              $<CountUp to={Math.round(rev * 100) / 100} duration={1} />
            </div>
            <p className="mt-2 text-xs text-white/40">
              Sum of recorded unlocks on this device.
            </p>
          </div>

          <div className="panel p-6">
            <div className="hud-label text-spec">Most-searched vehicles</div>
            <div className="mt-4 space-y-2">
              {top.length === 0 && (
                <p className="text-sm text-white/40">No builds recorded yet.</p>
              )}
              {top.map((v) => (
                <div key={v.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{v.label}</span>
                    <span className="font-mono text-white/45">{v.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-850">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(v.count / maxTop) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full bg-gradient-to-r from-ignition to-spec"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel mt-3 p-6">
          <div className="hud-label text-spec">Recent activity</div>
          <div className="mt-4 space-y-1.5">
            {(data?.events ?? []).length === 0 && (
              <p className="text-sm text-white/40">No activity yet.</p>
            )}
            {(data?.events ?? [])
              .slice()
              .reverse()
              .slice(0, 12)
              .map((e, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md bg-ink-850/60 px-3 py-1.5 text-xs"
                >
                  <span className="font-mono text-white/60">{e.type}</span>
                  <span className="text-white/35">
                    {new Date(e.at).toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
