import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Sliders, 
  Cpu, 
  CheckCircle2, 
  Globe, 
  Radio, 
  Server, 
  CloudRain, 
  Activity, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Zap,
  Database
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/common/SectionHeader';
import { SimulationBadge } from '../../components/ui/Badge';
import { systemHealthApi } from '../../services/allApis';

export const SettingsPage: React.FC = () => {
  const [rainThreshold, setRainThreshold] = useState<number>(35);
  const [tiltThreshold, setTiltThreshold] = useState<number>(4.5);
  const [moistureThreshold, setMoistureThreshold] = useState<number>(70);
  const [porePressureThreshold, setPorePressureThreshold] = useState<number>(55);
  const [capPushAutoDispatch, setCapPushAutoDispatch] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  // System Health and Gateway Probing
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [probing, setProbing] = useState<boolean>(false);

  const fetchHealth = async () => {
    setProbing(true);
    try {
      const data = await systemHealthApi.getHealth();
      setHealthStatus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setProbing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Header */}
      <SectionHeader
        icon={<Settings className="w-4 h-4 text-cyan-400" />}
        title="SYSTEM CONFIGURATION & ARCHITECTURE REGISTRY"
        subtitle="Slope Shield Service Interfaces, Geomechanical Tripwires, and Local Simulation Providers"
        badge={<SimulationBadge />}
        actions={
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs font-mono-tech text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Parameters Saved
              </span>
            )}
            <Button
              onClick={fetchHealth}
              variant="secondary"
              size="sm"
              disabled={probing}
              loading={probing}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Probe Architecture
            </Button>
          </div>
        }
      />

      {/* Phase 3 Architecture Banner */}
      <div className="bg-[#0B1728] border border-cyan-500/30 rounded-xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 shadow-inner">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono-tech text-slate-100 uppercase tracking-wider">
              PHASE 3 ARCHITECTURE: PERSISTENT DATABASE & HISTORICAL EVENT REPOSITORY
            </h4>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Persistent storage layer (SQLite / local persistent document store) supporting historical AI risk progression, alert acknowledgements, field reconnaissance reports, and emergency priorities across restarts.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-500/30 font-bold whitespace-nowrap">
            DATABASE: ONLINE
          </span>
          <span className="text-[10px] font-mono-tech text-cyan-300 bg-cyan-950/50 px-2.5 py-1 rounded border border-cyan-500/30 font-bold whitespace-nowrap">
            SQLITE / LOCAL
          </span>
        </div>
      </div>

      {/* Service Interfaces Registry */}
      <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#18283E] pb-3">
          <h3 className="text-xs font-bold text-slate-100 font-sans uppercase tracking-widest font-mono-tech flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            MODULAR SERVICE INTERFACE REGISTRY
          </h3>
          <span className="text-[10px] font-mono-tech text-slate-400 bg-[#07111F] px-2.5 py-1 rounded border border-[#18283E]">
            NODE: {healthStatus?.node || 'Local Grid Node'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 font-mono-tech text-xs">
          {/* 1. Weather Service */}
          <div className="p-3.5 rounded-lg bg-[#07111F]/90 border border-[#18283E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                weatherService
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 font-bold">
                SIMULATED AWS
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-400 block font-semibold text-[10px]">INTERFACE:</span>
              <code className="text-cyan-300 font-mono-tech">WeatherProvider</code>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Provides monsoonal precipitation rate (mm/hr), 24h accumulation, and cloudburst alerts.
            </p>
          </div>

          {/* 2. Satellite InSAR Service */}
          <div className="p-3.5 rounded-lg bg-[#07111F]/90 border border-[#18283E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                satelliteService
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 font-bold">
                C-BAND SAR MODEL
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-400 block font-semibold text-[10px]">INTERFACE:</span>
              <code className="text-teal-300 font-mono-tech">SatelliteProvider</code>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Sentinel-1 Line-of-Sight surface creep displacement and interferometric coherence metrics.
            </p>
          </div>

          {/* 3. Notification Service */}
          <div className="p-3.5 rounded-lg bg-[#07111F]/90 border border-[#18283E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                notificationService
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 font-bold">
                CAP RELAY ACTIVE
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-400 block font-semibold text-[10px]">INTERFACE:</span>
              <code className="text-rose-400 font-mono-tech">NotificationProvider</code>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Common Alerting Protocol (CAP) and emergency SMS broadcast dispatcher with receipt tracking.
            </p>
          </div>

          {/* 4. GIS Map Service */}
          <div className="p-3.5 rounded-lg bg-[#07111F]/90 border border-[#18283E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                mapService
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 font-bold">
                OPEN CARTO TILES
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-400 block font-semibold text-[10px]">INTERFACE:</span>
              <code className="text-amber-400 font-mono-tech">MapProvider</code>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Provider-independent GIS tiles, Northeast India spatial bounding, and hazard isochrones.
            </p>
          </div>

          {/* 5. Geomechanical Engine */}
          <div className="p-3.5 rounded-lg bg-[#07111F]/90 border border-[#18283E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
                geomechanicalEngine
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 font-bold">
                PINN + SHAP
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-400 block font-semibold text-[10px]">ENGINE:</span>
              <code className="text-violet-300 font-mono-tech">Physics-Informed Model</code>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Multi-source sensor fusion, factor of safety, and explainable feature contributor weights.
            </p>
          </div>

          {/* 6. REST API Server Backend */}
          <div className="p-3.5 rounded-lg bg-[#07111F]/90 border border-[#18283E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                REST Server Backend
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 font-bold">
                ONLINE (REST v2.0)
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-400 block font-semibold text-[10px]">ARCHITECTURE:</span>
              <span className="text-slate-200 font-mono-tech">FastAPI & Express Service</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              21 typed endpoints with JSON schemas and CORS security.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Geotechnical Trigger Thresholds */}
        <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-100 font-sans uppercase tracking-widest font-mono-tech flex items-center gap-2 border-b border-[#18283E] pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            EARLY WARNING TRIGGER THRESHOLDS (NER HYPERLOCAL)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-tech">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Rainfall Rate Critical Tripwire (mm/hr)
              </label>
              <input
                type="number"
                value={rainThreshold}
                onChange={(e) => setRainThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-slate-100 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 35 mm/hr for High Vulnerability Slopes</span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                In-Situ Inclinometer Tilt Rate (°/hr)
              </label>
              <input
                type="number"
                step="0.1"
                value={tiltThreshold}
                onChange={(e) => setTiltThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-slate-100 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 4.5°/hr critical acceleration</span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Volumetric Soil Moisture Saturation (%)
              </label>
              <input
                type="number"
                value={moistureThreshold}
                onChange={(e) => setMoistureThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-slate-100 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 70% pore saturation limit</span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Pore Water Pressure Transducer (kPa)
              </label>
              <input
                type="number"
                value={porePressureThreshold}
                onChange={(e) => setPorePressureThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-slate-100 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 55 kPa hydrostatic head</span>
            </div>
          </div>
        </div>

        {/* Section 2: Spaceborne InSAR & AI Dispatch Parameters */}
        <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-100 font-sans uppercase tracking-widest font-mono-tech flex items-center gap-2 border-b border-[#18283E] pb-3">
            <Cpu className="w-4 h-4 text-violet-400" />
            DISPATCH & SATELLITE CADENCE PROTOCOLS
          </h3>

          <div className="space-y-3 text-xs font-mono-tech">
            <label className="flex items-center justify-between p-3 rounded-lg bg-[#07111F]/90 border border-[#18283E] cursor-pointer">
              <div>
                <span className="text-slate-200 font-bold block">Automated Common Alerting Protocol (CAP) Push Dispatch</span>
                <span className="text-[11px] text-slate-400 font-normal">Automatically queue warning payload to NDMA / DDMA relays when Risk Score &gt; 85%</span>
              </div>
              <input
                type="checkbox"
                checked={capPushAutoDispatch}
                onChange={(e) => setCapPushAutoDispatch(e.target.checked)}
                className="accent-cyan-400 h-4 w-4 rounded"
              />
            </label>

            <div className="p-3 rounded-lg bg-[#07111F]/90 border border-[#18283E] text-slate-400">
              <span className="text-[10px] uppercase block mb-1 font-bold text-slate-300">Spaceborne SAR Cadence</span>
              <span>Sentinel-1 (C-Band) 12-day orbital cycle integrated via ESA Copernicus Open Access Hub model with ISRO NRSC calibration.</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button type="submit" variant="primary" size="md" icon={<Save className="w-4 h-4" />}>
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};
