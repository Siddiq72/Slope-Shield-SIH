/**
 * Slope Shield Map & GIS Service (Phase 1: Local / Provider-Independent Architecture)
 * 
 * Provides map layer configurations, Northeast India bounding boxes, high-contrast dark tiles
 * using open/standard CartoDB Dark Matter / OpenStreetMap tiles, requiring NO external Mapbox token or API keys.
 */

export interface MapLayerConfig {
  id: string;
  name: string;
  url: string;
  attribution?: string;
  maxZoom: number;
}

export interface RegionSpatialBounds {
  center: [number, number];
  defaultZoom: number;
  minZoom: number;
  maxZoom: number;
  bounds?: [[number, number], [number, number]];
}

export interface MapProvider {
  getBaseLayer(): MapLayerConfig;
  getRegionBounds(): RegionSpatialBounds;
  getRiskIsochroneStyles(): Record<string, { color: string; fillColor: string; fillOpacity: number }>;
}

class OpenGISMapService implements MapProvider {
  getBaseLayer(): MapLayerConfig {
    return {
      id: 'carto-dark',
      name: 'CartoDB Dark Matter (High Contrast / Open)',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      maxZoom: 18,
    };
  }

  getRegionBounds(): RegionSpatialBounds {
    return {
      center: [25.5, 92.5],
      defaultZoom: 7,
      minZoom: 6,
      maxZoom: 16,
    };
  }

  getRiskIsochroneStyles(): Record<string, { color: string; fillColor: string; fillOpacity: number }> {
    return {
      CRITICAL: { color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.35 },
      HIGH: { color: '#F97316', fillColor: '#F97316', fillOpacity: 0.30 },
      MODERATE: { color: '#EAB308', fillColor: '#EAB308', fillOpacity: 0.25 },
      LOW: { color: '#10B981', fillColor: '#10B981', fillOpacity: 0.20 },
    };
  }
}

export const mapService = new OpenGISMapService();
