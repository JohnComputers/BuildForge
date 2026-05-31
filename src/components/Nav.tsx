'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/planner', label: 'Build Planner' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, tier, configured, signOut } = useAuth();
  const [acct, setAcct] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-line bg-ink-950/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inset-0 rounded-md bg-ignition/20 blur-md transition group-hover:bg-ignition/40" />
            <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-ignition/50 bg-ink-850">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 18 L10 6 L14 6 L8 18 Z" fill="#ff5722" />
                <path d="M11 18 L17 6 L21 6 L15 18 Z" fill="#ff8a3d" />
              </svg>
            </span>
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            BUILD<span className="text-ignition">FORGE</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative px-4 py-2 text-sm font-medium text-white/70 transition hover:text-white"
            >
              {l.label}
              {isActive(l.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-ignition"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {configured && user ? (
            <div className="relative">
              <button
                onClick={() => setAcct((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-line bg-ink-850 py-1.5 pl-1.5 pr-3 text-sm text-white/80 transition hover:border-white/20"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ignition/20 font-mono text-xs text-ignition-400">
                  {(user.displayName || user.email || '?')[0].toUpperCase()}
                </span>
                <span className="max-w-[8rem] truncate">{user.displayName || user.email}</span>
              </button>
              <AnimatePresence>
                {acct && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-ink-850 p-1.5 shadow-panel"
                  >
                    <div className="px-3 py-2">
                      <div className="hud-label text-white/40">Plan</div>
                      <div className="mt-0.5 font-display text-sm font-semibold capitalize text-white">
                        {tier === 'free' ? 'Free' : tier === 'pro' ? 'Performance Pro' : 'Full Build'}
                      </div>
                    </div>
                    <Link
                      href="/planner"
                      onClick={() => setAcct(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-ink-800"
                    >
                      My builds
                    </Link>
                    <button
                      onClick={() => {
                        setAcct(false);
                        signOut();
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white/75 hover:bg-ink-800"
                    >
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : configured ? (
            <Link
              href="/login"
              className="rounded-full border border-line px-4 py-2 text-sm text-white/80 transition hover:border-white/20"
            >
              Log in
            </Link>
          ) : null}
          <Link href="/planner" className="btn-ignition text-sm">
            Start Building
          </Link>
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 bg-white"
          />
          <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block h-0.5 w-6 bg-white" />
          <motion.span
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 bg-white"
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-line bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    className={`block rounded-lg px-4 py-3 font-display uppercase tracking-wide ${
                      isActive(l.href) ? 'bg-ignition/10 text-ignition' : 'text-white/80'
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link href="/planner" className="btn-ignition mt-2 w-full">
                Start Building
              </Link>
              {configured &&
                (user ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                    className="mt-1 block rounded-lg px-4 py-3 text-left font-display uppercase tracking-wide text-white/70"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="mt-1 block rounded-lg px-4 py-3 font-display uppercase tracking-wide text-white/70"
                  >
                    Log in
                  </Link>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
