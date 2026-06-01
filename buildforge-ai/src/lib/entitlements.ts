import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Plan } from './payments';

export type Tier = 'free' | 'full' | 'pro';

const RANK: Record<Tier, number> = { free: 0, full: 1, pro: 2 };

function asTier(v: unknown): Tier {
  return v === 'pro' ? 'pro' : v === 'full' ? 'full' : 'free';
}

/** Read the purchased tier stored on the user's account. */
export async function fetchEntitlement(uid: string): Promise<Tier> {
  if (!db) return 'free';
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return 'free';
    return asTier(snap.data().tier);
  } catch {
    return 'free';
  }
}

/** Grant a purchased plan to the account, never downgrading an existing tier. */
export async function grantEntitlement(uid: string, plan: Plan): Promise<Tier> {
  if (!db) return 'free';
  const current = await fetchEntitlement(uid);
  const next: Tier = RANK[plan] > RANK[current] ? plan : current;
  await setDoc(
    doc(db, 'users', uid),
    { tier: next, updatedAt: serverTimestamp() },
    { merge: true },
  );
  return next;
}
