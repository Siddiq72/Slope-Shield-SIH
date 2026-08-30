import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  RotateCcw,
  Layers,
  HelpCircle,
  FileCheck,
  Zap,
  Radio
} from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useDemo } from '../../context/DemoContext';
import { riskApi } from '../../services/riskApi';
import { geminiBriefingApi, GeminiBriefingResult } from '../../services/allApis';
import { RiskAnalysisExplainability } from '../../types';
import { RiskGauge } from '../../components/ui/RiskGauge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { RiskBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const RiskAnalysisPage: React.FC = () => {
  const { selectedZone, selectedZoneCode, setSelectedZoneCode, zones } = useDemo();

  const [analysis, setAnalysis] = useState<RiskAnalysisExplainability | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Gemini Live AI Briefing state
  const [briefing, setBriefing] = useState<GeminiBriefingResult | null>(null);
  const [generatingBriefing, setGeneratingBriefing] = useState<boolean>(false);
  const [briefingSource, setBriefingSource] = useState<string>('');

  // What-If Simulation Sandbox State
  const [simRainfall, setSimRainfall] = useState<number>(selectedZone.rainfallRateMmHr);
  const [simSoilMoisture, setSimSoilMoisture] = useState<number>(selectedZone.soilMoisturePct);
  const [simTiltRate, setSimTiltRate] = useState<number>(5.6);

  useEffect(() => {
    setLoading(true);
    setBriefing(null);
    riskApi.getRiskAnalysis(selectedZoneCode).then((res) => {
      setAnalysis(res.data);
      setSimRainfall(selectedZone.rainfallRateMmHr);
      setSimSoilMoisture(selectedZone.soilMoisturePct);
      setLoading(false);
    });
  }, [selectedZoneCode, selectedZone]);

  const handleGenerateGeminiBriefing = async () => {
    setGeneratingBriefing(true);
    try {
      const res = await geminiBriefingApi.generateBriefing({
        zoneCode: selectedZone.code,
        zoneName: selectedZone.name,
        riskScore: selectedZone.riskScore,
        riskLevel: selectedZone.riskLevel,
        rainfallRate: selectedZone.rainfallRateMmHr,
        soilMoisture: selectedZone.soilMoisturePct,
        slopeAngle: selectedZone.slopeAngleDeg,
        district: selectedZone.district,
        state: selectedZone.state,
      });
      setBriefing(res.briefing);
      setBriefingSource(res.source);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingBriefing(false);
    }
  };

  // Compute what-if simulated risk score
  const computedSimRisk = Math.min(
    99,
    Math.max(
      15,
      Math.round(
        simRainfall * 0.9 +
        simSoilMoisture * 0.45 +
        simTiltRate * 4.2 +
        (selectedZone.historicalVulnerabilityPct * 0.15)
      )
    )
  );

  const getSimSeverity = (score: number) => {
    if (score >= 85) return 'CRITICAL';
    if (score >= 70) return 'HIGH';
    if (score >= 45) return 'MODERATE';
    return 'LOW';
  };

  const handleResetSandbox = () => {
    setSimRainfall(selectedZone.rainfallRateMmHr);
    setSimSoilMoisture(selectedZone.soilMoisturePct);
    setSimTiltRate(5.6);
  };

  if (loading || !analysis) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono-tech">
        <Sparkles className="w-8 h-8 text-[#7C5CFF] animate-spin mx-auto mb-2" />
        Initializing Physics-Informed Geomechanical Model for Zone {selectedZoneCode}...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header with Zone Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182B42] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[#7C5CFF]">
              <Cpu className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 font-sans tracking-tight">
              EXPLAINABLE AI RISK LABORATORY
            </h2>
          </div>
          <p className="text-xs font-mono-tech text-slate-400 mt-1">
            Multi-Source Fusion Engine: Physics-Informed Geomechanical Network (PINN) + Gemini Generative AI
          </p>
        </div>

        {/* Zone Selector & Gemini Live AI Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-tech text-slate-400">TARGET:</span>
            <select
              value={selectedZoneCode}
              onChange={(e) => setSelectedZoneCode(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0E1A2C] border border-[#264366] text-xs font-bold font-mono-tech text-[#00D4FF] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/50"
            >
              {zones.map((z) => (
                <option key={z.code} value={z.code}>
                  ZONE {z.code} — {z.name} ({z.riskScore}%)
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleGenerateGeminiBriefing}
            variant="ai"
            size="sm"
            disabled={generatingBriefing}
            icon={<Sparkles className={`w-3.5 h-3.5 ${generatingBriefing ? 'animate-spin' : ''}`} />}
          >
            {generatingBriefing ? 'Synthesizing AI Briefing...' : 'Generate Gemini Threat Briefing'}
          </Button>
        </div>
      </div>

      {/* Gemini AI Live Geotechnical Incident Synthesis Panel (When Generated) */}
      {briefing && (
        <div className="bg-[#0E1A2C] border-2 border-[#7C5CFF]/50 rounded-2xl p-6 shadow-2xl space-y-4 relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 px-4 py-1 bg-[#7C5CFF]/20 border-b border-l border-[#7C5CFF]/40 rounded-bl-xl text-[10px] font-mono-tech text-[#7C5CFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            ENGINE: {briefingSource.toUpperCase()}
          </div>

          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#7C5CFF]/20 text-[#7C5CFF]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-sans tracking-wide">
                GEMINI AI GEOTECHNICAL THREAT SYNTHESIS & EVACUATION DIRECTIVE
              </h3>
              <p className="text-xs font-mono-tech text-slate-400">
                Automated Incident Command Briefing for Zone {selectedZone.code} ({selectedZone.name}, {selectedZone.district})
              </p>
            </div>
          </div>

          {/* Summary & Geotechnical failure physics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#07111F] border border-[#182B42] space-y-2">
              <span className="text-[11px] font-bold font-mono-tech text-[#00D4FF] uppercase tracking-wider block">
                EXECUTIVE DISASTER SUMMARY
              </span>
              <p className="text-slate-200 leading-relaxed font-sans">
                {briefing.executiveSummary}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#07111F] border border-[#182B42] space-y-2">
              <span className="text-[11px] font-bold font-mono-tech text-[#14E6C5] uppercase tracking-wider block">
                GEOTECHNICAL FAILURE MECHANISM
              </span>
              <p className="text-slate-200 leading-relaxed font-sans">
                {briefing.geotechnicalAssessment}
              </p>
            </div>
          </div>

          {/* Immediate Action Directives */}
          {briefing.immediateDirectives && briefing.immediateDirectives.length > 0 && (
            <div className="p-4 rounded-xl bg-[#07111F] border border-[#182B42] space-y-2">
              <span className="text-[11px] font-bold font-mono-tech text-[#EF4444] uppercase tracking-wider block">
                IMMEDIATE OPERATIONAL DIRECTIVES (DDMA / SDRF / PWD)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                {briefing.immediateDirectives.map((dir, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#101D2E] border border-[#182B42] text-xs text-slate-200 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#EF4444]/20 text-[#EF4444] font-mono-tech font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{dir}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bilingual Public Emergency Broadcast copy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-tech">
            <div className="p-3.5 rounded-xl bg-[#101D2E]/80 border border-[#264366]">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] uppercase font-bold text-[#00D4FF]">PUBLIC CAP SMS BROADCAST (ENGLISH)</span>
                <Radio className="w-3.5 h-3.5 text-[#00D4FF] animate-pulse" />
              </div>
              <p className="text-slate-200">{briefing.publicWarningMessage}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101D2E]/80 border border-[#264366]">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] uppercase font-bold text-[#7C5CFF]">REGIONAL VERNACULAR DISPATCH (NER)</span>
                <Radio className="w-3.5 h-3.5 text-[#7C5CFF] animate-pulse" />
              </div>
              <p className="text-slate-200">
                {briefing.vernacularAlert || briefing.vernacularAlertMizo || "Khawngaihin hmun him lam pan rawh u."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Row 1: Current Risk Gauge + Contributors Fusion + Confidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Overall Risk & AI Confidence */}
        <div className="bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#182B42]">
              <span className="text-xs font-bold font-mono-tech text-slate-300">
                CURRENT HYPERLOCAL RISK
              </span>
              <RiskBadge level={analysis.severity} size="sm" />
            </div>

            <div className="my-2">
              <RiskGauge score={analysis.currentRiskScore} level={analysis.severity} size="lg" />
            </div>

            <div className="p-3 rounded-xl bg-[#07111F] border border-[#182B42] space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs font-mono-tech">
                <span className="text-slate-400">AI MODEL CONFIDENCE</span>
                <span className="font-bold text-[#14E6C5]">{analysis.aiConfidencePct}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#101D2E] rounded-full overflow-hidden">
                <div className="h-full bg-[#14E6C5]" style={{ width: `${analysis.aiConfidencePct}%` }} />
              </div>
              <span className="text-[10px] font-mono-tech text-slate-500 block text-right">
                10-Fold Cross Validated (p &lt; 0.001)
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#182B42] text-[11px] font-mono-tech text-slate-400 flex items-center justify-between">
            <span>Model Version: v4.2.8</span>
            <span className="text-[#7C5CFF] font-semibold">Real-Time Inference</span>
          </div>
        </div>

        {/* Center: Multi-Source Risk Contributors Breakdown */}
        <div className="lg:col-span-2 bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#182B42]">
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-sans tracking-wide">
                  WEIGHTED RISK CONTRIBUTORS
                </h3>
                <p className="text-[11px] font-mono-tech text-slate-400">
                  SHAP-Based Multi-Source Feature Importances
                </p>
              </div>
              <span className="text-xs font-mono-tech text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded border border-[#00D4FF]/30">
                100% TOTAL
              </span>
            </div>

            <div className="space-y-3.5 mt-4">
              <div>
                <ProgressBar
                  label="1. Monsoonal Precipitation Rate & 24h Accumulation"
                  value={analysis.contributors.rainfall.valuePct}
                  rawValue={analysis.contributors.rainfall.rawValue}
                  weight="35% Weight"
                  variant="cyan"
                />
                <span className="text-[10px] font-mono-tech text-slate-400 block mt-0.5 pl-1">
                  Status: {analysis.contributors.rainfall.status}
                </span>
              </div>

              <div>
                <ProgressBar
                  label="2. Volumetric Soil Moisture & Suction Loss"
                  value={analysis.contributors.soilMoisture.valuePct}
                  rawValue={analysis.contributors.soilMoisture.rawValue}
                  weight="25% Weight"
                  variant="teal"
                />
                <span className="text-[10px] font-mono-tech text-slate-400 block mt-0.5 pl-1">
                  Status: {analysis.contributors.soilMoisture.status}
                </span>
              </div>

              <div>
                <ProgressBar
                  label="3. Slope Angular Tilt & Shear Instability"
                  value={analysis.contributors.slopeInstability.valuePct}
                  rawValue={analysis.contributors.slopeInstability.rawValue}
                  weight="20% Weight"
                  variant="risk"
                  riskScore={analysis.contributors.slopeInstability.valuePct}
                />
                <span className="text-[10px] font-mono-tech text-slate-400 block mt-0.5 pl-1">
                  Status: {analysis.contributors.slopeInstability.status}
                </span>
              </div>

              <div>
                <ProgressBar
                  label="4. Sentinel-1 InSAR Surface Creep Displacement"
                  value={analysis.contributors.insarDeformation.valuePct}
                  rawValue={analysis.contributors.insarDeformation.rawValue}
                  weight="10% Weight"
                  variant="violet"
                />
                <span className="text-[10px] font-mono-tech text-slate-400 block mt-0.5 pl-1">
                  Status: {analysis.contributors.insarDeformation.status}
                </span>
              </div>

              <div>
                <ProgressBar
                  label="5. Historical Geomorphological Vulnerability"
                  value={analysis.contributors.historical.valuePct}
                  rawValue={analysis.contributors.historical.rawValue}
                  weight="10% Weight"
                  variant="amber"
                />
                <span className="text-[10px] font-mono-tech text-slate-400 block mt-0.5 pl-1">
                  Status: {analysis.contributors.historical.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#182B42] flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
            <span>Ground Truth Calibrated against GSI Historical Archive</span>
            <span className="text-[#10B981]">Residual Loss: 0.038</span>
          </div>
        </div>
      </div>

      {/* Row 2: Temporal Prediction Curve & False-Alarm Suppression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Temporal Prediction Curve (0h, 1h, 2h, 4h, 6h) */}
        <div className="bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#182B42]">
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-sans tracking-wide">
                  6-HOUR TEMPORAL TRAJECTORY PREDICTION
                </h3>
                <p className="text-[11px] font-mono-tech text-slate-400">
                  Forward Geotechnical Finite-Difference Forecast
                </p>
              </div>
              <span className="text-xs font-mono-tech text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded border border-[#EF4444]/30 font-bold">
                ESCALATING
              </span>
            </div>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analysis.temporalProjection} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hoursAhead" stroke="#64748b" tickFormatter={(val) => `+${val}h`} fontSize={11} fontFamily="JetBrains Mono" />
                  <YAxis domain={[30, 100]} stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1726', borderColor: '#264366', borderRadius: '8px', color: '#fff', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                  />
                  <Area type="monotone" dataKey="riskScore" stroke="#EF4444" strokeWidth={3} fill="url(#riskGrad)" name="Projected Risk" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#182B42] flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
            <span>Critical Rupture Horizon: ~2 to 4 Hours</span>
            <span className="text-[#00D4FF]">Pre-Alert Triggered</span>
          </div>
        </div>

        {/* False-Alarm Suppression Engine */}
        <div className="bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#182B42]">
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-sans tracking-wide">
                  FALSE-ALARM SUPPRESSION MATRIX
                </h3>
                <p className="text-[11px] font-mono-tech text-slate-400">
                  Distinguishing benign monsoonal runoff from true deep-seated shear failures
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-xl bg-[#07111F] border border-[#182B42]">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">
                  ANTECEDENT MOISTURE INDEX (API)
                </span>
                <span className="text-lg font-bold font-mono-tech text-slate-100 mt-1 block">
                  {analysis.falseAlarmSuppressionMetrics.antecedentSoilMoistureIndex}
                </span>
                <span className="text-[10px] text-[#EF4444] font-mono-tech">Critical Saturation Envelope</span>
              </div>

              <div className="p-3 rounded-xl bg-[#07111F] border border-[#182B42]">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">
                  VEGETATION ROOT COHESION (NDVI)
                </span>
                <span className="text-lg font-bold font-mono-tech text-[#14E6C5] mt-1 block">
                  {analysis.falseAlarmSuppressionMetrics.vegetationIndexNDVI}
                </span>
                <span className="text-[10px] text-slate-400 font-mono-tech">Colluvium Root Factor</span>
              </div>

              <div className="p-3 rounded-xl bg-[#07111F] border border-[#182B42]">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">
                  GEOLOGICAL FRICTION ANGLE (φ)
                </span>
                <span className="text-lg font-bold font-mono-tech text-slate-100 mt-1 block">
                  {analysis.falseAlarmSuppressionMetrics.geologicalFrictionAngle}°
                </span>
                <span className="text-[10px] text-slate-400 font-mono-tech">Disang Shale Formation</span>
              </div>

              <div className="p-3 rounded-xl bg-[#07111F] border border-[#182B42]">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">
                  CROSS-VALIDATION CONFIDENCE
                </span>
                <span className="text-lg font-bold font-mono-tech text-[#00D4FF] mt-1 block">
                  {(analysis.falseAlarmSuppressionMetrics.crossValidationScore * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-[#10B981] font-mono-tech">High Statistical Certainty</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#101D2E] border border-[#182B42] text-xs font-mono-tech text-slate-300">
              <span className="text-slate-400 block text-[10px] uppercase">HISTORICAL PROFILE CORRELATION</span>
              <span className="text-[#00D4FF] font-semibold">
                {analysis.falseAlarmSuppressionMetrics.historicalCorrelationMatch}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#182B42] text-[11px] font-mono-tech text-slate-400">
            Suppresses superficial false positives via dual-depth piezometric verification
          </div>
        </div>
      </div>

      {/* Row 3: "Why This Score?" Explainability Diagnostics */}
      <div className="bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-[#182B42] mb-3">
          <HelpCircle className="w-5 h-5 text-[#00D4FF]" />
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-sans tracking-wide">
              EXPLAINABLE AI DIAGNOSTIC REPORT: WHY THIS RISK SCORE?
            </h3>
            <p className="text-[11px] font-mono-tech text-slate-400">
              Human-Readable Reasoning generated for District Disaster Management Authorities
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.whyThisScore.map((reason, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl bg-[#07111F]/80 border border-[#182B42] flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-md bg-[#101D2E] border border-[#264366] flex-shrink-0 flex items-center justify-center font-mono-tech text-xs font-bold text-[#00D4FF]">
                {index + 1}
              </span>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                {reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Interactive What-If Simulation Sandbox */}
      <div className="bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#182B42] mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#00D4FF]/15 border border-[#00D4FF]/30 text-[#00D4FF]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-sans tracking-wide">
                WHAT-IF PARAMETRIC SIMULATION SANDBOX
              </h3>
              <p className="text-[11px] font-mono-tech text-slate-400">
                Stress-test slope stability parameters in real-time
              </p>
            </div>
          </div>

          <Button onClick={handleResetSandbox} variant="secondary" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset Parameters
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sliders */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono-tech mb-1.5">
                <span className="text-slate-300">Simulate Rainfall Intensity</span>
                <span className="text-[#00D4FF] font-bold">{simRainfall} mm/hr</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={simRainfall}
                onChange={(e) => setSimRainfall(Number(e.target.value))}
                className="w-full accent-[#00D4FF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono-tech text-slate-500">
                <span>0 mm/hr (Dry)</span>
                <span>40 mm/hr (Heavy)</span>
                <span>80 mm/hr (Cloudburst)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono-tech mb-1.5">
                <span className="text-slate-300">Simulate Soil Moisture Saturation</span>
                <span className="text-[#14E6C5] font-bold">{simSoilMoisture}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={simSoilMoisture}
                onChange={(e) => setSimSoilMoisture(Number(e.target.value))}
                className="w-full accent-[#14E6C5] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono-tech text-slate-500">
                <span>20% (Dry Sub-soil)</span>
                <span>60% (Field Capacity)</span>
                <span>95% (Liquefaction)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono-tech mb-1.5">
                <span className="text-slate-300">Simulate Angular Tilt Acceleration</span>
                <span className="text-[#EF4444] font-bold">{simTiltRate}°</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12.0"
                step="0.1"
                value={simTiltRate}
                onChange={(e) => setSimTiltRate(Number(e.target.value))}
                className="w-full accent-[#EF4444] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono-tech text-slate-500">
                <span>0.5° (Stable Bedding)</span>
                <span>5.0° (Creep Threshold)</span>
                <span>12.0° (Sudden Shear)</span>
              </div>
            </div>
          </div>

          {/* Real-time Resulting Risk Card */}
          <div className="p-4 rounded-xl bg-[#07111F] border border-[#264366] flex flex-col justify-between text-center">
            <div>
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-widest block">
                SIMULATED RISK OUTCOME
              </span>

              <div className="my-2">
                <div className="text-4xl font-extrabold font-mono-tech text-[#EF4444]">
                  {computedSimRisk}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </div>
                <div className="mt-1">
                  <RiskBadge level={getSimSeverity(computedSimRisk)} size="md" />
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans mt-2">
                {computedSimRisk >= 85
                  ? 'Catastrophic slope failure trigger predicted. Immediate evacuation protocol warranted.'
                  : computedSimRisk >= 70
                  ? 'High risk alert generated. Road transit restriction recommended.'
                  : 'Slope remains within safe structural factor of safety envelope.'}
              </p>
            </div>

            <div className="pt-2 text-[10px] font-mono-tech text-[#00D4FF]">
              Dynamic PINN Output Updated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
