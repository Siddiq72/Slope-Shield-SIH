import React, { useState } from 'react';
import { Camera, MapPin, CheckCircle, Upload, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDemo } from '../../context/DemoContext';
import { FieldReport, RiskLevel } from '../../types';

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewReportModal: React.FC<NewReportModalProps> = ({ isOpen, onClose }) => {
  const { zones, submitFieldReport } = useDemo();

  const [reporterName, setReporterName] = useState('');
  const [role, setRole] = useState<FieldReport['role']>('Field Recon Officer');
  const [contact, setContact] = useState('');
  const [zoneCode, setZoneCode] = useState('N-07');
  const [reportType, setReportType] = useState<FieldReport['reportType']>('Ground Crack');
  const [severity, setSeverity] = useState<RiskLevel>('CRITICAL');
  const [location, setLocation] = useState('Hunthar Veng Upper Slope, Ward-7, Aizawl');
  const [description, setDescription] = useState('');
  const [simulatedGps, setSimulatedGps] = useState<[number, number]>([23.7392, 92.7169]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleZoneChange = (code: string) => {
    setZoneCode(code);
    const z = zones.find(item => item.code === code);
    if (z) {
      setLocation(`${z.name}, ${z.district}`);
      setSimulatedGps(z.coordinates);
    }
  };

  const handleAcquireGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSimulatedGps([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          // Keep current coordinates
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitFieldReport({
        reporterName: reporterName || 'Er. Ground Recon Team',
        role,
        contact: contact || '+91 94361-XXXXX',
        zoneCode,
        location,
        coordinates: simulatedGps,
        reportType,
        severity,
        description: description || `Ground tension crack observed with notable lateral displacement across slope face in ${location}.`,
        photoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
      });

      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    }, 500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="1-TAP GEO-TAGGED FIELD REPORT"
      subtitle="Crowdsourced / Reconnaissance Triage Engine (NER Region)"
      icon={<ShieldAlert className="w-5 h-5 text-cyan-300" />}
      maxWidth="xl"
    >
      {success ? (
        <div className="p-8 text-center space-y-3 animate-in fade-in zoom-in-95">
          <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-100 font-sans">
            Report Uploaded & Geo-Clustered Successfully!
          </h4>
          <p className="text-xs font-mono-tech text-slate-400 max-w-sm mx-auto">
            Automated image compression passed. Cross-validated with Sensor Node SN-07A and dispatched to DDMA Triage queue.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reporter Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono-tech text-slate-400 uppercase mb-1 font-semibold">
                Reporter Name
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Er. Lalrinmawia"
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-xs text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono-tech text-slate-400 uppercase mb-1 font-semibold">
                Designated Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as FieldReport['role'])}
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="Field Recon Officer">Field Recon Officer</option>
                <option value="Community Volunteer">Community Volunteer</option>
                <option value="PWD Engineer">PWD Engineer</option>
                <option value="Disaster Warden">Disaster Warden</option>
              </select>
            </div>
          </div>

          {/* Zone & Geo-Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono-tech text-slate-400 uppercase mb-1 font-semibold">
                Target Risk Zone
              </label>
              <select
                value={zoneCode}
                onChange={(e) => handleZoneChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                {zones.map((z) => (
                  <option key={z.code} value={z.code}>
                    ZONE {z.code} — {z.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono-tech text-slate-400 uppercase mb-1 flex items-center justify-between font-semibold">
                <span>GPS Location</span>
                <button
                  type="button"
                  onClick={handleAcquireGps}
                  className="text-[10px] text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <MapPin className="w-3 h-3" /> Auto-Acquire
                </button>
              </label>
              <input
                type="text"
                value={`${simulatedGps[0].toFixed(4)}° N, ${simulatedGps[1].toFixed(4)}° E`}
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-[#07111F]/60 border border-[#18283E] text-xs font-mono-tech text-slate-300"
              />
            </div>
          </div>

          {/* Hazard Type & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono-tech text-slate-400 uppercase mb-1 font-semibold">
                Observation Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as FieldReport['reportType'])}
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="Ground Crack">Ground Crack / Tension Fissure</option>
                <option value="Rockfall / Debris">Rockfall / Loose Debris</option>
                <option value="Culvert Overflow">Culvert / Scupper Overflow</option>
                <option value="Subsidence">Road Shoulder Subsidence</option>
                <option value="Mudflow">Tributary Mudflow / Slurry</option>
                <option value="Toe Erosion">Slope Toe Erosion / Scour</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono-tech text-slate-400 uppercase mb-1 font-semibold">
                Assessed Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as RiskLevel)}
                className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="CRITICAL">CRITICAL (Immediate Collapse Danger)</option>
                <option value="HIGH">HIGH (Expanding Movement)</option>
                <option value="MODERATE">MODERATE (Localized Instability)</option>
                <option value="LOW">LOW (Early Minor Observation)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-mono-tech text-slate-400 uppercase mb-1 font-semibold">
              Field Observation Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe crack length, depth, water seepage, retaining structure distortion, or highway blockage..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#18283E] text-xs text-slate-100 focus:outline-none focus:border-cyan-400 placeholder-slate-500"
              required
            />
          </div>

          {/* Photo upload simulation */}
          <div className="p-3 rounded-lg border border-dashed border-[#264366] bg-[#07111F]/70 flex items-center justify-between text-xs font-mono-tech">
            <div className="flex items-center gap-2 text-slate-300">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Camera Geo-Stamp: <strong className="text-slate-100">IMG_2026_NER_772.JPG (Compressed 380KB)</strong></span>
            </div>
            <span className="text-[10px] text-teal-300 font-bold">1-TAP EMBEDDED</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#18283E]">
            <Button type="button" onClick={onClose} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting} loading={isSubmitting}>
              Submit Field Report →
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
