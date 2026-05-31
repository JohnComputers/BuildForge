'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth';
import { useBackend } from './firebase';
import {
  buildCheckoutUrl,
  createSecureCheckout,
  isConfigured,
  type Plan,
} from './payments';

/**
 * One entry point for starting a purchase. In secure mode it requires login and
 * routes through the Cloud Functions backend; otherwise it falls back to the
 * legacy Square payment links.
 */
export function useCheckout() {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState<Plan | null>(null);
  const [error, setError] = useState('');

  const startCheckout = useCallback(
    async (plan: Plan) => {
      setError('');

      if (useBackend) {
        if (!user) {
          router.push('/login');
          return;
        }
        setBusy(plan);
        try {
          const url = await createSecureCheckout(plan);
          window.open(url, '_blank', 'noopener,noreferrer');
        } catch {
          setError('Could not start secure checkout. Please try again in a moment.');
        } finally {
          setBusy(null);
        }
        return;
      }

      // Legacy client-side links.
      if (!isConfigured(plan)) {
        setError(
          'Checkout is not configured yet. Add your Square links in src/lib/payments.ts, or enable the secure backend (see README).',
        );
        return;
      }
      window.open(buildCheckoutUrl(plan), '_blank', 'noopener,noreferrer');
    },
    [user, router],
  );

  return { startCheckout, busy, error };
}
