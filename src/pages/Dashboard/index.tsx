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
  Layers
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { GISMap } from '../../components/map/GISMap';
import { AIRiskEngine } from '../../components/risk/AIRiskEngine';
import { RiskDistribution } from '../../components/risk/RiskDistribution';
import { RainfallIntelligence } from '../../components/weather/RainfallIntelligence';
import { SensorTelemetryCard } from '../../components/sensors/SensorTelemetryCard';
import { InSARPanel } from '../../components/satellite/InSARPanel';
import { RoadConnectivityPanel } from '../../components/roads/RoadConnectivityPanel';
import { ActiveAlertsPanel } from '../../components/alerts/ActiveAlertsPanel';
import { ResponsePriorityPanel } from '../../components/emergency/ResponsePriorityPanel';

export const DashboardPage: React.FC = () => {
  const { zones, alerts, selectedZone, setSelectedZoneCode, setActiveTab } = useDemo();

  const highRiskCount = zones.filter((z) => z.riskLevel === 'HIGH').length + 8;
  const criticalCount = zones.filter((z) => z.riskLevel === 'CRITICAL').length;
  const totalMonitored = 57;
  const activeAlertsCount = alerts.length + 3;

  return (
    <div className="space-y-5 pb-12">
      {/* Viewport Top Header & KPI Strip */}
      <div className="space-y-3">
        {/* 4 Big KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="MONITORED ZONES"
            value={totalMonitored}
            sublabel="57 NER Nodes active"
            riskHighlight="CYAN"
            icon={<Layers className="w-4 h-4 text-[#00D4FF]" />}
          />

          <MetricCard
            label="MODERATE / HIGH"
            value={highRiskCount}
            sublabel="Rainfall saturation > 65%"
            riskHighlight="HIGH"
            trend="up"
            trendValue="+2 in 6h"
            icon={<AlertTriangle className="w-4 h-4 text-[#F97316]" />}
          />

          <MetricCard
            label="CRITICAL THREAT"
            value={criticalCount < 10 ? `0${criticalCount}` : criticalCount}
            sublabel="InSAR + IoT shear failure"
            riskHighlight="CRITICAL"
            trend="up"
            trendValue="ELEVATED"
            icon={<Flame className="w-4 h-4 text-[#EF4444]" />}
          />

          <MetricCard
            label="EARLY WARNINGS"
            value={activeAlertsCount < 10 ? `0${activeAlertsCount}` : activeAlertsCount}
            sublabel="DDMA automated relays"
            riskHighlight="VIOLET"
            icon={<Activity className="w-4 h-4 text-[#7C5CFF]" />}
            onClick={() => setActiveTab('alerts')}
          />
        </div>
      </div>

      {/* Hero GIS Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              NORTHEAST INDIA GIS RISK THEATER
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Click any zone marker to inspect telemetry & trigger AI analysis
          </span>
        </div>

        <div className="rounded border border-[#1e293b] overflow-hidden shadow-2xl">
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
