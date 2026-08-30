# SLOPE SHIELD — AI PROJECT CONTEXT & DEVELOPMENT HANDOVER

## 0. IMPORTANT — READ THIS FIRST

You are working on an existing Smart India Hackathon 2026 project.

Project:
SLOPE SHIELD

SIH Problem Statement:
PS 26001

Problem Statement:
AI Based Early Warning and Landslide Risk Monitoring System in NER

Theme:
DISASTER MANAGEMENT

Team:
NEXORA

This is NOT a toy project or a simple demo website.

The goal is to develop a professional, technically credible, visually impressive disaster-intelligence and landslide early-warning platform suitable for a real SIH hackathon demonstration.

The application should feel like a serious operational platform for disaster-management authorities while remaining clearly transparent about simulated/demo integrations.

---

# 1. PROJECT VISION

SLOPE SHIELD is an AI-assisted landslide early-warning and risk-monitoring platform designed for vulnerable regions of Northeast India.

The platform combines multiple sources of information:

- IoT/geotechnical sensor telemetry
- Rainfall/weather information
- Satellite InSAR deformation observations
- Terrain and slope information
- Historical landslide information
- Crowdsourced field reports
- AI/ML risk analysis

The system converts these inputs into:

1. Regional risk intelligence
2. Hyperlocal landslide risk scores
3. Explainable risk factors
4. Temporal risk forecasts
5. Early-warning alerts
6. Emergency response priorities
7. GIS-based visualization
8. Field reconnaissance intelligence

The core concept is:

DATA SOURCES
    ↓
DATA FUSION
    ↓
AI / RISK ENGINE
    ↓
EXPLAINABLE RISK SCORE
    ↓
EARLY WARNING
    ↓
EMERGENCY RESPONSE

The SIH concept specifically emphasizes multi-source fusion of satellite InSAR, IoT ground sensors and rainfall information, hyperlocal prediction, low-cost edge sensing and actionable alerts. 

---

# 2. CURRENT PROJECT STATUS

IMPORTANT:

The project already has substantial implementation.

DO NOT rebuild the project from scratch.

DO NOT replace the architecture unnecessarily.

DO NOT delete working features simply to simplify the code.

DO NOT replace working backend/API functionality with static mock UI.

DO NOT assume that an existing feature is missing just because it is implemented differently than expected.

FIRST inspect the repository.

Understand the existing implementation before modifying anything.

---

# 3. CURRENT DEVELOPMENT PHASE

Completed:

## Phase 1 — Project Foundation

Completed.

The application has:

- React frontend
- TypeScript
- Vite
- Backend services
- FastAPI-related backend structure
- Existing server architecture
- Demo/simulation data
- Routing
- Core components
- Existing data models

---

## Phase 2 — Frontend ↔ Backend Integration

Completed.

The project has a typed REST API architecture and frontend service layer.

Important existing API concepts include:

- Dashboard
- Risk zones
- Risk analysis
- Risk simulation
- Sensors
- Alerts
- Reports
- Emergency priorities
- Weather
- Satellite

The frontend communicates with backend services through centralized API/service abstractions.

The application also has fallback behavior when the backend/API is unavailable.

DO NOT break this functionality while improving the UI.

---

# 4. IMPORTANT CURRENT ARCHITECTURE

Before changing anything, inspect:

## Frontend

Look inside:

- `src/`
- `src/components/`
- `src/pages/`
- `src/services/`
- `src/types/`
- `src/index.css`

Also inspect:

- `package.json`
- `vite.config.ts`
- `tsconfig.json`

---

## Backend

Inspect:

- `backend/`
- `backend/app/`

Also inspect:

- `server/`
- `server.ts`

Understand which backend implementation is currently active before making changes.

DO NOT remove one backend simply because another backend exists.

---

# 5. CURRENT MAJOR APPLICATION AREAS

The platform should provide these major operational areas:

## MONITORING

- Dashboard
- Risk Map
- Risk Analysis

## DATA INTELLIGENCE

- Sensors
- Reports

## RESPONSE

- Alerts
- Emergency Response

## SYSTEM

- Settings

