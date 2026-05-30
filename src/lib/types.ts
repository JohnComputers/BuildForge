export type Aspiration = 'na' | 'turbo' | 'supercharged';
export type Drivetrain = 'rwd' | 'fwd' | 'awd';
export type Category = 'muscle' | 'sports' | 'jdm' | 'euro' | 'truck' | 'exotic';

export type BuildType =
  | 'street'
  | 'track'
  | 'drag'
  | 'drift'
  | 'show'
  | 'daily'
  | 'offroad';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  years: [number, number];
  baseHp: number;
  aspiration: Aspiration;
  drivetrain: Drivetrain;
  category: Category;
  /** Pricing multiplier — exotics/euros cost more to modify. */
  costFactor: number;
}

export type ModCategory =
  | 'intake'
  | 'exhaust'
  | 'tune'
  | 'fueling'
  | 'forced-induction'
  | 'internals'
  | 'suspension'
  | 'brakes'
  | 'wheels'
  | 'drivetrain'
  | 'cooling'
  | 'aero'
  | 'cosmetic'
  | 'weight'
  | 'offroad';

export interface ModDef {
  id: string;
  name: string;
  category: ModCategory;
  /** Base cost before vehicle costFactor. */
  cost: number;
  /** Flat horsepower gain. */
  hp?: number;
  /** Gain as a fraction of base HP. */
  hpPct?: number;
  /** Forced-induction multiplier applied to current HP. */
  fiMultiplier?: number;
  aspiration: Aspiration[];
  builds: BuildType[];
  /** Lower = installed earlier / higher value. */
  priority: number;
  note: string;
  reliability?: string;
}

export interface BuildStage {
  stage: number;
  mod: ModDef;
  cost: number;
  hpAfter: number;
  hpGain: number;
}

export interface BuildPlan {
  vehicle: Vehicle;
  budget: number;
  hpGoal: number;
  buildType: BuildType;
  stages: BuildStage[];
  totalCost: number;
  estimatedHp: number;
  remaining: number;
  goalMet: boolean;
  reliabilityNotes: string[];
  sourcing: string[];
}

export interface PlannerInput {
  vehicleId: string;
  customLabel?: string;
  budget: number;
  hpGoal: number;
  buildType: BuildType;
}
