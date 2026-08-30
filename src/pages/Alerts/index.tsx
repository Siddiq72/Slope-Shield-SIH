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
import { RiskBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182B42] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444]">
              <BellRing className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 font-sans tracking-tight">
              EARLY WARNING DISPATCH CENTER
            </h2>
          </div>
          <p className="text-xs font-mono-tech text-slate-400 mt-1">
            Common Alerting Protocol (CAP) Multi-Channel Relays to DDMA, SDRF & Local Cell Towers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudioWarning}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono-tech flex items-center gap-2 transition-colors ${
              audioWarningMuted
                ? 'bg-[#101D2E] border-[#182B42] text-slate-400'
                : 'bg-[#EF4444]/20 border-[#EF4444]/50 text-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse'
            }`}
          >
            {audioWarningMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{audioWarningMuted ? 'AUDIO SIREN MUTED' : 'AUDIBLE SIREN ACTIVE'}</span>
          </button>
        </div>
      </div>

      {/* Protocol Gateway KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0E1A2C] border border-[#182B42]">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">CAP SMS / CB BROADCAST</span>
          <div className="text-xl font-extrabold font-mono-tech text-[#10B981] mt-1">32,450 SUBSCRIBERS</div>
          <span className="text-[10px] font-mono-tech text-slate-400">Geo-fenced Push Relay</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0E1A2C] border border-[#182B42]">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">DDMA NODAL CONTROL ROOMS</span>
          <div className="text-xl font-extrabold font-mono-tech text-[#00D4FF] mt-1">12 DISTRICTS LINKED</div>
          <span className="text-[10px] font-mono-tech text-slate-400">Direct API Webhook Handshake</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0E1A2C] border border-[#182B42]">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">MEAN DISPATCH LATENCY</span>
          <div className="text-xl font-extrabold font-mono-tech text-[#14E6C5] mt-1">&lt; 1.4 SECONDS</div>
          <span className="text-[10px] font-mono-tech text-slate-400">Sub-minute threshold delivery</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 font-mono-tech text-xs border-b border-[#182B42] pb-2">
        <span className="text-slate-400 mr-2">SEVERITY FILTER:</span>
        {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              filterSeverity === sev
                ? 'bg-[#00D4FF] text-[#050912]'
                : 'bg-[#0E1A2C] text-slate-400 hover:text-slate-200 border border-[#182B42]'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all ${
                isCritical
                  ? 'bg-[#EF4444]/5 border-[#EF4444]/50 shadow-xl shadow-[#EF4444]/5'
                  : 'bg-[#0E1A2C] border-[#182B42]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#182B42]">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-extrabold font-mono-tech px-2.5 py-1 rounded bg-[#0B1726] text-[#00D4FF] border border-[#264366]">
                    ZONE {alert.zoneCode}
                  </span>
                  <RiskBadge level={alert.severity} size="md" />
                  <span className="text-sm font-bold text-slate-100 font-sans">
                    {alert.locationName} ({alert.district})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono-tech text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{alert.timestamp} ({alert.minutesAgo}m ago)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    alert.acknowledged ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444] animate-pulse'
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
                  <span className="text-[10px] font-mono-tech text-slate-400 uppercase">
                    EVIDENCE SIGNALS:
                  </span>
                  {alert.contributingTriggers.map((trig, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono-tech px-2.5 py-1 rounded-lg bg-[#07111F] text-slate-300 border border-[#182B42]"
                    >
                      {trig}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Relays and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#182B42] text-xs font-mono-tech">
                <div className="flex items-center gap-2 text-slate-400">
                  <Send className="w-3.5 h-3.5 text-[#00D4FF]" />
                  <span>Dispatched: <strong>{alert.dispatchedTo.join(', ')}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {!alert.acknowledged && (
                    <Button
                      onClick={() => acknowledgeAlert(alert.id)}
                      variant="secondary"
                      size="sm"
                      icon={<CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
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
        })}
      </div>
    </div>
  );
};
