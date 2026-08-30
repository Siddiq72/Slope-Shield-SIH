import React from 'react';
import { Cpu, Sparkles, ArrowRight, ShieldAlert, Zap, AlertTriangle } from 'lucide-react';
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
    <div className="bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#182B42]">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest font-mono-tech">
              AI RISK ENGINE
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#7C5CFF] font-mono-tech px-2 py-0.5 bg-[#7C5CFF]/10 rounded border border-[#7C5CFF]/20">
              DYNAMIC SCORE
            </span>
            <span className="text-xs font-bold font-mono-tech text-[#00D4FF]">
              ZONE {zone.code}
            </span>
          </div>
        </div>

        {/* Gauge & Main Score Readout */}
        <div className="my-3 flex flex-col sm:flex-row items-center justify-around gap-4 bg-[#07111F]/80 p-3.5 rounded-xl border border-[#182B42]">
          <RiskGauge score={zone.riskScore} level={zone.riskLevel} size="md" showLabels={false} />

          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 tracking-wider">
              AI CLASSIFICATION
            </span>
            <div className="text-xl font-bold font-mono-tech text-white flex items-center gap-2">
              <span className={zone.riskLevel === 'CRITICAL' ? 'text-[#EF4444]' : zone.riskLevel === 'HIGH' ? 'text-[#F97316]' : 'text-[#10B981]'}>
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
            value={zone.rainfallRateMmHr > 35 ? 82 : 45}
            rawValue={`${zone.rainfallRateMmHr} mm/hr`}
            weight="35%"
            variant="cyan"
          />

          <ProgressBar
            label="SOIL MOISTURE"
            value={zone.soilMoisturePct}
            rawValue={`${zone.soilMoisturePct}%`}
            weight="25%"
            variant="teal"
          />

          <ProgressBar
            label="SLOPE INSTABILITY"
            value={zone.slopeInstabilityPct}
            rawValue={`${zone.slopeAngleDeg}°`}
            weight="20%"
            variant="risk"
            riskScore={zone.slopeInstabilityPct}
          />

          <ProgressBar
            label="HISTORICAL LOCUS"
            value={zone.historicalVulnerabilityPct}
            rawValue="Recurrent"
            weight="10%"
            variant="amber"
          />

          <ProgressBar
            label="InSAR SURFACE MOTION"
            value={Math.min(100, Math.round(zone.insarDisplacementMm * 9))}
            rawValue={`+${zone.insarDisplacementMm} mm`}
            weight="10%"
            variant="violet"
          />
        </div>
      </div>

      {/* Projection & Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#182B42] space-y-2">
        <div className="p-3 bg-[#07111F]/80 border border-[#182B42] rounded-xl">
          <div className="text-[10px] text-slate-400 font-mono-tech mb-1 uppercase tracking-wider">
            PROJECTION (NEXT 6 HOURS)
          </div>
          <div className="flex items-center gap-2 text-xs font-mono-tech">
            <span className="font-bold text-[#F97316]">{zone.forecast6h.from}</span>
            <div className="flex-1 border-t border-dashed border-slate-700"></div>
            <span className="font-bold text-[#EF4444] animate-pulse">{zone.forecast6h.to}</span>
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
