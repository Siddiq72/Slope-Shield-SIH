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
  Activity,
  Layers,
  Sparkles,
  Mountain
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
          label: 'Field Reports',
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
          label: 'Model & Thresholds',
          icon: <Settings className="w-4 h-4" />
        }
      ]
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#07111F] border-r border-[#182B42] flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#182B42] bg-[#07111F]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#00D4FF] rounded-md shadow-[0_0_10px_rgba(0,212,255,0.4)] flex items-center justify-center text-[#050912] font-extrabold text-[11px]">
              ▲
            </div>
            <div>
              <span className="font-bold text-white tracking-wider text-base font-sans">
                SLOPE SHIELD
              </span>
            </div>
          </div>
          <p className="text-[10px] text-[#00D4FF] font-mono-tech tracking-wider font-semibold mt-1">
            AI LANDSLIDE WARNING SYSTEM
          </p>

          <div className="mt-3 flex items-center justify-between px-2.5 py-1 rounded-lg bg-[#0E1A2C] border border-[#182B42] text-[10px] font-mono-tech text-slate-400">
            <span>SIH PS 26001</span>
            <span className="text-[#14E6C5] font-semibold">TEAM NEXORA</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="py-4 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)]">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-4 mb-2 text-[10px] uppercase tracking-widest text-slate-500 font-semibold font-mono-tech">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-2 text-xs transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-[#101D2E] text-[#00D4FF] border-r-2 border-[#00D4FF] font-medium'
                          : 'text-slate-400 hover:bg-[#101D2E]/60 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-[#00D4FF]' : 'text-slate-400'}>
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium font-sans">{item.label}</span>
                      </div>

                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`ml-auto font-mono-tech text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            item.badgeVariant === 'critical'
                              ? 'bg-[#EF4444] text-white animate-pulse'
                              : 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40'
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
      <div className="p-4 border-t border-[#182B42] bg-[#050912]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
          <span className="text-[10px] font-mono-tech text-[#10B981] tracking-tighter font-semibold">SYSTEM OPERATIONAL</span>
        </div>
        <div className="text-[9px] text-slate-500 mt-1 font-mono-tech uppercase">
          Northeast India Node v2.4.1
        </div>
      </div>
    </aside>
  );
};
