'use client';

import { useEffect } from 'react';
import { captureReferralFromUrl } from '@/lib/storage';

export default function ReferralCapture() {
  useEffect(() => {
    captureReferralFromUrl();
  }, []);
  return null;
}
