import React, { useState } from 'react';
import { Map, AlertTriangle, Search, CheckCircle2, ThumbsUp, MapPin } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';

export default function DuplicateRadar({ grievances, setSelectedGrievanceId, setCurrentTab }) {
  const [selectedWard, setSelectedWard] = useState('ALL');

  const filtered = grievances.filter(g => {
    if (selectedWard !== 'ALL' && g.wardId !== selectedWard) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
            <Map className="w-3.5 h-3.5" /> Duplicate Incident Radar
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Spatial Duplicate Detection Radar
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Real-time cluster mapping prevents redundant officer dispatching by automatically grouping civic complaints reported within 200 meters.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('file-complaint')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20"
        >
          + File New Grievance
        </button>
      </div>

      {/* Map View */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" /> City Geofence Cluster Map
        </h3>
        <InteractiveMap
          grievances={filtered}
          onSelectGrievance={(g) => {
            setSelectedGrievanceId(g.id);
            setCurrentTab('evidence-checker');
          }}
          height="h-96"
        />
      </div>

      {/* Active Incident List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(g => (
          <div key={g.id} className="glass-card p-4 rounded-xl border border-slate-800 space-y-2 flex justify-between items-center">
            <div>
              <span className="font-mono text-xs text-blue-400 font-bold">{g.id}</span>
              <h4 className="font-bold text-slate-200 text-xs">{g.title}</h4>
              <p className="text-[11px] text-slate-400">{g.locationText}</p>
            </div>
            
            <button
              onClick={() => alert(`Upvoted report ${g.id}! Duplicate counter incremented.`)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold whitespace-nowrap flex items-center gap-1.5"
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Upvote ({g.duplicateCount || 1})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
