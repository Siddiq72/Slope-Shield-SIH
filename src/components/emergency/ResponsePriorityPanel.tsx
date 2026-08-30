import React from 'react';
import { ShieldAlert, CheckCircle, ArrowRight, Truck, Users, Radio, AlertOctagon } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { RiskBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const ResponsePriorityPanel: React.FC = () => {
  const { emergencyPriorities, setSelectedZoneCode, setActiveTab } = useDemo();

  return (
    <div className="bg-[#101D2E] border border-[#1e293b] rounded p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-red-500/20 border border-red-500/40 text-red-500">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-widest">
              EMERGENCY RESPONSE PRIORITY QUEUE
            </h3>
            <p className="text-[10px] font-mono text-slate-500">
              AI Actionable Triage for DDMA, SDRF, and NDRF Incident Commanders
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('emergency')}
          className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <span>INCIDENT COMMAND MATRIX</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Priority Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        {emergencyPriorities.slice(0, 3).map((item) => {
          return (
            <div
              key={item.rank}
              className="p-3.5 rounded bg-[#050912]/60 border border-[#1e293b] hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rank & Score Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-mono font-bold text-xs shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                      0{item.rank}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-300">
                      ZONE {item.zoneCode}
                    </span>
                  </div>

                  <RiskBadge level={item.severity} size="sm" />
                </div>

                <h4 className="text-sm font-bold text-white font-sans mt-1">
                  {item.zoneName}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono mb-2">
                  {item.district}
                </p>

                {/* Main Action Banner */}
                <div className="p-2.5 rounded bg-[#101D2E] border border-[#1e293b] text-xs font-mono mb-2">
                  <span className="text-[9px] text-slate-500 uppercase block mb-0.5">
                    MANDATED ACTION
                  </span>
                  <span className="font-bold text-cyan-400 block leading-tight text-[11px]">
                    {item.primaryAction}
                  </span>
                </div>

                {/* Details */}
                <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2 mb-2">
                  {item.actionDetails}
                </p>
              </div>

              {/* Footer info & CTA */}
              <div className="pt-2.5 border-t border-[#1e293b] flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#14E6C5]" />
                  <span>{item.estimatedPeopleAffected.toLocaleString()} at Risk</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedZoneCode(item.zoneCode);
                    setActiveTab('emergency');
                  }}
                  className="px-2.5 py-1 bg-red-500/20 border border-red-500/60 text-red-400 hover:bg-red-500 hover:text-white rounded text-[10px] font-mono font-bold uppercase transition-colors"
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
