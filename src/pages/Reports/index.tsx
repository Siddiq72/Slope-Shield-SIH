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
import { RiskBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182B42] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#00D4FF]/15 border border-[#00D4FF]/30 text-[#00D4FF]">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 font-sans tracking-tight">
              FIELD INCIDENT REPORTS & TRIAGE
            </h2>
          </div>
          <p className="text-xs font-mono-tech text-slate-400 mt-1">
            Crowdsourced and Field Officer Reconnaissance Feeds with Automated Geo-Clustering
          </p>
        </div>

        <Button
          onClick={onOpenNewReportModal}
          variant="primary"
          size="md"
          icon={<PlusCircle className="w-4 h-4" />}
          className="font-sans font-semibold"
        >
          Submit 1-Tap Field Report
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 font-mono-tech text-xs border-b border-[#182B42] pb-2">
        <span className="text-slate-400 mr-2">REPORT STATUS:</span>
        {['ALL', 'NEW', 'UNDER REVIEW', 'VERIFIED', 'RESOLVED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === st
                ? 'bg-[#00D4FF] text-[#050912]'
                : 'bg-[#0E1A2C] text-slate-400 hover:text-slate-200 border border-[#182B42]'
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
          {filteredReports.map((r) => {
            const isSelected = selectedReport?.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#101D2E] border-[#00D4FF] shadow-lg shadow-[#00D4FF]/10'
                    : 'bg-[#0E1A2C] border-[#182B42] hover:border-[#264366]'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold font-mono-tech text-[#00D4FF]">
                      {r.id}
                    </span>
                    <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#07111F] text-slate-300 border border-[#182B42]">
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

                <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400 mt-2.5 pt-2 border-t border-[#182B42]/70">
                  <span>{r.reporterName}</span>
                  <span className="text-[#14E6C5] font-semibold">{r.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Report Inspection Detail */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <div className="bg-[#0E1A2C] border border-[#182B42] rounded-2xl p-6 shadow-xl space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#182B42]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold font-mono-tech text-[#00D4FF]">
                      REPORT ID: {selectedReport.id}
                    </span>
                    <span className="text-xs font-mono-tech px-2 py-0.5 rounded bg-[#101D2E] text-slate-200 border border-[#264366]">
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
                  <span className="text-xs font-mono-tech px-2.5 py-1 rounded bg-[#14E6C5]/20 text-[#14E6C5] border border-[#14E6C5]/40 font-bold">
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              {/* Photo Evidence & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Photo Evidence simulation */}
                <div className="rounded-xl overflow-hidden border border-[#182B42] bg-[#07111F] relative group">
                  <img
                    src={selectedReport.photoUrl}
                    alt="Field evidence"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded bg-[#050912]/80 backdrop-blur-md text-[10px] font-mono-tech text-slate-300 border border-[#182B42]">
                    Geo-Stamp Verified: {selectedReport.coordinates[0].toFixed(4)}°N, {selectedReport.coordinates[1].toFixed(4)}°E
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="p-4 rounded-xl bg-[#07111F] border border-[#182B42] space-y-2.5 text-xs font-mono-tech">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">SUBMITTED BY</span>
                    <span className="text-slate-100 font-bold">{selectedReport.reporterName}</span>
                    <span className="text-slate-400 block text-[10px]">({selectedReport.role})</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">CONTACT</span>
                    <span className="text-[#00D4FF]">{selectedReport.contact}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">TIMESTAMP</span>
                    <span className="text-slate-200">{selectedReport.timestamp}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">AI SENSOR CROSS-VALIDATION</span>
                    <span className="text-[#10B981] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Corroborated with Sensor SN-07A
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider block mb-1">
                  FIELD OBSERVATION TEXT
                </span>
                <p className="text-xs text-slate-200 font-sans leading-relaxed p-3.5 rounded-xl bg-[#07111F] border border-[#182B42]">
                  {selectedReport.description}
                </p>
              </div>

              {/* Triage Decision Workflow Buttons (NEW -> UNDER REVIEW -> VERIFIED -> RESOLVED) */}
              <div className="pt-4 border-t border-[#182B42] flex flex-wrap items-center justify-between gap-3">
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
            <div className="p-12 text-center text-slate-400 font-mono-tech">
              Select a field report to inspect reconnaissance evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
