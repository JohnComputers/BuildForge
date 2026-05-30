'use client';

import { jsPDF } from 'jspdf';
import type { BuildPlan } from './types';
import { BUILD_TYPES } from './planner';

const money = (n: number) => '$' + n.toLocaleString('en-US');

export function generatePdf(plan: BuildPlan, tier: 'full' | 'pro'): void {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  let y = 0;

  const ignition: [number, number, number] = [255, 87, 34];
  const ink: [number, number, number] = [16, 18, 22];
  const muted: [number, number, number] = [120, 128, 138];

  // Header band
  doc.setFillColor(...ink);
  doc.rect(0, 0, W, 96, 'F');
  doc.setFillColor(...ignition);
  doc.rect(0, 96, W, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('BUILDFORGE AI', M, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(255, 138, 102);
  doc.text(tier === 'pro' ? 'PERFORMANCE BUILD PRO' : 'FULL BUILD PLAN', M, 70);
  doc.setTextColor(180, 185, 192);
  doc.text(new Date().toLocaleDateString(), W - M, 50, { align: 'right' });

  y = 140;

  // Vehicle summary
  const buildLabel = BUILD_TYPES.find((b) => b.id === plan.buildType)?.label || plan.buildType;
  doc.setTextColor(...ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(`${plan.vehicle.make} ${plan.vehicle.model}`, M, y);
  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...muted);
  doc.text(
    `${plan.vehicle.years[0]}–${plan.vehicle.years[1]}  •  ${buildLabel} build  •  ${plan.vehicle.drivetrain.toUpperCase()}  •  ${plan.vehicle.aspiration}`,
    M,
    y,
  );
  y += 28;

  // Stat cards
  const stats: [string, string][] = [
    ['BUDGET', money(plan.budget)],
    ['HP GOAL', `${plan.hpGoal} HP`],
    ['ESTIMATED HP', `${plan.estimatedHp} HP`],
    ['REMAINING', money(plan.remaining)],
  ];
  const cardW = (W - M * 2 - 24) / 4;
  stats.forEach((s, i) => {
    const x = M + i * (cardW + 8);
    doc.setFillColor(244, 245, 247);
    doc.roundedRect(x, y, cardW, 56, 6, 6, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(s[0], x + 12, y + 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...ink);
    doc.text(s[1], x + 12, y + 42);
    doc.setFont('helvetica', 'normal');
  });
  y += 84;

  // Roadmap heading
  doc.setFillColor(...ignition);
  doc.rect(M, y - 12, 4, 16, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...ink);
  doc.text('MODIFICATION ROADMAP', M + 14, y);
  y += 22;

  // Table header
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text('STAGE', M, y);
  doc.text('MODIFICATION', M + 60, y);
  doc.text('+HP', W - M - 150, y, { align: 'right' });
  doc.text('COST', W - M, y, { align: 'right' });
  y += 8;
  doc.setDrawColor(225, 227, 230);
  doc.line(M, y, W - M, y);
  y += 16;

  doc.setFontSize(10);
  plan.stages.forEach((s) => {
    if (y > 700) {
      doc.addPage();
      y = 60;
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ignition);
    doc.text(String(s.stage), M, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ink);
    doc.text(s.mod.name, M + 60, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...muted);
    doc.text(s.hpGain > 0 ? `+${s.hpGain}` : '—', W - M - 150, y, { align: 'right' });
    doc.setTextColor(...ink);
    doc.text(money(s.cost), W - M, y, { align: 'right' });
    y += 14;
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    const note = doc.splitTextToSize(s.mod.note, W - M * 2 - 60);
    doc.text(note, M + 60, y);
    y += note.length * 10 + 8;
    doc.setFontSize(10);
  });

  // Total
  doc.setDrawColor(225, 227, 230);
  doc.line(M, y, W - M, y);
  y += 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...ink);
  doc.text('ESTIMATED TOTAL', M, y);
  doc.setTextColor(...ignition);
  doc.text(money(plan.totalCost), W - M, y, { align: 'right' });
  y += 30;

  // Pro-only sections
  if (tier === 'pro') {
    if (y > 600) {
      doc.addPage();
      y = 60;
    }
    doc.setFillColor(...ignition);
    doc.rect(M, y - 12, 4, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...ink);
    doc.text('RELIABILITY RECOMMENDATIONS', M + 14, y);
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    plan.reliabilityNotes.forEach((n) => {
      if (y > 740) {
        doc.addPage();
        y = 60;
      }
      const lines = doc.splitTextToSize('•  ' + n, W - M * 2);
      doc.text(lines, M, y);
      y += lines.length * 11 + 4;
    });
    y += 14;

    if (y > 620) {
      doc.addPage();
      y = 60;
    }
    doc.setFillColor(...ignition);
    doc.rect(M, y - 12, 4, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...ink);
    doc.text('PARTS SOURCING CHECKLIST', M + 14, y);
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    plan.sourcing.forEach((n) => {
      if (y > 740) {
        doc.addPage();
        y = 60;
      }
      const lines = doc.splitTextToSize('☐  ' + n, W - M * 2);
      doc.text(lines, M, y);
      y += lines.length * 11 + 4;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(
      'BuildForge AI — estimates only. Verify pricing and fitment with vendors before purchasing.',
      M,
      doc.internal.pageSize.getHeight() - 24,
    );
    doc.text(`${i} / ${pageCount}`, W - M, doc.internal.pageSize.getHeight() - 24, {
      align: 'right',
    });
  }

  const fname = `BuildForge-${plan.vehicle.model.replace(/[^a-z0-9]/gi, '-')}-${plan.buildType}.pdf`;
  doc.save(fname);
}
