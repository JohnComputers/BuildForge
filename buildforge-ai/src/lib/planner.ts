import type { BuildPlan, BuildStage, BuildType, ModDef, Vehicle } from './types';
import { MODS } from './mods';
import { findVehicle } from './vehicles';

const POWER_CATEGORIES = new Set([
  'intake',
  'exhaust',
  'tune',
  'fueling',
  'forced-induction',
  'internals',
]);

function effectiveCost(mod: ModDef, vehicle: Vehicle): number {
  // Power parts scale with platform cost; bolt cosmetic/offroad less so.
  const scaled = mod.cost * vehicle.costFactor;
  return Math.round(scaled / 25) * 25;
}

function applyHp(mod: ModDef, currentHp: number, baseHp: number): number {
  if (mod.fiMultiplier) return Math.round(currentHp * mod.fiMultiplier);
  let gain = 0;
  if (mod.hp) gain += mod.hp;
  if (mod.hpPct) gain += baseHp * mod.hpPct;
  return Math.round(currentHp + gain);
}

interface Candidate {
  mod: ModDef;
  cost: number;
  isPower: boolean;
}

function buildCandidates(vehicle: Vehicle, buildType: BuildType): Candidate[] {
  return MODS.filter(
    (m) => m.builds.includes(buildType) && m.aspiration.includes(vehicle.aspiration),
  )
    .map((mod) => ({
      mod,
      cost: effectiveCost(mod, vehicle),
      isPower: POWER_CATEGORIES.has(mod.category),
    }))
    .sort((a, b) => {
      if (a.mod.priority !== b.mod.priority) return a.mod.priority - b.mod.priority;
      return a.cost - b.cost;
    });
}

export function generatePlan(
  vehicleId: string,
  budget: number,
  hpGoal: number,
  buildType: BuildType,
): BuildPlan | null {
  const vehicle = findVehicle(vehicleId);
  if (!vehicle) return null;

  const candidates = buildCandidates(vehicle, buildType);
  const stages: BuildStage[] = [];
  let spent = 0;
  let hp = vehicle.baseHp;
  let stageNum = 0;

  // Whether the build cares about chasing the HP number aggressively.
  const powerFocused = buildType === 'drag' || buildType === 'track' || buildType === 'street';

  for (const c of candidates) {
    if (spent + c.cost > budget) continue; // can't afford — skip, try cheaper later items

    // Don't keep buying pure-power parts well past the goal (leave budget for the rest).
    if (c.isPower && hp >= hpGoal * 1.04 && c.mod.category !== 'forced-induction') {
      // allow non-power support mods to still be added below
      if (!powerFocused) continue;
      if (hp >= hpGoal * 1.12) continue;
    }

    const before = hp;
    const after = applyHp(c.mod, hp, vehicle.baseHp);
    hp = after;
    spent += c.cost;
    stageNum += 1;
    stages.push({
      stage: stageNum,
      mod: c.mod,
      cost: c.cost,
      hpAfter: after,
      hpGain: after - before,
    });
  }

  const reliabilityNotes = buildReliability(vehicle, hp, stages);
  const sourcing = buildSourcing(stages);

  return {
    vehicle,
    budget,
    hpGoal,
    buildType,
    stages,
    totalCost: spent,
    estimatedHp: hp,
    remaining: budget - spent,
    goalMet: hp >= hpGoal,
    reliabilityNotes,
    sourcing,
  };
}

function buildReliability(vehicle: Vehicle, hp: number, stages: BuildStage[]): string[] {
  const notes: string[] = [];
  const gainPct = (hp - vehicle.baseHp) / vehicle.baseHp;

  for (const s of stages) {
    if (s.mod.reliability) notes.push(`${s.mod.name}: ${s.mod.reliability}`);
  }

  if (gainPct > 0.4) {
    notes.push(
      `You are targeting roughly ${Math.round(gainPct * 100)}% over stock. Budget for upgraded fueling, cooling, and a professional dyno tune before chasing the final numbers.`,
    );
  }
  if (gainPct > 0.7) {
    notes.push(
      'At this power level, factory internals and drivetrain components become the weak link. Plan for built internals and a clutch/axle upgrade for long-term reliability.',
    );
  }
  if (vehicle.aspiration === 'na' && stages.some((s) => s.mod.category === 'forced-induction')) {
    notes.push(
      'Adding forced induction to a naturally aspirated engine: verify fuel-system capacity and reduce timing on pump gas until a flex-fuel or E85 tune is dialed in.',
    );
  }
  if (notes.length === 0) {
    notes.push('This is a conservative, street-reliable combination. Maintain fresh fluids and quality fuel.');
  }
  return notes;
}

function buildSourcing(stages: BuildStage[]): string[] {
  const seen = new Set<string>();
  const list: string[] = [];
  const map: Record<string, string> = {
    intake: 'Intake — reputable brand (e.g. AEM, K&N, aFe) with a CARB number if required',
    exhaust: 'Exhaust — full system from a known fabricator; confirm fitment by chassis code',
    tune: 'Tune — established calibrator for your platform; book dyno time in advance',
    fueling: 'Fuel system — OEM-grade pump/injectors sized to target output',
    'forced-induction': 'Forced induction — complete kit with all gaskets, fasteners, and a supporting tune',
    internals: 'Engine internals — forged components and a trusted machine shop',
    suspension: 'Suspension — matched spring/damper set; budget an alignment',
    brakes: 'Brakes — pads, rotors, and stainless lines as a package',
    wheels: 'Wheels & tires — verify offset, width, and load rating',
    drivetrain: 'Drivetrain — clutch/diff rated above target torque',
    cooling: 'Cooling — correctly sized core with proper mounting hardware',
    aero: 'Aero — hardware kit and reinforced mounting points',
    cosmetic: 'Cosmetic — professional install for wrap/body work',
    weight: 'Weight reduction — FIA-style seats and harnesses if track-bound',
    offroad: 'Off-road — kit matched to your axle and intended terrain',
  };
  for (const s of stages) {
    const key = s.mod.category;
    if (!seen.has(key)) {
      seen.add(key);
      list.push(map[key] || `${s.mod.category} — source from a reputable supplier`);
    }
  }
  list.push('Reserve ~10% of budget for fasteners, fluids, gaskets, and unforeseen install labor.');
  return list;
}

export const BUILD_TYPES: { id: BuildType; label: string; blurb: string }[] = [
  { id: 'street', label: 'Street', blurb: 'Balanced power and handling for spirited road driving.' },
  { id: 'track', label: 'Track', blurb: 'Grip, braking, cooling, and repeatable lap-time pace.' },
  { id: 'drag', label: 'Drag', blurb: 'Maximum straight-line power and traction off the line.' },
  { id: 'drift', label: 'Drift', blurb: 'Angle, control, and a chassis that loves to slide.' },
  { id: 'show', label: 'Show Car', blurb: 'Stance, wheels, and finish that turns heads.' },
  { id: 'daily', label: 'Daily Driver', blurb: 'Reliable, comfortable upgrades you live with every day.' },
  { id: 'offroad', label: 'Off Road', blurb: 'Clearance, traction, and protection for the trail.' },
];
