import React, { useState } from 'react';
import { 
  Radio, 
  Wifi, 
  Battery, 
  Activity, 
  Layers, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { SimulationBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/common/SectionHeader';

export const SensorsPage: React.FC = () => {
  const { sensors, setSelectedZoneCode, setActiveTab } = useDemo();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const onlineCount = sensors.filter((s) => s.status === 'ONLINE').length + 18;
  const warningCount = sensors.filter((s) => s.status === 'WARNING').length + 2;
  const offlineCount = 1;

  const filteredSensors = sensors.filter((s) => {
    if (filterStatus === 'ALL') return true;
    return s.status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <SectionHeader
        icon={<Radio className="w-4 h-4 text-cyan-400" />}
        title="GEOTECHNICAL SENSOR TELEMETRY WALL"
        subtitle="Real-Time In-Situ Geoprobe Nodes: Soil Moisture Piezometers, Inclinometers & Pore Pressure Transducers"
        badge={<SimulationBadge />}
        actions={
          <div className="px-3 py-1 rounded-lg bg-[#0E1D32] border border-[#203550] text-xs font-mono-tech flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-teal-300 font-bold">24 SENSOR NODES (SIMULATED TELEMETRY)</span>
          </div>
        }
      />

      {/* Network Health KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0B1728] border border-[#1c2e47] shadow-lg">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block font-semibold">TOTAL DEPLOYED</span>
          <div className="text-2xl font-extrabold font-mono-tech text-slate-100 mt-1">24 NODES</div>
          <span className="text-[10px] font-mono-tech text-slate-400">8 NER State Clusters</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 shadow-lg">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block font-semibold">ONLINE & ACTIVE</span>
          <div className="text-2xl font-extrabold font-mono-tech text-emerald-400 mt-1">{onlineCount}</div>
          <span className="text-[10px] font-mono-tech text-emerald-400">91.6% Network Availability</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 shadow-lg">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block font-semibold">HIGH TILT / WARNING</span>
          <div className="text-2xl font-extrabold font-mono-tech text-amber-400 mt-1">{warningCount}</div>
          <span className="text-[10px] font-mono-tech text-amber-400">Shear Threshold Tripped</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1728] border border-[#1c2e47] shadow-lg">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block font-semibold">BATTERY HEALTH</span>
          <div className="text-2xl font-extrabold font-mono-tech text-cyan-300 mt-1">94.2%</div>
          <span className="text-[10px] font-mono-tech text-slate-400">Solar-Charged Energy Harvesting</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 font-mono-tech text-xs border-b border-[#18283E] pb-2">
        <span className="text-slate-400 mr-2 font-semibold">FILTER TELEMETRY:</span>
        {['ALL', 'ONLINE', 'WARNING', 'OFFLINE'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === status
                ? 'bg-cyan-400 text-[#040810] shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                : 'bg-[#0E1D32] text-slate-400 hover:text-slate-200 border border-[#18283E]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSensors.map((s) => {
          const isWarning = s.status === 'WARNING';
          return (
            <div
              key={s.nodeId}
              className={`p-4 rounded-xl border transition-all ${
                isWarning
                  ? 'bg-amber-950/20 border-orange-500/40 hover:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                  : 'bg-[#0B1728] border-[#1c2e47] hover:border-[#2b496e] shadow-xl'
              }`}
            >
              {/* Top Node ID & Status */}
              <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-[#18283E]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech font-extrabold text-sm text-cyan-300">
                      {s.nodeId}
                    </span>
                    <span className="text-[11px] font-mono-tech px-2 py-0.2 rounded bg-[#07111F] text-slate-300 border border-[#18283E]">
                      ZONE {s.zoneCode}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 font-sans mt-1">
                    {s.nodeName}
                  </h4>
                  <p className="text-[11px] font-mono-tech text-slate-400">
                    {s.location}
                  </p>
                </div>

                <StatusIndicator status={s.status} isSimulated={true} />
              </div>

              {/* 3 Metrics */}
              <div className="grid grid-cols-3 gap-2 my-3">
                <div className="p-2.5 rounded-lg bg-[#07111F]/90 text-center border border-[#18283E]">
                  <span className="text-[9px] font-mono-tech text-slate-400 block uppercase font-semibold">SOIL MOISTURE</span>
                  <span className="text-base font-bold font-mono-tech text-teal-300">{s.soilMoisturePct}%</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#07111F]/90 text-center border border-[#18283E]">
                  <span className="text-[9px] font-mono-tech text-slate-400 block uppercase font-semibold">SLOPE TILT</span>
                  <span className="text-base font-bold font-mono-tech text-rose-400">{s.slopeTiltDeg}°</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#07111F]/90 text-center border border-[#18283E]">
                  <span className="text-[9px] font-mono-tech text-slate-400 block uppercase font-semibold">PORE PRESS.</span>
                  <span className="text-base font-bold font-mono-tech text-cyan-300">{s.porePressureKPa} <span className="text-[9px]">kPa</span></span>
                </div>
              </div>

              {/* Node Diagnostics */}
              <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400 pt-2.5 border-t border-[#18283E]">
                <div className="flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{s.batteryPct}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{s.signalDbm} dBm</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedZoneCode(s.zoneCode);
                    setActiveTab('risk-analysis');
                  }}
                  className="text-cyan-300 hover:text-cyan-200 flex items-center gap-0.5 font-semibold cursor-pointer"
                >
                  <span>ANALYZE</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
