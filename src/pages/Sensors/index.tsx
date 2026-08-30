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
import { Button } from '../../components/ui/Button';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#182B42] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#14E6C5]/15 border border-[#14E6C5]/30 text-[#14E6C5]">
              <Radio className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 font-sans tracking-tight">
              GEOTECHNICAL SENSOR TELEMETRY WALL
            </h2>
          </div>
          <p className="text-xs font-mono-tech text-slate-400 mt-1">
            Real-Time In-Situ Geoprobe Nodes: Soil Moisture Piezometers, Inclinometers & Pore Pressure Transducers
          </p>
        </div>

        {/* Demo Simulation Indicator */}
        <div className="px-3 py-1.5 rounded-lg bg-[#101D2E] border border-[#264366] text-xs font-mono-tech flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="text-[#14E6C5] font-semibold">24 SENSOR NODES (SIMULATED TELEMETRY)</span>
        </div>
      </div>

      {/* Network Health KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0E1A2C] border border-[#182B42]">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">TOTAL DEPLOYED</span>
          <div className="text-2xl font-extrabold font-mono-tech text-slate-100 mt-1">24 NODES</div>
          <span className="text-[10px] font-mono-tech text-slate-500">8 NER State Clusters</span>
        </div>

        <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">ONLINE & ACTIVE</span>
          <div className="text-2xl font-extrabold font-mono-tech text-[#10B981] mt-1">{onlineCount}</div>
          <span className="text-[10px] font-mono-tech text-[#10B981]">91.6% Network Availability</span>
        </div>

        <div className="p-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">HIGH TILT / WARNING</span>
          <div className="text-2xl font-extrabold font-mono-tech text-[#F59E0B] mt-1">{warningCount}</div>
          <span className="text-[10px] font-mono-tech text-[#F59E0B]">Shear Threshold Tripped</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0E1A2C] border border-[#182B42]">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">BATTERY HEALTH</span>
          <div className="text-2xl font-extrabold font-mono-tech text-[#00D4FF] mt-1">94.2%</div>
          <span className="text-[10px] font-mono-tech text-slate-400">Solar-Charged Harvesting</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 font-mono-tech text-xs border-b border-[#182B42] pb-2">
        <span className="text-slate-400 mr-2">FILTER TELEMETRY:</span>
        {['ALL', 'ONLINE', 'WARNING', 'OFFLINE'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === status
                ? 'bg-[#00D4FF] text-[#050912]'
                : 'bg-[#0E1A2C] text-slate-400 hover:text-slate-200 border border-[#182B42]'
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
                  ? 'bg-[#F97316]/5 border-[#F97316]/40 hover:border-[#F97316]'
                  : 'bg-[#0E1A2C] border-[#182B42] hover:border-[#264366]'
              }`}
            >
              {/* Top Node ID & Status */}
              <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-[#182B42]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech font-extrabold text-sm text-[#00D4FF]">
                      {s.nodeId}
                    </span>
                    <span className="text-[11px] font-mono-tech px-2 py-0.2 rounded bg-[#07111F] text-slate-300 border border-[#182B42]">
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
                <div className="p-2 rounded-lg bg-[#07111F] text-center border border-[#182B42]">
                  <span className="text-[9px] font-mono-tech text-slate-400 block uppercase">SOIL MOISTURE</span>
                  <span className="text-base font-bold font-mono-tech text-[#14E6C5]">{s.soilMoisturePct}%</span>
                </div>

                <div className="p-2 rounded-lg bg-[#07111F] text-center border border-[#182B42]">
                  <span className="text-[9px] font-mono-tech text-slate-400 block uppercase">SLOPE TILT</span>
                  <span className="text-base font-bold font-mono-tech text-[#EF4444]">{s.slopeTiltDeg}°</span>
                </div>

                <div className="p-2 rounded-lg bg-[#07111F] text-center border border-[#182B42]">
                  <span className="text-[9px] font-mono-tech text-slate-400 block uppercase">PORE PRESS.</span>
                  <span className="text-base font-bold font-mono-tech text-[#00D4FF]">{s.porePressureKPa} <span className="text-[9px]">kPa</span></span>
                </div>
              </div>

              {/* Node Diagnostics */}
              <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400 pt-2 border-t border-[#182B42]">
                <div className="flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{s.batteryPct}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-[#00D4FF]" />
                  <span>{s.signalDbm} dBm</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedZoneCode(s.zoneCode);
                    setActiveTab('risk-analysis');
                  }}
                  className="text-[#00D4FF] hover:underline flex items-center gap-0.5 font-semibold"
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
