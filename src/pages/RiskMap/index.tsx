import React, { useState } from 'react';
import { 
  Map, 
  Filter, 
  Search, 
  Layers, 
  Navigation, 
  ShieldAlert, 
  Compass, 
  CloudRain, 
  Radio, 
  Route, 
  SlidersHorizontal,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { GISMap } from '../../components/map/GISMap';
import { RiskBadge, SimulationBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/common/SectionHeader';

export const RiskMapPage: React.FC = () => {
  const { zones, selectedZone, setSelectedZoneCode, setActiveTab } = useDemo();
  
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterState, setFilterState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const states = Array.from(new Set(zones.map((z) => z.state)));

  const filteredZones = zones.filter((z) => {
    const matchesSeverity = filterSeverity === 'ALL' || z.riskLevel === filterSeverity;
    const matchesState = filterState === 'ALL' || z.state === filterState;
    const matchesSearch = 
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesState && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <SectionHeader
        icon={<Map className="w-4 h-4 text-cyan-400" />}
        title="GIS GEOSPATIAL INTELLIGENCE COMMAND"
        subtitle="Interactive multi-layered GIS theater for landslide hazard mapping across Northeast India"
        badge={<SimulationBadge />}
        actions={
          <span className="px-3 py-1 rounded-lg bg-[#0E1D32] border border-[#203550] text-teal-300 font-mono-tech text-xs font-bold shadow-sm">
            {filteredZones.length} / {zones.length} ZONES ACTIVE
          </span>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-3.5 bg-[#0B1728] border border-[#1c2e47] rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by zone code, ridge, highway, or district..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#07111F] border border-[#18283E] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans"
          />
        </div>

        {/* Severity filter pills */}
        <div className="flex items-center gap-1.5 font-mono-tech text-xs">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline font-semibold">SEVERITY:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filterSeverity === lvl
                  ? 'bg-cyan-400 text-[#040810] shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                  : 'bg-[#0E1D32] text-slate-400 hover:text-slate-200 border border-[#18283E]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* State filter */}
        <div className="flex items-center gap-2 text-xs font-mono-tech">
          <span className="text-slate-400 text-[11px] hidden lg:inline font-semibold">STATE:</span>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#07111F] border border-[#18283E] text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">All NER States (8)</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map + Side Zone Directory Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Large GIS Map */}
        <div className="lg:col-span-3">
          <GISMap
            heightClass="h-[580px] lg:h-[680px]"
            selectedZoneCode={selectedZone.code}
            onSelectZone={(zone) => setSelectedZoneCode(zone.code)}
            onViewAnalysis={() => setActiveTab('risk-analysis')}
          />
        </div>

        {/* Side Directory of Slopes */}
        <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-4 shadow-xl flex flex-col justify-between h-[580px] lg:h-[680px]">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#18283E] mb-3">
              <span className="text-xs font-bold font-mono-tech text-slate-200 uppercase">
                ZONES DIRECTORY
              </span>
              <span className="text-[11px] font-mono-tech text-cyan-300 font-semibold">
                {filteredZones.length} listed
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[490px] lg:max-h-[570px] pr-1">
              {filteredZones.map((z) => {
                const isSelected = selectedZone.code === z.code;
                return (
                  <div
                    key={z.id}
                    onClick={() => setSelectedZoneCode(z.code)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0E1D32] border-cyan-400/80 shadow-[0_0_15px_rgba(0,212,255,0.15)] ring-1 ring-cyan-400/40'
                        : 'bg-[#07111F]/80 border-[#18283E] hover:border-[#264366] hover:bg-[#0E1D32]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold font-mono-tech text-cyan-300">
                          {z.code}
                        </span>
                        <RiskBadge level={z.riskLevel} size="sm" showDot={false} />
                      </div>
                      <span className="text-sm font-bold font-mono-tech text-slate-100">
                        {z.riskScore}%
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 font-sans truncate">
                      {z.name}
                    </h4>

                    <div className="text-[10px] font-mono-tech text-slate-400 flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#18283E]/60">
                      <span>{z.district}, {z.state}</span>
                      <span className={z.roadStatus === 'BLOCKED' ? 'text-rose-400 font-semibold' : z.roadStatus === 'AT RISK' ? 'text-orange-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                        {z.roadStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#18283E] text-center">
            <Button
              onClick={() => setActiveTab('risk-analysis')}
              variant="ai"
              size="sm"
              className="w-full text-xs font-mono-tech justify-center"
            >
              INSPECT {selectedZone.code} IN AI LAB →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
