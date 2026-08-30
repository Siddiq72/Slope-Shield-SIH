import React from 'react';
import { BellRing, Clock, ArrowRight, ShieldAlert, CheckCircle2, Radio } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { RiskBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const ActiveAlertsPanel: React.FC = () => {
  const { alerts, setSelectedZoneCode, setActiveTab, acknowledgeAlert } = useDemo();

  return (
    <div className="bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#182B42]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444]">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-sans tracking-wide">
              ACTIVE EARLY WARNINGS
            </h3>
            <p className="text-[11px] font-mono-tech text-slate-400">
              Automated Dispatches to District Disaster Authorities (DDMA)
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('alerts')}
          className="text-xs font-mono-tech text-[#00D4FF] hover:underline flex items-center gap-1 font-semibold"
        >
          <span>ALL WARNINGS ({alerts.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alerts Grid / List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
        {alerts.slice(0, 2).map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                isCritical
                  ? 'bg-[#EF4444]/5 border-[#EF4444]/40 hover:border-[#EF4444]'
                  : 'bg-[#101D2E]/80 border-[#182B42] hover:border-[#264366]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold font-mono-tech px-2 py-0.5 rounded bg-[#0B1726] text-[#00D4FF] border border-[#182B42]">
                    ZONE {alert.zoneCode}
                  </span>
                  <RiskBadge level={alert.severity} size="sm" />
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono-tech text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{alert.minutesAgo} MIN AGO</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-100 font-sans mt-1">
                {alert.locationName} ({alert.district})
              </h4>

              <p className="text-xs text-slate-300 font-sans mt-1.5 line-clamp-2 leading-relaxed">
                {alert.summary}
              </p>

              {/* Triggers Tag Strip */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {alert.contributingTriggers.slice(0, 3).map((trigger, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#07111F] text-slate-300 border border-[#182B42]"
                  >
                    {trigger}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#182B42]">
                <span className="text-[10px] font-mono-tech text-[#14E6C5] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Dispatched to {alert.dispatchedTo[0]}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setSelectedZoneCode(alert.zoneCode);
                      setActiveTab('risk-map');
                    }}
                    variant="primary"
                    size="sm"
                    className="text-xs font-mono-tech py-1 px-3"
                  >
                    VIEW ZONE →
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
