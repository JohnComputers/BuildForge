'use client';

import type { Plan } from './payments';

const KEYS = {
  analytics: 'bf_analytics_v1',
  unlock: 'bf_unlock_v1',
  referral: 'bf_referral_v1',
};

// ── Referral / affiliate / UTM ────────────────────────────────
export interface Referral {
  code?: string;
  affiliate?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  capturedAt?: string;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / blocked — ignore */
  }
}

/** Parse ?ref= / ?affiliate= / ?utm_* from the URL and persist them once. */
export function captureReferralFromUrl(): Referral {
  if (typeof window === 'undefined') return {};
  const q = new URLSearchParams(window.location.search);
  const existing = getReferral();
  const next: Referral = { ...existing };
  const map: [keyof Referral, string][] = [
    ['code', 'ref'],
    ['affiliate', 'affiliate'],
    ['utm_source', 'utm_source'],
    ['utm_medium', 'utm_medium'],
    ['utm_campaign', 'utm_campaign'],
  ];
  let changed = false;
  for (const [field, param] of map) {
    const val = q.get(param);
    if (val && next[field] !== val) {
      (next[field] as string) = val;
      changed = true;
    }
  }
  if (changed) {
    next.capturedAt = new Date().toISOString();
    write(KEYS.referral, next);
  }
  return next;
}

export function getReferral(): Referral {
  return read<Referral>(KEYS.referral, {});
}

// ── Unlock state ──────────────────────────────────────────────
export interface UnlockState {
  full: boolean;
  pro: boolean;
}

export function getUnlock(): UnlockState {
  return read<UnlockState>(KEYS.unlock, { full: false, pro: false });
}

export function setUnlock(plan: Plan): UnlockState {
  const state = getUnlock();
  if (plan === 'pro') {
    state.pro = true;
    state.full = true;
  } else {
    state.full = true;
  }
  write(KEYS.unlock, state);
  return state;
}

// ── Analytics (admin dashboard) ───────────────────────────────
export interface Analytics {
  buildsCreated: number;
  purchases: { plan: Plan; amount: number; at: string; ref?: string }[];
  vehicleSearches: Record<string, number>;
  events: { type: string; at: string }[];
}

const EMPTY_ANALYTICS: Analytics = {
  buildsCreated: 0,
  purchases: [],
  vehicleSearches: {},
  events: [],
};

export function getAnalytics(): Analytics {
  return read<Analytics>(KEYS.analytics, EMPTY_ANALYTICS);
}

export function recordBuild(vehicleLabel: string): void {
  const a = getAnalytics();
  a.buildsCreated += 1;
  a.vehicleSearches[vehicleLabel] = (a.vehicleSearches[vehicleLabel] || 0) + 1;
  a.events.push({ type: `build:${vehicleLabel}`, at: new Date().toISOString() });
  if (a.events.length > 200) a.events = a.events.slice(-200);
  write(KEYS.analytics, a);
}

export function recordPurchase(plan: Plan, amount: number): void {
  const a = getAnalytics();
  const ref = getReferral().code;
  a.purchases.push({ plan, amount, at: new Date().toISOString(), ref });
  a.events.push({ type: `purchase:${plan}`, at: new Date().toISOString() });
  write(KEYS.analytics, a);
}

export function resetAnalytics(): void {
  write(KEYS.analytics, EMPTY_ANALYTICS);
}

export function revenue(a: Analytics): number {
  return a.purchases.reduce((sum, p) => sum + p.amount, 0);
}

export function topVehicles(a: Analytics, n = 6): { label: string; count: number }[] {
  return Object.entries(a.vehicleSearches)
    .map(([label, count]) => ({ label, count }))
    .sort((x, y) => y.count - x.count)
    .slice(0, n);
}
