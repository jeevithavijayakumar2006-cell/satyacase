import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  MapPin, 
  Clock, 
  Cpu, 
  RefreshCw, 
  AlertTriangle,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { verifyResolutionEvidence } from '../utils/cryptoUtils';

export default function ClosureIntegrityGate({ grievances, onUpdateGrievance }) {
  // Select first grievance or pending resolution grievance
  const pendingGrievances = grievances.filter(g => g.status === 'RESOLUTION_SUBMITTED' || g.status === 'IN_PROGRESS' || g.status === 'BLOCKED');
  const [selectedId, setSelectedId] = useState(pendingGrievances[0]?.id || grievances[0]?.id);

  const selectedGrievance = grievances.find(g => g.id === selectedId) || grievances[0];

  // Verification result state
  const [gateResult, setGateResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Trigger Resolution Approval Test (Valid Evidence Upload)
  const handleTestValidUpload = () => {
    setIsEvaluating(true);
    setGateResult(null);

    setTimeout(() => {
      const validProof = {
        fileName: 'repair_completion_site.jpg',
        fileSize: '3.2 MB',
        gpsLat: selectedGrievance.lat + 0.0001,
        gpsLng: selectedGrievance.lng + 0.0001,
        timestampValid: true,
        aiSimilarityScore: 94,
        exifMissing: false,
        officerNotes: 'Work completed according to BBMP civic guidelines. Asphalt compacted.',
      };

      const result = verifyResolutionEvidence(selectedGrievance, validProof, false);
      setGateResult(result);
      setIsEvaluating(false);

      // Update grievance state
      onUpdateGrievance(selectedGrievance.id, {
        status: 'CLOSED',
        resolutionStatus: 'APPROVED',
        resolutionEvidence: validProof,
        resolutionBlockedReasons: [],
        integrityScore: result.metrics.integrityScore,
      });
    }, 600);
  };

  // Trigger Resolution Blocked Test (Invalid Evidence Upload)
  const handleTestInvalidUpload = () => {
    setIsEvaluating(true);
    setGateResult(null);

    setTimeout(() => {
      const invalidProof = {
        fileName: 'stock_pothole_fixed.jpg',
        fileSize: '0.8 MB',
        gpsLat: selectedGrievance.lat + 0.015, // 1.5 km away!
        gpsLng: selectedGrievance.lng + 0.015,
        timestampValid: false,
        aiSimilarityScore: 32,
        exifMissing: true,
        officerNotes: 'Submitted generic photo without geotags.',
      };

      const result = verifyResolutionEvidence(selectedGrievance, invalidProof, true);
      setGateResult(result);
      setIsEvaluating(false);

      // Update grievance state
      onUpdateGrievance(selectedGrievance.id, {
        status: 'BLOCKED',
        resolutionStatus: 'BLOCKED',
        resolutionEvidence: invalidProof,
        resolutionBlockedReasons: result.blockedReasons,
        integrityScore: 30,
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" /> Automated Closure Integrity Gate
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Resolution Gate Verification Engine
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Prevents premature or fake complaint closures by enforcing zero-trust cryptographic geofence, EXIF temporal, and AI vision checks before marking resolved.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400">Select Case:</label>
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setGateResult(null);
            }}
            className="bg-slate-950 border border-slate-700 text-blue-300 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none"
          >
            {grievances.map(g => (
              <option key={g.id} value={g.id}>
                {g.id} - {g.title.substring(0, 28)}... ({g.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Gate Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Complaint & Original Evidence (4 cols) */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-blue-400">{selectedGrievance.id}</span>
              <h3 className="font-bold text-slate-100 text-sm mt-0.5">{selectedGrievance.title}</h3>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {selectedGrievance.wardName}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 text-[11px]">Location:</span>
              <p className="font-medium">{selectedGrievance.locationText}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[11px]">Assigned Officer:</span>
              <p className="font-medium text-purple-300">{selectedGrievance.assignedOfficer}</p>
            </div>
          </div>

          {/* Original Complaint Photo Preview */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-400" /> Original Citizen Photo Evidence
            </span>
            <div className="relative rounded-xl overflow-hidden border border-slate-800 h-44 group">
              <img
                src={selectedGrievance.originalEvidence.previewUrl}
                alt="Original evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-3 flex flex-col justify-end">
                <span className="text-[10px] font-mono text-slate-300">
                  GPS: {selectedGrievance.originalEvidence.gpsLat}, {selectedGrievance.originalEvidence.gpsLng}
                </span>
                <span className="text-[10px] font-mono text-blue-400 truncate">
                  SHA: {selectedGrievance.originalEvidence.sha256.substring(0, 24)}...
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Officer Resolution Evidence Upload & Gate Verification Engine (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Test Trigger Action Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-400" /> Officer Resolution Evidence Upload
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Simulate uploading resolution proof photos to test Closure Gate compliance logic.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Trigger 1: Valid Upload */}
              <button
                onClick={handleTestValidUpload}
                disabled={isEvaluating}
                className="p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition-all hover:scale-[1.01] group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Simulate VALID Resolution Evidence
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Uploads photo within 14m of site, valid EXIF headers, matching repair site geometry.
                </p>
                <div className="mt-2 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  👉 Triggers "RESOLUTION APPROVED"
                </div>
              </button>

              {/* Trigger 2: Invalid Upload */}
              <button
                onClick={handleTestInvalidUpload}
                disabled={isEvaluating}
                className="p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left transition-all hover:scale-[1.01] group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-red-400 text-xs flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Simulate INVALID Resolution Evidence
                  </span>
                  <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Uploads photo with 1.5km GPS mismatch, missing EXIF headers, failed AI similarity.
                </p>
                <div className="mt-2 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                  👉 Triggers "RESOLUTION BLOCKED"
                </div>
              </button>
            </div>
          </div>

          {/* Evaluating Loading Indicator */}
          {isEvaluating && (
            <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-3 animate-pulse">
              <Cpu className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
              <p className="font-bold text-slate-200 text-sm">Executing Closure Integrity Gate Audit...</p>
              <p className="text-xs text-slate-400 font-mono">
                Calculating Haversine GPS delta • Checking EXIF headers • Running AI Vision Similarity
              </p>
            </div>
          )}

          {/* GATE RESULTS DISPLAY PANEL (Requirements #11 & #12) */}
          {gateResult && !isEvaluating && (
            <div className="space-y-4">
              {/* STATE 1: RESOLUTION BLOCKED (Requirement #11) */}
              {gateResult.status === 'BLOCKED' && (
                <div className="glass-card rounded-2xl border-2 border-red-500/80 p-6 bg-red-950/20 shadow-2xl space-y-4">
                  <div className="flex items-center gap-3 border-b border-red-500/30 pb-4">
                    <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-red-500/50 animate-bounce">
                      ✕
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-red-400 tracking-wider">
                        RESOLUTION BLOCKED
                      </h2>
                      <p className="text-xs text-red-200 font-medium">
                        Closure Gate Audit Rejected: Evidence failed system integrity validation rules.
                      </p>
                    </div>
                  </div>

                  {/* List of Failure Reasons (Requirement #11) */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                      Validation Failure Audit Reasons:
                    </h4>
                    <div className="space-y-2">
                      {gateResult.blockedReasons.map((reason, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-red-500/30 text-xs text-red-300 font-medium flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Failed Metrics Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-red-500/30 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px]">GPS Delta:</span>
                      <p className="font-bold text-red-400">{gateResult.metrics.distanceMeters} Meters</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px]">EXIF Headers:</span>
                      <p className="font-bold text-red-400">MISSING</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px]">AI Similarity:</span>
                      <p className="font-bold text-red-400">{gateResult.metrics.similarityScore}% (Low)</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px]">Integrity Score:</span>
                      <p className="font-bold text-red-400">{gateResult.metrics.integrityScore}/100</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 2: RESOLUTION APPROVED (Requirement #12) */}
              {gateResult.status === 'APPROVED' && (
                <div className="glass-card rounded-2xl border-2 border-emerald-500/80 p-6 bg-emerald-950/20 shadow-2xl space-y-4">
                  <div className="flex items-center gap-3 border-b border-emerald-500/30 pb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/50">
                      ✓
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-emerald-400 tracking-wider">
                        RESOLUTION APPROVED
                      </h2>
                      <p className="text-xs text-emerald-200 font-medium">
                        Closure Gate Audit Passed: Resolution evidence verified and appended to Merkle ledger.
                      </p>
                    </div>
                  </div>

                  {/* Verification Checkmarks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-300 font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      GPS Coordinates Matched ({gateResult.metrics.distanceMeters}m delta from site)
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-300 font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      EXIF Camera & Hardware Telemetry Verified
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-300 font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      AI Vision Repair Similarity: {gateResult.metrics.similarityScore}%
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-300 font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Integrity Score: {gateResult.metrics.integrityScore}/100 (High Trust)
                    </div>
                  </div>

                  {/* Generated SHA-256 Ledger Hash */}
                  <div className="pt-2 border-t border-emerald-500/30 font-mono text-xs">
                    <span className="text-slate-400 text-[10px] uppercase tracking-wider">Immutable Merkle Block Receipt:</span>
                    <p className="text-emerald-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 break-all mt-1">
                      {gateResult.metrics.sha256}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
