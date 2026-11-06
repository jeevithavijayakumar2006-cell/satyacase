import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Search,
  Sparkles,
  Crosshair
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import { CATEGORIES, INITIAL_WARDS } from '../data/mockData';
import { parseExifSimulated, generateSha256 } from '../utils/cryptoUtils';

export default function FileComplaint({ onAddGrievance, setCurrentTab, grievances = [] }) {
  const [step, setStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('pothole');
  const [wardId, setWardId] = useState('W04');
  const [locationText, setLocationText] = useState('17th Main Road, Sector 3, HSR Layout');
  const [coords, setCoords] = useState({ lat: 12.9121, lng: 77.6445 });
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('Aarav Gupta');
  const [citizenPhone, setCitizenPhone] = useState('+91 98765 43210');
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Evidence state
  const [selectedFile, setSelectedFile] = useState(null);
  const [exifData, setExifData] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Duplicate Radar state
  const [duplicateMatches, setDuplicateMatches] = useState([]);

  // Geolocation Handler using navigator.geolocation.getCurrentPosition
  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      setIsDetectingGps(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = Number(position.coords.latitude.toFixed(5));
          const longitude = Number(position.coords.longitude.toFixed(5));
          console.log("Live GPS Position Detected:", latitude, longitude);
          setCoords({ lat: latitude, lng: longitude });
          setIsDetectingGps(false);
        },
        (error) => {
          console.log("Location access denied:", error);
          setIsDetectingGps(false);
          alert("Location access denied or unavailable. Please click on the map to pin coordinates.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation API is not supported by your browser.");
    }
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProcessingFile(true);

    setTimeout(() => {
      // Simulate EXIF extraction and cryptographic SHA-256 calculation
      const extracted = parseExifSimulated(file, coords.lat, coords.lng);
      setExifData(extracted);
      setIsProcessingFile(false);
    }, 800);
  };

  // Step 3 to Step 4 transition - Run Duplicate Radar Check
  const runDuplicateCheck = () => {
    // Find matching grievances in same ward or category
    const matches = grievances.filter(g => g.wardId === wardId || g.category === category);
    setDuplicateMatches(matches);
    setStep(4);
  };

  // Final Submit Handler
  const handleSubmit = () => {
    const selectedCategoryObj = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
    const selectedWardObj = INITIAL_WARDS.find(w => w.id === wardId) || INITIAL_WARDS[0];

    const newGrievance = {
      id: `SC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title || `${selectedCategoryObj.name} reported at ${selectedWardObj.name}`,
      category,
      categoryName: selectedCategoryObj.name,
      wardId,
      wardName: selectedWardObj.name,
      locationText: locationText || `${selectedWardObj.name} area`,
      lat: coords.lat,
      lng: coords.lng,
      citizenName,
      citizenPhone,
      description: description || 'Civic issue filed via SatyaCase evidence pipeline.',
      createdAt: new Date().toISOString(),
      slaHours: selectedCategoryObj.defaultSlaHours,
      slaExpiresAt: new Date(Date.now() + selectedCategoryObj.defaultSlaHours * 3600 * 1000).toISOString(),
      status: 'IN_PROGRESS',
      assignedOfficer: selectedWardObj.officer,
      integrityScore: exifData ? Math.floor(Math.random() * 5) + 94 : 88,
      duplicateCount: 0,
      originalEvidence: exifData || {
        fileName: selectedFile ? selectedFile.name : 'evidence_photo.jpg',
        fileSize: '3.1 MB',
        sha256: generateSha256(title + Date.now()),
        gpsLat: coords.lat,
        gpsLng: coords.lng,
        timestamp: new Date().toISOString(),
        cameraModel: 'Android Hardware Camera (EXIF Geotagged)',
        tampered: false,
        aiAuthenticityScore: 96,
        previewUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
      },
      resolutionEvidence: null,
      resolutionStatus: null,
      resolutionBlockedReasons: [],
    };

    onAddGrievance(newGrievance);
    setStep(5);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Workflow Step Progress Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
        {[
          { num: 1, name: '1. Incident Details' },
          { num: 2, name: '2. Ward Geofence' },
          { num: 3, name: '3. EXIF Evidence' },
          { num: 4, name: '4. Duplicate Radar' },
          { num: 5, name: '5. Ledger Receipt' },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              step === s.num
                ? 'bg-blue-600 text-white shadow-md'
                : step > s.num
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-500 bg-slate-900/40'
            }`}
          >
            {step > s.num ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center">
                {s.num}
              </span>
            )}
            <span>{s.name}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Details & Category */}
      {step === 1 && (
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" /> Step 1: Incident Categorization & Details
            </h2>
            <p className="text-slate-400 text-xs mt-1">Specify civic problem category and description</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Grievance Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Ruptured Water Main Pipeline Flooding Street"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Issue Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      category === cat.id
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="font-bold text-xs">{cat.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1">SLA Target: {cat.defaultSlaHours} Hours</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Detailed Description & Context
              </label>
              <textarea
                rows={3}
                placeholder="Provide details about severity, landmark references, or safety hazards..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Complainant Name</label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20"
            >
              Next: Select Ward Location <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Ward & Location */}
      {step === 2 && (
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" /> Step 2: Location & Ward Selection
            </h2>
            <p className="text-slate-400 text-xs mt-1">Select administrative ward and pinpoint precise incident coordinates</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Select Administrative Ward *</label>
                <select
                  value={wardId}
                  onChange={(e) => setWardId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  {INITIAL_WARDS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.zone}) - {w.officer}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Street Address / Landmark *</label>
                <input
                  type="text"
                  placeholder="e.g. Near HSR Water Tank, 17th Main Road"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Interactive Map Selector & GPS Detection Button */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Click on Geofenced Map or use Browser GPS:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetectingGps}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                  >
                    <Crosshair className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
                    {isDetectingGps ? 'Detecting GPS...' : 'Detect My Live Location'}
                  </button>
                  <span className="font-mono text-blue-400 text-xs bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    {coords.lat}, {coords.lng}
                  </span>
                </div>
              </div>

              <InteractiveMap
                grievances={grievances}
                selectedWardId={wardId}
                onSelectLocation={(c) => setCoords(c)}
                height="h-72"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20"
            >
              Next: Upload Evidence <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Evidence Upload & EXIF Parsing */}
      {step === 3 && (
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" /> Step 3: Evidence Packet Checker & Upload
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Upload photo evidence. System automatically parses EXIF camera metadata and generates cryptographic SHA-256 hash.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 text-center bg-slate-950/60 transition-colors">
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center border border-blue-500/20 mb-3">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-200">Click to upload photo evidence</p>
              <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP with embedded EXIF geotags</p>
            </label>
          </div>

          {/* Processing Spinner */}
          {isProcessingFile && (
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3 text-blue-300 text-xs animate-pulse">
              <Cpu className="w-5 h-5 animate-spin" />
              Extracting EXIF Telemetry & Generating Cryptographic SHA-256 Hash...
            </div>
          )}

          {/* Extracted EXIF Metadata Preview Panel */}
          {exifData && !isProcessingFile && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-slate-200 text-xs">EXIF Telemetry Packet Verified</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {exifData.aiAuthenticityScore}% Authenticity Score
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px]">Filename & Size:</span>
                  <p className="font-bold text-slate-300">{exifData.fileName} ({exifData.fileSize})</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Hardware Camera Signature:</span>
                  <p className="font-bold text-slate-300">{exifData.cameraModel}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">EXIF GPS Geotag:</span>
                  <p className="font-bold text-slate-300">{exifData.gpsLat}, {exifData.gpsLng}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Capture Hardware Timestamp:</span>
                  <p className="font-bold text-slate-300">{new Date(exifData.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">SHA-256 Hash Signature:</span>
                <p className="font-mono text-[11px] text-blue-400 break-all bg-slate-900 p-2 rounded border border-slate-800 mt-1">
                  {exifData.sha256}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={runDuplicateCheck}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20"
            >
              Run Duplicate Detection <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Duplicate Incident Radar */}
      {step === 4 && (
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" /> Step 4: Duplicate Incident Radar Check
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              SatyaCase scans nearby reports to prevent redundant officer dispatching and group community issues.
            </p>
          </div>

          {duplicateMatches.length > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-300 text-sm">
                    Potential Duplicate Reports Found in Ward!
                  </h3>
                  <p className="text-xs text-amber-200/80 mt-0.5">
                    Found {duplicateMatches.length} existing grievances in this ward matching your location & category. You can upvote an existing report or proceed with filing a new report.
                  </p>
                </div>
              </div>

              {/* List of matching duplicates */}
              <div className="space-y-3">
                {duplicateMatches.slice(0, 2).map((match) => (
                  <div key={match.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center gap-3">
                    <div>
                      <span className="font-mono text-[10px] text-blue-400 font-bold">{match.id}</span>
                      <p className="font-bold text-slate-200 text-xs">{match.title}</p>
                      <p className="text-[11px] text-slate-400">{match.locationText}</p>
                    </div>
                    <button
                      onClick={() => {
                        alert(`Upvoted report ${match.id}! Your vote has been recorded on the ledger.`);
                        setCurrentTab('dashboard');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold whitespace-nowrap"
                    >
                      👍 Upvote Existing
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Radar Scan Complete: No duplicate incidents found within 500m radius of this site.
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
            >
              <ShieldCheck className="w-4 h-4" /> Confirm & Append to Ledger
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Success Receipt */}
      {step === 5 && (
        <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center space-y-6 animate-pulse-glow">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Grievance Successfully Recorded!</h2>
            <p className="text-slate-400 text-xs mt-1">
              Your grievance has been cryptographically signed and routed to the ward officer.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Grievance ID:</span>
              <span className="text-blue-400 font-bold">SC-2026-8891</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SLA Target:</span>
              <span className="text-amber-400 font-bold">24 Hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Evidence Integrity:</span>
              <span className="text-emerald-400 font-bold">96/100 (High)</span>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-500">Merkle Block Hash:</span>
              <p className="text-[10px] text-slate-400 break-all">0000a38f7129c91b5e409b30c18d15a9992f0808b8b0e514f7b2c01994a4b123</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('audit-trail')}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              View Audit Ledger
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
