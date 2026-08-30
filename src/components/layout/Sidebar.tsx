import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Cpu, 
  Radio, 
  FileText, 
  BellRing, 
  ShieldAlert, 
  Settings,
  Mountain,
  Activity,
  Layers
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { NavigationTab } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, reports } = useDemo();

  const criticalAlertCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'NEW' || r.status === 'UNDER REVIEW').length;

  const navSections: Array<{
    title: string;
    items: Array<{
      id: NavigationTab;
      label: string;
      icon: React.ReactNode;
      badge?: number;
      badgeVariant?: 'critical' | 'cyan' | 'amber';
    }>;
  }> = [
    {
      title: 'MONITORING',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />
        },
        {
          id: 'risk-map',
          label: 'Risk Map (GIS)',
          icon: <Map className="w-4 h-4" />
        },
        {
          id: 'risk-analysis',
          label: 'Risk Analysis (AI)',
          icon: <Cpu className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'DATA INTELLIGENCE',
      items: [
        {
          id: 'sensors',
          label: 'Sensors Telemetry',
          icon: <Radio className="w-4 h-4" />
        },
        {
          id: 'reports',
          label: 'Field Recon Reports',
          icon: <FileText className="w-4 h-4" />,
          badge: pendingReportsCount,
          badgeVariant: 'cyan'
        }
      ]
    },
    {
      title: 'RESPONSE',
      items: [
        {
          id: 'alerts',
          label: 'Early Warnings',
          icon: <BellRing className="w-4 h-4" />,
          badge: criticalAlertCount,
          badgeVariant: 'critical'
        },
        {
          id: 'emergency',
          label: 'Emergency Action',
          icon: <ShieldAlert className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        {
          id: 'settings',
          label: 'System & Architecture',
          icon: <Settings className="w-4 h-4" />
        }
      ]
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#07111F] border-r border-[#18283E] flex flex-col justify-between h-screen sticky top-0 z-30 select-none shadow-2xl">
      {/* Brand Header */}
      <div>
        <div className="p-4 lg:p-5 border-b border-[#18283E] bg-[#07111F]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(0,212,255,0.4)] flex items-center justify-center text-[#040810] font-black text-xs">
              <Mountain className="w-4 h-4 text-[#040810]" />
            </div>
            <div>
              <span className="font-extrabold text-white tracking-wide text-base font-sans flex items-center gap-1">
                SLOPE <span className="text-cyan-400">SHIELD</span>
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono-tech tracking-wider font-semibold mt-1">
            AI EARLY WARNING & RISK GRID
          </p>

          <div className="mt-3 flex items-center justify-between px-2.5 py-1 rounded bg-[#0B1728] border border-[#18283E] text-[10px] font-mono-tech">
            <span className="text-slate-400">SIH PS 26001</span>
            <span className="text-teal-400 font-bold">TEAM NEXORA</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="py-3 px-2 space-y-4 overflow-y-auto max-h-[calc(100vh-215px)]">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 mb-1.5 text-[10px] uppercase tracking-widest text-slate-400 font-bold font-mono-tech">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer text-left group ${
                        isActive
                          ? 'bg-[#0E1D32] text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,212,255,0.1)] font-semibold'
                          : 'text-slate-400 hover:bg-[#0E1D32]/60 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                          {item.icon}
                        </span>
                        <span className="text-xs font-medium font-sans tracking-tight">{item.label}</span>
                      </div>

                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`ml-auto font-mono-tech text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm ${
                            item.badgeVariant === 'critical'
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-3.5 border-t border-[#18283E] bg-[#050912]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
            <span className="text-[10px] font-mono-tech text-emerald-400 tracking-wider font-bold">GRID ONLINE</span>
          </div>
          <span className="text-[9px] font-mono-tech text-slate-400">NER NODE 26°N</span>
        </div>
        <div className="text-[9px] text-slate-400 mt-1 font-mono-tech">
          Calibrated Simulation • Dual Mode
        </div>
      </div>
    </aside>
  );
};
