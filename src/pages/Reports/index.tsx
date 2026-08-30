import React, { useState } from 'react';
import { 
  FileText, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Camera, 
  Filter, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { RiskBadge, SimulationBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/common/SectionHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { FieldReport } from '../../types';

interface ReportsPageProps {
  onOpenNewReportModal: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onOpenNewReportModal }) => {
  const { reports, updateReportStatus, setSelectedZoneCode, setActiveTab } = useDemo();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedReport, setSelectedReport] = useState<FieldReport | null>(reports[0] || null);

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <SectionHeader
        icon={<FileText className="w-4 h-4 text-cyan-400" />}
        title="FIELD INCIDENT REPORTS & TRIAGE"
        subtitle="Crowdsourced and Field Officer Reconnaissance Feeds with Automated Geo-Clustering"
        badge={<SimulationBadge />}
        actions={
          <Button
            onClick={onOpenNewReportModal}
            variant="primary"
            size="md"
            icon={<PlusCircle className="w-4 h-4" />}
            className="font-semibold"
          >
            Submit 1-Tap Field Report
          </Button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 font-mono-tech text-xs border-b border-[#18283E] pb-2">
        <span className="text-slate-400 mr-2 font-semibold">REPORT STATUS:</span>
        {['ALL', 'NEW', 'UNDER REVIEW', 'VERIFIED', 'RESOLVED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === st
                ? 'bg-cyan-400 text-[#040810] shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                : 'bg-[#0E1D32] text-slate-400 hover:text-slate-200 border border-[#18283E]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Master Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredReports.length === 0 ? (
            <EmptyState
              title="No Incident Reports Found"
              description={`No reports matching status '${filterStatus}' were located in the active sector.`}
            />
          ) : (
            filteredReports.map((r) => {
              const isSelected = selectedReport?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0E1D32] border-cyan-400/80 shadow-[0_0_15px_rgba(0,212,255,0.15)] ring-1 ring-cyan-400/40'
                      : 'bg-[#0B1728] border-[#1c2e47] hover:border-[#2b496e] shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold font-mono-tech text-cyan-300">
                        {r.id}
                      </span>
                      <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#07111F] text-slate-300 border border-[#18283E]">
                        ZONE {r.zoneCode}
                      </span>
                    </div>
                    <RiskBadge level={r.severity} size="sm" />
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 font-sans truncate">
                    {r.reportType} — {r.location}
                  </h4>

                  <p className="text-xs text-slate-300 font-sans line-clamp-2 mt-1">
                    {r.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400 mt-2.5 pt-2 border-t border-[#18283E]/70">
                    <span>{r.reporterName}</span>
                    <span className="text-teal-300 font-semibold">{r.status}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Report Inspection Detail */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-6 shadow-xl space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#18283E]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold font-mono-tech text-cyan-300">
                      REPORT ID: {selectedReport.id}
                    </span>
                    <span className="text-xs font-mono-tech px-2 py-0.5 rounded bg-[#0E1D32] text-slate-200 border border-[#203550]">
                      ZONE {selectedReport.zoneCode}
                    </span>
                    <RiskBadge level={selectedReport.severity} size="sm" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 font-sans mt-1">
                    {selectedReport.reportType} at {selectedReport.location}
                  </h3>
                  <p className="text-xs font-mono-tech text-slate-400">
                    GPS Coordinates: {selectedReport.coordinates[0].toFixed(4)}° N, {selectedReport.coordinates[1].toFixed(4)}° E
                  </p>
                </div>

                {/* Workflow Status Actions */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono-tech px-2.5 py-1 rounded bg-teal-950/50 text-teal-300 border border-teal-500/40 font-bold">
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              {/* Photo Evidence & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Photo Evidence simulation */}
                <div className="rounded-xl overflow-hidden border border-[#18283E] bg-[#07111F] relative group">
                  <img
                    src={selectedReport.photoUrl}
                    alt="Field evidence"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded bg-[#040810]/85 backdrop-blur-md text-[10px] font-mono-tech text-slate-300 border border-[#18283E]">
                    Geo-Stamp Verified: {selectedReport.coordinates[0].toFixed(4)}°N, {selectedReport.coordinates[1].toFixed(4)}°E
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="p-4 rounded-xl bg-[#07111F]/90 border border-[#18283E] space-y-2.5 text-xs font-mono-tech">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">SUBMITTED BY</span>
                    <span className="text-slate-100 font-bold">{selectedReport.reporterName}</span>
                    <span className="text-slate-400 block text-[10px]">({selectedReport.role})</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">CONTACT</span>
                    <span className="text-cyan-300">{selectedReport.contact}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">TIMESTAMP</span>
                    <span className="text-slate-200">{selectedReport.timestamp}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">AI SENSOR CROSS-VALIDATION</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Corroborated with Sensor SN-07A
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                  FIELD OBSERVATION TEXT
                </span>
                <p className="text-xs text-slate-200 font-sans leading-relaxed p-3.5 rounded-lg bg-[#07111F]/90 border border-[#18283E]">
                  {selectedReport.description}
                </p>
              </div>

              {/* Triage Decision Workflow Buttons */}
              <div className="pt-4 border-t border-[#18283E] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => updateReportStatus(selectedReport.id, 'UNDER REVIEW')}
                    variant={selectedReport.status === 'UNDER REVIEW' ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    Mark Under Review
                  </Button>
                  <Button
                    onClick={() => updateReportStatus(selectedReport.id, 'VERIFIED')}
                    variant={selectedReport.status === 'VERIFIED' ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    Verify Incident
                  </Button>
                  <Button
                    onClick={() => updateReportStatus(selectedReport.id, 'RESOLVED')}
                    variant={selectedReport.status === 'RESOLVED' ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    Mark Resolved
                  </Button>
                </div>

                <Button
                  onClick={() => {
                    setSelectedZoneCode(selectedReport.zoneCode);
                    setActiveTab('risk-map');
                  }}
                  variant="ai"
                  size="sm"
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Locate Zone on GIS Map
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 font-mono-tech bg-[#0B1728] border border-[#1c2e47] rounded-xl">
              Select a field report to inspect reconnaissance evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
