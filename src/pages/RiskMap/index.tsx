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
  ChevronRight
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { GISMap } from '../../components/map/GISMap';
import { RiskBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#182B42] pb-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 font-sans tracking-tight flex items-center gap-2">
            <Map className="w-5 h-5 text-[#00D4FF]" />
            GIS GEOSPATIAL INTELLIGENCE COMMAND
          </h2>
          <p className="text-xs font-mono-tech text-slate-400">
            Interactive multi-layered GIS theater for landslide hazard mapping across Northeast India
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-300">
          <span className="px-2.5 py-1 rounded-lg bg-[#101D2E] border border-[#264366] text-[#14E6C5] font-bold">
            {filteredZones.length} / {zones.length} ZONES VISIBLE
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-[#0E1A2C] border border-[#182B42] rounded-xl flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by zone code, ridge, highway, or district..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#07111F] border border-[#182B42] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00D4FF]"
          />
        </div>

        {/* Severity filter pills */}
        <div className="flex items-center gap-1.5 font-mono-tech text-xs">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">SEVERITY:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                filterSeverity === lvl
                  ? 'bg-[#00D4FF] text-[#050912]'
                  : 'bg-[#101D2E] text-slate-400 hover:text-slate-200 border border-[#182B42]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* State filter */}
        <div className="flex items-center gap-2 text-xs font-mono-tech">
          <span className="text-slate-400 text-[11px] hidden lg:inline">STATE:</span>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#07111F] border border-[#182B42] text-xs text-slate-200 focus:outline-none focus:border-[#00D4FF]"
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
        <div className="bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-4 shadow-xl flex flex-col justify-between h-[580px] lg:h-[680px]">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#182B42] mb-3">
              <span className="text-xs font-bold font-mono-tech text-slate-200 uppercase">
                ZONES DIRECTORY
              </span>
              <span className="text-[11px] font-mono-tech text-[#00D4FF]">
                {filteredZones.length} listed
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[500px] lg:max-h-[580px] pr-1">
              {filteredZones.map((z) => {
                const isSelected = selectedZone.code === z.code;
                return (
                  <div
                    key={z.id}
                    onClick={() => setSelectedZoneCode(z.code)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#101D2E] border-[#00D4FF] shadow-lg shadow-[#00D4FF]/10'
                        : 'bg-[#07111F]/70 border-[#182B42] hover:border-[#264366] hover:bg-[#101D2E]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold font-mono-tech text-[#00D4FF]">
                          {z.code}
                        </span>
                        <RiskBadge level={z.riskLevel} size="sm" showDot={false} />
                      </div>
                      <span className="text-sm font-extrabold font-mono-tech text-slate-100">
                        {z.riskScore}%
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 font-sans truncate">
                      {z.name}
                    </h4>

                    <div className="text-[10px] font-mono-tech text-slate-400 flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#182B42]/60">
                      <span>{z.district}, {z.state}</span>
                      <span className={z.roadStatus === 'BLOCKED' ? 'text-[#EF4444]' : z.roadStatus === 'AT RISK' ? 'text-[#F97316]' : 'text-[#10B981]'}>
                        {z.roadStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#182B42] text-center">
            <Button
              onClick={() => setActiveTab('risk-analysis')}
              variant="ai"
              size="sm"
              className="w-full text-xs font-mono-tech"
            >
              INSPECT {selectedZone.code} IN AI LAB →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
