'use client';

import { useEffect } from 'react';
import Planner from '@/components/Planner';
import { Reveal } from '@/components/Effects';

export default function PlannerPage() {
  useEffect(() => {
    document.title = 'Build Planner · BuildForge AI';
  }, []);

  return (
    <div className="px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="hud-label text-ignition-400">Build Planner</span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Spec your build, stage by stage.
          </h1>
          <p className="mt-4 max-w-2xl text-white/55">
            Choose your platform, set a budget and power target, and tell us how you drive.
            We&apos;ll sequence a realistic roadmap with costs and horsepower at every stage.
          </p>
        </Reveal>
        <div className="mt-10">
          <Planner />
        </div>
      </div>
    </div>
  );
}
