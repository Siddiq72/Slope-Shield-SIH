import React from 'react';
import { Cpu, Sparkles, ChevronRight, ShieldAlert, Zap, AlertTriangle } from 'lucide-react';
import { RiskZone } from '../../types';
import { RiskGauge } from '../ui/RiskGauge';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { useDemo } from '../../context/DemoContext';

interface AIRiskEngineProps {
  zone: RiskZone;
  onOpenAnalysis?: () => void;
}

export const AIRiskEngine: React.FC<AIRiskEngineProps> = ({ zone, onOpenAnalysis }) => {
  const { setActiveTab } = useDemo();

  return (
    <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-5 shadow-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#18283E]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest font-mono-tech">
              AI RISK ENGINE
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-violet-300 font-mono-tech px-2 py-0.5 bg-violet-950/50 rounded border border-violet-500/30">
              DYNAMIC SCORE
            </span>
            <span className="text-xs font-bold font-mono-tech text-cyan-300">
              ZONE {zone.code}
            </span>
          </div>
        </div>

        {/* Gauge & Main Score Readout */}
        <div className="my-3 flex flex-col sm:flex-row items-center justify-around gap-4 bg-[#07111F]/90 p-3.5 rounded-xl border border-[#18283E]">
          <RiskGauge score={zone.riskScore} level={zone.riskLevel} size="md" showLabels={false} />

          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 tracking-wider">
              AI CLASSIFICATION
            </span>
            <div className="text-xl font-bold font-mono-tech text-white flex items-center gap-2">
              <span className={zone.riskLevel === 'CRITICAL' ? 'text-rose-400' : zone.riskLevel === 'HIGH' ? 'text-orange-400' : 'text-emerald-400'}>
                {zone.riskLevel} SEVERITY
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-[210px]">
              {zone.riskScore >= 85
                ? 'High pore water pressure exceeding critical shear threshold.'
                : 'Accelerated precipitation tracking monsoonal trend.'}
            </p>
          </div>
        </div>

        {/* Explainable Contributors Breakdown */}
        <div className="space-y-2.5 mt-3">
          <div className="text-[10px] font-mono-tech font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span>RISK CONTRIBUTORS</span>
            <span className="text-slate-400 font-normal">WEIGHTED FUSION</span>
          </div>

          <ProgressBar
            label="RAINFALL"
            value={Math.min(100, Math.round((zone.rainfallRateMmHr / 45) * 50 + (zone.accumulation24hMm / 180) * 50))}
            rawValue={`${zone.rainfallRateMmHr} mm/hr`}
            weight="25%"
            variant="cyan"
          />

          <ProgressBar
            label="SOIL MOISTURE"
            value={zone.soilMoisturePct}
            rawValue={`${zone.soilMoisturePct}%`}
            weight="15%"
            variant="teal"
          />

          <ProgressBar
            label="PORE-WATER PRESSURE"
            value={Math.min(100, Math.round((zone.porePressureKPa / 60) * 100))}
            rawValue={`${zone.porePressureKPa} kPa`}
            weight="15%"
            variant="cyan"
          />

          <ProgressBar
            label="SLOPE INSTABILITY"
            value={zone.slopeInstabilityPct}
            rawValue={`${zone.slopeInstabilityPct}%`}
            weight="15%"
            variant="risk"
            riskScore={zone.slopeInstabilityPct}
          />

          <ProgressBar
            label="InSAR SURFACE MOTION"
            value={Math.min(100, Math.round((Math.abs(zone.insarDisplacementMm) / 30) * 100))}
            rawValue={`${zone.insarDisplacementMm > 0 ? '+' : ''}${zone.insarDisplacementMm} mm`}
            weight="10%"
            variant="violet"
          />

          <ProgressBar
            label="TERRAIN GRADIENT"
            value={Math.min(100, Math.round((zone.slopeAngleDeg / 50) * 100))}
            rawValue={`${zone.slopeAngleDeg}°`}
            weight="10%"
            variant="amber"
          />

          <ProgressBar
            label="HISTORICAL LOCUS"
            value={zone.historicalVulnerabilityPct}
            rawValue={`${zone.historicalVulnerabilityPct}%`}
            weight="10%"
            variant="amber"
          />
        </div>
      </div>

      {/* Projection & Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#18283E] space-y-2">
        <div className="p-2.5 bg-[#07111F]/90 border border-[#18283E] rounded-lg">
          <div className="text-[10px] text-slate-400 font-mono-tech mb-1 uppercase tracking-wider">
            TEMPORAL PROJECTION (NEXT 6 HOURS)
          </div>
          <div className="flex items-center gap-2 text-xs font-mono-tech">
            <span className="font-bold text-orange-400">{zone.forecast6h.from}</span>
            <div className="flex-1 border-t border-dashed border-[#203550]"></div>
            <span className="font-bold text-rose-400 animate-pulse">{zone.forecast6h.to}</span>
          </div>
        </div>

        <Button
          onClick={() => {
            setActiveTab('risk-analysis');
            if (onOpenAnalysis) onOpenAnalysis();
          }}
          variant="ai"
          size="sm"
          className="w-full text-xs font-mono-tech justify-center"
          icon={<Sparkles className="w-3.5 h-3.5" />}
        >
          EXPLORE EXPLAINABLE AI MODEL →
        </Button>
      </div>
    </div>
  );
};
