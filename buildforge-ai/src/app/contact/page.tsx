'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '@/components/Effects';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', topic: 'general', message: '' });

  useEffect(() => {
    document.title = 'Contact · BuildForge AI';
  }, []);

  function submit() {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  }

  return (
    <div className="px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <Reveal>
              <span className="hud-label text-ignition-400">Contact</span>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Let&apos;s talk builds.
              </h1>
              <p className="mt-4 text-white/60">
                Feature requests, vehicle data we&apos;re missing, or partnership ideas — we read
                everything.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="panel mt-8 p-6">
                <h2 className="font-display text-xl font-semibold text-white">
                  Creator &amp; Affiliate Partners
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  Running a car channel or community? Earn commission on every Full Build and Pro
                  unlock from your audience. We&apos;ll set you up with a referral code and tracking
                  link.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <span className="text-spec">→</span> Custom creator referral codes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-spec">→</span> Affiliate &amp; UTM link tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-spec">→</span> Commission on every unlock
                  </li>
                </ul>
                <p className="mt-4 font-mono text-xs text-white/40">
                  Example link: buildforge.app/?ref=YOURCODE&amp;utm_source=youtube
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="panel p-6">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full min-h-[20rem] flex-col items-center justify-center text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-spec/15 text-2xl text-spec">
                    ✓
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-white">
                    Message ready to send
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-white/55">
                    Thanks, {form.name.split(' ')[0]}. In this demo build your message is captured
                    locally — wire this form to your email or form endpoint before launch.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({ name: '', email: '', topic: 'general', message: '' });
                    }}
                    className="btn-ghost mt-6"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="hud-label mb-1.5 block text-white/50">Name</label>
                    <input
                      className="field"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="hud-label mb-1.5 block text-white/50">Email</label>
                    <input
                      className="field"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="hud-label mb-1.5 block text-white/50">Topic</label>
                    <select
                      className="field"
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    >
                      <option value="general">General question</option>
                      <option value="vehicle">Request a vehicle</option>
                      <option value="partner">Creator / affiliate partnership</option>
                      <option value="bug">Report a bug</option>
                    </select>
                  </div>
                  <div>
                    <label className="hud-label mb-1.5 block text-white/50">Message</label>
                    <textarea
                      className="field min-h-[7rem] resize-y"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="What's on your mind?"
                    />
                  </div>
                  <button onClick={submit} className="btn-ignition flex w-full justify-center">
                    Send message
                  </button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
