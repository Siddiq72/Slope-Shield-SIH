// Server-side calibrated data store for Slope Shield Full-Stack REST API

export interface ServerRiskZone {
  id: string;
  code: string;
  name: string;
  district: string;
  state: string;
  coordinates: [number, number];
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  slopeAngleDeg: number;
  soilMoisturePct: number;
  rainfallRateMmHr: number;
  accumulation24hMm: number;
  porePressureKPa: number;
  insarDisplacementMm: number;
  historicalVulnerabilityPct: number;
  slopeInstabilityPct: number;
  roadStatus: 'OPEN' | 'AT RISK' | 'BLOCKED';
  affectedRoad?: string;
  forecast6h: {
    from: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    to: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    projectedScore: number;
    trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  };
  populationAtRisk: number;
  sensorNodeId: string;
  lastUpdated: string;
  description: string;
  recommendedAction: string;
}

export const serverRiskZones: ServerRiskZone[] = [
  {
    id: 'zone-1',
    code: 'N-07',
    name: 'Hunthar Escarpment Corridor',
    district: 'Aizawl',
    state: 'Mizoram',
    coordinates: [23.7307, 92.7173],
    riskScore: 92,
    riskLevel: 'CRITICAL',
    slopeAngleDeg: 48,
    soilMoisturePct: 84,
    rainfallRateMmHr: 42.5,
    accumulation24hMm: 168.4,
    porePressureKPa: 58.4,
    insarDisplacementMm: -28.4,
    historicalVulnerabilityPct: 88,
    slopeInstabilityPct: 91,
    roadStatus: 'BLOCKED',
    affectedRoad: 'NH-54 (Aizawl - Silchar National Highway)',
    forecast6h: {
      from: 'HIGH',
      to: 'CRITICAL',
      projectedScore: 96,
      trend: 'INCREASING'
    },
    populationAtRisk: 14200,
    sensorNodeId: 'SN-07A',
    lastUpdated: '1 min ago (Live Sync)',
    description: 'Active bedding slip along fractured Disang shale. Hydrostatic pore water saturation triggering acute creep.',
    recommendedAction: 'Execute Pre-Emptive Evacuation Order for Downslope Settlements. Restrict NH-54 heavy transport.'
  },
  {
    id: 'zone-2',
    code: 'N-03',
    name: 'Sonapur Tunnel Approach Slopes',
    district: 'East Jaintia Hills',
    state: 'Meghalaya',
    coordinates: [25.1322, 92.3584],
    riskScore: 84,
    riskLevel: 'HIGH',
    slopeAngleDeg: 42,
    soilMoisturePct: 76,
    rainfallRateMmHr: 34.0,
    accumulation24hMm: 142.0,
    porePressureKPa: 46.2,
    insarDisplacementMm: -21.8,
    historicalVulnerabilityPct: 82,
    slopeInstabilityPct: 79,
    roadStatus: 'AT RISK',
    affectedRoad: 'NH-06 (Shillong - Silchar Lifeline Highway)',
    forecast6h: {
      from: 'MODERATE',
      to: 'HIGH',
      projectedScore: 89,
      trend: 'INCREASING'
    },
    populationAtRisk: 8600,
    sensorNodeId: 'SN-03B',
    lastUpdated: '3 mins ago',
    description: 'Heavy limestone-sandstone overburden saturated by monsoonal downpours. High vulnerability to sudden debris mudflow.',
    recommendedAction: 'Deploy SDRF quick response unit to NH-06 kilometer marker 142. Alert PWD earthmoving equipment.'
  },
  {
    id: 'zone-3',
    code: 'N-11',
    name: '9th Mile - Ranipool Highway Ridge',
    district: 'Gangtok',
    state: 'Sikkim',
    coordinates: [27.3389, 88.6065],
    riskScore: 78,
    riskLevel: 'HIGH',
    slopeAngleDeg: 45,
    soilMoisturePct: 69,
    rainfallRateMmHr: 28.5,
    accumulation24hMm: 118.0,
    porePressureKPa: 38.5,
    insarDisplacementMm: -14.2,
    historicalVulnerabilityPct: 79,
    slopeInstabilityPct: 74,
    roadStatus: 'AT RISK',
    affectedRoad: 'NH-10 (Siliguri - Gangtok Arterial Link)',
    forecast6h: {
      from: 'MODERATE',
      to: 'HIGH',
      projectedScore: 82,
      trend: 'INCREASING'
    },
    populationAtRisk: 6400,
    sensorNodeId: 'SN-11C',
    lastUpdated: '4 mins ago',
    description: 'Tension fissures expanding along the upper colluvium boundary. Teesta river scouring slope toe.',
    recommendedAction: 'One-way controlled transit on NH-10. Station Border Roads Organisation (BRO) patrol detachments.'
  },
  {
    id: 'zone-4',
    code: 'N-14',
    name: 'Kohima Bypass Overhang',
    district: 'Kohima',
    state: 'Nagaland',
    coordinates: [25.6751, 94.1086],
    riskScore: 68,
    riskLevel: 'MODERATE',
    slopeAngleDeg: 38,
    soilMoisturePct: 58,
    rainfallRateMmHr: 22.0,
    accumulation24hMm: 85.0,
    porePressureKPa: 28.0,
    insarDisplacementMm: -9.5,
    historicalVulnerabilityPct: 65,
    slopeInstabilityPct: 62,
    roadStatus: 'OPEN',
    affectedRoad: 'NH-29 (Dimapur - Kohima Highway)',
    forecast6h: {
      from: 'MODERATE',
      to: 'MODERATE',
      projectedScore: 71,
      trend: 'STABLE'
    },
    populationAtRisk: 4200,
    sensorNodeId: 'SN-14A',
    lastUpdated: '6 mins ago',
    description: 'Continuous moderate rainfall. Inclinometer showing nominal basal creep within tolerance threshold.',
    recommendedAction: 'Routine automated telemetry polling. Visual spot-checks by Kohima DDMA wardens.'
  }
];

