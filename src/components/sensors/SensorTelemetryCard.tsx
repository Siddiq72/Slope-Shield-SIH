import React from 'react';
import { Radio, Activity, Battery, Wifi, Gauge, ArrowUpRight } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { StatusIndicator } from '../ui/StatusIndicator';
import { Button } from '../ui/Button';

export const SensorTelemetryCard: React.FC = () => {
  const { sensors, selectedZoneCode, setActiveTab } = useDemo();

  const sensor = sensors.find((s) => s.zoneCode === selectedZoneCode) || sensors[0];

  return (
    <div className="bg-[#101D2E] border border-[#1e293b] rounded p-4 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
              TELEMETRY & IN-SITU
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SIMULATED LIVE
            </span>
            <span className="text-xs font-mono font-bold text-[#00D4FF] bg-[#050912] px-2 py-0.5 rounded border border-[#1e293b]">
              {sensor.nodeId}
            </span>
          </div>
        </div>

        {/* 3 Core Geotechnical Metrics */}
        <div className="grid grid-cols-3 gap-2.5 my-3">
          {/* Soil Moisture */}
          <div className="bg-[#050912]/50 p-2.5 border border-[#1e293b] rounded text-center">
            <span className="text-[9px] font-mono uppercase text-slate-500 block tracking-wider">
              SOIL MOISTURE
            </span>
            <div className="text-xl font-mono font-bold text-[#14E6C5] mt-0.5">
              {sensor.soilMoisturePct}%
            </div>
            <span className="text-[9px] font-mono text-slate-500 block">
              @ {sensor.depthMeters}m depth
            </span>
          </div>

          {/* Slope Tilt */}
          <div className="bg-[#050912]/50 p-2.5 border border-[#1e293b] rounded text-center">
            <span className="text-[9px] font-mono uppercase text-slate-500 block tracking-wider">
              SLOPE TILT
            </span>
            <div className="text-xl font-mono font-bold text-red-500 mt-0.5">
              {sensor.slopeTiltDeg}°
            </div>
            <span className="text-[9px] font-mono text-red-400 block font-semibold">
              +0.8°/hr Rate
            </span>
          </div>

          {/* Pore Pressure */}
          <div className="bg-[#050912]/50 p-2.5 border border-[#1e293b] rounded text-center">
            <span className="text-[9px] font-mono uppercase text-slate-500 block tracking-wider">
              PORE PRESS.
            </span>
            <div className="text-xl font-mono font-bold text-[#00D4FF] mt-0.5">
              {sensor.porePressureKPa}
            </div>
            <span className="text-[9px] font-mono text-slate-500 block">
              kPa
            </span>
          </div>
        </div>

        {/* Precipitation Trend Micro Chart */}
        <div className="bg-[#050912]/50 p-2.5 border border-[#1e293b] rounded mb-3">
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1.5 uppercase">
            <span>RAINFALL INTENSITY TREND</span>
            <span className="text-cyan-400 font-bold">42 mm/hr (CRITICAL)</span>
          </div>
          <div className="flex items-end gap-1.5 h-10 pt-1">
            {[18, 22, 28, 35, 42, 45, 52, 60, 75, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-cyan-500 rounded-t transition-all hover:bg-cyan-300 cursor-pointer"
                style={{ height: `${h}%` }}
                title={`T-${10 - i}h: ${Math.round(h * 0.5)} mm/hr`}
              />
            ))}
          </div>
        </div>

        {/* Node Health & Diagnostics */}
        <div className="p-2.5 rounded bg-[#050912]/40 border border-[#1e293b] flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5">
            <Battery className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-[11px]">Batt: <strong className="text-white">{sensor.batteryPct}%</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span className="text-[11px]">LoRa: <strong className="text-white">{sensor.signalDbm} dBm</strong></span>
          </div>

          <div className="text-[11px] text-slate-400">
            Ping: <span className="text-slate-200">{sensor.lastPing}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-[#1e293b] flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-500">
          24 Sensor Nodes Online
        </span>
        <button
          onClick={() => setActiveTab('sensors')}
          className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <span>ALL SENSORS</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
