export interface PriceData {
  description: string;
  nationalAvg: number;
  low: number;
  high: number;
  unit: string;
  category: string;
}

// National average prices for common medical procedures and services
// Sources: Healthcare Bluebook, FAIR Health, CMS data
export const NATIONAL_AVERAGES: Record<string, PriceData> = {
  // Emergency & Evaluation
  "99281": { description: "Emergency Dept Visit – Level 1", nationalAvg: 150, low: 80, high: 350, unit: "per visit", category: "Emergency" },
  "99282": { description: "Emergency Dept Visit – Level 2", nationalAvg: 280, low: 150, high: 600, unit: "per visit", category: "Emergency" },
  "99283": { description: "Emergency Dept Visit – Level 3", nationalAvg: 420, low: 250, high: 900, unit: "per visit", category: "Emergency" },
  "99284": { description: "Emergency Dept Visit – Level 4", nationalAvg: 640, low: 400, high: 1400, unit: "per visit", category: "Emergency" },
  "99285": { description: "Emergency Dept Visit – Level 5", nationalAvg: 980, low: 600, high: 2200, unit: "per visit", category: "Emergency" },

  // Imaging
  "74177": { description: "CT Scan – Abdomen & Pelvis w/ contrast", nationalAvg: 1500, low: 400, high: 3200, unit: "per scan", category: "Imaging" },
  "74178": { description: "CT Scan – Abdomen & Pelvis w/o & w/ contrast", nationalAvg: 1800, low: 500, high: 3800, unit: "per scan", category: "Imaging" },
  "71046": { description: "Chest X-Ray – 2 views", nationalAvg: 300, low: 80, high: 700, unit: "per image", category: "Imaging" },
  "70553": { description: "MRI – Brain w/ contrast", nationalAvg: 2000, low: 400, high: 5000, unit: "per scan", category: "Imaging" },
  "70551": { description: "MRI – Brain w/o contrast", nationalAvg: 1600, low: 350, high: 4000, unit: "per scan", category: "Imaging" },
  "72148": { description: "MRI – Lumbar Spine w/o contrast", nationalAvg: 1700, low: 400, high: 3800, unit: "per scan", category: "Imaging" },
  "73721": { description: "MRI – Knee w/o contrast", nationalAvg: 1500, low: 350, high: 3500, unit: "per scan", category: "Imaging" },
  "70450": { description: "CT Scan – Head w/o contrast", nationalAvg: 1000, low: 250, high: 3000, unit: "per scan", category: "Imaging" },
  "72192": { description: "CT Scan – Pelvis w/o contrast", nationalAvg: 900, low: 250, high: 2500, unit: "per scan", category: "Imaging" },

  // Lab / Blood Work
  "80053": { description: "Comprehensive Metabolic Panel (CMP)", nationalAvg: 55, low: 20, high: 150, unit: "per test", category: "Laboratory" },
  "80048": { description: "Basic Metabolic Panel (BMP)", nationalAvg: 40, low: 15, high: 110, unit: "per test", category: "Laboratory" },
  "85025": { description: "CBC with Differential", nationalAvg: 45, low: 15, high: 100, unit: "per test", category: "Laboratory" },
  "85027": { description: "Complete Blood Count (CBC)", nationalAvg: 35, low: 12, high: 80, unit: "per test", category: "Laboratory" },
  "80061": { description: "Lipid Panel", nationalAvg: 50, low: 15, high: 120, unit: "per test", category: "Laboratory" },
  "83036": { description: "Hemoglobin A1c", nationalAvg: 45, low: 15, high: 110, unit: "per test", category: "Laboratory" },
  "84443": { description: "TSH (Thyroid Stimulating Hormone)", nationalAvg: 55, low: 20, high: 130, unit: "per test", category: "Laboratory" },
  "81003": { description: "Urinalysis, automated", nationalAvg: 35, low: 10, high: 80, unit: "per test", category: "Laboratory" },
  "87804": { description: "Influenza Rapid Antigen Test", nationalAvg: 65, low: 25, high: 150, unit: "per test", category: "Laboratory" },

  // Cardiology
  "93000": { description: "EKG – 12-Lead (ECG)", nationalAvg: 100, low: 40, high: 250, unit: "per test", category: "Cardiology" },
  "93306": { description: "Echocardiogram w/ Doppler", nationalAvg: 1400, low: 400, high: 3500, unit: "per test", category: "Cardiology" },
  "93015": { description: "Stress Test (Exercise ECG)", nationalAvg: 800, low: 300, high: 2000, unit: "per test", category: "Cardiology" },

  // Room & Board
  "0120": { description: "Room & Board – Semi-Private", nationalAvg: 1200, low: 700, high: 2200, unit: "per day", category: "Room & Board" },
  "0110": { description: "Room & Board – Private", nationalAvg: 1900, low: 1000, high: 3500, unit: "per day", category: "Room & Board" },
  "0200": { description: "ICU / Intensive Care Room", nationalAvg: 4000, low: 2000, high: 10000, unit: "per day", category: "Room & Board" },

  // Common Procedures
  "27447": { description: "Total Knee Replacement", nationalAvg: 22000, low: 12000, high: 50000, unit: "per procedure", category: "Surgery" },
  "27130": { description: "Total Hip Replacement", nationalAvg: 20000, low: 11000, high: 45000, unit: "per procedure", category: "Surgery" },
  "44950": { description: "Appendectomy (laparoscopic)", nationalAvg: 15000, low: 8000, high: 30000, unit: "per procedure", category: "Surgery" },
  "45378": { description: "Colonoscopy – diagnostic", nationalAvg: 2750, low: 900, high: 5500, unit: "per procedure", category: "Gastro" },
  "43239": { description: "Upper GI Endoscopy w/ biopsy", nationalAvg: 2000, low: 700, high: 4500, unit: "per procedure", category: "Gastro" },

  // Drugs / IV
  "0636": { description: "IV Drug Administration", nationalAvg: 280, low: 100, high: 700, unit: "per administration", category: "Pharmacy" },
  "0270": { description: "IV Setup & Administration (1st hour)", nationalAvg: 180, low: 80, high: 450, unit: "per session", category: "Pharmacy" },

  // Hospital Services
  "0730": { description: "EKG – Routine 12-Lead (hospital)", nationalAvg: 185, low: 60, high: 400, unit: "per test", category: "Hospital Services" },
  "0301": { description: "Laboratory Services – General", nationalAvg: 120, low: 40, high: 300, unit: "per test", category: "Laboratory" },
  "0450": { description: "Pulmonary / Respiratory Therapy", nationalAvg: 280, low: 100, high: 650, unit: "per session", category: "Therapy" },
  "99238": { description: "Hospital Discharge – Day Management >30 min", nationalAvg: 175, low: 80, high: 380, unit: "per visit", category: "Physician" },
  "99233": { description: "Subsequent Hospital Care – High complexity", nationalAvg: 220, low: 100, high: 500, unit: "per visit", category: "Physician" },
};

/**
 * Try to find a national average for a given CPT code or keyword
 */
export function lookupPrice(query: string): PriceData | null {
  const q = query.trim().toUpperCase();

  // Exact CPT match
  if (NATIONAL_AVERAGES[q]) return NATIONAL_AVERAGES[q];
  if (NATIONAL_AVERAGES[query.trim()]) return NATIONAL_AVERAGES[query.trim()];

  // Fuzzy keyword match
  const lower = query.toLowerCase();
  for (const [, data] of Object.entries(NATIONAL_AVERAGES)) {
    if (data.description.toLowerCase().includes(lower)) return data;
  }

  return null;
}

/**
 * Featured comparisons shown on the results page
 */
export const FEATURED_COMPARISONS = [
  { label: "CT Scan (Abdomen)", cpt: "74177" },
  { label: "MRI (Brain)", cpt: "70551" },
  { label: "Emergency Visit (Level 4)", cpt: "99284" },
  { label: "Chest X-Ray", cpt: "71046" },
  { label: "Hospital Room (per day)", cpt: "0120" },
  { label: "Blood Panel (CMP)", cpt: "80053" },
];
