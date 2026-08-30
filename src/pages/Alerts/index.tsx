import React, { useState } from 'react';
import { 
  BellRing, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Radio, 
  Users, 
  Volume2, 
  VolumeX,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { RiskBadge, SimulationBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/common/SectionHeader';
import { EmptyState } from '../../components/common/EmptyState';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, setSelectedZoneCode, setActiveTab, audioWarningMuted, toggleAudioWarning } = useDemo();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <SectionHeader
        icon={<BellRing className="w-4 h-4 text-rose-500" />}
        title="EARLY WARNING DISPATCH CENTER"
        subtitle="Common Alerting Protocol (CAP) Multi-Channel Relays to DDMA, SDRF & Local Cell Towers"
        badge={<SimulationBadge />}
        actions={
          <button
            onClick={toggleAudioWarning}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono-tech flex items-center gap-2 transition-all cursor-pointer ${
              audioWarningMuted
                ? 'bg-[#0E1D32] border-[#18283E] text-slate-400'
                : 'bg-rose-950/60 border-rose-500/60 text-rose-300 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
            }`}
          >
            {audioWarningMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="font-bold">{audioWarningMuted ? 'AUDIO SIREN MUTED' : 'AUDIBLE SIREN ACTIVE'}</span>
          </button>
        }
      />

      {/* Protocol Gateway KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0B1728] border border-[#1c2e47] shadow-lg">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block font-semibold">CAP SMS / CB BROADCAST</span>
          <div className="text-xl font-extrabold font-mono-tech text-emerald-400 mt-1">32,450 SUBSCRIBERS</div>
          <span className="text-[10px] font-mono-tech text-slate-400">Geo-fenced Push Relay</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1728] border border-[#1c2e47] shadow-lg">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block font-semibold">DDMA NODAL CONTROL ROOMS</span>
          <div className="text-xl font-extrabold font-mono-tech text-cyan-300 mt-1">12 DISTRICTS LINKED</div>
          <span className="text-[10px] font-mono-tech text-slate-400">Direct API Webhook Handshake</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1728] border border-[#1c2e47] shadow-lg">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block font-semibold">MEAN DISPATCH LATENCY</span>
          <div className="text-xl font-extrabold font-mono-tech text-teal-300 mt-1">&lt; 1.4 SECONDS</div>
          <span className="text-[10px] font-mono-tech text-slate-400">Sub-minute threshold delivery</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 font-mono-tech text-xs border-b border-[#18283E] pb-2">
        <span className="text-slate-400 mr-2 font-semibold">SEVERITY FILTER:</span>
        {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterSeverity === sev
                ? 'bg-cyan-400 text-[#040810] shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                : 'bg-[#0E1D32] text-slate-400 hover:text-slate-200 border border-[#18283E]'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <EmptyState
            title="No Active Warnings Found"
            description={`No early warnings with severity '${filterSeverity}' are active in this sector.`}
          />
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            return (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border transition-all shadow-xl ${
                  isCritical
                    ? 'bg-rose-950/20 border-rose-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                    : 'bg-[#0B1728] border-[#1c2e47] hover:border-[#2b496e]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#18283E]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-extrabold font-mono-tech px-2.5 py-1 rounded bg-[#0E1D32] text-cyan-300 border border-[#203550]">
                      ZONE {alert.zoneCode}
                    </span>
                    <RiskBadge level={alert.severity} size="md" />
                    <span className="text-sm font-bold text-slate-100 font-sans">
                      {alert.locationName} ({alert.district})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono-tech text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.timestamp} ({alert.minutesAgo}m ago)</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      alert.acknowledged ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950/60 text-rose-400 border border-rose-500/40 animate-pulse'
                    }`}>
                      {alert.acknowledged ? 'ACKNOWLEDGED' : 'ACTION REQUIRED'}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="my-3 space-y-2">
                  <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                    {alert.summary}
                  </p>

                  {/* Contributing Triggers */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] font-mono-tech text-slate-400 uppercase font-semibold">
                      EVIDENCE SIGNALS:
                    </span>
                    {alert.contributingTriggers.map((trig, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono-tech px-2.5 py-1 rounded-lg bg-[#07111F]/90 text-slate-300 border border-[#18283E]"
                      >
                        {trig}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Relays and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#18283E] text-xs font-mono-tech">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Send className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dispatched: <strong className="text-slate-200">{alert.dispatchedTo.join(', ')}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!alert.acknowledged && (
                      <Button
                        onClick={() => acknowledgeAlert(alert.id)}
                        variant="secondary"
                        size="sm"
                        icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      >
                        Acknowledge Alert
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        setSelectedZoneCode(alert.zoneCode);
                        setActiveTab('emergency');
                      }}
                      variant="primary"
                      size="sm"
                    >
                      Deploy Response Plan →
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
