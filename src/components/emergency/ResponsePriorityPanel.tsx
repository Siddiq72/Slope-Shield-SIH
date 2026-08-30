import React from 'react';
import { ShieldAlert, CheckCircle, ArrowRight, Truck, Users, Radio, AlertOctagon } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { RiskBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const ResponsePriorityPanel: React.FC = () => {
  const { emergencyPriorities, setSelectedZoneCode, setActiveTab } = useDemo();

  return (
    <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#18283E]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-rose-950/60 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-sans uppercase tracking-widest font-mono-tech">
              EMERGENCY RESPONSE PRIORITY QUEUE
            </h3>
            <p className="text-[11px] font-mono-tech text-slate-400">
              AI Actionable Triage for DDMA, SDRF, and NDRF Incident Commanders
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('emergency')}
          className="text-xs font-mono-tech text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-semibold cursor-pointer"
        >
          <span>COMMAND MATRIX</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Priority Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {emergencyPriorities.slice(0, 3).map((item) => {
          return (
            <div
              key={item.rank}
              className="p-4 rounded-xl bg-[#07111F]/90 border border-[#18283E] hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rank & Score Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-rose-600 text-white flex items-center justify-center font-mono-tech font-extrabold text-xs shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                      0{item.rank}
                    </span>
                    <span className="text-xs font-bold font-mono-tech text-slate-300">
                      ZONE {item.zoneCode}
                    </span>
                  </div>

                  <RiskBadge level={item.severity} size="sm" />
                </div>

                <h4 className="text-sm font-bold text-white font-sans mt-1">
                  {item.zoneName}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono-tech mb-2">
                  {item.district}
                </p>

                {/* Main Action Banner */}
                <div className="p-2.5 rounded-lg bg-[#0E1D32] border border-[#18283E] text-xs font-mono-tech mb-2">
                  <span className="text-[9px] text-slate-400 uppercase block mb-0.5 font-semibold">
                    MANDATED ACTION
                  </span>
                  <span className="font-bold text-cyan-300 block leading-tight text-[11px]">
                    {item.primaryAction}
                  </span>
                </div>

                {/* Details */}
                <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2 mb-2">
                  {item.actionDetails}
                </p>
              </div>

              {/* Footer info & CTA */}
              <div className="pt-2.5 border-t border-[#18283E] flex items-center justify-between">
                <div className="text-[10px] font-mono-tech text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                  <span>{item.estimatedPeopleAffected.toLocaleString()} at Risk</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedZoneCode(item.zoneCode);
                    setActiveTab('emergency');
                  }}
                  className="px-2.5 py-1 bg-rose-950/60 border border-rose-500/50 text-rose-300 hover:bg-rose-600 hover:text-white rounded-lg text-[10px] font-mono-tech font-bold uppercase transition-colors cursor-pointer"
                >
                  DISPATCH ALERT →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
