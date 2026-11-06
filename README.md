# SatyaCase – Civic Grievance Evidence Integrity System

> **A tamper-evident, zero-trust civic grievance evidence pipeline with automated SLA countdowns, duplicate detection radar, and cryptographic Closure Integrity Gates.**

Built with **React**, **Tailwind CSS**, and **Vite**.

---

## 🌟 Key Features

1. **Dual Role Interfaces:**
   - **Citizen Portal:** Interactive dashboard for reporting civic issues, viewing live status, and inspecting evidence packets.
   - **Municipal Officer Interface:** Workload queue with active SLA countdowns, duplicate detection maps, and Closure Integrity Gate audits.

2. **5-Step Complaint Filing Workflow:**
   - **Step 1: Incident Categorization & Details** (Potholes, Water Leaks, Garbage, Streetlights, Drainage).
   - **Step 2: Ward Geofence & Location Selection** (Interactive click-to-pin map + live browser GPS detection via `navigator.geolocation`).
   - **Step 3: Cryptographic EXIF Packet Inspector** (Extracts hardware camera sensor metadata, capture timestamps, and computes SHA-256 hash).
   - **Step 4: Spatial Duplicate Detection Radar** (Detects existing complaints within a 200m radius to prevent redundant dispatching).
   - **Step 5: Immutable Ledger Receipt** (Generates Merkle block receipt).

3. **Closure Integrity Gate (Zero-Trust Resolution Engine):**
   - **Resolution Blocked:** Automatically detects tampering or invalid proof (e.g. GPS mismatch > 150m, missing EXIF metadata, low AI similarity score) and displays itemized audit rejection reasons.
   - **Resolution Approved:** Verifies location within geofence, authentic EXIF telemetry, and approved repair similarity, appending the verification to the immutable audit ledger.

4. **Cryptographic Audit Trail:**
   - Displays an immutable chain of system events with SHA-256 block hashes, previous block hashes, and actors.
   - Interactive **"Validate Ledger Integrity"** engine that recalculates Merkle hashes in real time.

5. **Live SLA Countdowns & Ward Scorecards:**
   - Real-time countdown timers with color-coded alerts (`bg-emerald-500`, `bg-amber-500`, `bg-red-500` for SLA breaches).
   - Ward-by-ward integrity ratings and compliance scorecards.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd satyacase

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 🛠️ Tech Stack
- **Frontend Framework:** React 19
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3 with custom Glassmorphism UI
- **Icons:** Lucide React
- **Location & Forensics:** HTML5 Geolocation API, simulated EXIF telemetry parser, SHA-256 cryptographic digest engine

---

## 📄 License
MIT License.
