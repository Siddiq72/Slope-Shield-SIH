import React from 'react';
import { Radio, Activity, Battery, Wifi, Gauge, ArrowUpRight } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { StatusIndicator } from '../ui/StatusIndicator';
import { Button } from '../ui/Button';

export const SensorTelemetryCard: React.FC = () => {
  const { sensors, selectedZoneCode, setActiveTab } = useDemo();

  const sensor = sensors.find((s) => s.zoneCode === selectedZoneCode) || sensors[0];

  return (
    <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-5 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#18283E]">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest font-mono-tech">
              TELEMETRY & IN-SITU
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-300 font-mono-tech flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SIMULATED LIVE
            </span>
            <span className="text-xs font-mono-tech font-bold text-cyan-300 bg-[#07111F] px-2 py-0.5 rounded border border-[#18283E]">
              {sensor.nodeId}
            </span>
          </div>
        </div>

        {/* 3 Core Geotechnical Metrics */}
        <div className="grid grid-cols-3 gap-2.5 my-3">
          {/* Soil Moisture */}
          <div className="bg-[#07111F]/90 p-3 border border-[#18283E] rounded-lg text-center">
            <span className="text-[9px] font-mono-tech uppercase text-slate-400 block tracking-wider font-semibold">
              SOIL MOISTURE
            </span>
            <div className="text-xl font-mono-tech font-bold text-teal-300 mt-0.5">
              {sensor.soilMoisturePct}%
            </div>
            <span className="text-[9px] font-mono-tech text-slate-400 block">
              @ {sensor.depthMeters}m depth
            </span>
          </div>

          {/* Slope Tilt */}
          <div className="bg-[#07111F]/90 p-3 border border-[#18283E] rounded-lg text-center">
            <span className="text-[9px] font-mono-tech uppercase text-slate-400 block tracking-wider font-semibold">
              SLOPE TILT
            </span>
            <div className="text-xl font-mono-tech font-bold text-rose-400 mt-0.5">
              {sensor.slopeTiltDeg}°
            </div>
            <span className="text-[9px] font-mono-tech text-rose-400 block font-semibold">
              +0.8°/hr Rate
            </span>
          </div>

          {/* Pore Pressure */}
          <div className="bg-[#07111F]/90 p-3 border border-[#18283E] rounded-lg text-center">
            <span className="text-[9px] font-mono-tech uppercase text-slate-400 block tracking-wider font-semibold">
              PORE PRESS.
            </span>
            <div className="text-xl font-mono-tech font-bold text-cyan-300 mt-0.5">
              {sensor.porePressureKPa}
            </div>
            <span className="text-[9px] font-mono-tech text-slate-400 block">
              kPa
            </span>
          </div>
        </div>

        {/* Precipitation Trend Micro Chart */}
        <div className="bg-[#07111F]/90 p-3 border border-[#18283E] rounded-lg mb-3">
          <div className="flex items-center justify-between text-[9px] font-mono-tech text-slate-400 mb-1.5 uppercase font-semibold">
            <span>RAINFALL INTENSITY TREND (10H)</span>
            <span className="text-cyan-300 font-bold">42 mm/hr (CRITICAL)</span>
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
        <div className="p-2.5 rounded-lg bg-[#07111F]/90 border border-[#18283E] flex items-center justify-between text-xs font-mono-tech text-slate-300">
          <div className="flex items-center gap-1.5">
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Batt: <strong className="text-white">{sensor.batteryPct}%</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px]">LoRa: <strong className="text-white">{sensor.signalDbm} dBm</strong></span>
          </div>

          <div className="text-[11px] text-slate-400">
            Ping: <span className="text-slate-200">{sensor.lastPing}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-[#18283E] flex items-center justify-between">
        <span className="text-[10px] font-mono-tech text-slate-400 font-medium">
          24 Sensor Nodes Online
        </span>
        <button
          onClick={() => setActiveTab('sensors')}
          className="text-xs font-mono-tech text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-semibold cursor-pointer"
        >
          <span>ALL SENSORS</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
