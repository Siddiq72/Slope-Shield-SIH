import React from 'react';
import { CloudRain, Droplets, TrendingUp, Compass, Wind, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDemo } from '../../context/DemoContext';
import { StatusIndicator } from '../ui/StatusIndicator';

export const RainfallIntelligence: React.FC = () => {
  const { weather, selectedZone } = useDemo();

  return (
    <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-5 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#18283E]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 font-sans uppercase tracking-widest font-mono-tech">
                RAINFALL INTELLIGENCE
              </h3>
              <p className="text-[11px] font-mono-tech text-slate-400">
                IMD Radar + Microclimate Gauge ({selectedZone.code})
              </p>
            </div>
          </div>

          <StatusIndicator status="ONLINE" isSimulated={true} />
        </div>

        {/* Hero Rate Metric */}
        <div className="my-3 grid grid-cols-3 gap-3">
          <div className="col-span-2 p-3.5 rounded-xl bg-[#07111F]/90 border border-[#18283E] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono-tech uppercase text-slate-400 tracking-wider block">
                PRECIPITATION INTENSITY
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold font-mono-tech text-cyan-300 tracking-tight">
                  {weather.rainfallRateMmHr}
                </span>
                <span className="text-xs font-mono-tech text-slate-400 uppercase font-semibold">
                  mm/hr
                </span>
              </div>
              <span className="inline-block mt-1 text-[10px] font-bold font-mono-tech px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                {weather.intensityLabel}
              </span>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] font-mono-tech text-slate-400 block uppercase">24H CUMULATIVE</span>
              <span className="text-lg font-bold font-mono-tech text-slate-100">
                {weather.accumulation24hMm} <span className="text-xs text-slate-400 font-normal">mm</span>
              </span>
              <span className="text-[10px] font-mono-tech text-rose-400 font-semibold flex items-center justify-end gap-0.5">
                <TrendingUp className="w-3 h-3" /> {weather.trend}
              </span>
            </div>
          </div>

          {/* Hydrologic Index Box */}
          <div className="p-3 rounded-xl bg-[#07111F]/90 border border-[#18283E] flex flex-col justify-between">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 block font-semibold">
              72H RUNOFF
            </span>
            <div className="text-xl font-bold font-mono-tech text-slate-100">
              {weather.accumulation72hMm} <span className="text-xs text-slate-400 font-normal">mm</span>
            </div>
            <div className="text-[10px] font-mono-tech text-teal-300 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-teal-400" />
              <span>{weather.humidityPct}% RH</span>
            </div>
          </div>
        </div>

        {/* Rainfall Hourly Forecast Chart */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400 mb-1">
            <span>6-HOUR HOURLY RAINFALL FORECAST</span>
            <span className="text-cyan-400 font-semibold">PROBABILITY 95%</span>
          </div>

          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weather.hourlyForecast} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} fontFamily="JetBrains Mono" />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1728', borderColor: '#264366', borderRadius: '8px', color: '#fff', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                />
                <Area type="monotone" dataKey="rate" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#rainGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#18283E] flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
        <span className="flex items-center gap-1 text-amber-400 font-semibold">
          <AlertCircle className="w-3.5 h-3.5" />
          Direct Inflow to PINN Risk Engine
        </span>
        <span className="text-slate-400">IMD Doppler Station AWS-07</span>
      </div>
    </div>
  );
};
