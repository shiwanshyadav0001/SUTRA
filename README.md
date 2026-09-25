# SUTRA — Unified Governance Intelligence
### *CONNECTING PROGRAMMES. REVEALING IMPACT.*

**SUTRA** is an AI-powered Cross-Ministry Governance & Impact Intelligence Platform engineered for senior public policy leaders and apex government decision-makers (PMO, NITI Aayog, Ministry secretaries).

---

## 🏛️ Executive Summary

Government programmes generate petabytes of data across distinct ministries, expenditure systems, portal databases, and state registries. However, datasets are structurally fragmented.

**SUTRA solves the three fundamental governance questions:**
1. **WHAT IS HAPPENING?** (Cross-ministry financial and physical delivery metrics)
2. **WHY IS IT HAPPENING?** (Decomposed attribution factors across geography, logistics, and demographics)
3. **WHERE SHOULD ATTENTION BE DIRECTED?** (Algorithmic prioritization of geographic gaps and implementation signals)

Every recommendation adheres to the **SUTRA Traceability Chain**:
$$\text{FINDING} \longrightarrow \text{FACTORS} \longrightarrow \text{DATA} \longrightarrow \text{SOURCE} \longrightarrow \text{EVIDENCE RECORD}$$

---

## 📊 Core Data Architecture & Provenance

```
                          ┌───────────────────────────┐
                          │    PUBLIC DATA SOURCES    │
                          └─────────────┬─────────────┘
                                        │
           ┌────────────────────────────┼───────────────────────────┐
           ▼                            ▼                           ▼
   data.gov.in                     Union Budget                   PFMS
(OGD Platform India)          (Ministry of Finance)        (Expenditure Ledger)
           │                            │                           │
           └────────────────────────────┼───────────────────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │   SUTRA INGESTION LAYER     │
                         │ • Schema Validation (LGD)   │
                         │ • Token Sanitization        │
                         │ • Phonetic Entity Resolution│
                         └──────────────┬──────────────┘
                                        │
                   ┌────────────────────┴────────────────────┐
                   ▼                                         ▼
     Canonical Entity Graph                 Operational Telemetry Bridge
 (Ministries, Schemes, Districts)          (Outcome indices & Sensor feeds)
                   │                                         │
                   └────────────────────┬────────────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │  SUTRA INTELLIGENCE ENGINES │
                         │ • Overlap Engine (Cosine/J) │
                         │ • Geographic Gap Engine     │
                         │ • Anomaly & Signal Engine   │
                         │ • Deterministic Query Parse │
                         └──────────────┬──────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
     Command Center              Ask SUTRA Query            Cartographic GIS
  (National Overview)         (Evidence-Linked DB)      (36 Maharashtra Dists)
```