export const serverSensors = [
  {
    id: 'sens-1',
    nodeId: 'SN-07A',
    nodeName: 'Hunthar Deep Piezometer Probe A',
    zoneCode: 'N-07',
    location: 'Hunthar Ridge Km 4.2, Aizawl',
    status: 'WARNING' as const,
    isSimulated: true,
    soilMoisturePct: 84,
    slopeTiltDeg: 5.6,
    porePressureKPa: 58.4,
    batteryPct: 92,
    signalDbm: -68,
    lastPing: '30s ago',
    depthMeters: 8.5,
    history: [
      { timestamp: '10:00', soilMoisture: 42, tilt: 1.2, porePressure: 18.2 },
      { timestamp: '11:00', soilMoisture: 54, tilt: 2.1, porePressure: 28.4 },
      { timestamp: '12:00', soilMoisture: 68, tilt: 3.4, porePressure: 41.0 },
      { timestamp: '13:00', soilMoisture: 79, tilt: 4.8, porePressure: 52.1 },
      { timestamp: '14:00', soilMoisture: 84, tilt: 5.6, porePressure: 58.4 }
    ]
  },
  {
    id: 'sens-2',
    nodeId: 'SN-03B',
    nodeName: 'Sonapur Inclinometer Array B',
    zoneCode: 'N-03',
    location: 'East Jaintia Hills, NH-06',
    status: 'WARNING' as const,
    isSimulated: true,
    soilMoisturePct: 76,
    slopeTiltDeg: 4.2,
    porePressureKPa: 46.2,
    batteryPct: 88,
    signalDbm: -74,
    lastPing: '1m ago',
    depthMeters: 6.0,
    history: [
      { timestamp: '10:00', soilMoisture: 38, tilt: 0.9, porePressure: 14.1 },
      { timestamp: '11:00', soilMoisture: 48, tilt: 1.6, porePressure: 22.0 },
      { timestamp: '12:00', soilMoisture: 61, tilt: 2.8, porePressure: 33.5 },
      { timestamp: '13:00', soilMoisture: 71, tilt: 3.6, porePressure: 41.2 },
      { timestamp: '14:00', soilMoisture: 76, tilt: 4.2, porePressure: 46.2 }
    ]
  },
  {
    id: 'sens-3',
    nodeId: 'SN-11C',
    nodeName: 'Ranipool Pore Pressure Node C',
    zoneCode: 'N-11',
    location: 'Gangtok - 9th Mile Corridor',
    status: 'ONLINE' as const,
    isSimulated: true,
    soilMoisturePct: 69,
    slopeTiltDeg: 3.1,
    porePressureKPa: 38.5,
    batteryPct: 96,
    signalDbm: -62,
    lastPing: '45s ago',
    depthMeters: 10.0,
    history: [
      { timestamp: '10:00', soilMoisture: 35, tilt: 0.8, porePressure: 12.0 },
      { timestamp: '11:00', soilMoisture: 44, tilt: 1.4, porePressure: 19.5 },
      { timestamp: '12:00', soilMoisture: 52, tilt: 2.0, porePressure: 26.8 },
      { timestamp: '13:00', soilMoisture: 62, tilt: 2.6, porePressure: 32.4 },
      { timestamp: '14:00', soilMoisture: 69, tilt: 3.1, porePressure: 38.5 }
    ]
  },
  {
    id: 'sens-4',
    nodeId: 'SN-14A',
    nodeName: 'Kohima Ridge Telemetry Sensor',
    zoneCode: 'N-14',
    location: 'Kohima Bypass Section Km 12',
    status: 'ONLINE' as const,
    isSimulated: true,
    soilMoisturePct: 58,
    slopeTiltDeg: 1.8,
    porePressureKPa: 28.0,
    batteryPct: 95,
    signalDbm: -65,
    lastPing: '2m ago',
    depthMeters: 5.0,
    history: [
      { timestamp: '10:00', soilMoisture: 30, tilt: 0.5, porePressure: 10.0 },
      { timestamp: '11:00', soilMoisture: 38, tilt: 0.9, porePressure: 14.5 },
      { timestamp: '12:00', soilMoisture: 45, tilt: 1.2, porePressure: 19.0 },
      { timestamp: '13:00', soilMoisture: 52, tilt: 1.5, porePressure: 23.5 },
      { timestamp: '14:00', soilMoisture: 58, tilt: 1.8, porePressure: 28.0 }
    ]
  }
];

