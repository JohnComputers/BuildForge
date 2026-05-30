import type { ModDef } from './types';

const ALL_BUILDS = ['street', 'track', 'drag', 'drift', 'show', 'daily', 'offroad'] as const;
const POWER_BUILDS = ['street', 'track', 'drag', 'drift', 'daily'] as const;
const NA_SC = ['na', 'supercharged'] as const;
const ALL_ASP = ['na', 'turbo', 'supercharged'] as const;

export const MODS: ModDef[] = [
  // ── Bolt-on power ─────────────────────────────────
  {
    id: 'cai', name: 'Cold Air Intake', category: 'intake', cost: 350, hp: 14,
    aspiration: [...ALL_ASP], builds: [...POWER_BUILDS, 'show'], priority: 1,
    note: 'Frees up intake airflow — the classic first mod.',
    reliability: 'Use an oiled-filter alternative or maintain MAF cleanliness.',
  },
  {
    id: 'catback', name: 'Cat-Back Exhaust', category: 'exhaust', cost: 950, hp: 14,
    aspiration: [...ALL_ASP], builds: [...POWER_BUILDS, 'show'], priority: 2,
    note: 'Reduced backpressure and a far better soundtrack.',
  },
  {
    id: 'headers', name: 'Long-Tube Headers', category: 'exhaust', cost: 1200, hp: 24,
    aspiration: [...NA_SC], builds: [...POWER_BUILDS], priority: 3,
    note: 'Major exhaust-side gains for naturally aspirated engines.',
    reliability: 'Pairs with a high-flow cat to stay emissions-friendly.',
  },
  {
    id: 'downpipe', name: 'High-Flow Downpipe', category: 'exhaust', cost: 750, hp: 38,
    aspiration: ['turbo'], builds: [...POWER_BUILDS], priority: 3,
    note: 'Unlocks turbo spool and big mid-range torque.',
    reliability: 'Catless variants may trip emissions; choose accordingly.',
  },
  {
    id: 'tune93', name: 'ECU Tune (93 Octane)', category: 'tune', cost: 600, hpPct: 0.06,
    aspiration: [...ALL_ASP], builds: [...POWER_BUILDS], priority: 1,
    note: 'Recalibrated timing and fueling to match your hardware.',
    reliability: 'Always tune on quality fuel and log knock.',
  },
  {
    id: 'e85', name: 'E85 Flex-Fuel Tune', category: 'tune', cost: 900, hpPct: 0.1,
    aspiration: [...ALL_ASP], builds: ['street', 'track', 'drag', 'drift'], priority: 5,
    note: 'High-octane ethanol blend for aggressive timing.',
    reliability: 'Requires compatible fuel system; check injector duty cycle.',
  },
  {
    id: 'injectors', name: 'Injectors + Fuel Pump', category: 'fueling', cost: 1100, hp: 10,
    aspiration: [...ALL_ASP], builds: ['track', 'drag', 'drift', 'street'], priority: 4,
    note: 'Fuel-system headroom required before serious power.',
    reliability: 'Critical safety upgrade before any forced-induction increase.',
  },
  {
    id: 'intercooler', name: 'Front-Mount Intercooler', category: 'cooling', cost: 850, hp: 26,
    aspiration: ['turbo'], builds: ['track', 'drag', 'drift', 'street'], priority: 4,
    note: 'Cooler charge air = consistent, repeatable power.',
  },
  {
    id: 'meth', name: 'Methanol Injection', category: 'fueling', cost: 700, hp: 30,
    aspiration: ['turbo', 'supercharged'], builds: ['drag', 'track'], priority: 6,
    note: 'Charge cooling and detonation resistance for big boost.',
    reliability: 'Add a low-fluid failsafe to protect the engine.',
  },
  {
    id: 'cams', name: 'Performance Camshafts', category: 'internals', cost: 2200, hp: 38,
    aspiration: ['na'], builds: ['track', 'drag', 'street'], priority: 6,
    note: 'Aggressive lift and duration for top-end power.',
    reliability: 'Requires a supporting tune and valvetrain check.',
  },

  // ── Forced induction ──────────────────────────────
  {
    id: 'turbo-upgrade', name: 'Upgraded Turbo', category: 'forced-induction', cost: 4500, fiMultiplier: 1.42,
    aspiration: ['turbo'], builds: ['track', 'drag', 'street', 'drift'], priority: 8,
    note: 'Larger compressor for a substantial power ceiling.',
    reliability: 'Demands upgraded fueling and a professional tune.',
  },
  {
    id: 'supercharger', name: 'Supercharger Kit', category: 'forced-induction', cost: 6500, fiMultiplier: 1.5,
    aspiration: ['na'], builds: ['track', 'drag', 'street'], priority: 8,
    note: 'Linear, instant boost — huge gains for NA V6/V8 platforms.',
    reliability: 'Add an upgraded fuel system and supporting cooling.',
  },
  {
    id: 'turbo-kit', name: 'Turbo Kit (NA Conversion)', category: 'forced-induction', cost: 5500, fiMultiplier: 1.55,
    aspiration: ['na'], builds: ['drag', 'street', 'drift'], priority: 8,
    note: 'Bolt-on forced induction for naturally aspirated engines.',
    reliability: 'Plan for built internals beyond moderate boost levels.',
  },
  {
    id: 'pulley', name: 'Pulley + Heat Exchanger', category: 'forced-induction', cost: 1200, hpPct: 0.09,
    aspiration: ['supercharged'], builds: ['track', 'drag', 'street'], priority: 5,
    note: 'More boost from the factory blower with cooler IATs.',
  },
  {
    id: 'built-motor', name: 'Built Long-Block', category: 'internals', cost: 6500, hp: 0,
    aspiration: [...ALL_ASP], builds: ['drag', 'track'], priority: 9,
    note: 'Forged internals for sustained high-boost reliability.',
    reliability: 'Essential foundation for power well beyond stock limits.',
  },

  // ── Handling ──────────────────────────────────────
  {
    id: 'coilovers', name: 'Coilover Suspension', category: 'suspension', cost: 1500, hp: 0,
    aspiration: [...ALL_ASP], builds: ['track', 'drift', 'street', 'show'], priority: 4,
    note: 'Adjustable ride height and damping for a planted stance.',
  },
  {
    id: 'springs', name: 'Lowering Springs', category: 'suspension', cost: 450, hp: 0,
    aspiration: [...ALL_ASP], builds: ['daily', 'street', 'show'], priority: 3,
    note: 'Cleaner stance and lower center of gravity on a budget.',
  },
  {
    id: 'sways', name: 'Sway Bar Kit', category: 'suspension', cost: 450, hp: 0,
    aspiration: [...ALL_ASP], builds: ['track', 'drift', 'street'], priority: 5,
    note: 'Reduces body roll and sharpens turn-in.',
  },
  {
    id: 'bbk', name: 'Big Brake Kit', category: 'brakes', cost: 2500, hp: 0,
    aspiration: [...ALL_ASP], builds: ['track', 'drag', 'street'], priority: 5,
    note: 'Fade-free stopping power for repeated hard use.',
  },
  {
    id: 'pads-lines', name: 'Track Pads + SS Lines', category: 'brakes', cost: 600, hp: 0,
    aspiration: [...ALL_ASP], builds: ['track', 'drift', 'daily'], priority: 4,
    note: 'High-temp friction and a firmer pedal for cheap.',
  },
  {
    id: 'lsd', name: 'Limited-Slip Differential', category: 'drivetrain', cost: 1800, hp: 0,
    aspiration: [...ALL_ASP], builds: ['track', 'drag', 'drift', 'street'], priority: 6,
    note: 'Puts power down evenly — transformative for traction.',
  },
  {
    id: 'clutch', name: 'Upgraded Clutch + Flywheel', category: 'drivetrain', cost: 1800, hp: 0,
    aspiration: [...ALL_ASP], builds: ['track', 'drag', 'drift'], priority: 7,
    note: 'Holds added torque without slip.',
    reliability: 'Mandatory once torque climbs past the stock clutch rating.',
  },

  // ── Wheels / tires ────────────────────────────────
  {
    id: 'track-wheels', name: 'Lightweight Wheels + Tires', category: 'wheels', cost: 2800, hp: 0,
    aspiration: [...ALL_ASP], builds: ['track', 'street'], priority: 5,
    note: 'Reduced unsprung mass and far more mechanical grip.',
  },
  {
    id: 'drag-radials', name: 'Drag Radials + Skinnies', category: 'wheels', cost: 1400, hp: 0,
    aspiration: [...ALL_ASP], builds: ['drag'], priority: 4,
    note: 'Hooks hard at launch for quicker 60-foot times.',
  },
  {
    id: 'show-wheels', name: 'Forged Show Wheels', category: 'wheels', cost: 3200, hp: 0,
    aspiration: [...ALL_ASP], builds: ['show', 'street'], priority: 3,
    note: 'Statement fitment and finish for the build.',
  },

  // ── Drift specific ────────────────────────────────
  {
    id: 'angle-kit', name: 'Steering Angle Kit', category: 'suspension', cost: 1200, hp: 0,
    aspiration: [...ALL_ASP], builds: ['drift'], priority: 4,
    note: 'Massive lock for holding bigger angle.',
  },
  {
    id: 'hydro', name: 'Hydraulic Handbrake', category: 'drivetrain', cost: 350, hp: 0,
    aspiration: [...ALL_ASP], builds: ['drift'], priority: 6,
    note: 'Independent rear-lock control for initiation.',
  },

  // ── Cooling / endurance ───────────────────────────
  {
    id: 'oil-cooler', name: 'Oil + Coolant Upgrade', category: 'cooling', cost: 900, hp: 0,
    aspiration: [...ALL_ASP], builds: ['track', 'drag', 'drift'], priority: 6,
    note: 'Keeps temps in check during sustained sessions.',
    reliability: 'Cheap insurance against heat-soak on track days.',
  },

  // ── Weight / aero ─────────────────────────────────
  {
    id: 'weight', name: 'Weight Reduction Package', category: 'weight', cost: 1800, hp: 0,
    aspiration: [...ALL_ASP], builds: ['track', 'drag'], priority: 7,
    note: 'Lightweight seats and panels improve every metric.',
  },
  {
    id: 'aero', name: 'Splitter + Wing Aero', category: 'aero', cost: 1600, hp: 0,
    aspiration: [...ALL_ASP], builds: ['track', 'show'], priority: 6,
    note: 'Real downforce for high-speed stability.',
  },
  {
    id: 'widebody', name: 'Wide-Body Kit', category: 'cosmetic', cost: 4500, hp: 0,
    aspiration: [...ALL_ASP], builds: ['show', 'drift'], priority: 5,
    note: 'Aggressive fender flares and presence.',
  },
  {
    id: 'wrap', name: 'Custom Wrap + Detail', category: 'cosmetic', cost: 3500, hp: 0,
    aspiration: [...ALL_ASP], builds: ['show'], priority: 4,
    note: 'Show-quality finish and protection.',
  },

  // ── Daily / comfort ───────────────────────────────
  {
    id: 'tires', name: 'Quality Performance Tires', category: 'wheels', cost: 950, hp: 0,
    aspiration: [...ALL_ASP], builds: ['daily', 'street'], priority: 2,
    note: 'The single biggest real-world performance upgrade.',
  },
  {
    id: 'brake-refresh', name: 'Brake Refresh + Fluid', category: 'brakes', cost: 600, hp: 0,
    aspiration: [...ALL_ASP], builds: ['daily'], priority: 3,
    note: 'Reliable, confident braking for the street.',
  },

  // ── Off-road ──────────────────────────────────────
  {
    id: 'lift', name: 'Suspension Lift Kit', category: 'offroad', cost: 2500, hp: 0,
    aspiration: [...ALL_ASP], builds: ['offroad'], priority: 1,
    note: 'Ground clearance and travel for the trail.',
  },
  {
    id: 'at-tires', name: 'All-Terrain / MT Tires', category: 'offroad', cost: 1800, hp: 0,
    aspiration: [...ALL_ASP], builds: ['offroad'], priority: 1,
    note: 'Traction across mud, rock and sand.',
  },
  {
    id: 'lockers', name: 'Front + Rear Lockers', category: 'offroad', cost: 2800, hp: 0,
    aspiration: [...ALL_ASP], builds: ['offroad'], priority: 3,
    note: 'Maximum traction in the gnarliest terrain.',
  },
  {
    id: 'armor', name: 'Skid Plates + Sliders', category: 'offroad', cost: 1500, hp: 0,
    aspiration: [...ALL_ASP], builds: ['offroad'], priority: 2,
    note: 'Protects the underbody and rockers.',
  },
  {
    id: 'winch', name: 'Winch + Steel Bumper', category: 'offroad', cost: 1900, hp: 0,
    aspiration: [...ALL_ASP], builds: ['offroad'], priority: 4,
    note: 'Self-recovery capability when it gets serious.',
  },
  {
    id: 'snorkel', name: 'Snorkel + Light Bar', category: 'offroad', cost: 750, hp: 0,
    aspiration: [...ALL_ASP], builds: ['offroad'], priority: 5,
    note: 'Water-crossing intake and night-trail visibility.',
  },
];

export function modById(id: string): ModDef | undefined {
  return MODS.find((m) => m.id === id);
}