The navigation and information architecture should remain coherent.

---

# 6. CORE DASHBOARD CONCEPT

The Dashboard is the primary disaster command-center view.

It should communicate:

### Regional Risk Intelligence

Target region:

Northeast India

Example regional context:

- Assam
- Meghalaya
- Sikkim
- Nagaland
- Mizoram
- Manipur
- Tripura
- Arunachal Pradesh

Example regional grid reference:

26.0°N, 92.5°E

The dashboard should prioritize:

1. Current regional risk
2. Critical/high-risk zones
3. Active warnings
4. GIS risk visualization
5. AI risk explanation
6. Sensor telemetry
7. Rainfall intelligence
8. Satellite deformation
9. Road connectivity
10. Field reports
11. Emergency response priorities
12. Data-source pipeline

---

# 7. CURRENT DESIGN DIRECTION

The website must NOT look like a generic admin dashboard.

It should feel like:

- Disaster intelligence command center
- Modern geospatial monitoring platform
- AI-powered operational console
- Government/public-safety technology platform

Visual inspiration may include the quality and polish associated with:

- Linear
- Stripe
- Vercel
- Rive

IMPORTANT:

Do NOT copy their layouts or branding.

Use them only as inspiration for:

- visual polish
- spacing
- typography
- interaction quality
- modern gradients
- hierarchy
- animation
- component consistency

---

# 8. VISUAL LANGUAGE

The interface should be:

- Premium
- Modern
- Vibrant
- Professional
- Trustworthy
- High-tech
- Operational
- Data-dense but readable

Use:

- Dark command-center foundation
- Electric cyan accents
- Teal
- Violet
- Blue
- Controlled gradients
- Subtle glows
- Rounded panels
- Strong typography hierarchy
- Data visualization
- Clear severity indicators
- Smooth micro-interactions

Avoid:

- childish gaming UI
- excessive neon
- excessive glassmorphism
- unnecessary animations
- huge empty spaces
- generic Bootstrap appearance
- excessive rounded cards
- random gradients
- visual clutter
- fake "AI" decoration without functional meaning

---

# 9. COLOR SEMANTICS

Risk severity must remain semantically consistent.

LOW:
Emerald / green

MODERATE:
Amber / yellow

HIGH:
Orange

CRITICAL:
Red

System operational:
Green

Demo/simulation:
Amber

Primary technology accent:
Electric cyan / teal

AI intelligence:
Violet / blue

Never communicate severity using color alone.

Always combine:

- color
- text
- icon
- appropriate visual indicator

---

# 10. TYPOGRAPHY

Prefer a professional modern UI font such as:

Inter

For numerical telemetry, timestamps and technical values, a monospace font such as:

JetBrains Mono

can be used selectively.

Maintain a strong hierarchy:

- page title
- section title
- card title
- metric
- supporting label
- metadata

Do not use oversized typography that reduces dashboard information density.

---

# 11. UI PRINCIPLES

Every page must follow these principles:

### Information hierarchy

The most important information should be visually dominant.

Example:

CRITICAL RISK

should be immediately understandable before secondary telemetry.

### Scanability

An emergency operator should be able to understand the state of the system quickly.

### Consistency

Buttons, cards, badges, tables, charts, tabs and alerts should share a consistent design system.

### Responsiveness

The interface must work on:

- desktop
- laptop
- tablet
- smaller screens

Do not design only for one screen size.

---

# 12. MAP / GIS EXPERIENCE

The Risk Map is a major product feature.

It should communicate:

- hazard zones
- risk severity
- geographic position
- roads
- settlements
- rainfall
- slope
- satellite deformation
- sensor locations
- evacuation corridors

Possible map layers:

- Risk Zones
- Rainfall
- Slope
- Roads
- Settlements
- Satellite / InSAR

The map should feel like an actual operational GIS workspace.

Avoid using a static decorative map if the existing architecture supports interaction.

If the current implementation uses a placeholder/demo GIS layer, improve the presentation without falsely claiming a live government GIS integration.

---

# 13. AI RISK ENGINE

The Risk Analysis area should communicate explainable AI.

Example factors:

