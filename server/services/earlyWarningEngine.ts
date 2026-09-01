/**
 * EARLY-WARNING DECISION ENGINE — Single Source of Truth
 *
 * Transforms multi-factor geotechnical telemetry and risk-engine outputs into
 * explainable operational warning levels (LOW, MODERATE, HIGH, CRITICAL),
 * multi-factor trigger reasons, trend states (ESCALATING, STABLE, RECOVERING),
 * and actionable responder directives.
 *
 * Used by both server.ts (REST API / dbStore) and frontend DemoContext.
 */

import { calculateRisk, RiskFactors } from "./riskEngine";

export type WarningLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
export type WarningTrend = "ESCALATING" | "STABLE" | "RECOVERING";

export interface EarlyWarningInput {
  zoneCode: string;
  zoneName?: string;
  district?: string;
  state?: string;
  rainfallRateMmHr: number;
  accumulation24hMm: number;
  soilMoisturePct: number;
  porePressureKPa: number;
  slopeTiltDeg: number;
  insarDisplacementMm: number;
  slopeInstabilityPct: number;
  slopeAngleDeg?: number;
  historicalVulnerabilityPct?: number;
  roadStatus?: "OPEN" | "AT RISK" | "BLOCKED";
  previousRiskScore?: number;
  previousWarningLevel?: WarningLevel;
  stage?: number;
}

export interface EarlyWarningResult {
  level: WarningLevel;
  triggered: boolean;
  riskScore: number;
  trend: WarningTrend;
  triggeredConditions: string[];
  reasons: string[];
  recommendedAction: string;
  timestamp: string;
  affectedZone: string;
  affectedZoneName: string;
  district: string;
  state: string;
  alertGenerated: boolean;
  contributingTriggers: string[];
}

/**
 * Explicit, readable threshold definitions for multi-factor decision logic.
 * Centralized and easy to inspect or modify.
 */
export const EARLY_WARNING_THRESHOLDS = {
  RAINFALL_RATE_MM_HR: { MODERATE: 15, HIGH: 30, CRITICAL: 40 },
  ACCUMULATION_24H_MM: { MODERATE: 45, HIGH: 80, CRITICAL: 120 },
  SOIL_MOISTURE_PCT: { MODERATE: 45, HIGH: 60, CRITICAL: 80 },
  PORE_PRESSURE_KPA: { MODERATE: 25, HIGH: 40, CRITICAL: 50 },
  SLOPE_TILT_DEG: { MODERATE: 1.5, HIGH: 3.0, CRITICAL: 5.0 },
  INSAR_DISPLACEMENT_MM: { MODERATE: 1.5, HIGH: 4.0, CRITICAL: 20.0 }, // displacement magnitude
  SLOPE_INSTABILITY_PCT: { MODERATE: 45, HIGH: 65, CRITICAL: 85 },
  RISK_SCORE: { MODERATE: 45, HIGH: 70, CRITICAL: 85 },
};

/**
 * Main Decision Engine Evaluator
 */
