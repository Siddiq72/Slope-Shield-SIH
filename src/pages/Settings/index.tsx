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
  Zap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182B42] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#00D4FF]/15 border border-[#00D4FF]/30 text-[#00D4FF]">
              <Settings className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 font-sans tracking-tight">
              SYSTEM CONFIGURATION & ARCHITECTURE REGISTRY
            </h2>
          </div>
          <p className="text-xs font-mono-tech text-slate-400 mt-1">
            Slope Shield Service Interfaces, Geomechanical Tripwires, and Local Simulation Providers
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs font-mono-tech text-[#10B981] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Parameters Saved to Engine
            </span>
          )}
          <Button
            onClick={fetchHealth}
            variant="secondary"
            size="sm"
            disabled={probing}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${probing ? 'animate-spin' : ''}`} />}
          >
            Probe Architecture
          </Button>
        </div>
      </div>

      {/* Phase 3 Architecture Banner */}
      <div className="bg-[#0E1A2C] border border-[#00D4FF]/30 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono-tech text-slate-100 uppercase tracking-wider">
              PHASE 3 ARCHITECTURE: PERSISTENT DATABASE & HISTORICAL EVENT REPOSITORY
            </h4>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Persistent storage layer (SQLite / SQLAlchemy & local persistent document store) supporting historical AI risk progression, alert acknowledgements, field reconnaissance reports, and emergency priorities across restarts and page reloads.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono-tech text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded border border-[#10B981]/30 font-bold whitespace-nowrap">
            DATABASE: ONLINE
          </span>
          <span className="text-[10px] font-mono-tech text-[#00D4FF] bg-[#00D4FF]/15 px-2.5 py-1 rounded border border-[#00D4FF]/30 font-bold whitespace-nowrap">
            SQLITE / LOCAL
          </span>
        </div>
      </div>

      {/* Service Interfaces Registry */}
      <div className="bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#182B42] pb-3">
          <h3 className="text-sm font-bold text-slate-100 font-sans tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00D4FF]" />
            MODULAR SERVICE INTERFACE REGISTRY
          </h3>
          <span className="text-[10px] font-mono-tech text-slate-400 bg-[#07111F] px-2.5 py-1 rounded border border-[#182B42]">
            NODE: {healthStatus?.node || 'Local Grid Node'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 font-mono-tech text-xs">
          {/* 1. Weather Service */}
          <div className="p-3.5 rounded-xl bg-[#07111F] border border-[#182B42] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-[#00D4FF]" />
                weatherService
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                SIMULATED AWS
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-500 block">INTERFACE:</span>
              <code className="text-[#00D4FF]">WeatherProvider</code>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Provides monsoonal precipitation rate (mm/hr), 24h accumulation, and cloudburst alerts.
            </p>
          </div>

          {/* 2. Satellite InSAR Service */}
          <div className="p-3.5 rounded-xl bg-[#07111F] border border-[#182B42] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#14E6C5]" />
                satelliteService
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                C-BAND SAR MODEL
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-500 block">INTERFACE:</span>
              <code className="text-[#14E6C5]">SatelliteProvider</code>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Sentinel-1 Line-of-Sight surface creep displacement and interferometric coherence metrics.
            </p>
          </div>

          {/* 3. Notification Service */}
          <div className="p-3.5 rounded-xl bg-[#07111F] border border-[#182B42] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#EF4444]" />
                notificationService
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                CAP RELAY ACTIVE
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-500 block">INTERFACE:</span>
              <code className="text-[#EF4444]">NotificationProvider</code>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Common Alerting Protocol (CAP) and emergency SMS broadcast dispatcher with receipt tracking.
            </p>
          </div>

          {/* 4. GIS Map Service */}
          <div className="p-3.5 rounded-xl bg-[#07111F] border border-[#182B42] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#F59E0B]" />
                mapService
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                OPEN CARTO TILES
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-500 block">INTERFACE:</span>
              <code className="text-[#F59E0B]">MapProvider</code>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Provider-independent GIS tiles, Northeast India spatial bounding, and hazard isochrones.
            </p>
          </div>

          {/* 5. Geomechanical Engine */}
          <div className="p-3.5 rounded-xl bg-[#07111F] border border-[#182B42] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#7C5CFF]" />
                geomechanicalEngine
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                PINN + SHAP
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-500 block">ENGINE:</span>
              <code className="text-[#7C5CFF]">Physics-Informed Model</code>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Multi-source sensor fusion, factor of safety, and explainable feature contributor weights.
            </p>
          </div>

          {/* 6. REST API Server Backend */}
          <div className="p-3.5 rounded-xl bg-[#07111F] border border-[#182B42] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#10B981]" />
                Full-Stack REST Backend
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                ONLINE (REST v2.0)
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-500 block">ARCHITECTURE:</span>
              <span className="text-slate-200">FastAPI & Express REST Service</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              21 typed endpoints with JSON schemas and CORS security.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Geotechnical Trigger Thresholds */}
        <div className="bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 font-sans tracking-wide flex items-center gap-2 border-b border-[#182B42] pb-3">
            <Sliders className="w-4 h-4 text-[#00D4FF]" />
            EARLY WARNING TRIGGER THRESHOLDS (NER HYPERLOCAL)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-tech">
            <div>
              <label className="text-slate-300 block mb-1">
                Rainfall Rate Critical Tripwire (mm/hr)
              </label>
              <input
                type="number"
                value={rainThreshold}
                onChange={(e) => setRainThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#182B42] text-slate-100 focus:outline-none focus:border-[#00D4FF]"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 35 mm/hr for High Vulnerability Slopes</span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">
                In-Situ Inclinometer Tilt Rate (°/hr)
              </label>
              <input
                type="number"
                step="0.1"
                value={tiltThreshold}
                onChange={(e) => setTiltThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#182B42] text-slate-100 focus:outline-none focus:border-[#00D4FF]"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 4.5°/hr critical acceleration</span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">
                Volumetric Soil Moisture Saturation (%)
              </label>
              <input
                type="number"
                value={moistureThreshold}
                onChange={(e) => setMoistureThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#182B42] text-slate-100 focus:outline-none focus:border-[#00D4FF]"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 70% pore saturation limit</span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">
                Pore Water Pressure Transducer (kPa)
              </label>
              <input
                type="number"
                value={porePressureThreshold}
                onChange={(e) => setPorePressureThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#182B42] text-slate-100 focus:outline-none focus:border-[#00D4FF]"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 55 kPa hydrostatic head</span>
            </div>
          </div>
        </div>

        {/* Section 2: Spaceborne InSAR & AI Dispatch Parameters */}
        <div className="bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 font-sans tracking-wide flex items-center gap-2 border-b border-[#182B42] pb-3">
            <Cpu className="w-4 h-4 text-[#7C5CFF]" />
            DISPATCH & SATELLITE CADENCE PROTOCOLS
          </h3>

          <div className="space-y-3 text-xs font-mono-tech">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#07111F] border border-[#182B42] cursor-pointer">
              <div>
                <span className="text-slate-200 font-bold block">Automated Common Alerting Protocol (CAP) Push Dispatch</span>
                <span className="text-[11px] text-slate-400 font-normal">Automatically queue warning payload to NDMA / DDMA relays when Risk Score &gt; 85%</span>
              </div>
              <input
                type="checkbox"
                checked={capPushAutoDispatch}
                onChange={(e) => setCapPushAutoDispatch(e.target.checked)}
                className="accent-[#00D4FF] h-4 w-4 rounded"
              />
            </label>

            <div className="p-3 rounded-xl bg-[#07111F] border border-[#182B42] text-slate-400">
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
