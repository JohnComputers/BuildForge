'use client';

import { motion } from 'framer-motion';

export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0e1014_0%,_#06070a_55%)]" />
      {/* blueprint grid */}
      <div className="blueprint absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-grid-fade" />
      {/* drifting glows */}
      <motion.div
        className="absolute -left-40 top-10 h-[460px] w-[460px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,87,34,0.18), transparent 70%)' }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-32 top-1/3 h-[520px] w-[520px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.1), transparent 70%)' }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 h-[400px] w-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)' }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
