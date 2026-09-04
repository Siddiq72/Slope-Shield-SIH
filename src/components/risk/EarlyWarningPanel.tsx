import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Zap, 
  Radio, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Layers, 
  Info,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { earlyWarningApi } from '../../services/allApis';
import { RiskBadge, TechBadge } from '../ui/Badge';
import { EarlyWarningResult } from '../../../server/services/earlyWarningEngine';

export const EarlyWarningPanel: React.FC = () => {
  const { 
    selectedZone, 
    demoStage, 
    earlyWarningResult: contextEarlyWarning,
    isApiLoading 
  } = useDemo();

  const [apiResult, setApiResult] = useState<EarlyWarningResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Attempt live API fetch when zone or stage changes, with fallback to DemoContext
  useEffect(() => {
    let isMounted = true;
    const fetchEarlyWarning = async () => {
      setLoading(true);
      try {
        const res = await earlyWarningApi.getEarlyWarning(selectedZone.code, demoStage);
        if (isMounted && res && res.data) {
          setApiResult(res.data);
        }
      } catch (err) {
        if (isMounted) {
          console.debug('Early warning backend API fetch fallback to local engine:', err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEarlyWarning();
    return () => {
      isMounted = false;
    };
  }, [selectedZone.code, demoStage]);

  // Use API result if available, otherwise fallback to context result
  const ew: EarlyWarningResult | null = apiResult || contextEarlyWarning;

  if (!ew && loading) {
    return (
      <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-6 shadow-xl animate-pulse">
        <div className="h-6 bg-[#18283E] rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-[#18283E] rounded w-full mb-4"></div>
        <div className="h-32 bg-[#18283E] rounded w-full"></div>
      </div>
    );
  }

  // Baseline telemetry values from selected zone / stage
  const rainfallRate = selectedZone.rainfallRateMmHr ?? 0;
  const accum24h = selectedZone.accumulation24hMm ?? 0;
  const soilMoisture = selectedZone.soilMoisturePct ?? 0;
  const porePressure = selectedZone.porePressureKPa ?? 0;
  const slopeTilt = ew ? (ew.level === 'CRITICAL' ? 5.2 : ew.level === 'HIGH' ? 3.4 : ew.level === 'MODERATE' ? 1.8 : 0.4) : 0.4;
  const insarDisp = selectedZone.insarDisplacementMm ?? 0;
  const slopeInstability = selectedZone.slopeInstabilityPct ?? 0;
  const riskScore = ew ? ew.riskScore : selectedZone.riskScore;

  // Trend config helpers
  const getTrendConfig = (trend: string) => {
    switch (trend) {
      case 'ESCALATING':
        return {
          label: 'ESCALATING',
          color: 'text-rose-400 bg-rose-950/50 border-rose-500/40',
          icon: <TrendingUp className="w-4 h-4 text-rose-400 animate-bounce" />,
          desc: 'Risk score & pore pressure accelerating'
        };
      case 'RECOVERING':
        return {
          label: 'RECOVERING',
          color: 'text-cyan-400 bg-cyan-950/50 border-cyan-500/40',
          icon: <RefreshCw className="w-4 h-4 text-cyan-400" />,
          desc: 'Drainage active, post-event stabilization'
        };
      case 'STABLE':
      default:
        return {
          label: 'STABLE',
          color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/40',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          desc: 'Telemetry parameters within safe envelope'
        };
    }
  };

  const trendConfig = getTrendConfig(ew?.trend || 'STABLE');

  // Severity styling
  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          border: 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
          badgeBg: 'bg-rose-950/60 border-rose-500/60 text-rose-400',
          headerBg: 'from-rose-950/30 via-[#0B1728] to-[#0B1728]',
          actionBg: 'bg-rose-950/40 border-rose-500/50 text-rose-200',
          actionIcon: <Flame className="w-5 h-5 text-rose-400 shrink-0" />,
          icon: <Flame className="w-6 h-6 text-rose-400 animate-pulse" />
        };
      case 'HIGH':
        return {
          border: 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)]',
          badgeBg: 'bg-amber-950/60 border-orange-500/60 text-orange-400',
          headerBg: 'from-amber-950/30 via-[#0B1728] to-[#0B1728]',
          actionBg: 'bg-amber-950/40 border-orange-500/50 text-orange-200',
          actionIcon: <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />,
          icon: <AlertTriangle className="w-6 h-6 text-orange-400" />
        };
      case 'MODERATE':
        return {
          border: 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
          badgeBg: 'bg-yellow-950/60 border-amber-500/50 text-amber-400',
          headerBg: 'from-yellow-950/20 via-[#0B1728] to-[#0B1728]',
          actionBg: 'bg-yellow-950/30 border-amber-500/40 text-amber-200',
          actionIcon: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
          icon: <AlertCircle className="w-6 h-6 text-amber-400" />
        };
      case 'LOW':
      default:
        return {
          border: 'border-emerald-500/40',
          badgeBg: 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400',
          headerBg: 'from-emerald-950/20 via-[#0B1728] to-[#0B1728]',
          actionBg: 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200',
          actionIcon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        };
    }
  };

  const levelStyle = getLevelStyle(ew?.level || 'LOW');

  // Multi-factor Pipeline Node Status Check
  const isRainActive = rainfallRate >= 15 || accum24h >= 45;
  const isMoistureActive = soilMoisture >= 45;
  const isPoreActive = porePressure >= 25;
  const isMotionActive = slopeInstability >= 45 || Math.abs(insarDisp) >= 1.5;
  const isRiskActive = riskScore >= 45;
  const isWarningActive = (ew?.level && ew.level !== 'LOW');

  return (
    <div id="early-warning-intelligence-panel" className={`bg-[#0B1728] border ${levelStyle.border} rounded-xl p-5 shadow-2xl space-y-5 transition-all duration-300`}>
      
      {/* Header Bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1c2e47] bg-gradient-to-r ${levelStyle.headerBg} -mx-5 -mt-5 p-5 rounded-t-xl`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0E1D32] border border-[#203550] flex items-center justify-center shadow-inner shrink-0">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white font-sans tracking-tight uppercase">
                EARLY WARNING INTELLIGENCE
              </h2>
              <TechBadge label="DECISION ENGINE v2.4" variant="cyan" icon={<Zap className="w-3 h-3 text-cyan-400" />} />
            </div>
            <p className="text-xs font-mono-tech text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Multi-factor deterministic & AI failure assessment</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-300 font-semibold">{ew?.affectedZoneName || selectedZone.name} ({ew?.affectedZone || selectedZone.code})</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-mono-tech text-slate-300 bg-[#0E1D32] px-3 py-1.5 rounded-lg border border-[#203550]">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{ew?.district || selectedZone.district}, {ew?.state || selectedZone.state}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono-tech text-slate-400 bg-[#0E1D32] px-3 py-1.5 rounded-lg border border-[#203550]">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{ew?.timestamp || 'Just now'}</span>
          </div>
        </div>
      </div>

      {/* Row 1: Warning Level + Risk Score + Trend Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Card 1: Warning Level */}
        <div className="bg-[#07111F] border border-[#18283E] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400 mb-2">
            <span className="uppercase tracking-wider">CURRENT WARNING LEVEL</span>
            <span className="text-[10px] text-slate-500">EXPLICIT STATUS</span>
          </div>
          <div className="flex items-center gap-3 my-1">
            <div className="p-2 rounded-lg bg-[#0E1D32] border border-[#203550]">
              {levelStyle.icon}
            </div>
            <div>
              <div className="text-2xl font-black font-mono-tech tracking-wider text-white flex items-center gap-2">
                <span>{ew?.level || 'LOW'}</span>
              </div>
              <p className="text-[11px] font-mono-tech text-slate-400 font-semibold uppercase">
                {ew?.level === 'CRITICAL' ? 'RED ALERT — IMMINENT THREAT' :
                 ew?.level === 'HIGH' ? 'ORANGE ALERT — ELEVATED RISK' :
                 ew?.level === 'MODERATE' ? 'YELLOW ALERT — ADVISORY MONITORING' : 'GREEN ALERT — NORMAL BASELINE'}
              </p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-[#18283E] flex items-center justify-between">
            <RiskBadge level={(ew?.level || 'LOW') as any} size="sm" showIcon />
            <span className="text-[10px] font-mono-tech text-slate-400">
              Stage {demoStage} Telemetry
            </span>
          </div>
        </div>

        {/* Card 2: AI Risk Score */}
        <div className="bg-[#07111F] border border-[#18283E] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400 mb-2">
            <span className="uppercase tracking-wider">AI COMPOSITE RISK SCORE</span>
            <span className="text-[10px] text-cyan-400">PHYSICS FUSION</span>
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-black font-mono-tech text-cyan-300 tracking-tight">
              {riskScore}
            </span>
            <span className="text-sm font-mono-tech text-slate-400 font-bold">
              / 100
            </span>
          </div>
          <div className="w-full bg-[#0E1D32] h-2 rounded-full overflow-hidden border border-[#203550]">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                riskScore >= 85 ? 'bg-gradient-to-r from-orange-500 to-rose-500' :
                riskScore >= 65 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                riskScore >= 45 ? 'bg-gradient-to-r from-yellow-400 to-amber-400' :
                'bg-gradient-to-r from-teal-400 to-emerald-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, riskScore))}%` }}
            />
          </div>
          <div className="mt-2 pt-2 border-t border-[#18283E] flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
            <span>Factor of Safety: {(1.85 - (riskScore / 100) * 1.1).toFixed(2)}</span>
            <span>Threshold: &ge; 45 MOD / 70 HIGH / 85 CRIT</span>
          </div>
        </div>

        {/* Card 3: Warning Trend */}
        <div className="bg-[#07111F] border border-[#18283E] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400 mb-2">
            <span className="uppercase tracking-wider">WARNING TREND</span>
            <span className="text-[10px] text-slate-500">STAGE MOTION</span>
          </div>
          <div className="flex items-center gap-2.5 my-1">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono-tech font-bold text-sm ${trendConfig.color}`}>
              {trendConfig.icon}
              <span>{trendConfig.label}</span>
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans mt-1">
            {trendConfig.desc}
          </p>
          <div className="mt-2 pt-2 border-t border-[#18283E] flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
            <span>Stage 1-5: Escalating</span>
            <span>Stage 6: Recovering</span>
          </div>
        </div>

      </div>

      {/* Row 2: "WHY THIS WARNING?" & Multi-Factor Decision Pipeline */}
      <div className="bg-[#07111F] border border-[#18283E] rounded-xl p-4 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#18283E]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono-tech">
              WHY THIS WARNING?
            </h3>
            <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-semibold">
              EXPLAINABLE AI ENGINE
            </span>
          </div>
          <div className="text-[11px] font-mono-tech text-slate-400">
            {ew?.reasons.length || 0} active indicator condition(s) triggered
          </div>
        </div>

        {/* Visual Multi-Factor Decision Chain Flow */}
        <div className="p-3 bg-[#0B1728] border border-[#1c2e47] rounded-lg space-y-2">
          <div className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>MULTI-FACTOR INDICATOR DECISION CHAIN</span>
            <span className="text-cyan-400 font-semibold">REAL-TIME PROPAGATION</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 text-center font-mono-tech text-[10px]">
            {/* Step 1: Rainfall */}
            <div className={`p-2 rounded border transition-all ${isRainActive ? 'bg-amber-950/40 border-orange-500/50 text-orange-300' : 'bg-[#0E1D32] border-[#203550] text-slate-400'}`}>
              <div className="font-bold uppercase">1. Rainfall</div>
              <div className="text-[9px] mt-0.5">{rainfallRate} mm/h</div>
            </div>
            
            {/* Step 2: Soil Moisture */}
            <div className={`p-2 rounded border transition-all ${isMoistureActive ? 'bg-teal-950/40 border-teal-500/50 text-teal-300' : 'bg-[#0E1D32] border-[#203550] text-slate-400'}`}>
              <div className="font-bold uppercase">2. Soil Moisture</div>
              <div className="text-[9px] mt-0.5">{soilMoisture}%</div>
            </div>

            {/* Step 3: Pore Pressure */}
            <div className={`p-2 rounded border transition-all ${isPoreActive ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' : 'bg-[#0E1D32] border-[#203550] text-slate-400'}`}>
              <div className="font-bold uppercase">3. Pore Pressure</div>
              <div className="text-[9px] mt-0.5">{porePressure} kPa</div>
            </div>

            {/* Step 4: Slope Movement */}
            <div className={`p-2 rounded border transition-all ${isMotionActive ? 'bg-violet-950/40 border-violet-500/50 text-violet-300' : 'bg-[#0E1D32] border-[#203550] text-slate-400'}`}>
              <div className="font-bold uppercase">4. Movement</div>
              <div className="text-[9px] mt-0.5">{insarDisp} mm</div>
            </div>

            {/* Step 5: Risk Score */}
            <div className={`p-2 rounded border transition-all ${isRiskActive ? 'bg-amber-950/50 border-amber-400/50 text-amber-300' : 'bg-[#0E1D32] border-[#203550] text-slate-400'}`}>
              <div className="font-bold uppercase">5. Risk Score</div>
              <div className="text-[9px] mt-0.5">{riskScore}/100</div>
            </div>

            {/* Step 6: Warning */}
            <div className={`p-2 rounded border transition-all ${isWarningActive ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 font-bold' : 'bg-[#0E1D32] border-[#203550] text-emerald-400'}`}>
              <div className="font-bold uppercase">6. Warning</div>
              <div className="text-[9px] mt-0.5">{ew?.level || 'LOW'}</div>
            </div>

            {/* Step 7: Response */}
            <div className="p-2 rounded border bg-[#0E1D32] border-[#203550] text-cyan-300 font-bold col-span-2 sm:col-span-4 md:col-span-1">
              <div className="font-bold uppercase">7. Directive</div>
              <div className="text-[9px] mt-0.5 truncate">Active Relay</div>
            </div>
          </div>
        </div>

        {/* Render Actual Trigger Reasons Returned by Early-Warning Engine */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono-tech font-bold text-slate-300 uppercase tracking-wider">
            PRIMARY TRIGGERED CONDITIONS & REASONS:
          </div>
          <div className="grid grid-cols-1 gap-2">
            {ew?.reasons && ew.reasons.length > 0 ? (
              ew.reasons.map((reason, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-[#0E1D32]/80 border border-[#1f3552] rounded-lg text-xs font-sans text-slate-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(0,212,255,0.8)]" />
                  <div className="flex-1">
                    <p className="leading-relaxed text-slate-200 font-medium">
                      {reason}
                    </p>
                    {ew.triggeredConditions && ew.triggeredConditions[idx] && (
                      <span className="inline-block mt-1 text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#07111F] border border-[#203550] text-cyan-300 font-bold uppercase">
                        CONDITION: {ew.triggeredConditions[idx]}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 bg-[#0E1D32]/50 border border-[#1f3552] rounded-lg text-xs font-mono-tech text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All telemetry parameters remain within safe geomechanical envelope.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Row 3: Telemetry Evidence Grid */}
      <div className="bg-[#07111F] border border-[#18283E] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#18283E]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono-tech">
              TELEMETRY EVIDENCE BEHIND WARNING
            </h3>
          </div>
          <span className="text-[10px] font-mono-tech text-slate-400">
            NUMERICAL SENSOR EVIDENCE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3 bg-[#0B1728] border border-[#1c2e47] rounded-lg">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Rainfall Rate</div>
            <div className="text-lg font-bold font-mono-tech text-cyan-300 mt-0.5">
              {rainfallRate} <span className="text-xs font-normal text-slate-400">mm/hr</span>
            </div>
            <div className="text-[9px] font-mono-tech text-slate-500 mt-1">Threshold: &ge;15 / 30 / 40</div>
          </div>

          <div className="p-3 bg-[#0B1728] border border-[#1c2e47] rounded-lg">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase">24h Accumulation</div>
            <div className="text-lg font-bold font-mono-tech text-cyan-300 mt-0.5">
              {accum24h} <span className="text-xs font-normal text-slate-400">mm</span>
            </div>
            <div className="text-[9px] font-mono-tech text-slate-500 mt-1">Threshold: &ge;45 / 80 / 120</div>
          </div>

          <div className="p-3 bg-[#0B1728] border border-[#1c2e47] rounded-lg">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Soil Moisture</div>
            <div className="text-lg font-bold font-mono-tech text-teal-300 mt-0.5">
              {soilMoisture} <span className="text-xs font-normal text-slate-400">%</span>
            </div>
            <div className="text-[9px] font-mono-tech text-slate-500 mt-1">Threshold: &ge;45% / 60% / 80%</div>
          </div>

          <div className="p-3 bg-[#0B1728] border border-[#1c2e47] rounded-lg">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Pore Pressure</div>
            <div className="text-lg font-bold font-mono-tech text-cyan-300 mt-0.5">
              {porePressure} <span className="text-xs font-normal text-slate-400">kPa</span>
            </div>
            <div className="text-[9px] font-mono-tech text-slate-500 mt-1">Threshold: &ge;25 / 40 / 50</div>
          </div>

          <div className="p-3 bg-[#0B1728] border border-[#1c2e47] rounded-lg">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Slope Tilt</div>
            <div className="text-lg font-bold font-mono-tech text-amber-300 mt-0.5">
              {slopeTilt} <span className="text-xs font-normal text-slate-400">&deg;</span>
            </div>
            <div className="text-[9px] font-mono-tech text-slate-500 mt-1">Threshold: &ge;1.5&deg; / 3.0&deg; / 5.0&deg;</div>
          </div>

          <div className="p-3 bg-[#0B1728] border border-[#1c2e47] rounded-lg">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase">InSAR Motion</div>
            <div className="text-lg font-bold font-mono-tech text-violet-300 mt-0.5">
              {insarDisp > 0 ? `+${insarDisp}` : insarDisp} <span className="text-xs font-normal text-slate-400">mm</span>
            </div>
            <div className="text-[9px] font-mono-tech text-slate-500 mt-1">Threshold: &ge;1.5 / 4.0 / 20</div>
          </div>

          <div className="p-3 bg-[#0B1728] border border-[#1c2e47] rounded-lg">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Slope Instability</div>
            <div className="text-lg font-bold font-mono-tech text-rose-400 mt-0.5">
              {slopeInstability} <span className="text-xs font-normal text-slate-400">%</span>
            </div>
            <div className="text-[9px] font-mono-tech text-slate-500 mt-1">Threshold: &ge;45% / 65% / 85%</div>
          </div>

          <div className="p-3 bg-[#0B1728] border border-[#1c2e47] rounded-lg">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase">AI Composite Risk</div>
            <div className="text-lg font-bold font-mono-tech text-cyan-300 mt-0.5">
              {riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <div className="text-[9px] font-mono-tech text-slate-500 mt-1">Physics PINN Model</div>
          </div>

        </div>
      </div>

      {/* Row 4: Recommended Response Directive */}
      <div className={`p-4 rounded-xl border ${levelStyle.actionBg} transition-all`}>
        <div className="flex items-start gap-3">
          {levelStyle.actionIcon}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-bold font-mono-tech uppercase tracking-wider text-white">
                RECOMMENDED RESPONDER DIRECTIVE:
              </h3>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#07111F] border border-current font-bold uppercase">
                AUTOMATED DDMA PROTOCOL
              </span>
            </div>
            <p className="text-sm font-sans font-semibold leading-relaxed text-slate-100">
              {ew?.recommendedAction || 'Routine automated telemetry polling (15-min interval). Maintain baseline structural monitoring.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