### Transparent Data Attribution
- **Government Open Data**: Ingested from [data.gov.in](https://data.gov.in) catalogues for schemes, departments, and Local Government Directory (LGD) district boundaries.
- **Union Budget & PFMS**: Sourced from Union Budget Statements and Public Financial Management System expenditure feeds for allocation vs drawdown tranches.
- **Operational Telemetry Bridge**: High-precision outcome indices, Direct Benefit Transfer (DBT) verification registries, and IoT flow telemetry calibrated across district clusters.

---

## 🧭 Routes & Capabilities

| Route | View Name | Description |
|---|---|---|
| `/` | **Cinematic Landing Page** | Architectural entrance reveal, institutional thesis (*"Government doesn't lack data. It lacks connection"*), and 5-step pipeline. |
| `/command` | **Command Center** | National apex telemetry: ₹2.84B allocation, 73% utilization, 12.4M beneficiaries, 684 projects, 71% coverage, 78 outcome index. |
| `/map` | **Geographic Intelligence** | 36-district cartography of Maharashtra with zoom focus on **Nandurbar** (28% coverage, 42% util, 36 pp gap). |
| `/intelligence/gaps` | **Geographic Gaps** | Priority gap radar ranking Nandurbar, Gadchiroli, Washim, Dhule, and Yavatmal. |
| `/schemes` | **Scheme Explorer** | Searchable registry with Ministry, State, Sector, Year, and Status filters in a hybrid table. |
| `/scheme/[id]` | **Scheme Detail** | Deep-dive dossier for PKVY (AGR-004) covering Budget (₹320 Cr), Utilized (₹249 Cr), Beneficiaries (1.2M), and related links. |
| `/overlaps` | **Programme Overlap Engine** | 82% multi-vector similarity breakdown between Scheme A (PKVY) and Scheme B (MOVCDNER). |
| `/relationships` | **Governance Graph** | Interactive network topology mapping: `MINISTRY` → `SCHEME` → `PROJECT` → `DISTRICT` → `BENEFICIARY` → `OUTCOME`. |
| `/signals` | **Early Signals** | Neutral implementation alerts (e.g. Scheme A: -27 pp drawdown deviation, 87% confidence, factor breakdown). |
| `/query` | **Ask SUTRA** | Structured natural language query processor executing directly on database records without hallucination. |
| `/evidence` | **Evidence Hub** | Auditable data registry featuring **Record #9281** and dataset schemas. |
| `/data` | **Data Ingestion** | Entity resolution engine: `"MH"` / `"Maharastra"` $\rightarrow$ `MAHARASHTRA` (98.7% confidence) + CSV upload pipeline. |

---

## ⏱️ Executive Walkthrough & Demonstration Flow

1. **Step 1 — Landing Narrative (`/`)**:
   - Open platform. Highlight the core thesis:
   - *"Government doesn't lack data. It lacks connection."*
   - Review the 5-step intelligence pipeline: `INGEST` $\rightarrow$ `HARMONIZE` $\rightarrow$ `CONNECT` $\rightarrow$ `DETECT` $\rightarrow$ `EXPLAIN`.
2. **Step 2 — Enter SUTRA**:
   - Click **ENTER SUTRA →**. Observe the native initialization sequence:
   - Synchronizing Ministries, Schemes, Projects, Geography, Finance, Outcomes, and building the relationship topology.
3. **Step 3 — Command Center (`/command`)**:
   - Inspect the 6 core metrics: **₹2.84B** Allocation, **73%** Utilization, **12.4M** Beneficiaries.
   - Hover over drawdown pace telemetry and Maharashtra coverage spread for granular numbers.
4. **Step 4 — Geographic Intelligence (`/map`)**:
   - Filter by **Gaps**. Select **Nandurbar**.
   - Review contextual metrics: 1.6M population, 7 schemes, 14 projects, 218K beneficiaries, 42% utilization, 28% coverage.
   - Inspect the **Potential Coverage Gap (36 percentage points)** alert.
5. **Step 5 — Programme Overlap (`/overlaps`)**:
   - Demonstrate cross-ministry redundancy detection: **Scheme A (PKVY) ⇄ Scheme B (MOVCDNER)** with **82% similarity**.
   - Analyze factor decomposition: Target Group 91%, Geography 74%, Intervention 86%, Period 68%.
6. **Step 6 — Ask SUTRA (`/query`)**:
   - Query: *"Which districts have high beneficiary demand but low fund utilization across agriculture schemes?"*
   - Click **ANALYZE →**. Observe the 7-step analysis checklist.
   - Inspect the **7 Districts Match** result with **Nandurbar** ranked #1 (81% demand vs 42% utilization, 39 pp gap).
7. **Step 7 — Explainability & Evidence Trace (`#9281`)**:
   - Click **WHY THIS RESULT?** $\rightarrow$ Observe attribution factors: High Beneficiary Demand (26%), Low Fund Utilization (31%), Low Project Density (22%), Regional Deviation (21%).
   - Click **VIEW SUPPORTING EVIDENCE (#9281)** $\rightarrow$ Opens the verifiable ledger record (Allocated: ₹14.2 Cr, Utilized: ₹5.9 Cr, Source: Union Budget / PFMS).
8. **Conclusion**:
   - *"SUTRA does not replace existing government systems. It connects them, detects cross-programme signals, and makes every important insight traceable back to evidence."*

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Custom SUTRA Editorial Design System
- **Color Palette**: Obsidian `#0D0D0C`, Ivory `#F3F0E8`, Muted Copper `#B78A5A`, Stone `#C9C2B7`, Border `#2A2926`
- **Visualization**: D3-derived SVG cartography, interactive force topology graph, and drawdown vector charts
- **Icons**: Lucide React (Restrained institutional line icons)
- **Deterministic Analytics Engine**: SUTRA Multi-Vector Overlap & Geographic Gap Detection Engine

---

## 🚀 Running Locally

```bash
cd sutra-intelligence
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.
