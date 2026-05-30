import type { Vehicle } from './types';

export const VEHICLES: Vehicle[] = [
  // ── American muscle ───────────────────────────────
  { id: 'mustang-gt', make: 'Ford', model: 'Mustang GT', years: [2015, 2024], baseHp: 460, aspiration: 'na', drivetrain: 'rwd', category: 'muscle', costFactor: 1.0 },
  { id: 'mustang-ecoboost', make: 'Ford', model: 'Mustang EcoBoost', years: [2015, 2023], baseHp: 310, aspiration: 'turbo', drivetrain: 'rwd', category: 'muscle', costFactor: 1.0 },
  { id: 'shelby-gt500', make: 'Ford', model: 'Shelby GT500', years: [2020, 2022], baseHp: 760, aspiration: 'supercharged', drivetrain: 'rwd', category: 'exotic', costFactor: 1.4 },
  { id: 'camaro-ss', make: 'Chevrolet', model: 'Camaro SS', years: [2016, 2024], baseHp: 455, aspiration: 'na', drivetrain: 'rwd', category: 'muscle', costFactor: 1.0 },
  { id: 'camaro-zl1', make: 'Chevrolet', model: 'Camaro ZL1', years: [2017, 2024], baseHp: 650, aspiration: 'supercharged', drivetrain: 'rwd', category: 'exotic', costFactor: 1.35 },
  { id: 'corvette-c7', make: 'Chevrolet', model: 'Corvette C7', years: [2014, 2019], baseHp: 460, aspiration: 'na', drivetrain: 'rwd', category: 'sports', costFactor: 1.2 },
  { id: 'corvette-c8', make: 'Chevrolet', model: 'Corvette C8', years: [2020, 2024], baseHp: 495, aspiration: 'na', drivetrain: 'rwd', category: 'sports', costFactor: 1.3 },
  { id: 'charger-rt', make: 'Dodge', model: 'Charger R/T', years: [2015, 2023], baseHp: 370, aspiration: 'na', drivetrain: 'rwd', category: 'muscle', costFactor: 1.0 },
  { id: 'charger-hellcat', make: 'Dodge', model: 'Charger Hellcat', years: [2015, 2023], baseHp: 707, aspiration: 'supercharged', drivetrain: 'rwd', category: 'exotic', costFactor: 1.3 },
  { id: 'challenger-rt', make: 'Dodge', model: 'Challenger R/T', years: [2015, 2023], baseHp: 375, aspiration: 'na', drivetrain: 'rwd', category: 'muscle', costFactor: 1.0 },
  { id: 'challenger-hellcat', make: 'Dodge', model: 'Challenger Hellcat', years: [2015, 2023], baseHp: 717, aspiration: 'supercharged', drivetrain: 'rwd', category: 'exotic', costFactor: 1.3 },
  { id: 'viper', make: 'Dodge', model: 'Viper', years: [2013, 2017], baseHp: 645, aspiration: 'na', drivetrain: 'rwd', category: 'exotic', costFactor: 1.6 },

  // ── JDM ───────────────────────────────────────────
  { id: 'supra-a90', make: 'Toyota', model: 'GR Supra (A90)', years: [2020, 2024], baseHp: 382, aspiration: 'turbo', drivetrain: 'rwd', category: 'jdm', costFactor: 1.15 },
  { id: 'supra-mk4', make: 'Toyota', model: 'Supra (MK4)', years: [1993, 1998], baseHp: 320, aspiration: 'turbo', drivetrain: 'rwd', category: 'jdm', costFactor: 1.2 },
  { id: 'brz', make: 'Subaru', model: 'BRZ', years: [2013, 2024], baseHp: 228, aspiration: 'na', drivetrain: 'rwd', category: 'jdm', costFactor: 0.95 },
  { id: 'gr86', make: 'Toyota', model: 'GR86', years: [2022, 2024], baseHp: 228, aspiration: 'na', drivetrain: 'rwd', category: 'jdm', costFactor: 0.95 },
  { id: 'civic-si', make: 'Honda', model: 'Civic Si', years: [2017, 2024], baseHp: 200, aspiration: 'turbo', drivetrain: 'fwd', category: 'jdm', costFactor: 0.9 },
  { id: 'civic-type-r', make: 'Honda', model: 'Civic Type R', years: [2017, 2024], baseHp: 315, aspiration: 'turbo', drivetrain: 'fwd', category: 'jdm', costFactor: 1.0 },
  { id: 'wrx', make: 'Subaru', model: 'WRX', years: [2015, 2024], baseHp: 271, aspiration: 'turbo', drivetrain: 'awd', category: 'jdm', costFactor: 1.0 },
  { id: 'sti', make: 'Subaru', model: 'WRX STI', years: [2015, 2021], baseHp: 310, aspiration: 'turbo', drivetrain: 'awd', category: 'jdm', costFactor: 1.05 },
  { id: '370z', make: 'Nissan', model: '370Z', years: [2009, 2020], baseHp: 332, aspiration: 'na', drivetrain: 'rwd', category: 'jdm', costFactor: 0.95 },
  { id: '350z', make: 'Nissan', model: '350Z', years: [2003, 2009], baseHp: 287, aspiration: 'na', drivetrain: 'rwd', category: 'jdm', costFactor: 0.9 },
  { id: '400z', make: 'Nissan', model: 'Z (400Z)', years: [2023, 2024], baseHp: 400, aspiration: 'turbo', drivetrain: 'rwd', category: 'jdm', costFactor: 1.1 },
  { id: 'miata-nd', make: 'Mazda', model: 'MX-5 Miata (ND)', years: [2016, 2024], baseHp: 181, aspiration: 'na', drivetrain: 'rwd', category: 'jdm', costFactor: 0.9 },
  { id: 'gtr-r35', make: 'Nissan', model: 'GT-R (R35)', years: [2009, 2024], baseHp: 565, aspiration: 'turbo', drivetrain: 'awd', category: 'exotic', costFactor: 1.5 },
  { id: 'gtr-r34', make: 'Nissan', model: 'Skyline GT-R (R34)', years: [1999, 2002], baseHp: 276, aspiration: 'turbo', drivetrain: 'awd', category: 'exotic', costFactor: 1.55 },
  { id: 'evo-x', make: 'Mitsubishi', model: 'Lancer Evolution X', years: [2008, 2015], baseHp: 291, aspiration: 'turbo', drivetrain: 'awd', category: 'jdm', costFactor: 1.0 },
  { id: 'rx7-fd', make: 'Mazda', model: 'RX-7 (FD)', years: [1992, 2002], baseHp: 276, aspiration: 'turbo', drivetrain: 'rwd', category: 'jdm', costFactor: 1.25 },
  { id: 'rx8', make: 'Mazda', model: 'RX-8', years: [2004, 2011], baseHp: 232, aspiration: 'na', drivetrain: 'rwd', category: 'jdm', costFactor: 1.0 },
  { id: 's15', make: 'Nissan', model: 'Silvia S15', years: [1999, 2002], baseHp: 247, aspiration: 'turbo', drivetrain: 'rwd', category: 'jdm', costFactor: 1.1 },
  { id: 's2000', make: 'Honda', model: 'S2000', years: [2000, 2009], baseHp: 240, aspiration: 'na', drivetrain: 'rwd', category: 'jdm', costFactor: 1.0 },
  { id: 'integra-type-s', make: 'Acura', model: 'Integra Type S', years: [2024, 2024], baseHp: 320, aspiration: 'turbo', drivetrain: 'fwd', category: 'jdm', costFactor: 1.0 },
  { id: 'nsx-na1', make: 'Acura', model: 'NSX (NA1)', years: [1991, 2005], baseHp: 270, aspiration: 'na', drivetrain: 'rwd', category: 'exotic', costFactor: 1.4 },
  { id: 'gr-corolla', make: 'Toyota', model: 'GR Corolla', years: [2023, 2024], baseHp: 300, aspiration: 'turbo', drivetrain: 'awd', category: 'jdm', costFactor: 1.0 },
  { id: 'gr-yaris', make: 'Toyota', model: 'GR Yaris', years: [2021, 2024], baseHp: 268, aspiration: 'turbo', drivetrain: 'awd', category: 'jdm', costFactor: 1.05 },

  // ── European ──────────────────────────────────────
  { id: 'm3-f80', make: 'BMW', model: 'M3 (F80)', years: [2015, 2018], baseHp: 425, aspiration: 'turbo', drivetrain: 'rwd', category: 'euro', costFactor: 1.3 },
  { id: 'm3-g80', make: 'BMW', model: 'M3 (G80)', years: [2021, 2024], baseHp: 473, aspiration: 'turbo', drivetrain: 'rwd', category: 'euro', costFactor: 1.35 },
  { id: 'm4', make: 'BMW', model: 'M4', years: [2021, 2024], baseHp: 473, aspiration: 'turbo', drivetrain: 'rwd', category: 'euro', costFactor: 1.35 },
  { id: 'm2', make: 'BMW', model: 'M2', years: [2016, 2024], baseHp: 405, aspiration: 'turbo', drivetrain: 'rwd', category: 'euro', costFactor: 1.3 },
  { id: '335i', make: 'BMW', model: '335i', years: [2007, 2013], baseHp: 300, aspiration: 'turbo', drivetrain: 'rwd', category: 'euro', costFactor: 1.2 },
  { id: 'golf-gti', make: 'Volkswagen', model: 'Golf GTI', years: [2015, 2024], baseHp: 241, aspiration: 'turbo', drivetrain: 'fwd', category: 'euro', costFactor: 1.1 },
  { id: 'golf-r', make: 'Volkswagen', model: 'Golf R', years: [2015, 2024], baseHp: 315, aspiration: 'turbo', drivetrain: 'awd', category: 'euro', costFactor: 1.15 },
  { id: 'jetta-gli', make: 'Volkswagen', model: 'Jetta GLI', years: [2019, 2024], baseHp: 228, aspiration: 'turbo', drivetrain: 'fwd', category: 'euro', costFactor: 1.05 },
  { id: 'audi-s4', make: 'Audi', model: 'S4', years: [2016, 2024], baseHp: 349, aspiration: 'turbo', drivetrain: 'awd', category: 'euro', costFactor: 1.3 },
  { id: 'audi-rs3', make: 'Audi', model: 'RS3', years: [2017, 2024], baseHp: 401, aspiration: 'turbo', drivetrain: 'awd', category: 'euro', costFactor: 1.35 },
  { id: 'audi-tt-rs', make: 'Audi', model: 'TT RS', years: [2018, 2023], baseHp: 394, aspiration: 'turbo', drivetrain: 'awd', category: 'euro', costFactor: 1.35 },
  { id: 'audi-rs6', make: 'Audi', model: 'RS6 Avant', years: [2021, 2024], baseHp: 591, aspiration: 'turbo', drivetrain: 'awd', category: 'exotic', costFactor: 1.55 },
  { id: 'c63-amg', make: 'Mercedes-Benz', model: 'C63 AMG', years: [2015, 2021], baseHp: 469, aspiration: 'turbo', drivetrain: 'rwd', category: 'euro', costFactor: 1.4 },
  { id: 'a45-amg', make: 'Mercedes-Benz', model: 'A45 AMG', years: [2020, 2024], baseHp: 416, aspiration: 'turbo', drivetrain: 'awd', category: 'euro', costFactor: 1.35 },
  { id: '911-carrera', make: 'Porsche', model: '911 Carrera', years: [2017, 2024], baseHp: 379, aspiration: 'turbo', drivetrain: 'rwd', category: 'exotic', costFactor: 1.5 },
  { id: '911-gt3', make: 'Porsche', model: '911 GT3', years: [2018, 2024], baseHp: 502, aspiration: 'na', drivetrain: 'rwd', category: 'exotic', costFactor: 1.7 },
  { id: '911-turbo-s', make: 'Porsche', model: '911 Turbo S', years: [2021, 2024], baseHp: 640, aspiration: 'turbo', drivetrain: 'awd', category: 'exotic', costFactor: 1.7 },
  { id: 'cayman', make: 'Porsche', model: '718 Cayman', years: [2017, 2024], baseHp: 300, aspiration: 'turbo', drivetrain: 'rwd', category: 'exotic', costFactor: 1.45 },
  { id: 'mini-cooper-s', make: 'Mini', model: 'Cooper S', years: [2014, 2024], baseHp: 189, aspiration: 'turbo', drivetrain: 'fwd', category: 'euro', costFactor: 1.05 },

  // ── Hot hatch / sport compact ─────────────────────
  { id: 'focus-rs', make: 'Ford', model: 'Focus RS', years: [2016, 2018], baseHp: 350, aspiration: 'turbo', drivetrain: 'awd', category: 'sports', costFactor: 1.0 },
  { id: 'fiesta-st', make: 'Ford', model: 'Fiesta ST', years: [2014, 2019], baseHp: 197, aspiration: 'turbo', drivetrain: 'fwd', category: 'sports', costFactor: 0.9 },
  { id: 'elantra-n', make: 'Hyundai', model: 'Elantra N', years: [2022, 2024], baseHp: 276, aspiration: 'turbo', drivetrain: 'fwd', category: 'sports', costFactor: 0.95 },
  { id: 'veloster-n', make: 'Hyundai', model: 'Veloster N', years: [2019, 2022], baseHp: 275, aspiration: 'turbo', drivetrain: 'fwd', category: 'sports', costFactor: 0.95 },
  { id: 'stinger-gt', make: 'Kia', model: 'Stinger GT', years: [2018, 2023], baseHp: 368, aspiration: 'turbo', drivetrain: 'awd', category: 'sports', costFactor: 1.1 },

  // ── Trucks / off-road ─────────────────────────────
  { id: 'tacoma', make: 'Toyota', model: 'Tacoma', years: [2016, 2024], baseHp: 278, aspiration: 'na', drivetrain: 'awd', category: 'truck', costFactor: 1.0 },
  { id: '4runner', make: 'Toyota', model: '4Runner', years: [2010, 2024], baseHp: 270, aspiration: 'na', drivetrain: 'awd', category: 'truck', costFactor: 1.05 },
  { id: 'f150', make: 'Ford', model: 'F-150 (5.0)', years: [2015, 2024], baseHp: 400, aspiration: 'na', drivetrain: 'awd', category: 'truck', costFactor: 1.0 },
  { id: 'f150-raptor', make: 'Ford', model: 'F-150 Raptor', years: [2017, 2024], baseHp: 450, aspiration: 'turbo', drivetrain: 'awd', category: 'truck', costFactor: 1.15 },
  { id: 'ranger', make: 'Ford', model: 'Ranger', years: [2019, 2024], baseHp: 270, aspiration: 'turbo', drivetrain: 'awd', category: 'truck', costFactor: 1.0 },
  { id: 'bronco', make: 'Ford', model: 'Bronco', years: [2021, 2024], baseHp: 330, aspiration: 'turbo', drivetrain: 'awd', category: 'truck', costFactor: 1.1 },
  { id: 'silverado', make: 'Chevrolet', model: 'Silverado 1500', years: [2014, 2024], baseHp: 420, aspiration: 'na', drivetrain: 'awd', category: 'truck', costFactor: 1.0 },
  { id: 'colorado', make: 'Chevrolet', model: 'Colorado', years: [2017, 2024], baseHp: 310, aspiration: 'turbo', drivetrain: 'awd', category: 'truck', costFactor: 1.0 },
  { id: 'ram-1500', make: 'Ram', model: '1500', years: [2019, 2024], baseHp: 395, aspiration: 'na', drivetrain: 'awd', category: 'truck', costFactor: 1.0 },
  { id: 'wrangler', make: 'Jeep', model: 'Wrangler', years: [2018, 2024], baseHp: 285, aspiration: 'na', drivetrain: 'awd', category: 'truck', costFactor: 1.05 },
  { id: 'wrangler-392', make: 'Jeep', model: 'Wrangler 392', years: [2021, 2024], baseHp: 470, aspiration: 'na', drivetrain: 'awd', category: 'truck', costFactor: 1.15 },
];

export function findVehicle(id: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.id === id);
}

export const MAKES: string[] = Array.from(new Set(VEHICLES.map((v) => v.make))).sort();