- Rainfall intensity
- Soil moisture saturation
- Slope instability / tilt
- Historical susceptibility
- Pore pressure
- Surface deformation

The UI should make it obvious:

CURRENT RISK SCORE
+
CONTRIBUTING FACTORS
+
TEMPORAL FORECAST
+
WHAT-IF SIMULATION

The user should understand WHY the risk score exists.

Avoid making the AI look like a black box.

---

# 14. SENSOR INTELLIGENCE

Sensor monitoring may include:

- soil moisture
- slope tilt
- pore pressure
- piezometers
- inclinometers
- rainfall gauges

Telemetry UI should include useful information such as:

- current value
- unit
- status
- trend
- timestamp
- signal/battery when available
- location/zone

Charts should communicate trends rather than simply decorate the page.

---

# 15. WEATHER INTELLIGENCE

Weather/rainfall information may include:

- current rainfall rate
- 24-hour accumulation
- forecast trend
- heavy rainfall state
- saturation-related interpretation

Always make clear when the data is simulated/demo data.

Do not claim a live weather provider is connected unless the code actually connects to one.

---

# 16. SATELLITE / INSAR

The platform should communicate:

- surface displacement
- deformation trend
- observation frequency
- coverage
- Sentinel-1 / InSAR context

If the integration is simulated or integration-ready:

SHOW THIS CLEARLY.

Do not present simulated observations as live satellite data.

---

# 17. ALERT SYSTEM

Alerts should be highly visible but not visually chaotic.

Support concepts such as:

- CRITICAL
- HIGH
- MODERATE
- LOW

Alerts may communicate:

- location
- trigger factors
- timestamp
- severity
- acknowledgement
- dispatch state

Emergency alerts should have strong visual hierarchy.

---

# 18. EMERGENCY RESPONSE

Emergency Response is an important differentiating feature.

It should help answer:

"WHAT SHOULD AUTHORITIES DO NEXT?"

Potential information:

- response priority
- risk score
- affected roads
- affected settlements
- evacuation shelters
- response units
- road closures
- deployment status
- CAP broadcast simulation

The interface should prioritize action over decoration.

---

# 19. FIELD REPORTS

Field reporting should support the concept of:

1-Tap field reconnaissance.

Potential information:

- report ID
- location
- coordinates
- report type
- severity
- timestamp
- verification state
- description
- photo evidence
- AI confidence when available

The interface should make reports easy to triage.

---

# 20. DEMO / SIMULATION TRANSPARENCY

This is extremely important.

Some current data/integrations are simulated or demo data.

Never falsely claim that:

- government systems are connected
- NDRF is actually receiving notifications
- SDRF is actually receiving deployments
- SMS is actually being sent
- WhatsApp messages are actually being delivered
- satellite feeds are live
- weather APIs are live
- government databases are connected

Use labels such as:

- DEMO MODE
- SIMULATED
- SIMULATED SENSOR
- SIMULATED WEATHER FEED
- INTEGRATION READY
- SIMULATED GATEWAY

The project should demonstrate the architecture without misleading judges.

---

# 21. API / BACKEND SAFETY RULE

When modifying the frontend:

DO NOT:

- remove API services
- rename API endpoints unnecessarily
- remove API calls
- replace backend data with hardcoded values
- break TypeScript interfaces
- remove error handling
- remove fallback behavior
- remove loading states
- remove error states

unless explicitly instructed.

UI improvements must preserve the existing backend contracts.

---

# 22. ERROR HANDLING

Every major page should gracefully handle:

### Loading

Show a polished loading state.

### Empty

Show a useful empty state.

### Error

Show a clear recovery option.

### Offline/demo fallback

Clearly communicate that the system is operating using fallback/demo data.

Never allow a runtime error to produce a blank screen.

---

# 23. PERFORMANCE

Do not introduce unnecessary heavy dependencies.

Prefer:

- existing libraries
- CSS animations
- lightweight SVG
- efficient charts
- lazy loading when appropriate

Avoid unnecessary:

- 3D engines
- huge animation libraries
- giant background videos
- excessive particle effects

The dashboard must remain responsive.

---

# 24. ACCESSIBILITY

