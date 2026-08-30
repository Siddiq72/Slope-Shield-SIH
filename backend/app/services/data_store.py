# In-memory calibrated store for FastAPI backend

risk_zones_db = [
    {
        "id": "zone-1",
        "code": "N-07",
        "name": "Hunthar Escarpment Corridor",
        "district": "Aizawl",
        "state": "Mizoram",
        "coordinates": [23.7307, 92.7173],
        "riskScore": 92,
        "riskLevel": "CRITICAL",
        "slopeAngleDeg": 48.0,
        "soilMoisturePct": 84.0,
        "rainfallRateMmHr": 42.5,
        "accumulation24hMm": 168.4,
        "porePressureKPa": 58.4,
        "insarDisplacementMm": -28.4,
        "historicalVulnerabilityPct": 88.0,
        "slopeInstabilityPct": 91.0,
        "roadStatus": "BLOCKED",
        "affectedRoad": "NH-54 (Aizawl - Silchar National Highway)",
        "forecast6h": {
            "from": "HIGH",
            "to": "CRITICAL",
            "projectedScore": 96,
            "trend": "INCREASING"
        },
        "populationAtRisk": 14200,
        "sensorNodeId": "SN-07A",
        "lastUpdated": "1 min ago",
        "description": "Active bedding slip along fractured Disang shale. Hydrostatic pore water saturation triggering acute creep.",
        "recommendedAction": "Execute Pre-Emptive Evacuation Order for Downslope Settlements."
    },
    {
        "id": "zone-2",
        "code": "N-03",
        "name": "Sonapur Tunnel Approach Slopes",
        "district": "East Jaintia Hills",
        "state": "Meghalaya",
        "coordinates": [25.1322, 92.3584],
        "riskScore": 84,
        "riskLevel": "HIGH",
        "slopeAngleDeg": 42.0,
        "soilMoisturePct": 76.0,
        "rainfallRateMmHr": 34.0,
        "accumulation24hMm": 142.0,
        "porePressureKPa": 46.2,
        "insarDisplacementMm": -21.8,
        "historicalVulnerabilityPct": 82.0,
        "slopeInstabilityPct": 79.0,
        "roadStatus": "AT RISK",
        "affectedRoad": "NH-06 (Shillong - Silchar Lifeline Highway)",
        "forecast6h": {
            "from": "MODERATE",
            "to": "HIGH",
            "projectedScore": 89,
            "trend": "INCREASING"
        },
        "populationAtRisk": 8600,
        "sensorNodeId": "SN-03B",
        "lastUpdated": "3 mins ago",
        "description": "Heavy limestone-sandstone overburden saturated by monsoonal downpours.",
        "recommendedAction": "Deploy SDRF quick response unit to NH-06 kilometer marker 142."
    },
    {
        "id": "zone-3",
        "code": "N-11",
        "name": "9th Mile - Ranipool Highway Ridge",
        "district": "Gangtok",
        "state": "Sikkim",
        "coordinates": [27.3389, 88.6065],
        "riskScore": 78,
        "riskLevel": "HIGH",
        "slopeAngleDeg": 45.0,
        "soilMoisturePct": 69.0,
        "rainfallRateMmHr": 28.5,
        "accumulation24hMm": 118.0,
        "porePressureKPa": 38.5,
        "insarDisplacementMm": -14.2,
        "historicalVulnerabilityPct": 79.0,
        "slopeInstabilityPct": 74.0,
        "roadStatus": "AT RISK",
        "affectedRoad": "NH-10 (Siliguri - Gangtok Arterial Link)",
        "forecast6h": {
            "from": "MODERATE",
            "to": "HIGH",
            "projectedScore": 82,
            "trend": "INCREASING"
        },
        "populationAtRisk": 6400,
        "sensorNodeId": "SN-11C",
        "lastUpdated": "4 mins ago",
        "description": "Tension fissures expanding along the upper colluvium boundary. Teesta river scouring slope toe.",
        "recommendedAction": "One-way controlled transit on NH-10. Station Border Roads Organisation patrol."
    },
    {
        "id": "zone-4",
        "code": "N-14",
        "name": "Kohima Bypass Overhang",
        "district": "Kohima",
        "state": "Nagaland",
        "coordinates": [25.6751, 94.1086],
        "riskScore": 68,
        "riskLevel": "MODERATE",
        "slopeAngleDeg": 38.0,
        "soilMoisturePct": 58.0,
        "rainfallRateMmHr": 22.0,
        "accumulation24hMm": 85.0,
        "porePressureKPa": 28.0,
        "insarDisplacementMm": -9.5,
        "historicalVulnerabilityPct": 65.0,
        "slopeInstabilityPct": 62.0,
        "roadStatus": "OPEN",
        "affectedRoad": "NH-29 (Dimapur - Kohima Highway)",
        "forecast6h": {
            "from": "MODERATE",
            "to": "MODERATE",
            "projectedScore": 71,
            "trend": "STABLE"
        },
        "populationAtRisk": 4200,
        "sensorNodeId": "SN-14A",
        "lastUpdated": "6 mins ago",
        "description": "Continuous moderate rainfall with nominal basal creep within tolerance threshold.",
        "recommendedAction": "Routine automated telemetry polling. Visual spot-checks."
    }
]

