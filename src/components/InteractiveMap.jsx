import React, { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, Layers, Crosshair, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function InteractiveMap({ 
  grievances = [], 
  selectedWardId, 
  onSelectLocation, 
  onSelectGrievance,
  interactive = true,
  height = 'h-80'
}) {
  const [activePin, setActivePin] = useState(null);
  const [pinnedCoords, setPinnedCoords] = useState({ lat: 12.9716, lng: 77.5946 });
  const [isLocating, setIsLocating] = useState(false);

  // Map mock coordinates to relative percentage offsets for visual map grid
  const getMapPosition = (lat, lng) => {
    // Map Bangalore lat (12.90 to 13.02) and lng (77.55 to 77.67) to %
    const minLat = 12.89;
    const maxLat = 13.02;
    const minLng = 77.55;
    const maxLng = 77.67;

    const top = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    const left = ((lng - minLng) / (maxLng - minLng)) * 100;

    return {
      top: `${Math.max(10, Math.min(85, top))}%`,
      left: `${Math.max(10, Math.min(85, left))}%`,
    };
  };

  const handleMapClick = (e) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert pixel click to pseudo lat/lng
    const leftPct = x / rect.width;
    const topPct = y / rect.height;

    const lat = Number((13.02 - topPct * 0.13).toFixed(5));
    const lng = Number((77.55 + leftPct * 0.12).toFixed(5));

    setPinnedCoords({ lat, lng });
    if (onSelectLocation) {
      onSelectLocation({ lat, lng });
    }
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = Number(position.coords.latitude.toFixed(5));
          const longitude = Number(position.coords.longitude.toFixed(5));
          console.log("Detected Live GPS:", latitude, longitude);
          setPinnedCoords({ lat: latitude, lng: longitude });
          setIsLocating(false);
          if (onSelectLocation) {
            onSelectLocation({ lat: latitude, lng: longitude });
          }
        },
        (error) => {
          console.log("Location access denied:", error);
          setIsLocating(false);
          alert("Location access denied or unavailable. Using clicked/pinned location instead.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner group select-none`}>
      {/* Visual Map Grid Background (Stylized Dark Vector Map) */}
      <div 
        onClick={handleMapClick}
        className="absolute inset-0 bg-slate-950 cursor-crosshair overflow-hidden"
      >
        {/* SVG Roads & Ward Boundaries Overlay */}
        <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Main Highway Veins */}
          <path d="M 0 100 Q 200 150, 400 120 T 800 250" fill="none" stroke="#2563eb" strokeWidth="3" opacity="0.4" />
          <path d="M 150 0 Q 180 200, 320 400" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
          <path d="M 50 350 L 750 80" fill="none" stroke="#6366f1" strokeWidth="2.5" opacity="0.3" />
          
          {/* Ward Geofence Boundaries */}
          <rect x="5%" y="10%" width="40%" height="38%" rx="12" fill="rgba(37, 99, 235, 0.04)" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="7%" y="16%" fill="#60a5fa" fontSize="11" fontWeight="bold" opacity="0.7">Ward 1 - Indiranagar Geofence</text>

          <rect x="48%" y="10%" width="45%" height="38%" rx="12" fill="rgba(16, 185, 129, 0.04)" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="50%" y="16%" fill="#34d399" fontSize="11" fontWeight="bold" opacity="0.7">Ward 4 - HSR Layout Geofence</text>

          <rect x="5%" y="52%" width="40%" height="40%" rx="12" fill="rgba(168, 85, 247, 0.04)" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="7%" y="58%" fill="#c084fc" fontSize="11" fontWeight="bold" opacity="0.7">Ward 2 - Koramangala Geofence</text>
        </svg>

        {/* Selected Pin Marker if clicked */}
        {pinnedCoords && (
          <div 
            className="absolute z-30 transition-all duration-200 transform -translate-x-1/2 -translate-y-full pointer-events-none"
            style={getMapPosition(pinnedCoords.lat, pinnedCoords.lng)}
          >
            <div className="flex flex-col items-center animate-bounce">
              <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg shadow-blue-500/50 ring-4 ring-blue-400/30">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="bg-slate-900/90 text-blue-300 border border-blue-500/40 text-[10px] font-mono px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                {pinnedCoords.lat}, {pinnedCoords.lng}
              </span>
            </div>
          </div>
        )}

        {/* Existing Grievance Pins on Map */}
        {grievances.map((g) => {
          const pos = getMapPosition(g.lat, g.lng);
          const isClosed = g.status === 'CLOSED';
          const isBlocked = g.status === 'BLOCKED';
          const isSubmitted = g.status === 'RESOLUTION_SUBMITTED';

          return (
            <div
              key={g.id}
              onClick={(e) => {
                e.stopPropagation();
                setActivePin(activePin === g.id ? null : g.id);
                if (onSelectGrievance) onSelectGrievance(g);
              }}
              style={pos}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
            >
              <div className="relative">
                {/* Ping animation for active open issues */}
                {!isClosed && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isBlocked ? 'bg-red-400' : isSubmitted ? 'bg-purple-400' : 'bg-amber-400'
                  }`}></span>
                )}
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 transition-transform duration-200 group-hover/pin:scale-125 ${
                  isClosed
                    ? 'bg-emerald-600 border-emerald-300'
                    : isBlocked
                    ? 'bg-red-600 border-red-300'
                    : isSubmitted
                    ? 'bg-purple-600 border-purple-300'
                    : 'bg-amber-500 border-amber-200'
                }`}>
                  {isClosed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isBlocked ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                </div>

                {/* Tooltip on Hover or Click */}
                {(activePin === g.id || true) && (
                  <div className="hidden group-hover/pin:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-900/95 border border-slate-700 text-slate-100 p-2.5 rounded-xl shadow-2xl z-40 text-xs pointer-events-none">
                    <p className="font-bold text-blue-300 truncate">{g.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{g.id} • {g.wardName}</p>
                    <div className="mt-1.5 flex justify-between items-center text-[10px]">
                      <span className="text-slate-300">Integrity:</span>
                      <span className="font-bold text-emerald-400">{g.integrityScore}/100</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Header Overlay Controls */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Interactive Geofence Map</span>
        </div>
        {interactive && (
          <button
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/30 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting GPS...' : 'Detect My Live Location'}</span>
          </button>
        )}
      </div>

      {/* Map Legend Footer Overlay */}
      <div className="absolute bottom-3 right-3 z-30 bg-slate-900/90 backdrop-blur-md border border-slate-800 text-slate-300 p-2 rounded-xl text-[11px] flex items-center gap-3 shadow-md">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Open Grievance
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Verification Pending
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved & Closed
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Resolution Blocked
        </span>
      </div>
    </div>
  );
}
