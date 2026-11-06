import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Lock, 
  MapPin, 
  Search, 
  User, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { getSlaRemainingTime, getStatusTheme } from '../utils/slaUtils';

export default function OfficerDashboard({ grievances, setCurrentTab, setSelectedGrievanceId }) {
  const [wardFilter, setWardFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = grievances.filter(g => {
    if (wardFilter !== 'ALL' && g.wardId !== wardFilter) return false;
    if (statusFilter !== 'ALL' && g.status !== statusFilter) return false;
    return true;
  });

  const pendingVerification = grievances.filter(g => g.status === 'RESOLUTION_SUBMITTED');
  const openCount = grievances.filter(g => g.status === 'IN_PROGRESS' || g.status === 'RESOLUTION_SUBMITTED').length;
  const blockedCount = grievances.filter(g => g.status === 'BLOCKED').length;

  return (
    <div className="space-y-6">
      {/* Officer Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Municipal Officer Command Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ward Grievance Workload Queue
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Review assigned ward complaints, monitor live SLA countdown timers, and submit resolution evidence to the Closure Gate.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('closure-gate')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all"
        >
          <Lock className="w-4 h-4" /> Open Closure Integrity Gate
        </button>
      </div>

      {/* SLA Priority Warning Bar if pending resolution */}
      {pendingVerification.length > 0 && (
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-purple-400 flex-shrink-0 animate-pulse" />
            <div>
              <span className="font-bold text-purple-300 text-sm">
                {pendingVerification.length} Resolution(s) Awaiting Gate Audit!
              </span>
              <p className="text-purple-200/80 text-[11px] mt-0.5">
                Resolution proof has been submitted. Perform Closure Gate verification to approve closure.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedGrievanceId(pendingVerification[0].id);
              setCurrentTab('closure-gate');
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow whitespace-nowrap"
          >
            Audit Pending Case ({pendingVerification[0].id})
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Ward Filter:
          </span>
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Wards (City Wide)</option>
            <option value="W01">Ward 1 - Indiranagar</option>
            <option value="W02">Ward 2 - Koramangala</option>
            <option value="W04">Ward 4 - HSR Layout</option>
          </select>

          <span className="text-slate-400 font-semibold ml-2">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">Under Investigation</option>
            <option value="RESOLUTION_SUBMITTED">Verification Pending</option>
            <option value="BLOCKED">Resolution Blocked</option>
            <option value="CLOSED">Resolved & Closed</option>
          </select>
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-white">{filtered.length}</strong> assigned cases
        </div>
      </div>

      {/* Officer Workload Queue Table / Cards */}
      <div className="space-y-4">
        {filtered.map((g) => {
          const theme = getStatusTheme(g.status);
          const sla = getSlaRemainingTime(g.slaExpiresAt);

          return (
            <div
              key={g.id}
              className="glass-card rounded-2xl border border-slate-800 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded">
                    {g.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${theme.bg} ${theme.text} ${theme.border}`}>
                    {theme.label}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold bg-slate-800/60 px-2 py-0.5 rounded">
                    {g.wardName}
                  </span>
                </div>

                <h3 className="font-bold text-slate-100 text-base">{g.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {g.locationText}
                </p>
              </div>

              {/* SLA & Action Column */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 min-w-[170px]">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    SLA Countdown
                  </span>
                  <span className={`font-mono text-xs font-bold ${sla.isBreached ? 'text-red-400' : 'text-amber-400'}`}>
                    {sla.formattedStr}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedGrievanceId(g.id);
                      setCurrentTab('closure-gate');
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Lock className="w-3.5 h-3.5" /> Gate Audit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedGrievanceId(g.id);
                      setCurrentTab('evidence-checker');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
