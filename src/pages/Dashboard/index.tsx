import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Radio, 
  CloudRain, 
  Satellite, 
  Route, 
  AlertTriangle,
  Flame,
  ArrowUpRight,
  Sparkles,
  MapPin,
  TrendingUp,
  Layers,
  Info
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { SimulationBadge } from '../../components/ui/Badge';
import { GISMap } from '../../components/map/GISMap';
import { AIRiskEngine } from '../../components/risk/AIRiskEngine';
import { RiskDistribution } from '../../components/risk/RiskDistribution';
import { RainfallIntelligence } from '../../components/weather/RainfallIntelligence';
import { SensorTelemetryCard } from '../../components/sensors/SensorTelemetryCard';
import { InSARPanel } from '../../components/satellite/InSARPanel';
import { RoadConnectivityPanel } from '../../components/roads/RoadConnectivityPanel';
import { ActiveAlertsPanel } from '../../components/alerts/ActiveAlertsPanel';
import { ResponsePriorityPanel } from '../../components/emergency/ResponsePriorityPanel';
import { SectionHeader } from '../../components/common/SectionHeader';
import { DemoScenarioPanel } from '../../components/demo/DemoScenarioPanel';
import { EarlyWarningPanel } from '../../components/risk/EarlyWarningPanel';

export const DashboardPage: React.FC = () => {
  const { zones, alerts, selectedZone, setSelectedZoneCode, setActiveTab } = useDemo();

  const highRiskCount = zones.filter((z) => z.riskLevel === 'HIGH').length + 8;
  const criticalCount = zones.filter((z) => z.riskLevel === 'CRITICAL').length;
  const totalMonitored = 57;
  const activeAlertsCount = alerts.length + 3;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Regional Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0B1728] border border-[#1c2e47] rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0E1D32] border border-[#203550] flex items-center justify-center text-cyan-300 shadow-inner">
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100 font-sans tracking-tight uppercase">
                NORTHEAST INDIA OPERATIONAL COMMAND
              </h2>
              <SimulationBadge />
            </div>
            <p className="text-xs font-mono-tech text-slate-400 mt-0.5">
              Multi-source data fusion: InSAR surface displacement + Geotechnical ground sensors + Doppler rainfall radar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-tech text-slate-400">Target Focus:</span>
          <span className="px-2.5 py-1 rounded bg-[#0E1D32] border border-cyan-500/40 text-cyan-300 font-mono-tech text-xs font-bold shadow-sm">
            {selectedZone.name} ({selectedZone.code})
          </span>
        </div>
      </div>

      {/* Demo Scenario Control Panel */}
      <DemoScenarioPanel />

      {/* Early Warning Intelligence Panel */}
      <EarlyWarningPanel />

      {/* 4 Big KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          label="MONITORED ZONES"
          value={totalMonitored}
          sublabel="57 NER Nodes active"
          riskHighlight="CYAN"
          icon={<Layers className="w-4 h-4 text-cyan-400" />}
        />

        <MetricCard
          label="MODERATE / HIGH"
          value={highRiskCount}
          sublabel="Rainfall saturation > 65%"
          riskHighlight="HIGH"
          trend="up"
          trendValue="+2 in 6h"
          icon={<AlertTriangle className="w-4 h-4 text-orange-400" />}
        />

        <MetricCard
          label="CRITICAL THREAT"
          value={criticalCount < 10 ? `0${criticalCount}` : criticalCount}
          sublabel="InSAR + IoT shear failure"
          riskHighlight="CRITICAL"
          trend="up"
          trendValue="ELEVATED"
          icon={<Flame className="w-4 h-4 text-rose-500" />}
        />

        <MetricCard
          label="EARLY WARNINGS"
          value={activeAlertsCount < 10 ? `0${activeAlertsCount}` : activeAlertsCount}
          sublabel="DDMA automated relays"
          riskHighlight="VIOLET"
          icon={<Activity className="w-4 h-4 text-violet-400" />}
          onClick={() => setActiveTab('alerts')}
        />
      </div>

      {/* Hero GIS Map Theater */}
      <div className="space-y-2.5">
        <SectionHeader
          icon={<MapPin className="w-4 h-4" />}
          title="GEOSPATIAL RISK THEATER (NER REGION)"
          subtitle="Click any zone marker to inspect telemetry and trigger explainable AI models"
          badge={
            <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
              INTERACTIVE GIS
            </span>
          }
        />

        <div className="rounded-xl border border-[#1c2e47] overflow-hidden shadow-2xl">
          <GISMap
            heightClass="h-[480px] lg:h-[540px]"
            selectedZoneCode={selectedZone.code}
            onSelectZone={(zone) => setSelectedZoneCode(zone.code)}
            onViewAnalysis={() => setActiveTab('risk-analysis')}
          />
        </div>
      </div>

      {/* Row 1: AI Risk Engine + Regional Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AIRiskEngine
          zone={selectedZone}
          onOpenAnalysis={() => setActiveTab('risk-analysis')}
        />
        <RiskDistribution />
      </div>

      {/* Row 2: Weather Intelligence + Sensor Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RainfallIntelligence />
        <SensorTelemetryCard />
      </div>

      {/* Row 3: Satellite / InSAR + Road Connectivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InSARPanel />
        <RoadConnectivityPanel />
      </div>

      {/* Row 4: Active Alerts Panel */}
      <div>
        <ActiveAlertsPanel />
      </div>

      {/* Row 5: Emergency Response Priority Queue */}
      <div>
        <ResponsePriorityPanel />
      </div>
    </div>
  );
};