sensors_db = [
    {
        "id": "sens-1",
        "nodeId": "SN-07A",
        "nodeName": "Hunthar Deep Piezometer Probe A",
        "zoneCode": "N-07",
        "location": "Hunthar Ridge Km 4.2, Aizawl",
        "status": "WARNING",
        "isSimulated": True,
        "soilMoisturePct": 84.0,
        "slopeTiltDeg": 5.6,
        "porePressureKPa": 58.4,
        "batteryPct": 92,
        "signalDbm": -68,
        "lastPing": "30s ago",
        "depthMeters": 8.5,
        "history": [
            {"timestamp": "10:00", "soilMoisture": 42, "tilt": 1.2, "porePressure": 18.2},
            {"timestamp": "11:00", "soilMoisture": 54, "tilt": 2.1, "porePressure": 28.4},
            {"timestamp": "12:00", "soilMoisture": 68, "tilt": 3.4, "porePressure": 41.0},
            {"timestamp": "13:00", "soilMoisture": 79, "tilt": 4.8, "porePressure": 52.1},
            {"timestamp": "14:00", "soilMoisture": 84, "tilt": 5.6, "porePressure": 58.4}
        ]
    },
    {
        "id": "sens-2",
        "nodeId": "SN-03B",
        "nodeName": "Sonapur Inclinometer Array B",
        "zoneCode": "N-03",
        "location": "East Jaintia Hills, NH-06",
        "status": "WARNING",
        "isSimulated": True,
        "soilMoisturePct": 76.0,
        "slopeTiltDeg": 4.2,
        "porePressureKPa": 46.2,
        "batteryPct": 88,
        "signalDbm": -74,
        "lastPing": "1m ago",
        "depthMeters": 6.0,
        "history": [
            {"timestamp": "10:00", "soilMoisture": 38, "tilt": 0.9, "porePressure": 14.1},
            {"timestamp": "11:00", "soilMoisture": 48, "tilt": 1.6, "porePressure": 22.0},
            {"timestamp": "12:00", "soilMoisture": 61, "tilt": 2.8, "porePressure": 33.5},
            {"timestamp": "13:00", "soilMoisture": 71, "tilt": 3.6, "porePressure": 41.2},
            {"timestamp": "14:00", "soilMoisture": 76, "tilt": 4.2, "porePressure": 46.2}
        ]
    }
]