export const serverAlerts = [
  {
    id: 'alt-1',
    alertCode: 'ALT-2026-N07',
    severity: 'CRITICAL' as const,
    zoneCode: 'N-07',
    locationName: 'Hunthar Ridge',
    district: 'Aizawl',
    state: 'Mizoram',
    riskScore: 92,
    headline: 'RED ALERT: Imminent Slope Shear Failure at Hunthar Escarpment (NH-54)',
    summary: 'Composite AI risk index reached 92%. In-situ piezometers report hydrostatic pore water pressure of 58.4 kPa with rapid angular tilt acceleration (5.6°). Sentinel-1 InSAR indicates -28.4 mm/yr surface creep.',
    timestamp: '14:32 IST',
    minutesAgo: 4,
    contributingTriggers: [
      'Precipitation > 42.5 mm/hr (Cloudburst)',
      'Volumetric Soil Saturation = 84%',
      'Tilt Rate Acceleration > 4.5°/hr',
      'InSAR LOS Displacement = -28.4 mm'
    ],
    threatenedCorridor: 'NH-54 & Downslope Settled Hamlet (14,200 Residents)',
    status: 'DISPATCHED' as const,
    dispatchedTo: [
      'State Disaster Management Authority (SDMA Mizoram)',
      'District Disaster Management Authority (DDMA Aizawl)',
      '1st Battalion NDRF Guwahati Detachment',
      'State Disaster Response Force (SDRF Mizoram)',
      'Superintendent of Police (Traffic), Aizawl'
    ],
    acknowledged: false
  },
  {
    id: 'alt-2',
    alertCode: 'ALT-2026-N03',
    severity: 'HIGH' as const,
    zoneCode: 'N-03',
    locationName: 'Sonapur Tunnel Slopes',
    district: 'East Jaintia Hills',
    state: 'Meghalaya',
    riskScore: 84,
    headline: 'ORANGE WARNING: High Mudflow Hazard along Sonapur NH-06 Lifeline Corridor',
    summary: 'Rainfall accumulation (142 mm in 24h) and high pore pressure (46.2 kPa) approaching critical shearing limit. Potential mudflow threatening to sever road connectivity to Barak Valley, Tripura & Mizoram.',
    timestamp: '14:15 IST',
    minutesAgo: 21,
    contributingTriggers: [
      '24h Precipitation = 142 mm',
      'Pore Pressure Transducer = 46.2 kPa',
      'Historical Limestone Dissolution Fissures'
    ],
    threatenedCorridor: 'NH-06 Sonapur Tunnel Km 142',
    status: 'DISPATCHED' as const,
    dispatchedTo: [
      'DDMA East Jaintia Hills (Khliehriat)',
      'Meghalaya PWD (Roads) Heavy Equipment Depot',
      'NHAI Project Implementation Unit'
    ],
    acknowledged: true
  },
  {
    id: 'alt-3',
    alertCode: 'ALT-2026-N11',
    severity: 'HIGH' as const,
    zoneCode: 'N-11',
    locationName: 'Ranipool - 9th Mile',
    district: 'Gangtok',
    state: 'Sikkim',
    riskScore: 78,
    headline: 'ORANGE WARNING: Tension Fissures Expanding on NH-10 Sikkim Highway',
    summary: 'Teesta basin orographic rainfall triggering continuous soil saturation (69%). Field officers report 12 cm longitudinal tension crack widening across roadway shoulder.',
    timestamp: '13:50 IST',
    minutesAgo: 46,
    contributingTriggers: [
      'Teesta River Toe Erosion Acceleration',
      'Field Recon Ticket FR-8821 Corroborated',
      'Pore Pressure = 38.5 kPa'
    ],
    threatenedCorridor: 'NH-10 Siliguri-Gangtok Corridor',
    status: 'DISPATCHED' as const,
    dispatchedTo: [
      'Sikkim State Disaster Management Authority (SSDMA)',
      'Border Roads Organisation (BRO Project Swastik)',
      'District Collector, Gangtok'
    ],
    acknowledged: true
  }
];

