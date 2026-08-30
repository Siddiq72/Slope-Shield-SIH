import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldCheck, AlertCircle, AlertTriangle, Flame, Layers } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const RiskDistribution: React.FC = () => {
  const { zones } = useDemo();

  // Aggregate distribution
  const critical = zones.filter((z) => z.riskLevel === 'CRITICAL').length;
  const high = zones.filter((z) => z.riskLevel === 'HIGH').length;
  const moderate = zones.filter((z) => z.riskLevel === 'MODERATE').length;
  const low = zones.filter((z) => z.riskLevel === 'LOW').length;

  const data = [
    { level: 'LOW', count: low + 15, color: '#10B981', label: 'Low (0-40)' },
    { level: 'MOD', count: moderate + 20, color: '#F59E0B', label: 'Mod (41-70)' },
    { level: 'HIGH', count: high + 8, color: '#F97316', label: 'High (71-85)' },
    { level: 'CRIT', count: critical, color: '#EF4444', label: 'Crit (86-100)' }
  ];

  return (
    <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-5 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#18283E]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-xs font-bold text-slate-100 font-sans uppercase tracking-widest font-mono-tech">
                REGIONAL RISK DISTRIBUTION
              </h3>
              <p className="text-[11px] font-mono-tech text-slate-400">
                57 Monitored Slopes across 8 NER States
              </p>
            </div>
          </div>
          <span className="text-xs font-mono-tech text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
            57 TOTAL
          </span>
        </div>

        {/* 4 Summary Stat Pills */}
        <div className="grid grid-cols-4 gap-2 my-4">
          <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-center">
            <span className="text-[10px] font-mono-tech text-slate-400 block">LOW</span>
            <span className="text-lg font-bold font-mono-tech text-emerald-400">{low + 15}</span>
          </div>

          <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 text-center">
            <span className="text-[10px] font-mono-tech text-slate-400 block">MOD</span>
            <span className="text-lg font-bold font-mono-tech text-amber-400">{moderate + 20}</span>
          </div>

          <div className="p-2 rounded-lg bg-orange-950/30 border border-orange-500/30 text-center">
            <span className="text-[10px] font-mono-tech text-slate-400 block">HIGH</span>
            <span className="text-lg font-bold font-mono-tech text-orange-400">{high + 8}</span>
          </div>

          <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/40 text-center shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <span className="text-[10px] font-mono-tech text-slate-400 block">CRIT</span>
            <span className="text-lg font-bold font-mono-tech text-rose-400 animate-pulse">{critical}</span>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-40 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="level" stroke="#64748b" fontSize={11} tickLine={false} fontFamily="JetBrains Mono" />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} fontFamily="JetBrains Mono" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B1728', borderColor: '#264366', borderRadius: '8px', color: '#fff', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#18283E] flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
        <span>GSI Susceptibility Mapping Reference</span>
        <span className="text-teal-300 font-semibold">Calibrated Stream</span>
      </div>
    </div>
  );
};
