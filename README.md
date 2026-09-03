# WeatherGPT – Conversational AI for Weather Forecasting, Alerts and Climate Information

![WeatherGPT Banner](https://img.shields.io/badge/WeatherGPT-Conversational%20Meteorology-0284c7?style=for-the-badge&logo=cloud&logoColor=white)
![IMD MoES](https://img.shields.io/badge/Ministry%20of%20Earth%20Sciences-India%20Meteorological%20Department-0f172a?style=for-the-badge)
![Full Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Express%20%7C%20MySQL-emerald?style=for-the-badge)
![SDG Alignment](https://img.shields.io/badge/UN%20SDGs-2%20%7C%203%20%7C%209%20%7C%2011%20%7C%2013-purple?style=for-the-badge)

---

## 📌 Project Overview
* **Project Name:** WeatherGPT – Conversational AI for Weather Forecasting, Alerts and Climate Information
* **Organization:** Ministry of Earth Sciences (MoES)
* **Department:** India Meteorological Department (IMD)
* **Category:** Software
* **Theme:** Disaster Management & Climate Resilience
* **Academic Submission:** Full-Stack Software Engineering Capstone / Semester Assignment

WeatherGPT is a production-grade, AI-powered conversational weather and climate intelligence web application. It democratizes meteorological insights for the **general public, farmers, disaster-management authorities, researchers, and government agencies** through an accessible natural-language chat interface in **English, Hindi (हिन्दी), Tamil (தமிழ்), and Telugu (తెలుగు)**, paired with live forecasting dashboards, empirical severe hazard alert engines, and historical climate reanalysis.

---

## 🏛️ System Architecture

```
User / Citizen / Farmer
        │
        ▼
┌────────────────────────────────────────────────────────┐
│  React 18 + Vite + Tailwind CSS Frontend Portal       │
│  - Multi-Page Navigation (Home, Dashboard, Chat, etc.) │
│  - Multilingual Context (EN, HI, TA, TE)               │
│  - Interactive Recharts Visualizations                 │
│  - Web Speech API Microphone Dictation                 │
└───────────────────────┬────────────────────────────────┘
                        │ HTTP / REST JSON
                        ▼
┌────────────────────────────────────────────────────────┐
│  Node.js + Express.js Backend API Server (Port 5000)   │
│  - /api/weather (Current, Forecast, Alerts, History)   │
│  - /api/chat (Conversational NLP Intent Parser)        │
│  - /api/saved-locations (User Bookmarks CRUD)          │
└───────┬───────────────────────────────┬────────────────┘
        │                               │
        ▼                               ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│ Open-Meteo & IMD Feeds   │   │ MySQL 8.0 Database       │
│ - Live NWP Models        │   │ - locations              │
│ - Geocoding Resolutions  │   │ - weather_queries        │
│ - Archive Reanalysis     │   │ - chat_history           │
│ - Agricultural Guidance  │   │ - saved_locations        │
└──────────────────────────┘   │ - weather_alerts_log     │
                               │ - climate_records        │
                               └──────────────────────────┘
```

---

## 🌟 Core Modules & Features

### 1. Natural-Language Weather Chatbot
* **ChatGPT-style Interface:** Conversational chat interface supporting questions like:
  * *"What is the weather in Chennai?"*
  * *"Will it rain tomorrow in Delhi?"*
  * *"Is there any extreme weather alert for Mumbai?"*
  * *"Is the weather suitable for farming in Bengaluru?"*
* **Intent & Entity Extraction:** Automatically detects meteorological intent (Rain, Temp, Forecast, Wind, Cyclone/Alert, Agriculture, Climate) and target geographic entity.
* **Multilingual Synthesis:** Responds fluently in English, Hindi, Tamil, or Telugu.
* **Voice Input:** Web Speech API integration for microphone speech-to-text dictation.

### 2. Comprehensive Weather Dashboard
* **Hero Overview Card:** Current temperature, Feels-like index, High/Low range, weather condition icon, sunrise/sunset.
* **8 Primary Meteorological Metrics:** Relative Humidity, Wind Speed, Wind Direction & Degrees, Wind Gusts, Surface Barometric Pressure, Horizontal Visibility, UV Radiation Index, Dew Point.
* **24-Hour Hourly Trajectory:** Scrollable progression cards with temperature trends and precipitation probability.
* **5-Day Outlook Deck:** Extended daily forecast cards.

### 3. Extreme Weather Hazard & Alerts Monitor
* **Empirical Hazard Engine:** Evaluates meteorology against official IMD alert thresholds:
  * **Heavy Rain / Flood Watch:** $\ge 65\text{ mm}$ or high rain intensity
  * **Severe Thunderstorms & Lightning:** WMO codes 95, 96, 99
  * **Tropical Cyclone / Squalls:** Gale-force sustained winds $\ge 55\text{ km/h}$ or gusts $\ge 70\text{ km/h}$
  * **Heatwave Warnings:** Max temperature $\ge 40^\circ\text{C}$ or $+4.5^\circ\text{C}$ above normal
  * **Coldwave Alerts:** Min temperature $\le 5^\circ\text{C}$
  * **Dense Fog:** Visibility $< 1.0\text{ km}$
* **Severity Distinction:** Normal (Green), Advisory (Yellow/Orange - Be Prepared), Warning (Red - Action Required).
* **Emergency Helplines Directory:** NDRF (1078), National Emergency (112), IMD Hotline, SDMA.

### 4. 7-Day Forecast & Interactive Charts
* **Recharts Data Visualizations:**
  * Multi-day Temperature Range Area Chart (Max vs Min curves)
  * Precipitation Probability (%) and Rainfall Accumulation (mm) Bar Chart
  * Max Sustained Wind Speed Line Graph

### 5. Agro-Meteorological Advisory for Farmers (SDG 2)
* **Agronomic Decision Support:**
  * **Irrigation Guidance:** Computes whether upcoming precipitation makes artificial watering redundant.
  * **Pesticide / Spray Window:** Evaluates wind drift and rain washout risks.
  * **Crop Protection Alerts:** Monitors humidity and thermal stress for Paddy, Cotton, Wheat, Sugarcane, Vegetables.
  * **Responsible AI Farming Notice:** Transparent disclaimer for agricultural investments.

### 6. Climate & Historical Trends (SDG 13)
* **Historical Reanalysis:** Explores multi-year thermal baseline shifts and temperature anomalies ($+^\circ\text{C}$).
* **Seasonal Climatology:** 12-month profile displaying monthly mean temperature and monsoon precipitation peaks.

### 7. Indian Multilingual Support
* Full interface and conversational support across:
  * **English** (en)
  * **हिन्दी** (Hindi - hi)
  * **தமிழ்** (Tamil - ta)
  * **తెలుగు** (Telugu - te)

---

## 🗄️ Database Design (MySQL)

Schema file: `backend/database/schema.sql`

```sql
-- 1. Locations Table
CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    state_name VARCHAR(100),
    country VARCHAR(10) DEFAULT 'IN',
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    elevation_meters DECIMAL(8, 2),
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_city (city_name)
);

-- 2. Weather Queries Log Table
CREATE TABLE weather_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    location_name VARCHAR(150) NOT NULL,
    query_type VARCHAR(50) NOT NULL DEFAULT 'current',
    raw_query TEXT,
    detected_intent VARCHAR(50) DEFAULT 'weather_general',
    language VARCHAR(10) DEFAULT 'en',
    response_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id)
);

-- 3. Chat History Table
CREATE TABLE chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    role ENUM('user', 'assistant') NOT NULL,
    message TEXT NOT NULL,
    intent VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    location_name VARCHAR(150),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_chat_session (session_id)
);

-- 4. Saved Locations Table
CREATE TABLE saved_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL DEFAULT 'default_user',
    city_name VARCHAR(100) NOT NULL,
    state_name VARCHAR(100),
    country VARCHAR(10) DEFAULT 'IN',
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_saved_session (session_id)
);

-- 5. Weather Alerts Log Table
CREATE TABLE weather_alerts_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(150) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    severity_level ENUM('Normal', 'Advisory', 'Warning', 'Severe') NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    advisory_details TEXT,
    valid_from DATETIME DEFAULT CURRENT_TIMESTAMP,
    valid_to DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Climate Historical Records Table
CREATE TABLE climate_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    avg_temp_c DECIMAL(5, 2) NOT NULL,
    max_temp_c DECIMAL(5, 2) NOT NULL,
    min_temp_c DECIMAL(5, 2) NOT NULL,
    total_rainfall_mm DECIMAL(7, 2) NOT NULL,
    anomaly_c DECIMAL(4, 2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_city_year_month (city_name, year, month)
);
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Query / Body Parameters |
|---|---|---|---|
| `GET` | `/api/health` | Service diagnostics, uptime & MySQL status | None |
| `GET` | `/api/weather/current` | Current observation & 8 atmospheric metrics | `?city=Chennai` or `?lat=13.08&lon=80.27` |
| `GET` | `/api/weather/forecast` | Hourly and 7-day extended forecasts | `?city=Delhi&days=7` |
| `GET` | `/api/weather/alerts` | Active hazard alerts & safety severity | `?city=Mumbai` |
| `GET` | `/api/weather/history` | Multi-year climate anomalies & monthly distributions | `?city=Bengaluru` |
| `GET` | `/api/weather/agriculture`| Agro-meteorological advisory bulletin | `?city=Pune` |
| `GET` | `/api/weather/locations` | Geocoding autocomplete city search | `?search=Kolkata` |
| `POST`| `/api/chat` | Conversational weather AI query processing | `{ message, language, location, sessionId }` |
| `GET` | `/api/chat/history` | Retrieve user conversational history | `?sessionId=xyz` |
| `POST`| `/api/chat/clear` | Clear conversation history | `{ sessionId }` |
| `GET` | `/api/saved-locations` | Get bookmarked weather stations | `?sessionId=xyz` |
| `POST`| `/api/saved-locations` | Add bookmarked weather station | `{ cityName, sessionId, notes }` |
| `DELETE`| `/api/saved-locations/:id`| Remove bookmarked station | URL param `id` |

---

## ⚙️ Installation & Running

### Prerequisites
* **Node.js**: v18.0.0 or higher (v24 tested)
* **npm**: v9.0.0 or higher
* **MySQL Server** (Optional for local DB persistence; the app contains an automatic high-speed in-memory store so it runs instantly out-of-the-box).

### 1. Environment Configuration
Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=weathergpt_db

# Optional AI LLM Keys
GEMINI_API_KEY=
```

### 2. One-Click Launch (Windows)
Double-click `start-dev.bat` or run in PowerShell:
```powershell
.\start-dev.ps1
```

### 3. Manual Launch Commands
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

* **Frontend Web App:** `http://localhost:5173`
* **Backend API Health:** `http://localhost:5000/api/health`

---

## 🧪 Automated Testing Suite

To run all automated API and intent verification tests:
```bash
cd backend
npm test
```

### Verified Test Results Matrix

| Test Case ID | Test Description | Input / Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **TC01** | System Health Check | `GET /api/health` | HTTP 200, Status: ONLINE | HTTP 200, Status: ONLINE | ✅ PASS |
| **TC02** | Current Weather Search | `GET /api/weather/current?city=Chennai` | HTTP 200, Temperature & Humidity valid | HTTP 200, Temp: 31°C, Hum: 62% | ✅ PASS |
| **TC03** | 5-Day Forecast Retrieval | `GET /api/weather/forecast?city=Bengaluru&days=5` | HTTP 200, Daily array length $\ge 5$ | HTTP 200, 5 days returned | ✅ PASS |
| **TC04** | Extreme Weather Alerts | `GET /api/weather/alerts?city=Mumbai` | HTTP 200, Alerts array returned | HTTP 200, Active alerts categorized | ✅ PASS |
| **TC05** | Climate History Trends | `GET /api/weather/history?city=New Delhi` | HTTP 200, Multi-year trends & monthly data | HTTP 200, 4-yr reanalysis loaded | ✅ PASS |
| **TC06** | Agro-Meteorological Advisory | `GET /api/weather/agriculture?city=Pune` | HTTP 200, Irrigation, Spray, Disclaimer | HTTP 200, Advisory + Disclaimer present | ✅ PASS |
| **TC07** | Geocoding City Search | `GET /api/weather/locations?search=kolkata` | HTTP 200, Matching cities list returned | HTTP 200, Kolkata geocoded | ✅ PASS |
| **TC08** | Conversational AI (English) | `POST /api/chat` ("Will it rain tomorrow in Delhi?") | Intent: `RAIN_QUERY`, Rain probability | Intent: `RAIN_QUERY`, Tomorrow rain: 15% | ✅ PASS |
| **TC09** | Multilingual Query (Hindi) | `POST /api/chat` ("चेन्नई में मौसम कैसा है?", `hi`) | Localized Hindi weather response | Returned Hindi meteorological summary | ✅ PASS |
| **TC10** | Multilingual Query (Tamil) | `POST /api/chat` ("சென்னையில் மழை பெய்யுமா?", `ta`) | Localized Tamil weather response | Returned Tamil rainfall prediction | ✅ PASS |
| **TC11** | Multilingual Query (Telugu) | `POST /api/chat` ("హైదరాబాద్ లో ఉష్ణోగ్రత ఎంత?", `te`) | Localized Telugu weather response | Returned Telugu temperature data | ✅ PASS |
| **TC12** | Empty Query Validation | `POST /api/chat` (Empty string message) | HTTP 400 Bad Request, Friendly error | HTTP 400 Bad Request returned | ✅ PASS |
| **TC13** | Saved Locations CRUD | `POST` & `GET` on `/api/saved-locations` | HTTP 201 Created, Bookmark persisted | Bookmark saved and retrieved | ✅ PASS |

---

## 🎯 Academic Course Outcomes (CO1 – CO6) Mapping

| Course Outcome | Academic Competency Demonstrated in WeatherGPT | Evidence Artifact |
|---|---|---|
| **CO1: Agile Planning & Jira** | Product Backlog breakdown, MoSCoW prioritization, 2-week Sprint Plan with User Stories (General Public, Farmer, Disaster Official). | Jira Sprint Backlog & User Story Matrix |
| **CO2: Requirements & UML Design** | Functional/Non-functional SRS, MoSCoW classification, Figma component design system, Umbrello Component and Sequence Diagrams. | Architecture Diagrams & Design System |
| **CO3: Full-Stack Development** | Complete React + Vite + Tailwind CSS frontend, Express REST API backend, and normalized MySQL relational database with seed data. | Working Codebase & Git Commits |
| **CO4: Multi-Layer Testing** | Functional API test suite, input validation tests, edge-case handling (empty chat, invalid city), security sanitization. | Automated Test Runner (`npm test`) |
| **CO5: AI & Responsible Ethics** | Natural-language intent classifier, multilingual dialogue generator, factual grounding in NWP grids, agricultural & emergency disclaimers. | `aiService.js` Guardrails & Disclaimers |
| **CO6: Integration & Deployment** | End-to-end integrated application with live geocoding, responsive mobile layout, one-click launcher scripts, and deployment config. | Full-Stack Working Portal & Deployment Scripts |

---

## 🌍 UN Sustainable Development Goals (SDG) Alignment

* **SDG 2 – Zero Hunger:** Agro-meteorological guidance helps farmers optimize irrigation, schedule pesticide applications safely, and prevent crop submergence.
* **SDG 3 – Good Health and Well-Being:** Heatwave and coldwave alerts warn vulnerable populations against thermal shock, heat exhaustion, and dehydration.
* **SDG 9 – Industry, Innovation and Infrastructure:** Leverages modern Conversational AI, Open-Meteo APIs, and GIS location intelligence.
* **SDG 11 – Sustainable Cities and Communities:** Real-time heavy rain, cyclone, and lightning alerts support municipal disaster preparedness and urban resilience.
* **SDG 13 – Climate Action:** Historical reanalysis and thermal anomaly charts promote climate change awareness and evidence-based adaptation.

---

## 📸 Recommended Screenshots for Project Report

1. **Screenshot 1:** Home Landing Page with Hero Banner and MoES/IMD branding.
2. **Screenshot 2:** Main Weather Dashboard with Current Temperature, 8 Atmospheric Metric Cards, and 24-Hour Timeline.
3. **Screenshot 3:** Natural-Language AI Weather Chat with English query and structured weather response cards.
4. **Screenshot 4:** Multilingual AI Chat in Hindi (हिन्दी), Tamil (தமிழ்), or Telugu (తెలుగు).
5. **Screenshot 5:** Extreme Weather Hazard Alerts Page with Severe Red Warnings and Emergency Helplines.
6. **Screenshot 6:** 7-Day Forecast Page with interactive Temperature Area Chart and Precipitation Bar Chart.
7. **Screenshot 7:** Agro-Meteorological Advisory Page showing irrigation, spraying windows, and crop recommendations.
8. **Screenshot 8:** Climate & History Page displaying multi-year thermal anomaly charts.
9. **Screenshot 9:** Settings Page with Saved Bookmarked Cities Manager and System Diagnostics.
10. **Screenshot 10:** Automated Terminal Test Suite Output showing all 13 Test Cases passing (100% PASS).

---

## 🚀 Deployment Instructions

### Frontend (Vercel or Netlify)
1. Set Build Command: `npm run build`
2. Set Output Directory: `dist`
3. Environment Variable: `VITE_API_URL=https://your-backend-domain.com/api`

### Backend (Render, Railway, or VPS)
1. Set Start Command: `node server.js`
2. Configure Environment Variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT=5000`.
3. Run `backend/database/schema.sql` on the MySQL database instance.

---

## 🔒 Limitations & Future Scope
* **Current Limitations:** Satellite radar Doppler imagery is currently simulated via Numerical Weather Prediction (NWP) precipitation grids.
* **Future Improvements:**
  * Integration with IoT automatic weather stations (AWS) for hyperlocal 100-meter sensor readings.
  * WhatsApp / SMS Agro-Advisory push alerts for rural farmers without smartphones.
  * Direct radar Doppler animation map overlay using Leaflet / Mapbox.
