import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Home, 
  Truck, 
  PhoneCall, 
  MapPin, 
  CheckCircle, 
  Route, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Radio, 
  Send, 
  AlertTriangle, 
  Layers, 
  Activity, 
  FileCheck, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Filter, 
  Navigation, 
  Compass,
  X
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { RiskBadge, SimulationBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/common/SectionHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { notificationService, AlertDispatchPayload, DispatchReceipt } from '../../services/notificationService';
import { EmergencyPriority } from '../../types';

export const EmergencyPage: React.FC = () => {
  const { emergencyPriorities, selectedZoneCode, setSelectedZoneCode, setActiveTab } = useDemo();
  const [activeTabSub, setActiveTabSub] = useState<'PRIORITIES' | 'SHELTERS' | 'DETOURS' | 'BROADCAST'>('PRIORITIES');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE'>('ALL');
  
  // CAP Broadcast Dispatch Modal State
  const [selectedForBroadcast, setSelectedForBroadcast] = useState<EmergencyPriority | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [broadcastChannels, setBroadcastChannels] = useState<('SMS' | 'CAP_XML' | 'SIREN' | 'WHATSAPP')[]>(['SMS', 'CAP_XML', 'SIREN']);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchReceipt, setDispatchReceipt] = useState<DispatchReceipt | null>(null);

  // Filtered priority list
  const filteredPriorities = emergencyPriorities.filter((item) => {
    const matchesSearch = 
      item.zoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.zoneCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.affectedRoads && item.affectedRoads.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  // Calculate high-level command statistics
  const totalPopulationAtRisk = emergencyPriorities.reduce((acc, p) => acc + (p.estimatedPeopleAffected || 0), 0);
  const criticalCount = emergencyPriorities.filter((p) => p.severity === 'CRITICAL').length;
  const highCount = emergencyPriorities.filter((p) => p.severity === 'HIGH').length;

  // Open broadcast modal with prefilled data
  const handleOpenBroadcastModal = (item: EmergencyPriority) => {
    setSelectedForBroadcast(item);
    setDispatchReceipt(null);
    setBroadcastMessage(
      `[EMERGENCY WARNING - DDMA] Landslide Threat at ${item.zoneName} (${item.zoneCode}). Severe risk score: ${item.riskScore}/100. ${item.recommendedResponse || item.primaryAction}. Evacuate immediately to designated relief centers. Dial 1077 for assistance.`
    );
  };

  const handleExecuteDispatch = async () => {
    if (!selectedForBroadcast) return;
    setIsDispatching(true);
    try {
      const payload: AlertDispatchPayload = {
        recipient: 'DDMA Incident Command & Citizen Roster',
        message: broadcastMessage,
        alertLevel: selectedForBroadcast.severity as any,
        zoneCode: selectedForBroadcast.zoneCode,
        channels: broadcastChannels
      };
      const receipt = await notificationService.dispatchAlert(payload);
      setDispatchReceipt(receipt);
    } catch (e) {
      console.error('Dispatch error:', e);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <SectionHeader
        icon={<ShieldAlert className="w-4 h-4 text-rose-500" />}
        title="EMERGENCY RESPONSE & DECISION SUPPORT"
        subtitle="Simulated Decision-Support Matrix for DDMA, SDRF, NDRF, and District Emergency Operations"
        badge={<SimulationBadge />}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveTab('risk-map')}
              variant="secondary"
              size="sm"
              icon={<Navigation className="w-3.5 h-3.5 text-cyan-400" />}
            >
              GIS Corridors
            </Button>
            <Button
              onClick={() => setActiveTab('risk-analysis')}
              variant="ai"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              AI Briefing
            </Button>
          </div>
        }
      />

      {/* Decision-Support Operational Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#0B1728] border border-rose-500/40 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 font-bold">Priority 1 Threat</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-xl font-extrabold text-rose-400 font-mono-tech mt-1">
            CRITICAL ({criticalCount} Sectors)
          </div>
          <span className="text-[10px] text-slate-400 font-sans mt-0.5 block">
            Immediate field deployment required
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0B1728] border border-[#1c2e47] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 font-bold">Population at Risk</span>
            <Users className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-xl font-extrabold text-slate-100 font-mono-tech mt-1">
            {totalPopulationAtRisk.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-sans mt-0.5 block">
            Across 4 priority hazard zones
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0B1728] border border-[#1c2e47] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 font-bold">Evacuation Shelters</span>
            <Home className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-cyan-300 font-mono-tech mt-1">
            9 Active Hubs
          </div>
          <span className="text-[10px] text-slate-400 font-sans mt-0.5 block">
            Capacity: 4,450 / Occupied: 1,030
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0B1728] border border-[#1c2e47] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 font-bold">Corridors Guarded</span>
            <Truck className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-xl font-extrabold text-orange-400 font-mono-tech mt-1">
            NH-54, NH-06, NH-10
          </div>
          <span className="text-[10px] text-slate-400 font-sans mt-0.5 block">
            BRO & SDRF Road Units active
          </span>
        </div>
      </div>

      {/* Navigation Tabs & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#18283E] pb-3">
        <div className="flex items-center gap-2 font-mono-tech text-xs flex-wrap">
          <button
            onClick={() => setActiveTabSub('PRIORITIES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTabSub === 'PRIORITIES'
                ? 'bg-cyan-400 text-[#040810] shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                : 'bg-[#0E1D32] text-slate-300 hover:text-white border border-[#18283E]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            RESPONSE PRIORITIES ({filteredPriorities.length})
          </button>

          <button
            onClick={() => setActiveTabSub('SHELTERS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTabSub === 'SHELTERS'
                ? 'bg-cyan-400 text-[#040810] shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                : 'bg-[#0E1D32] text-slate-300 hover:text-white border border-[#18283E]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            RELIEF SHELTERS (DEMO)
          </button>

          <button
            onClick={() => setActiveTabSub('DETOURS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTabSub === 'DETOURS'
                ? 'bg-cyan-400 text-[#040810] shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                : 'bg-[#0E1D32] text-slate-300 hover:text-white border border-[#18283E]'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            ROAD DETOURS (SIMULATED)
          </button>

          <button
            onClick={() => setActiveTabSub('BROADCAST')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTabSub === 'BROADCAST'
                ? 'bg-cyan-400 text-[#040810] shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                : 'bg-[#0E1D32] text-slate-300 hover:text-white border border-[#18283E]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            CAP BROADCAST (SIMULATOR)
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sector, zone, highway..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#07111F] border border-[#18283E] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-60 font-mono-tech font-sans"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#07111F] border border-[#18283E] rounded-lg p-0.5 text-[11px] font-mono-tech">
            {(['ALL', 'CRITICAL', 'HIGH'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSeverityFilter(lvl)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  severityFilter === lvl
                    ? 'bg-[#0E1D32] text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW 1: RESPONSE PRIORITIES MATRIX */}
      {activeTabSub === 'PRIORITIES' && (
        <div className="space-y-4">
          {filteredPriorities.map((item) => {
            const isRank1 = item.rank === 1;
            return (
              <div
                key={item.rank}
                className={`p-5 rounded-xl bg-[#0B1728] border transition-all space-y-4 shadow-xl relative overflow-hidden ${
                  isRank1
                    ? 'border-rose-500/60 shadow-[0_0_25px_rgba(239,68,68,0.18)] ring-1 ring-rose-500/30'
                    : 'border-[#1c2e47] hover:border-[#2b496e]'
                }`}
              >
                {/* Top Banner with Rank, Location, Risk Score */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#18283E]">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono-tech font-extrabold text-base flex-shrink-0 shadow-md ${
                      isRank1
                        ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                        : item.severity === 'CRITICAL'
                        ? 'bg-rose-950/60 border border-rose-500/50 text-rose-400'
                        : 'bg-orange-950/60 border border-orange-500/50 text-orange-400'
                    }`}>
                      #{item.rank}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-100 font-sans tracking-tight">
                          PRIORITY {item.rank}: {item.zoneName}
                        </h3>
                        <span className="text-xs font-mono-tech px-2 py-0.5 rounded bg-[#07111F] text-cyan-300 border border-[#18283E] font-semibold">
                          ZONE {item.zoneCode}
                        </span>
                        <RiskBadge level={item.severity} size="sm" />
                      </div>
                      <p className="text-xs font-mono-tech text-slate-400 mt-0.5 flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.district}{item.state ? `, ${item.state}` : ''}</span>
                        <span className="text-slate-600">•</span>
                        <span>{item.targetDDMA}</span>
                      </p>
                    </div>
                  </div>

                  {/* Risk Score & People Impact */}
                  <div className="flex items-center gap-4 text-xs font-mono-tech flex-wrap bg-[#07111F]/90 px-3.5 py-2 rounded-lg border border-[#18283E]">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">RISK SCORE</span>
                      <span className={`text-base font-extrabold ${
                        item.riskScore >= 90 ? 'text-rose-400' : 'text-orange-400'
                      }`}>
                        {item.riskScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                      </span>
                    </div>

                    <div className="h-7 w-[1px] bg-[#18283E]" />

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">POPULATION AT RISK</span>
                      <span className="text-sm font-bold text-teal-300">
                        {(item.estimatedPeopleAffected || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="h-7 w-[1px] bg-[#18283E]" />

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">DISPATCH STATUS</span>
                      <span className="text-xs font-semibold text-slate-200">
                        {item.status || item.evacuationStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Core Reason & Recommended Action Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                  {/* HAZARD TRIGGER & DANGER MECHANISM */}
                  <div className="p-3.5 rounded-lg bg-[#07111F]/90 border border-[#18283E] space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono-tech font-bold text-rose-400 uppercase tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      HAZARD TRIGGER & DANGER MECHANISM
                    </div>
                    <p className="text-xs text-slate-200 font-sans leading-relaxed">
                      <strong>Reason:</strong> {item.reason || item.actionDetails}
                    </p>

                    {/* Contributing Factors Pills */}
                    {item.contributingFactors && item.contributingFactors.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] font-mono-tech text-slate-400 block mb-1.5 uppercase font-semibold">
                          Contributing Geotechnical Factors:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.contributingFactors.map((factor, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#0E1D32] text-slate-300 border border-[#18283E]"
                            >
                              • {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* WHAT ACTION IS RECOMMENDED */}
                  <div className="p-3.5 rounded-lg bg-[#07111F]/90 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono-tech font-bold text-cyan-300 uppercase tracking-wider">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      RECOMMENDED RESPONSE DIRECTIVE
                    </div>
                    <div className="text-xs font-bold text-cyan-300 font-mono-tech">
                      {item.recommendedResponse || item.primaryAction}
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {item.actionDetails}
                    </p>

                    {/* Affected Infrastructure & Settlements */}
                    <div className="pt-1 border-t border-[#18283E] text-[11px] font-mono-tech text-slate-300 space-y-1">
                      {item.affectedRoads && (
                        <div>
                          <span className="text-slate-400 uppercase text-[10px]">AFFECTED ROAD: </span>
                          <span className="text-orange-400 font-semibold">{item.affectedRoads}</span>
                        </div>
                      )}
                      {item.affectedSettlements && (
                        <div>
                          <span className="text-slate-400 uppercase text-[10px]">AFFECTED SETTLEMENTS: </span>
                          <span className="text-slate-200">{item.affectedSettlements}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Evacuation Centers, Assigned Responders, Road Closure Ribbon */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono-tech">
                  <div className="p-3 rounded-lg bg-[#07111F]/90 border border-[#18283E]">
                    <span className="text-slate-400 block text-[10px] uppercase flex items-center gap-1 font-semibold">
                      <Home className="w-3 h-3 text-cyan-400" />
                      DESIGNATED RELIEF CENTERS
                    </span>
                    <span className="font-semibold text-slate-200 mt-1 block">
                      {item.evacuationShelters && item.evacuationShelters.length > 0
                        ? item.evacuationShelters.join(' • ')
                        : 'Shelters on standby at DDMA nodal hub'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#07111F]/90 border border-[#18283E]">
                    <span className="text-slate-400 block text-[10px] uppercase flex items-center gap-1 font-semibold">
                      <Users className="w-3 h-3 text-teal-400" />
                      DISPATCHED UNITS & NDRF
                    </span>
                    <span className="font-semibold text-teal-300 mt-1 block">
                      {item.assignedUnits && item.assignedUnits.length > 0
                        ? item.assignedUnits.join(' • ')
                        : item.ndrfBattalionAssigned}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#07111F]/90 border border-[#18283E]">
                    <span className="text-slate-400 block text-[10px] uppercase flex items-center gap-1 font-semibold">
                      <Truck className="w-3 h-3 text-orange-400" />
                      HIGHWAY TRANSIT REGULATION
                    </span>
                    <span className="font-semibold text-orange-400 mt-1 block">
                      {item.roadClosureStatus || 'Escort Convoy Protocol Active'}
                    </span>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-[#18283E] flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleOpenBroadcastModal(item)}
                      variant="primary"
                      size="sm"
                      icon={<Radio className="w-3.5 h-3.5" />}
                    >
                      Broadcast CAP SMS Alert
                    </Button>

                    <Button
                      onClick={() => {
                        setSelectedZoneCode(item.zoneCode);
                        setActiveTab('risk-map');
                      }}
                      variant="secondary"
                      size="sm"
                      icon={<Compass className="w-3.5 h-3.5" />}
                    >
                      View on GIS Map
                    </Button>
                  </div>

                  <div className="text-[11px] font-mono-tech text-slate-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Shelter Capacity Ready</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPriorities.length === 0 && (
            <EmptyState
              title="No Priority Corridors Match Query"
              description="Try adjusting your search terms or severity filter."
            />
          )}
        </div>
      )}

      {/* VIEW 2: RELIEF SHELTERS & NDRF DEPLOYMENT */}
      {activeTabSub === 'SHELTERS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Hunthar Community Hall & Higher Secondary',
                zone: 'Zone N-07 (Aizawl West)',
                state: 'Mizoram',
                capacity: 600,
                occupied: 320,
                contact: '+91 94361-22891 (Nodal Officer)',
                medicalStaff: '03 Doctors, 08 Nurses (Civil Hospital Detachment)',
                supplies: '72-Hour Ration, Water Purifiers, 2x Standby DG Gensets',
                status: 'ACTIVE & ACCEPTING CITIZENS'
              },
              {
                name: 'Sonapur High School & Tourist Lodge Hub',
                zone: 'Zone S-12 (East Jaintia Hills)',
                state: 'Meghalaya',
                capacity: 450,
                occupied: 180,
                contact: '+91 94363-11029 (Khliehriat SDMA)',
                medicalStaff: '02 Doctors, 04 SDRF Paramilitary Medics',
                supplies: 'Emergency Trauma Kits, Heavy Dewatering Pumps',
                status: 'ACTIVE & ACCEPTING CITIZENS'
              },
              {
                name: 'Jatinga Multi-Purpose Cyclone & Disaster Shelter',
                zone: 'Zone DH-03 (Dima Hasao)',
                state: 'Assam',
                capacity: 800,
                occupied: 120,
                contact: '+91 94350-98711 (DDMA Haflong)',
                medicalStaff: '04 Doctors, 10 Volunteers (Indian Red Cross)',
                supplies: 'Blankets, Infant Nutrition Kits, Satellite Comm Terminal',
                status: 'ACTIVE & ACCEPTING CITIZENS'
              },
              {
                name: 'Singtam Indoor Stadium Evacuation Hub',
                zone: 'Zone G-04 (Singtam / East Sikkim)',
                state: 'Sikkim',
                capacity: 1200,
                occupied: 410,
                contact: '+91 94340-44912 (SDMA Gangtok)',
                medicalStaff: '06 Doctors, Army Mobile Medical Corps Detachment',
                supplies: 'High-Altitude Warming Gear, Oxygen Concentrators',
                status: 'ACTIVE & ACCEPTING CITIZENS'
              },
            ].map((sh, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-[#0B1728] border border-[#1c2e47] space-y-3.5 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 font-sans">{sh.name}</h4>
                    <p className="text-xs font-mono-tech text-slate-400">{sh.zone} • {sh.state}</p>
                  </div>
                  <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/40 font-bold">
                    {sh.status}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-tech">
                    <span className="text-slate-400">Capacity Occupancy</span>
                    <span className="text-slate-200 font-bold">
                      {sh.occupied} / {sh.capacity} persons ({Math.round((sh.occupied / sh.capacity) * 100)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#07111F] rounded-full overflow-hidden border border-[#18283E]">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 shadow-[0_0_8px_#00D4FF]"
                      style={{ width: `${(sh.occupied / sh.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs font-mono-tech text-slate-300 space-y-1 pt-1 bg-[#07111F]/90 p-2.5 rounded-lg border border-[#18283E]">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px]">Medical: </span>
                    <span className="text-teal-300 font-medium">{sh.medicalStaff}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px]">Supplies: </span>
                    <span className="text-slate-300 font-medium">{sh.supplies}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#18283E] text-xs font-mono-tech text-slate-400 flex items-center justify-between">
                  <span>Emergency Helpline: <strong className="text-slate-200">{sh.contact}</strong></span>
                  <span className="text-[10px] text-cyan-300 font-semibold">NDRF Verified Hub</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: ROAD DETOURS & PWD CORRIDORS */}
      {activeTabSub === 'DETOURS' && (
        <div className="space-y-3">
          {[
            {
              corridor: 'NH-54 Aizawl Bypass (Hunthar Scarp Reach)',
              state: 'Mizoram',
              status: 'HAZARDOUS — PILOT ESCORT ONLY',
              statusVariant: 'orange',
              detour: 'Route all heavy transport trucks via Sairang — Tanhril Western Valley Link.',
              etaIncrease: '+45 mins',
              machineryStationed: '2x PWD Excavators, 1x Wheel Loader on 15-min standby at Bawngkawn junction.'
            },
            {
              corridor: 'NH-06 / NH-44 Sonapur Tunnel Approach',
              state: 'Meghalaya',
              status: 'BLOCKED TO HEAVY VEHICLES',
              statusVariant: 'red',
              detour: 'Divert freight through Shillong — Nongstoin — Tura alternate lifeline highway.',
              etaIncrease: '+3.5 hours',
              machineryStationed: 'BRO Task Force 44 (2x Hydraulic Excavators + 3x 100HP Dewatering Pumps).'
            },
            {
              corridor: 'NH-10 Sevoke — Gangtok Highway (9th Mile)',
              state: 'Sikkim / West Bengal',
              status: 'RESTRICTED SINGLE-LANE',
              statusVariant: 'amber',
              detour: 'Light passenger convoy via Lava — Pedong — Reshi — Rhenock alternate ridge road.',
              etaIncrease: '+1.5 hours',
              machineryStationed: 'Project Swastik Dozer deployed at 20th Mile clearing chute.'
            },
            {
              corridor: 'NH-27 Lumding — Haflong Mountain Highway',
              state: 'Assam',
              status: 'UNDER ACTIVE RECONNAISSANCE',
              statusVariant: 'amber',
              detour: 'Divert south-bound cargo via Silchar — Badarpur loop road.',
              etaIncrease: '+2.0 hours',
              machineryStationed: 'Assam PWD Road Maintenance Squad on active patrol.'
            }
          ].map((d, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#0B1728] border border-[#1c2e47] flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs font-mono-tech shadow-xl"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-100 text-sm font-sans">{d.corridor}</span>
                  <span className="text-[10px] text-slate-400 bg-[#07111F] px-2 py-0.5 rounded border border-[#18283E]">{d.state}</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    d.statusVariant === 'red'
                      ? 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                      : d.statusVariant === 'orange'
                      ? 'bg-orange-950/60 text-orange-400 border border-orange-500/40'
                      : 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                  }`}>
                    {d.status}
                  </span>
                </div>

                <p className="text-slate-300 font-sans text-xs">
                  <strong className="text-slate-200">Recommended Detour:</strong> {d.detour}
                </p>

                <p className="text-slate-400 text-[11px]">
                  <strong className="text-slate-300">Machinery Deployment:</strong> {d.machineryStationed}
                </p>
              </div>

              <div className="lg:text-right flex-shrink-0 bg-[#07111F]/90 p-3 rounded-lg border border-[#18283E]">
                <span className="text-slate-400 uppercase text-[10px] block font-semibold">ETA IMPACT</span>
                <span className="text-orange-400 font-bold text-base">{d.etaIncrease}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 4: CAP BROADCAST CONSOLE */}
      {activeTabSub === 'BROADCAST' && (
        <div className="p-6 rounded-xl bg-[#0B1728] border border-[#1c2e47] shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#18283E] pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-sans tracking-wide flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-500" />
                COMMON ALERTING PROTOCOL (CAP) BROADCAST SIMULATOR
              </h3>
              <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
                Simulated multi-channel emergency broadcast demo for testing protocol payload generation across SMS, Siren, and CAP-XML. (No live telco or agency gateways connected).
              </p>
            </div>
            <SimulationBadge label="SIMULATED GATEWAY" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Quick Dispatch form */}
            <div className="space-y-4 font-mono-tech text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-bold">Target Zone Sector</label>
                <select
                  value={selectedForBroadcast?.zoneCode || 'N-07'}
                  onChange={(e) => {
                    const found = emergencyPriorities.find((p) => p.zoneCode === e.target.value);
                    if (found) handleOpenBroadcastModal(found);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {emergencyPriorities.map((p) => (
                    <option key={p.zoneCode} value={p.zoneCode}>
                      #{p.rank} - {p.zoneName} ({p.zoneCode}) - Risk {p.riskScore}%
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Broadcast Channels</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['SMS', 'CAP_XML', 'SIREN', 'WHATSAPP'] as const).map((ch) => (
                    <label key={ch} className="flex items-center gap-2 p-2 rounded-lg bg-[#07111F] border border-[#18283E] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={broadcastChannels.includes(ch)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBroadcastChannels([...broadcastChannels, ch]);
                          } else {
                            setBroadcastChannels(broadcastChannels.filter((c) => c !== ch));
                          }
                        }}
                        className="accent-cyan-400"
                      />
                      <span className="text-slate-200 font-bold">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">CAP SMS Alert Message Payload</label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-slate-100 focus:outline-none focus:border-cyan-400 font-sans text-xs"
                />
              </div>

              <Button
                onClick={handleExecuteDispatch}
                variant="primary"
                size="md"
                disabled={isDispatching || !selectedForBroadcast}
                loading={isDispatching}
                icon={<Send className="w-4 h-4" />}
                className="w-full"
              >
                Execute Multi-Channel Broadcast
              </Button>
            </div>

            {/* Right: Dispatch Receipt / Log */}
            <div className="space-y-4">
              <span className="text-xs font-mono-tech font-bold text-slate-300 block">
                GATEWAY DISPATCH RECEIPT
              </span>

              {dispatchReceipt ? (
                <div className="p-4 rounded-xl bg-[#07111F]/90 border border-emerald-500/50 space-y-3 font-mono-tech text-xs">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> BROADCAST DELIVERED
                    </span>
                    <span className="text-[10px] bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {dispatchReceipt.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-300">
                    <div><span className="text-slate-400">DISPATCH ID:</span> <span className="text-cyan-300 font-bold">{dispatchReceipt.dispatchId}</span></div>
                    <div><span className="text-slate-400">ZONE:</span> {dispatchReceipt.zoneCode}</div>
                    <div><span className="text-slate-400">RECIPIENTS REACHED:</span> {dispatchReceipt.recipientCount} Citizens & Officers</div>
                    <div><span className="text-slate-400">CHANNELS:</span> {dispatchReceipt.channelsDispatched.join(', ')}</div>
                    <div><span className="text-slate-400">GATEWAY:</span> {dispatchReceipt.gateway}</div>
                    <div><span className="text-slate-400">TIMESTAMP:</span> {dispatchReceipt.timestamp}</div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-[#07111F]/90 border border-[#18283E] text-center space-y-2 font-mono-tech text-xs text-slate-400">
                  <Radio className="w-6 h-6 mx-auto text-slate-500" />
                  <p>No broadcast executed in this session.</p>
                  <p className="text-[10px]">Select a priority zone on the left and click Execute to test simulated dispatch.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Quick CAP Broadcast Dispatch */}
      {selectedForBroadcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040810]/85 backdrop-blur-md">
          <div className="bg-[#0B1728] border border-[#203550] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#18283E] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-500/40">
                  <Radio className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-100 font-sans uppercase">
                  COMMON ALERTING PROTOCOL (CAP) BROADCAST [SIMULATION]
                </h3>
              </div>
              <button
                onClick={() => setSelectedForBroadcast(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-mono-tech p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono-tech text-xs">
              <div className="p-3 rounded-lg bg-[#07111F]/90 border border-[#18283E]">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">TARGET SECTOR</span>
                <span className="font-bold text-slate-100 text-sm font-sans block mt-0.5">
                  {selectedForBroadcast.zoneName} ({selectedForBroadcast.zoneCode})
                </span>
                <span className="text-slate-400 text-xs">{selectedForBroadcast.district} • Risk: {selectedForBroadcast.riskScore}%</span>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Broadcast Message</label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-slate-100 focus:outline-none focus:border-cyan-400 font-sans text-xs leading-relaxed"
                />
              </div>

              {dispatchReceipt && (
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Broadcast Successfully Dispatched
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Receipt: <code className="text-cyan-300">{dispatchReceipt.dispatchId}</code> (48 recipients reached)
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#18283E]">
              <Button
                onClick={() => setSelectedForBroadcast(null)}
                variant="secondary"
                size="sm"
              >
                Close
              </Button>

              <Button
                onClick={handleExecuteDispatch}
                variant="primary"
                size="sm"
                disabled={isDispatching}
                loading={isDispatching}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Transmit Alert Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
