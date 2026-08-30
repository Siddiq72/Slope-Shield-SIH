import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Eye, 
  Radio, 
  CloudRain, 
  Activity, 
  Route,
  Info,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { RiskZone, SensorReading, RoadSegment } from '../../types';
import { useDemo } from '../../context/DemoContext';
import { RiskBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface GISMapProps {
  heightClass?: string;
  selectedZoneCode?: string;
  onSelectZone?: (zone: RiskZone) => void;
  onViewAnalysis?: (zoneCode: string) => void;
}

export const GISMap: React.FC<GISMapProps> = ({
  heightClass = 'h-[500px] lg:h-[580px]',
  selectedZoneCode,
  onSelectZone,
  onViewAnalysis
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const roadLayersRef = useRef<L.LayerGroup | null>(null);
  const radarOverlayRef = useRef<L.LayerGroup | null>(null);

  const { zones, sensors, roads, setSelectedZoneCode, setActiveTab } = useDemo();

  // Layer toggles
  const [layersOpen, setLayersOpen] = useState(false);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showRainfallLayer, setShowRainfallLayer] = useState(true);
  const [showRoadCorridors, setShowRoadCorridors] = useState(true);
  const [showSensorNodes, setShowSensorNodes] = useState(true);
  const [showInSAROverlay, setShowInSAROverlay] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inspectedZone, setInspectedZone] = useState<RiskZone | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Northeast India: [25.5, 92.5], zoom 7
    const map = L.map(mapContainerRef.current, {
      center: [25.5, 92.5],
      zoom: 7,
      zoomControl: false,
      attributionControl: false
    });

    // Dark Basemap Tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom control at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    const roadsGroup = L.layerGroup().addTo(map);
    const radarGroup = L.layerGroup().addTo(map);

    markersGroupRef.current = markersGroup;
    roadLayersRef.current = roadsGroup;
    radarOverlayRef.current = radarGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Road Corridors
  useEffect(() => {
    if (!mapInstanceRef.current || !roadLayersRef.current) return;
    roadLayersRef.current.clearLayers();

    if (!showRoadCorridors) return;

    // Key Northeast India Road alignments
    const roadPolylines: Array<{
      id: string;
      name: string;
      coords: [number, number][];
      status: 'OPEN' | 'AT RISK' | 'BLOCKED';
    }> = [
      {
        id: 'NH-54',
        name: 'NH-54 Aizawl Arterial Corridor',
        status: 'AT RISK',
        coords: [
          [23.85, 92.68],
          [23.7388, 92.7176],
          [23.65, 92.74]
        ]
      },
      {
        id: 'NH-06',
        name: 'NH-06 / NH-44 Sonapur Lifeline',
        status: 'BLOCKED',
        coords: [
          [25.35, 92.20],
          [25.1052, 92.3619],
          [24.85, 92.60]
        ]
      },
      {
        id: 'NH-10',
        name: 'NH-10 Sevoke — Gangtok Highway',
        status: 'AT RISK',
        coords: [
          [26.85, 88.42],
          [27.05, 88.52],
          [27.3389, 88.6065]
        ]
      },
      {
        id: 'NH-29',
        name: 'NH-29 Dimapur — Kohima Corridor',
        status: 'OPEN',
        coords: [
          [25.90, 93.72],
          [25.75, 93.92],
          [25.6421, 94.1084]
        ]
      },
      {
        id: 'NH-37',
        name: 'NH-37 Jiribam — Noney — Imphal',
        status: 'AT RISK',
        coords: [
          [24.80, 93.15],
          [24.7891, 93.6334],
          [24.81, 93.94]
        ]
      }
    ];

    roadPolylines.forEach((road) => {
      const color = road.status === 'BLOCKED' ? '#EF4444' : road.status === 'AT RISK' ? '#F97316' : '#10B981';
      const weight = road.status === 'BLOCKED' ? 5 : 3.5;
      const dash = road.status === 'BLOCKED' ? '6, 6' : undefined;

      const polyline = L.polyline(road.coords, {
        color,
        weight,
        opacity: 0.85,
        dashArray: dash,
        lineCap: 'round',
        lineJoin: 'round'
      });

      polyline.bindTooltip(
        `<div class="font-mono-tech text-[10px] bg-[#0E1A2C] text-slate-100 px-2 py-1 rounded border border-[#264366]">
          <strong>${road.name}</strong><br/><span style="color: ${color}">${road.status}</span>
        </div>`,
        { sticky: true, opacity: 0.95 }
      );

      roadLayersRef.current?.addLayer(polyline);
    });
  }, [showRoadCorridors]);

  // Update Radar Overlay Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !radarOverlayRef.current) return;
    radarOverlayRef.current.clearLayers();

    if (!showRainfallLayer) return;

    // Simulated Monsoonal Precipitation heat pockets over Northeast India
    const rainfallCenters: Array<{ lat: number; lng: number; radiusKm: number; intensity: number }> = [
      { lat: 23.74, lng: 92.72, radiusKm: 35, intensity: 0.8 }, // Aizawl
      { lat: 25.11, lng: 92.36, radiusKm: 45, intensity: 0.9 }, // Sonapur Meghalaya
      { lat: 27.34, lng: 88.61, radiusKm: 30, intensity: 0.65 }, // Gangtok
      { lat: 25.12, lng: 92.99, radiusKm: 38, intensity: 0.85 } // Dima Hasao
    ];

    rainfallCenters.forEach((cell) => {
      const circle = L.circle([cell.lat, cell.lng], {
        radius: cell.radiusKm * 1000,
        color: '#00D4FF',
        fillColor: '#00D4FF',
        fillOpacity: 0.12 * cell.intensity,
        weight: 1,
        dashArray: '3, 6'
      });
      radarOverlayRef.current?.addLayer(circle);
    });
  }, [showRainfallLayer]);

  // Update Markers for Risk Zones & Sensors
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    markersGroupRef.current.clearLayers();

    if (!showRiskZones) return;

    zones.forEach((zone) => {
      const isSelected = selectedZoneCode === zone.code;
      const isCritical = zone.riskLevel === 'CRITICAL';
      const isHigh = zone.riskLevel === 'HIGH';

      const color = isCritical ? '#EF4444' : isHigh ? '#F97316' : zone.riskLevel === 'MODERATE' ? '#F59E0B' : '#10B981';

      // Custom HTML Marker Icon matching the Master Plan
      const iconHtml = `
        <div class="relative cursor-pointer group transform transition-transform duration-200 hover:scale-110">
          ${isCritical ? `<div class="absolute -inset-2 rounded-full bg-[#EF4444]/30 animate-ping"></div>` : ''}
          ${isSelected ? `<div class="absolute -inset-3 rounded-full border-2 border-[#00D4FF] animate-pulse"></div>` : ''}
          <div class="relative px-2 py-1 rounded-md border flex items-center gap-1.5 shadow-xl font-mono-tech"
               style="background: #0B1726; border-color: ${color}; color: ${color};">
            <span class="text-[11px] font-extrabold">${zone.code}</span>
            <span class="w-1.5 h-1.5 rounded-full" style="background: ${color}"></span>
            <span class="text-[10px] font-bold text-slate-100">${zone.riskScore}%</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-gis-marker',
        iconSize: [64, 28],
        iconAnchor: [32, 14]
      });

      const marker = L.marker(zone.coordinates, { icon: customIcon });

      // Click handler updates inspected zone & triggers selection
      marker.on('click', () => {
        setSelectedZoneCode(zone.code);
        setInspectedZone(zone);
        if (onSelectZone) onSelectZone(zone);
      });

      markersGroupRef.current?.addLayer(marker);

      // Also add risk buffer circle
      const bufferColor = color;
      const buffer = L.circle(zone.coordinates, {
        radius: isCritical ? 6500 : isHigh ? 4500 : 2500,
        color: bufferColor,
        fillColor: bufferColor,
        fillOpacity: isCritical ? 0.18 : 0.08,
        weight: 1.5
      });
      markersGroupRef.current?.addLayer(buffer);
    });

    // Sensor Node markers
    if (showSensorNodes) {
      sensors.forEach((s) => {
        const matchingZone = zones.find((z) => z.code === s.zoneCode);
        if (!matchingZone) return;

        // Offset slightly from center
        const sensorCoords: [number, number] = [
          matchingZone.coordinates[0] + 0.015,
          matchingZone.coordinates[1] + 0.015
        ];

        const sensorColor = s.status === 'ONLINE' ? '#10B981' : s.status === 'WARNING' ? '#F59E0B' : '#EF4444';

        const sensorIcon = L.divIcon({
          html: `
            <div class="flex items-center justify-center w-5 h-5 rounded-full bg-[#101D2E] border border-[${sensorColor}] text-[${sensorColor}] shadow-md" style="border-color: ${sensorColor}; color: ${sensorColor}">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>
            </div>
          `,
          className: 'sensor-gis-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const sensorMarker = L.marker(sensorCoords, { icon: sensorIcon });
        sensorMarker.bindTooltip(
          `<div class="font-mono-tech text-[10px] bg-[#0E1A2C] text-slate-100 p-2 rounded border border-[#264366]">
            <div class="font-bold text-[#00D4FF]">${s.nodeId} — ${s.nodeName}</div>
            <div class="text-slate-400">${s.location}</div>
            <div class="mt-1 flex gap-2">
              <span>Moisture: <strong>${s.soilMoisturePct}%</strong></span>
              <span>Tilt: <strong>${s.slopeTiltDeg}°</strong></span>
            </div>
          </div>`,
          { sticky: true, opacity: 0.95 }
        );

        markersGroupRef.current?.addLayer(sensorMarker);
      });
    }
  }, [zones, sensors, selectedZoneCode, showRiskZones, showSensorNodes, setSelectedZoneCode, onSelectZone]);

  // Sync inspectedZone with selectedZoneCode
  useEffect(() => {
    if (selectedZoneCode) {
      const z = zones.find((item) => item.code === selectedZoneCode);
      if (z) setInspectedZone(z);
    }
  }, [selectedZoneCode, zones]);

  // Center map on inspected zone when selected
  const handleLocateZone = (coords: [number, number]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, 10, { duration: 1.2 });
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([25.5, 92.5], 7, { duration: 1.0 });
    }
  };

  return (
    <div className={`relative w-full ${heightClass} bg-[#07111F] rounded-2xl border border-[#182B42] overflow-hidden shadow-2xl`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left Header Badge: GIS Command Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-[#0B1726]/90 backdrop-blur-md border border-[#264366] text-xs font-mono-tech flex items-center gap-2 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4FF]" />
          </span>
          <span className="font-bold text-slate-100">GIS MULTI-SOURCE RADAR</span>
          <span className="text-slate-400">|</span>
          <span className="text-[#14E6C5] font-semibold">NER SECTOR</span>
        </div>
      </div>

      {/* Top Right Controls & Layer Toggle */}
      <div className="absolute top-4 right-14 z-10 flex items-center gap-2">
        {/* Layer selector toggle button */}
        <div className="relative">
          <button
            onClick={() => setLayersOpen(!layersOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1726]/90 backdrop-blur-md hover:bg-[#101D2E] border border-[#264366] text-xs font-mono-tech text-slate-200 transition-colors shadow-lg"
          >
            <Layers className="w-4 h-4 text-[#00D4FF]" />
            <span className="hidden sm:inline">Layers</span>
          </button>

          {/* Layers Dropdown Menu */}
          {layersOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#0B1726] border border-[#264366] rounded-xl shadow-2xl p-3 z-50 animate-fade-in text-xs font-sans">
              <div className="font-mono-tech text-[10px] text-slate-400 uppercase tracking-wider border-b border-[#182B42] pb-1.5 mb-2 font-bold">
                GIS Geospatial Layers
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between cursor-pointer text-slate-200 hover:text-white">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>Risk Zones & Hazard Buffer</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showRiskZones}
                    onChange={(e) => setShowRiskZones(e.target.checked)}
                    className="accent-[#00D4FF] rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-slate-200 hover:text-white">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-3.5 h-3.5 text-[#00D4FF]" />
                    <span>Rainfall Radar Intensity</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showRainfallLayer}
                    onChange={(e) => setShowRainfallLayer(e.target.checked)}
                    className="accent-[#00D4FF] rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-slate-200 hover:text-white">
                  <div className="flex items-center gap-2">
                    <Route className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Road Corridors & Blockages</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showRoadCorridors}
                    onChange={(e) => setShowRoadCorridors(e.target.checked)}
                    className="accent-[#00D4FF] rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-slate-200 hover:text-white">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>IoT Sensor Telemetry Nodes</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showSensorNodes}
                    onChange={(e) => setShowSensorNodes(e.target.checked)}
                    className="accent-[#00D4FF] rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-slate-200 hover:text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#7C5CFF]" />
                    <span>Sentinel-1 InSAR Deformation</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showInSAROverlay}
                    onChange={(e) => setShowInSAROverlay(e.target.checked)}
                    className="accent-[#7C5CFF] rounded"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Locate / Reset View */}
        <button
          onClick={handleResetView}
          title="Reset Regional View"
          className="p-1.5 rounded-lg bg-[#0B1726]/90 backdrop-blur-md hover:bg-[#101D2E] border border-[#264366] text-slate-300 hover:text-white transition-colors shadow-lg"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Interactive Zone Inspector (Bottom Right or Bottom Left on Desktop) */}
      {inspectedZone && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-10 bg-[#0B1726]/95 backdrop-blur-lg border border-[#264366] rounded-xl p-4 shadow-2xl animate-fade-in">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-[#182B42]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold font-mono-tech px-2 py-0.5 rounded bg-[#101D2E] text-[#00D4FF] border border-[#264366]">
                  ZONE {inspectedZone.code}
                </span>
                <RiskBadge level={inspectedZone.riskLevel} size="sm" />
              </div>
              <h4 className="text-sm font-bold text-slate-100 font-sans mt-1 truncate">
                {inspectedZone.name}
              </h4>
              <p className="text-[11px] text-slate-400 font-mono-tech">
                {inspectedZone.district}, {inspectedZone.state}
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-extrabold font-mono-tech text-[#EF4444] leading-none">
                {inspectedZone.riskScore}
                <span className="text-xs font-normal text-slate-400">/100</span>
              </div>
              <span className="text-[9px] font-mono-tech text-slate-400 uppercase">
                HYPERLOCAL RISK
              </span>
            </div>
          </div>

          {/* Contributors Progress Grid matching Section 10 of Master Plan */}
          <div className="space-y-1.5 text-xs font-sans mb-3">
            <div className="flex items-center justify-between font-mono-tech text-[11px]">
              <span className="text-slate-400">Rainfall</span>
              <span className="font-bold text-slate-100">{inspectedZone.rainfallRateMmHr > 35 ? '82%' : '45%'}</span>
            </div>
            <div className="h-1.5 w-full bg-[#101D2E] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00D4FF]" 
                style={{ width: `${inspectedZone.rainfallRateMmHr > 35 ? 82 : 45}%` }} 
              />
            </div>

            <div className="flex items-center justify-between font-mono-tech text-[11px] pt-1">
              <span className="text-slate-400">Soil Moisture</span>
              <span className="font-bold text-slate-100">{inspectedZone.soilMoisturePct}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#101D2E] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#14E6C5]" 
                style={{ width: `${inspectedZone.soilMoisturePct}%` }} 
              />
            </div>

            <div className="flex items-center justify-between font-mono-tech text-[11px] pt-1">
              <span className="text-slate-400">Slope Tilt Instability</span>
              <span className="font-bold text-slate-100">{inspectedZone.slopeInstabilityPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#101D2E] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#EF4444]" 
                style={{ width: `${inspectedZone.slopeInstabilityPct}%` }} 
              />
            </div>

            <div className="flex items-center justify-between font-mono-tech text-[11px] pt-1">
              <span className="text-slate-400">Historical Locus Vulnerability</span>
              <span className="font-bold text-slate-100">{inspectedZone.historicalVulnerabilityPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#101D2E] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#F59E0B]" 
                style={{ width: `${inspectedZone.historicalVulnerabilityPct}%` }} 
              />
            </div>
          </div>

          {/* Road & 6H Forecast Row */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#101D2E] border border-[#182B42] text-[11px] font-mono-tech mb-3">
            <div>
              <span className="text-slate-400 uppercase text-[9px] block">ROAD NETWORK</span>
              <span className={`font-bold ${
                inspectedZone.roadStatus === 'BLOCKED' ? 'text-[#EF4444]' : inspectedZone.roadStatus === 'AT RISK' ? 'text-[#F97316]' : 'text-[#10B981]'
              }`}>
                {inspectedZone.roadStatus}
              </span>
            </div>

            <div className="text-right">
              <span className="text-slate-400 uppercase text-[9px] block">NEXT 6 HOURS</span>
              <span className="font-bold text-[#EF4444]">
                {inspectedZone.forecast6h.from} → {inspectedZone.forecast6h.to}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setSelectedZoneCode(inspectedZone.code);
                setActiveTab('risk-analysis');
                if (onViewAnalysis) onViewAnalysis(inspectedZone.code);
              }}
              variant="ai"
              size="sm"
              className="w-full text-xs font-mono-tech"
              icon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              VIEW AI RISK ANALYSIS →
            </Button>
            <Button
              onClick={() => handleLocateZone(inspectedZone.coordinates)}
              variant="secondary"
              size="sm"
              className="text-xs px-2.5"
              title="Fly to coordinate"
            >
              <Compass className="w-3.5 h-3.5 text-[#00D4FF]" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