alerts_db = [
    {
        "id": "alt-1",
        "alertCode": "ALT-2026-N07",
        "severity": "CRITICAL",
        "zoneCode": "N-07",
        "locationName": "Hunthar Ridge",
        "district": "Aizawl",
        "state": "Mizoram",
        "riskScore": 92,
        "headline": "RED ALERT: Imminent Slope Shear Failure at Hunthar Escarpment (NH-54)",
        "summary": "Composite AI risk index reached 92%. In-situ piezometers report hydrostatic pore water pressure of 58.4 kPa with rapid angular tilt acceleration (5.6°).",
        "timestamp": "14:32 IST",
        "minutesAgo": 4,
        "contributingTriggers": [
            "Precipitation > 42.5 mm/hr (Cloudburst)",
            "Volumetric Soil Saturation = 84%",
            "Tilt Rate Acceleration > 4.5°/hr",
            "InSAR LOS Displacement = -28.4 mm"
        ],
        "threatenedCorridor": "NH-54 & Downslope Settled Hamlet (14,200 Residents)",
        "status": "DISPATCHED",
        "dispatchedTo": [
            "SDMA Mizoram",
            "DDMA Aizawl",
            "1st Battalion NDRF Guwahati",
            "SDRF Mizoram"
        ],
        "acknowledged": False
    }
]

reports_db = [
    {
        "id": "rep-1",
        "ticketNumber": "FR-8821",
        "reporterName": "Lalremruata Pachuau",
        "role": "Field Recon Officer",
        "contact": "+91 94361-XXXXX",
        "zoneCode": "N-07",
        "location": "Hunthar Veng Lower Step Section",
        "coordinates": [23.7315, 92.7165],
        "reportType": "Ground Crack",
        "severity": "CRITICAL",
        "description": "Observed active 8cm widening tension crack propagating along retaining wall.",
        "photoUrl": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
        "timestamp": "12 mins ago",
        "status": "VERIFIED",
        "confidenceScore": 98,
        "triageNotes": "Corroborated with Sensor SN-07A sudden tilt surge (+1.4°/hr)."
    }
]

emergency_db = [
    {
        "rank": 1,
        "zoneCode": "N-07",
        "zoneName": "Hunthar Ridge",
        "district": "Aizawl",
        "state": "Mizoram",
        "riskScore": 92,
        "severity": "CRITICAL",
        "reason": "Active shear bedding plane failure triggered by continuous monsoonal downpour (42.5 mm/hr) and 84% volumetric soil saturation.",
        "recommendedResponse": "Issue immediate Red Alert pre-emptive evacuation order for downstream residential clusters.",
        "contributingFactors": [
            "Precipitation Intensity: 42.5 mm/hr",
            "Subsurface Pore Water Pressure: 58.4 kPa",
            "In-Situ Inclinometer Tilt Acceleration: 5.6°"
        ],
        "affectedRoads": "NH-54 (Aizawl - Silchar National Highway)",
        "affectedSettlements": "Hunthar Veng, Edenthar Sector",
        "status": "ACTIVE EMERGENCY",
        "primaryAction": "Immediate Pre-Emptive Evacuation Directive",
        "actionDetails": "Issue Red Alert evacuation for 14,200 residents in Hunthar downslope runout fan.",
        "targetDDMA": "DDMA Aizawl & SDMA Mizoram",
        "ndrfBattalionAssigned": "1st Bn NDRF Detachment",
        "evacuationStatus": "PRE-EMPTIVE EVACUATION ORDER",
        "estimatedPeopleAffected": 14200,
        "shelterCapacityReady": True,
        "evacuationShelters": [
            "Aizawl West Higher Secondary Hall (Capacity: 650)",
            "Government Central High School Edenthar (Capacity: 450)"
        ],
        "assignedUnits": [
            "1st Battalion NDRF Quick Response Team Alpha",
            "SDRF Mizoram Rescue Detachment 3"
        ],
        "roadClosureStatus": "NH-54 Closed to civilian traffic at Km 4.2."
    }
]