Maintain:

- readable contrast
- keyboard accessibility
- semantic buttons
- meaningful labels
- visible focus states
- non-color severity indicators
- accessible charts where possible

Do not sacrifice usability for visual effects.

---

# 25. ANIMATION PRINCIPLES

Animations should communicate system activity.

Good examples:

- KPI number transitions
- chart drawing
- critical zone pulse
- alert appearance
- hover elevation
- active navigation indicator
- map marker pulse
- status indicator

Avoid:

- constant distracting motion
- excessive bouncing
- animation on every element
- animations that slow navigation

Animations should generally be short and smooth.

---

# 26. COMPONENT REUSE

Create reusable components where appropriate.

Examples:

- Card
- KPI card
- Severity badge
- Status badge
- Button
- Tabs
- Modal
- Alert card
- Data table
- Chart container
- Section header
- Loading state
- Empty state
- Error state

Do not duplicate large amounts of JSX unnecessarily.

---

# 27. CODE QUALITY

Use:

- TypeScript
- meaningful component names
- reusable components
- typed props
- clear service boundaries
- maintainable CSS
- existing project conventions

Avoid:

- `any` unless genuinely necessary
- giant components
- duplicated styles
- dead code
- unused imports
- unnecessary abstractions
- magic numbers scattered throughout the UI

---

# 28. GIT SAFETY

This project is tracked in GitHub.

Before major changes:

1. Check Git status.
2. Understand current branch.
3. Make the requested change.
4. Test the application.
5. Run build/type checks.
6. Commit the completed phase.
7. Push to GitHub.

Never reset or delete Git history without explicit instruction.

Never force-push unless explicitly requested.

---

# 29. PHASE ROADMAP

## PHASE 1 — FOUNDATION

STATUS:
COMPLETED

Core application architecture and project foundation.

---

## PHASE 2 — FRONTEND ↔ BACKEND INTEGRATION

STATUS:
COMPLETED

REST/API integration, backend services, typed API client, domain services and fallback behavior.

---

## PHASE 3 — PREMIUM UI/UX DESIGN SYSTEM

STATUS:
NEXT

Goals:

- establish final visual language
- redesign global layout
- improve typography
- improve cards
- improve buttons
- improve navigation
- improve badges
- improve spacing
- establish gradients
- establish shadows/glows
- establish animation principles
- improve responsive behavior

IMPORTANT:

Do not redesign each page independently with unrelated styling.

Create a cohesive design system first.

---

## PHASE 4 — COMMAND CENTER DASHBOARD

Goals:

- premium dashboard
- high-impact regional risk hero
- KPI intelligence
- risk map
- AI risk summary
- weather
- satellite
- sensors
- alerts
- field intelligence
- emergency priorities
- risk trends
- data pipeline

The dashboard should immediately communicate the value of Slope Shield to an SIH judge.

---

## PHASE 5 — GIS RISK INTELLIGENCE

Goals:

- interactive risk map
- zone selection
- severity visualization
- map layers
- sensor markers
- roads
- settlements
- rainfall
- slope
- InSAR
- evacuation corridors
- map legends
- geographic filtering

---

## PHASE 6 — AI RISK ANALYSIS

Goals:

- explainable risk engine
- contributor visualization
- risk score
- safety factor
- temporal forecast
- what-if simulation
- scenario comparison
- AI reasoning presentation

---

## PHASE 7 — MULTI-SOURCE DATA INTELLIGENCE

Goals:

- sensor telemetry
- rainfall
- satellite deformation
- terrain
- historical data
- crowdsourced reports
- unified data-fusion presentation

The goal is to visually demonstrate:

MULTI-SOURCE DATA
→ FUSION
→ AI
→ RISK

---

## PHASE 8 — ALERTS & EMERGENCY RESPONSE

Goals:

- critical alert workflow
- acknowledgement
- emergency priority matrix
- shelters
- response units
- road detours
- CAP simulation
- response timeline
- operational decision support

---

## PHASE 9 — TESTING / SECURITY / PERFORMANCE

Goals:

