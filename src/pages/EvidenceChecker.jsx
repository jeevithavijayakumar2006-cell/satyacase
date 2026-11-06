import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  MapPin, 
  Clock, 
  Camera, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';

export default function EvidenceChecker({ grievances, selectedGrievanceId }) {
  const [queryId, setQueryId] = useState(selectedGrievanceId || grievances[0]?.id || 'SC-2026-8891');
  const targetGrievance = grievances.find(g => g.id === queryId) || grievances[0];

  const ev = targetGrievance.originalEvidence;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-2">
            <Search className="w-3.5 h-3.5" /> Evidence Packet Inspector
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cryptographic EXIF Packet Inspector
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Deep-dive forensic inspection tool. Analyzes hardware camera signatures, SHA-256 hashes, EXIF GPS geotags, and synthetic manipulation indicators.
          </p>
        </div>

        {/* Grievance Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400">Inspect Packet ID:</label>
          <select
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-blue-300 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none"
          >
            {grievances.map(g => (
              <option key={g.id} value={g.id}>
                {g.id} - {g.title.substring(0, 24)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Inspector Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Photo Evidence & Visual Analysis (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="font-mono text-xs font-bold text-blue-400">{targetGrievance.id}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Integrity Score: {targetGrievance.integrityScore}/100
            </span>
          </div>

          {/* Photo Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-64 bg-slate-950">
            <img
              src={ev.previewUrl}
              alt="Packet evidence"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> EXIF Geotagged
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">File Metadata</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 text-[11px]">Filename:</span>
                <p className="font-mono text-slate-300 text-[11px] truncate">{ev.fileName}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">File Size:</span>
                <p className="font-mono text-slate-300 text-[11px]">{ev.fileSize}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Deep EXIF Telemetry & Cryptographic Verification (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" /> Deep EXIF Hardware Telemetry
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Raw hardware sensor outputs and location verification</p>
          </div>

          {/* EXIF Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-blue-400" /> Hardware Camera Sensor
              </span>
              <p className="font-bold text-slate-200">{ev.cameraModel}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Hardware Capture Timestamp
              </span>
              <p className="font-bold text-slate-200">{new Date(ev.timestamp).toLocaleString()}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> EXIF Embedded Coordinates
              </span>
              <p className="font-bold text-slate-200">{ev.gpsLat}, {ev.gpsLng}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Authenticity Score
              </span>
              <p className="font-bold text-emerald-400">{ev.aiAuthenticityScore}% (Genuine Capture)</p>
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash Verification */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" /> Cryptographic SHA-256 Digest
            </span>
            <p className="font-mono text-xs text-blue-400 break-all bg-slate-900 p-3 rounded-lg border border-slate-800">
              {ev.sha256}
            </p>
          </div>

          {/* Integrity Score Breakdown Bar */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">Overall Packet Integrity Rating</span>
              <span className="font-bold text-emerald-400 text-sm">{targetGrievance.integrityScore}/100</span>
            </div>
            
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                style={{ width: `${targetGrievance.integrityScore}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 text-center text-[10px] text-slate-400 pt-2 border-t border-slate-900">
              <div>EXIF Headers: <strong className="text-emerald-400">Valid (+30)</strong></div>
              <div>Geofence Match: <strong className="text-emerald-400">Exact (+30)</strong></div>
              <div>Hash Merkle: <strong className="text-emerald-400">Linked (+40)</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