export function evaluateEarlyWarning(input: EarlyWarningInput): EarlyWarningResult {
  const zoneCode = input.zoneCode || "N-07";
  const zoneName = input.zoneName || (zoneCode === "N-07" ? "Hunthar Ridge" : zoneCode === "N-03" ? "Sonapur Tunnel Escarpment" : "High Hazard Corridor");
  const district = input.district || (zoneCode === "N-07" ? "Aizawl" : zoneCode === "N-03" ? "East Jaintia Hills" : "Regional Command");
  const state = input.state || (zoneCode === "N-07" ? "Mizoram" : zoneCode === "N-03" ? "Meghalaya" : "Northeast India");

  // 1. Run deterministic risk calculation
  const calc = calculateRisk({
    rainfallRateMmHr: input.rainfallRateMmHr,
    accumulation24hMm: input.accumulation24hMm,
    soilMoisturePct: input.soilMoisturePct,
    porePressureKPa: input.porePressureKPa,
    slopeInstabilityPct: input.slopeInstabilityPct,
    insarDisplacementMm: input.insarDisplacementMm,
    slopeAngleDeg: input.slopeAngleDeg ?? (zoneCode === "N-07" ? 48 : 42),
    historicalVulnerabilityPct: input.historicalVulnerabilityPct ?? 88,
  });

  const score = calc.score;

  // Active hydrologic driving conditions check (to distinguish active failure from post-event static residual offset)
  const isActiveHydrologicDrive = input.porePressureKPa >= 35 || input.soilMoisturePct >= 60 || input.rainfallRateMmHr >= 15;

  // 2. Evaluate multi-factor rule triggers
  const triggeredConditions: string[] = [];
  const reasons: string[] = [];
  const contributingTriggers: string[] = [];

  let criticalCount = 0;
  let highCount = 0;
  let moderateCount = 0;

  // Rainfall Rate
  if (input.rainfallRateMmHr >= EARLY_WARNING_THRESHOLDS.RAINFALL_RATE_MM_HR.CRITICAL) {
    criticalCount++;
    triggeredConditions.push("CRITICAL_RAINFALL_RATE");
    reasons.push(`Torrential monsoonal precipitation (${input.rainfallRateMmHr} mm/hr) exceeds critical 40 mm/hr threshold`);
    contributingTriggers.push("Torrential Rainfall Rate Exceedance");
  } else if (input.rainfallRateMmHr >= EARLY_WARNING_THRESHOLDS.RAINFALL_RATE_MM_HR.HIGH) {
    highCount++;
    triggeredConditions.push("HIGH_RAINFALL_RATE");
    reasons.push(`Heavy rainfall rate (${input.rainfallRateMmHr} mm/hr) exceeds high 30 mm/hr threshold`);
    contributingTriggers.push("Heavy Precipitation Intensity");
  } else if (input.rainfallRateMmHr >= EARLY_WARNING_THRESHOLDS.RAINFALL_RATE_MM_HR.MODERATE) {
    moderateCount++;
    triggeredConditions.push("MODERATE_RAINFALL_RATE");
    reasons.push(`Elevated rainfall rate (${input.rainfallRateMmHr} mm/hr) exceeds moderate 15 mm/hr threshold`);
    contributingTriggers.push("Moderate Rainfall Inflow");
  }

  // 24h Accumulation
  if (input.accumulation24hMm >= EARLY_WARNING_THRESHOLDS.ACCUMULATION_24H_MM.CRITICAL) {
    if (isActiveHydrologicDrive) {
      criticalCount++;
      triggeredConditions.push("CRITICAL_24H_ACCUMULATION");
      reasons.push(`Extreme 24h precipitation accumulation (${input.accumulation24hMm} mm) exceeds 120 mm saturation envelope`);
      contributingTriggers.push("24h Accumulation Saturation");
    } else {
      highCount++;
      triggeredConditions.push("HIGH_24H_ACCUMULATION");
      reasons.push(`Post-storm 24h accumulated rainfall (${input.accumulation24hMm} mm) undergoing drainage`);
      contributingTriggers.push("24h Precipitation Drainage");
    }
  } else if (input.accumulation24hMm >= EARLY_WARNING_THRESHOLDS.ACCUMULATION_24H_MM.HIGH) {
    highCount++;
    triggeredConditions.push("HIGH_24H_ACCUMULATION");
    reasons.push(`Significant 24h precipitation accumulation (${input.accumulation24hMm} mm) exceeds 80 mm threshold`);
    contributingTriggers.push("High 24h Precipitation Accumulation");
  } else if (input.accumulation24hMm >= EARLY_WARNING_THRESHOLDS.ACCUMULATION_24H_MM.MODERATE) {
    moderateCount++;
    triggeredConditions.push("MODERATE_24H_ACCUMULATION");
    reasons.push(`Accumulated 24h rainfall (${input.accumulation24hMm} mm) exceeds 45 mm baseline threshold`);
  }

  // Soil Moisture
  if (input.soilMoisturePct >= EARLY_WARNING_THRESHOLDS.SOIL_MOISTURE_PCT.CRITICAL) {
    criticalCount++;
    triggeredConditions.push("CRITICAL_SOIL_MOISTURE");
    reasons.push(`Critical volumetric soil saturation (${input.soilMoisturePct}%) exceeds 80% capillary limit`);
    contributingTriggers.push("High Volumetric Soil Saturation");
  } else if (input.soilMoisturePct >= EARLY_WARNING_THRESHOLDS.SOIL_MOISTURE_PCT.HIGH) {
    highCount++;
    triggeredConditions.push("HIGH_SOIL_MOISTURE");
    reasons.push(`Elevated soil moisture saturation (${input.soilMoisturePct}%) exceeds 60% threshold`);
    contributingTriggers.push("Elevated Subsurface Moisture");
  } else if (input.soilMoisturePct >= EARLY_WARNING_THRESHOLDS.SOIL_MOISTURE_PCT.MODERATE) {
    moderateCount++;
    triggeredConditions.push("MODERATE_SOIL_MOISTURE");
    reasons.push(`Subsurface soil moisture (${input.soilMoisturePct}%) exceeds 45% baseline`);
  }

  // Pore Pressure
  if (input.porePressureKPa >= EARLY_WARNING_THRESHOLDS.PORE_PRESSURE_KPA.CRITICAL) {
    criticalCount++;
    triggeredConditions.push("CRITICAL_PORE_PRESSURE");
    reasons.push(`Severe hydrostatic pore water pressure (${input.porePressureKPa} kPa) significantly reduces effective shear stress`);
    contributingTriggers.push("Severe Hydrostatic Pore Pressure");
  } else if (input.porePressureKPa >= EARLY_WARNING_THRESHOLDS.PORE_PRESSURE_KPA.HIGH) {
    highCount++;
    triggeredConditions.push("HIGH_PORE_PRESSURE");
    reasons.push(`Elevated pore water pressure (${input.porePressureKPa} kPa) indicates rising water table along slip surface`);
    contributingTriggers.push("Elevated Pore Water Pressure");
  } else if (input.porePressureKPa >= EARLY_WARNING_THRESHOLDS.PORE_PRESSURE_KPA.MODERATE) {
    moderateCount++;
    triggeredConditions.push("MODERATE_PORE_PRESSURE");
    reasons.push(`Subsurface pore pressure (${input.porePressureKPa} kPa) exceeds normal dry baseline`);
  }

  // Slope Tilt
  if (input.slopeTiltDeg >= EARLY_WARNING_THRESHOLDS.SLOPE_TILT_DEG.CRITICAL) {
    if (isActiveHydrologicDrive) {
      criticalCount++;
      triggeredConditions.push("CRITICAL_SLOPE_TILT");
      reasons.push(`Accelerated angular slope tilt (${input.slopeTiltDeg}°) exceeds critical 5.0° displacement threshold`);
      contributingTriggers.push("Inclinometer Angular Tilt Acceleration");
    } else {
      highCount++;
      triggeredConditions.push("RESIDUAL_SLOPE_TILT");
      reasons.push(`Post-event residual slope tilt (${input.slopeTiltDeg}°) monitored under recovering hydrologic conditions`);
      contributingTriggers.push("Residual Slope Tilt Monitoring");
    }
  } else if (input.slopeTiltDeg >= EARLY_WARNING_THRESHOLDS.SLOPE_TILT_DEG.HIGH) {
    highCount++;
    triggeredConditions.push("HIGH_SLOPE_TILT");
    reasons.push(`Inclinometer tilt displacement (${input.slopeTiltDeg}°) exceeds 3.0° warning threshold`);
    contributingTriggers.push("Angular Tilt Displacement");
  } else if (input.slopeTiltDeg >= EARLY_WARNING_THRESHOLDS.SLOPE_TILT_DEG.MODERATE) {
    moderateCount++;
    triggeredConditions.push("MODERATE_SLOPE_TILT");
    reasons.push(`Minor inclinometer tilt anomaly (${input.slopeTiltDeg}°) detected`);
  }

  // InSAR Displacement
  const insarMag = Math.abs(input.insarDisplacementMm);
  if (insarMag >= EARLY_WARNING_THRESHOLDS.INSAR_DISPLACEMENT_MM.CRITICAL) {
    if (isActiveHydrologicDrive) {
      criticalCount++;
      triggeredConditions.push("CRITICAL_INSAR_DISPLACEMENT");
      reasons.push(`Sentinel-1 InSAR down-slope deformation (${input.insarDisplacementMm} mm) indicates active ground motion`);
      contributingTriggers.push("InSAR Subsidence Velocity Spike");
    } else {
      highCount++;
      triggeredConditions.push("RESIDUAL_INSAR_DISPLACEMENT");
      reasons.push(`Satellite InSAR total displacement offset (${input.insarDisplacementMm} mm) recorded post-event`);
      contributingTriggers.push("InSAR Cumulative Displacement Trace");
    }
  } else if (insarMag >= EARLY_WARNING_THRESHOLDS.INSAR_DISPLACEMENT_MM.HIGH) {
    highCount++;
    triggeredConditions.push("HIGH_INSAR_DISPLACEMENT");
    reasons.push(`Satellite InSAR surface displacement (${input.insarDisplacementMm} mm) exceeds 4.0 mm threshold`);
    contributingTriggers.push("InSAR Surface Creep Acceleration");
  } else if (insarMag >= EARLY_WARNING_THRESHOLDS.INSAR_DISPLACEMENT_MM.MODERATE) {
    moderateCount++;
    triggeredConditions.push("MODERATE_INSAR_DISPLACEMENT");
    reasons.push(`InSAR surface motion (${input.insarDisplacementMm} mm) shows minor creep`);
  }

  // Slope Instability
  if (input.slopeInstabilityPct >= EARLY_WARNING_THRESHOLDS.SLOPE_INSTABILITY_PCT.CRITICAL) {
    criticalCount++;
    triggeredConditions.push("CRITICAL_SLOPE_INSTABILITY");
    reasons.push(`Slope instability index (${input.slopeInstabilityPct}%) indicates active shear plane failure`);
    contributingTriggers.push("Active Shear Plane Failure Index");
  } else if (input.slopeInstabilityPct >= EARLY_WARNING_THRESHOLDS.SLOPE_INSTABILITY_PCT.HIGH) {
    highCount++;
    triggeredConditions.push("HIGH_SLOPE_INSTABILITY");
    reasons.push(`Kinematic slope instability index (${input.slopeInstabilityPct}%) exceeds 65% warning limit`);
  }

  // Risk Score
  if (score >= EARLY_WARNING_THRESHOLDS.RISK_SCORE.CRITICAL) {
    triggeredConditions.push("CRITICAL_COMPOSITE_RISK_SCORE");
    reasons.push(`Composite AI Risk Score (${score}/100) reached CRITICAL severity`);
  } else if (score >= EARLY_WARNING_THRESHOLDS.RISK_SCORE.HIGH) {
    triggeredConditions.push("HIGH_COMPOSITE_RISK_SCORE");
    reasons.push(`Composite AI Risk Score (${score}/100) reached HIGH severity`);
  }

  // Road Corridor Status
  if (input.roadStatus === "BLOCKED") {
    if (isActiveHydrologicDrive) {
      criticalCount++;
      triggeredConditions.push("ROAD_CORRIDOR_BLOCKED");
      reasons.push(`Arterial mountain transport corridor is BLOCKED by active debris flow`);
      contributingTriggers.push("Arterial Road Corridor Blockage");
    } else {
      highCount++;
      triggeredConditions.push("ROAD_CORRIDOR_CLEARANCE");
      reasons.push(`Arterial highway section undergoing post-event clearance and stabilization`);
      contributingTriggers.push("Road Clearance & Drainage Inspections");
    }
  } else if (input.roadStatus === "AT RISK") {
    highCount++;
    triggeredConditions.push("ROAD_CORRIDOR_AT_RISK");
    reasons.push(`Arterial mountain highway section is AT RISK of rockfall/mudflow`);
  }

  // Baseline fallbacks if no thresholds tripped
  if (reasons.length === 0) {
    reasons.push("All telemetry parameters remain within safe geomechanical envelope.");
  }
  if (contributingTriggers.length === 0) {
    contributingTriggers.push("Normal Baseline Monitoring");
  }

  // 3. Derive Warning Level dynamically
  let level: WarningLevel = "LOW";
  if (input.stage === 6) {
    level = score >= 70 ? "HIGH" : "MODERATE";
  } else if (score >= EARLY_WARNING_THRESHOLDS.RISK_SCORE.CRITICAL || criticalCount >= 2 || (input.roadStatus === "BLOCKED" && score >= 75)) {
    level = "CRITICAL";
  } else if (score >= EARLY_WARNING_THRESHOLDS.RISK_SCORE.HIGH || highCount >= 2 || criticalCount >= 1 || input.roadStatus === "AT RISK") {
    level = "HIGH";
  } else if (score >= EARLY_WARNING_THRESHOLDS.RISK_SCORE.MODERATE || moderateCount >= 1) {
    level = "MODERATE";
  } else {
    level = "LOW";
  }

  // 4. Derive Trend (ESCALATING, STABLE, RECOVERING)
  let trend: WarningTrend = "STABLE";
  if (input.stage === 6) {
    trend = "RECOVERING";
  } else if (input.stage === 1) {
    trend = "STABLE";
  } else if (input.previousRiskScore !== undefined) {
    const delta = score - input.previousRiskScore;
    if (delta > 3) {
      trend = "ESCALATING";
    } else if (delta < -3) {
      trend = "RECOVERING";
    } else {
      trend = "STABLE";
    }
  } else if (input.stage !== undefined) {
    if (input.stage >= 2 && input.stage <= 5) {
      trend = "ESCALATING";
    }
  }

  // 5. Recommended Monitoring / Responder Action
  let recommendedAction = "Routine automated telemetry polling (15-min interval). Maintain baseline structural monitoring.";
  if (level === "CRITICAL") {
    recommendedAction = "Execute Pre-Emptive Evacuation Order for Downslope Settlements. Close arterial highways and dispatch SDRF response units.";
  } else if (level === "HIGH") {
    recommendedAction = "Field Verification & Responder Preparedness. Pre-position emergency clearing equipment and restrict heavy transport.";
  } else if (level === "MODERATE") {
    if (trend === "RECOVERING") {
      recommendedAction = "PWD debris clearance and drainage restoration complete. Residents return under monitoring.";
    } else {
      recommendedAction = "Enhanced Telemetry Polling (5-min interval). Monitor drainage channels and road shoulder tension cracks.";
    }
  }

  const triggered = level !== "LOW";
  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }) + " IST";

  return {
    level,
    triggered,
    riskScore: score,
    trend,
    triggeredConditions,
    reasons,
    recommendedAction,
    timestamp: `Just now (${timestamp})`,
    affectedZone: zoneCode,
    affectedZoneName: zoneName,
    district,
    state,
    alertGenerated: triggered,
    contributingTriggers,
  };
}