- test every route
- test API failure
- test loading states
- test empty states
- test emergency workflows
- test forms
- test responsive layouts
- fix console errors
- fix TypeScript errors
- improve performance
- review security
- remove accidental debug code

---

## PHASE 10 — SIH FINAL POLISH

Goals:

- final visual polish
- consistent spacing
- final animation refinement
- presentation-ready dashboard
- judge-friendly demo flow
- realistic operational storytelling
- final build
- final GitHub checkpoint
- README improvement
- architecture documentation
- demo preparation

---

# 30. SIH DEMO STORY

The ideal demonstration should communicate:

### STEP 1

The system monitors vulnerable terrain.

### STEP 2

Multiple sources provide data:

Weather
+
Sensors
+
Satellite
+
Terrain
+
Historical
+
Field Reports

### STEP 3

The AI risk engine fuses the information.

### STEP 4

The system identifies a rising landslide risk.

### STEP 5

The dashboard explains WHY the risk is high.

### STEP 6

The map shows WHERE the risk is.

### STEP 7

The alert system determines WHO should be warned.

### STEP 8

Emergency Response determines WHAT should happen next.

### STEP 9

Authorities can simulate scenarios using the risk engine.

This creates a complete:

SENSE → ANALYZE → PREDICT → WARN → RESPOND

story.

---

# 31. IMPORTANT DEVELOPMENT RULE FOR AI AGENTS

When asked to implement a phase:

FIRST:

- inspect the repository
- inspect package.json
- inspect existing architecture
- inspect relevant components
- inspect API services
- inspect types
- inspect current styling
- inspect routes

THEN:

- make a plan
- identify files that need modification
- implement incrementally

AFTER:

- run type checking
- run build
- check for runtime errors
- verify navigation
- verify API functionality
- verify responsive behavior

Do not blindly rewrite the project.

---

# 32. HANDOVER PROTOCOL FOR A NEW AI ACCOUNT

If another AI account takes over this project:

DO NOT assume it knows anything from previous conversations.

Read this file first.

Then inspect the repository.

Then inspect Git history.

Determine:

- completed phases
- current phase
- current architecture
- current working state
- files changed recently

Before editing, provide a short understanding summary.

Only then begin implementation.

---

# 33. WHEN AN AI ACCOUNT LIMIT IS REACHED

The project may be continued using another AI account.

The new AI account should:

1. Open the same repository.
2. Read `prompt.md`.
3. Inspect the current code.
4. Check Git status.
5. Inspect recent commits.
6. Identify the current phase.
7. Continue from the latest stable implementation.

Do NOT restart the project.

Do NOT recreate existing features.

Do NOT assume previous work is missing.

---

# 34. DEFINITION OF DONE FOR EVERY PHASE

A phase is NOT complete merely because code was generated.

A phase is complete only when:

- requested functionality exists
- existing functionality still works
- no major runtime errors exist
- navigation works
- API integration still works
- TypeScript passes
- production build passes
- UI is responsive
- loading/error states work
- demo/simulation labels remain accurate
- code is committed to Git
- changes are pushed to GitHub

---

# 35. FINAL QUALITY STANDARD

Ask before considering the project complete:

Would this look like a serious product if shown to:

- SIH judges
- disaster-management officials
- technical judges
- software engineers
- GIS specialists
- AI/ML reviewers

The answer should be YES.

The project should demonstrate:

TECHNICAL DEPTH
+
AI INTELLIGENCE
+
GIS
+
MULTI-SOURCE DATA
+
ACTIONABLE ALERTS
+
EMERGENCY RESPONSE
+
PROFESSIONAL UI/UX

---

# 36. NON-NEGOTIABLE RULE

DO NOT sacrifice technical correctness for visual appearance.

DO NOT sacrifice usability for visual effects.

DO NOT sacrifice existing functionality for a redesign.

DO NOT fabricate live integrations.

DO NOT claim simulated data is real.

DO NOT rewrite stable architecture unnecessarily.

DO NOT make destructive changes without understanding the repository.

The goal is:

A technically credible,
visually exceptional,
operationally understandable,
SIH-ready
landslide early-warning platform.

---

# END OF SLOPE SHIELD PROJECT CONTEXT