export interface ServerFieldReport {
  id: string;
  ticketNumber: string;
  reporterName: string;
  role: string;
  contact: string;
  zoneCode: string;
  location: string;
  coordinates: [number, number];
  reportType: string;
  severity: string;
  description: string;
  photoUrl?: string;
  timestamp: string;
  status: string;
  confidenceScore: number;
  triageNotes?: string;
}

export const serverFieldReports: ServerFieldReport[] = [
  {
    id: 'rep-1',
    ticketNumber: 'FR-8821',
    reporterName: 'Lalremruata Pachuau',
    role: 'Field Recon Officer' as const,
    contact: '+91 94361-XXXXX',
    zoneCode: 'N-07',
    location: 'Hunthar Veng Lower Step Section',
    coordinates: [23.7315, 92.7165] as [number, number],
    reportType: 'Ground Crack' as const,
    severity: 'CRITICAL' as const,
    description: 'Observed active 8cm widening tension crack propagating along the residential retaining wall behind Baptist Church. Muddy seep water emerging from slope toe.',
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
    timestamp: '12 mins ago',
    status: 'VERIFIED' as const,
    confidenceScore: 98,
    triageNotes: 'Corroborated with Sensor SN-07A sudden tilt surge (+1.4°/hr). DDMA Incident Commander alerted.'
  },
  {
    id: 'rep-2',
    ticketNumber: 'FR-8819',
    reporterName: 'Wansuk Dkhar',
    role: 'PWD Engineer' as const,
    contact: '+91 98622-XXXXX',
    zoneCode: 'N-03',
    location: 'Sonapur Tunnel East Portal Approach',
    coordinates: [25.1318, 92.3592] as [number, number],
    reportType: 'Rockfall / Debris' as const,
    severity: 'HIGH' as const,
    description: 'Minor shale fragments and mud slurries sliding onto eastbound carriageway. Heavy water runoff overloading mountain culvert drainage.',
    photoUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=800',
    timestamp: '38 mins ago',
    status: 'UNDER REVIEW' as const,
    confidenceScore: 92,
    triageNotes: 'JCB excavator mobilized on standby at Sonapur toll plaza.'
  }
];

export const serverEmergencyPriorities = [
  {
    rank: 1,
    zoneCode: 'N-07',
    zoneName: 'Hunthar Ridge',
    district: 'Aizawl',
    state: 'Mizoram',
    riskScore: 92,
    severity: 'CRITICAL' as const,
    reason: 'Active shear bedding plane failure triggered by continuous monsoonal downpour (42.5 mm/hr) and 84% volumetric soil saturation. Hydrostatic pore water pressure reached 58.4 kPa with acute angular tilt acceleration.',
    recommendedResponse: 'Issue immediate Red Alert pre-emptive evacuation order for downstream residential clusters. Enforce heavy vehicle diversions along NH-54 arterial bypass corridors.',
    contributingFactors: [
      'Precipitation Intensity: 42.5 mm/hr (Cloudburst Trigger)',
      'Subsurface Pore Water Pressure: 58.4 kPa',
      'In-Situ Inclinometer Tilt Acceleration: 5.6°',
      'InSAR Surface Creep: -28.4 mm/yr'
    ],
    affectedRoads: 'NH-54 (Aizawl - Silchar National Highway)',
    affectedSettlements: 'Hunthar Veng, Edenthar Sector, Durtlang Lowlands',
    status: 'ACTIVE EMERGENCY',
    primaryAction: 'Immediate Pre-Emptive Evacuation Directive',
    actionDetails: 'Issue Red Alert evacuation for 14,200 residents in Hunthar downslope runout fan. Divert all NH-54 traffic to Sairang-Lengpui bypass corridor.',
    targetDDMA: 'DDMA Aizawl & SDMA Mizoram',
    ndrfBattalionAssigned: '1st Bn NDRF Detachment (Patgaon / Silchar)',
    evacuationStatus: 'PRE-EMPTIVE EVACUATION ORDER' as const,
    estimatedPeopleAffected: 14200,
    shelterCapacityReady: true,
    evacuationShelters: [
      'Aizawl West Higher Secondary Hall (Capacity: 650, Medical: Ready)',
      'Government Central High School Edenthar (Capacity: 450, Medical: Ready)',
      'Bawngkawn Community Hall (Capacity: 800, Medical: Ready)'
    ],
    assignedUnits: [
      '1st Battalion NDRF Quick Response Team Alpha (48 Personnel)',
      'SDRF Mizoram Rescue Detachment 3 (24 Personnel)',
      'Border Roads Organisation (BRO) Heavy Earthmover Unit 14'
    ],
    roadClosureStatus: 'NH-54 Closed to civilian traffic at Km 4.2. Detour active via Sairang bypass.'
  },
  {
    rank: 2,
    zoneCode: 'N-03',
    zoneName: 'Sonapur Tunnel Slopes',
    district: 'East Jaintia Hills',
    state: 'Meghalaya',
    riskScore: 84,
    severity: 'HIGH' as const,
    reason: 'Saturated limestone-sandstone overburden with high pore pressure head (46.2 kPa). 24-hour rainfall accumulation of 142 mm threatening to release loose debris across the tunnel entrance.',
    recommendedResponse: 'Deploy SDRF quick-response detachment to Sonapur Tunnel east portal. Pre-position heavy hydraulic earthmovers and enforce convoy escort on NH-06.',
    contributingFactors: [
      '24h Rainfall Accumulation: 142.0 mm',
      'Pore Water Pressure Transducer: 46.2 kPa',
      'InSAR LOS Displacement: -21.8 mm/yr',
      'Historical Debris Flow Frequency: High'
    ],
    affectedRoads: 'NH-06 (Shillong - Silchar Lifeline Corridor)',
    affectedSettlements: 'Sonapur Village, Umkiang Transit Cluster',
    status: 'ELEVATED HAZARD',
    primaryAction: 'Deploy SDRF + Station Heavy Excavators',
    actionDetails: 'Position JCB excavators at Sonapur tunnel portal. Stage SDRF quick-response detachment at Umkiang.',
    targetDDMA: 'DDMA East Jaintia Hills (Khliehriat)',
    ndrfBattalionAssigned: '1st Bn NDRF Sub-team Silchar',
    evacuationStatus: 'ROAD CORRIDOR AT RISK' as const,
    estimatedPeopleAffected: 8600,
    shelterCapacityReady: true,
    evacuationShelters: [
      'Khliehriat Multi-Purpose Relief Center (Capacity: 500, Medical: Ready)',
      'Umkiang Community Hall (Capacity: 320, Medical: Standby)'
    ],
    assignedUnits: [
      'SDRF Meghalaya Response Team East Jaintia Hills (18 Personnel)',
      'PWD Meghalaya Highway Mechanical Division (3 Excavators)'
    ],
    roadClosureStatus: 'NH-06 regulated single-lane convoy transit under police pilot.'
  },
  {
    rank: 3,
    zoneCode: 'N-11',
    zoneName: '9th Mile - Ranipool',
    district: 'Gangtok',
    state: 'Sikkim',
    riskScore: 78,
    severity: 'HIGH' as const,
    reason: 'Toe scouring by Teesta River during torrential orographic downpours combined with longitudinal ground fissures expanding on NH-10.',
    recommendedResponse: 'Enforce one-way controlled traffic transit on NH-10. Coordinate with Border Roads Organisation (BRO) for emergency shotcrete and retaining wall reinforcement.',
    contributingFactors: [
      'Teesta River Toe Erosion Rate: Elevated',
      'Tension Crack Fissure Width: 12 cm',
      'Pore Water Pressure: 38.5 kPa'
    ],
    affectedRoads: 'NH-10 (Siliguri - Gangtok Arterial Link)',
    affectedSettlements: 'Ranipool Bazaar, 9th Mile Settlement',
    status: 'MONITORING INTENSIVE',
    primaryAction: 'One-Way Transit & BRO Slope Patrol',
    actionDetails: 'Station BRO Swastik repair detachment at 9th Mile. Implement one-way regulated traffic for civilian transit.',
    targetDDMA: 'SSDMA & District Collector Gangtok',
    ndrfBattalionAssigned: '2nd Bn NDRF Siliguri',
    evacuationStatus: 'IMMEDIATE FIELD VERIFICATION' as const,
    estimatedPeopleAffected: 6400,
    shelterCapacityReady: true,
    evacuationShelters: [
      'Ranipool Stadium Indoor Hall (Capacity: 600, Medical: Ready)',
      'Singtam Secondary School Shelter (Capacity: 400, Medical: Ready)'
    ],
    assignedUnits: [
      'BRO Project Swastik Rapid Engineering Unit (12 Personnel)',
      'Sikkim Police Highway Patrol Team'
    ],
    roadClosureStatus: 'NH-10 open with 20 km/h speed restriction and no night heavy-vehicle movement.'
  },
  {
    rank: 4,
    zoneCode: 'N-14',
    zoneName: 'Kohima Bypass Overhang',
    district: 'Kohima',
    state: 'Nagaland',
    riskScore: 68,
    severity: 'MODERATE' as const,
    reason: 'Continuous moderate monsoonal precipitation with basal inclinometer creep within acceptable factor of safety margins.',
    recommendedResponse: 'Maintain automated sensor polling interval at 30 seconds. Conduct twice-daily physical ground reconnaissance along NH-29 bypass.',
    contributingFactors: [
      'Rainfall Intensity: 22.0 mm/hr',
      'Soil Moisture: 58%',
      'Pore Pressure: 28.0 kPa'
    ],
    affectedRoads: 'NH-29 (Dimapur - Kohima Highway)',
    affectedSettlements: 'Kohima South Ridge Hamlets',
    status: 'STANDBY',
    primaryAction: 'Automated 30-Sec In-Situ Telemetry Polling',
    actionDetails: 'Maintain automated telemetry polling interval at 30 seconds. Visual spot checks twice daily.',
    targetDDMA: 'DDMA Kohima & NSDMA',
    ndrfBattalionAssigned: '12th Bn NDRF Doimukh Standby',
    evacuationStatus: 'STANDBY MONITORING' as const,
    estimatedPeopleAffected: 4200,
    shelterCapacityReady: true,
    evacuationShelters: [
      'Kohima South Community Center (Capacity: 350, Medical: Standby)'
    ],
    assignedUnits: [
      'Kohima District Disaster Volunteer Corps'
    ],
    roadClosureStatus: 'NH-29 fully open in both directions.'
  }
];
