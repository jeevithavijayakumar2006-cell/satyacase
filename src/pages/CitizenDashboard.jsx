import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  FileText, 
  Search, 
  ChevronRight, 
  TrendingUp, 
  Zap, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { getSlaRemainingTime, getStatusTheme } from '../utils/slaUtils';

export default function CitizenDashboard({ grievances, setCurrentTab, setSelectedGrievanceId }) {
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGrievances = grievances.filter(g => {
    if (filter === 'ACTIVE' && (g.status === 'CLOSED' || g.status === 'APPROVED')) return false;
    if (filter === 'RESOLVED' && (g.status !== 'CLOSED' && g.status !== 'APPROVED')) return false;
    if (filter === 'BLOCKED' && g.status !== 'BLOCKED') return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        g.title.toLowerCase().includes(q) ||
        g.id.toLowerCase().includes(q) ||
        g.wardName.toLowerCase().includes(q) ||
        g.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCount = grievances.length;
  const activeCount = grievances.filter(g => g.status !== 'CLOSED' && g.status !== 'APPROVED').length;
  const resolvedCount = grievances.filter(g => g.status === 'CLOSED' || g.status === 'APPROVED').length;
  const blockedCount = grievances.filter(g => g.status === 'BLOCKED').length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Quick Action Bar */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-slate-800">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Citizen Grievance Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Evidence-Backed Civic Transparency
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-2xl">
              File civic issues with cryptographic evidence verification. Every report is EXIF-geotagged, hashed on an immutable ledger, and guarded by automated SLA countdowns.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('file-complaint')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <FileText className="w-4 h-4" />
            File New Evidence Complaint
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Grievances</p>
            <p className="text-2xl font-black text-white mt-1">{totalCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Recorded in system</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Under Investigation</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{activeCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Active SLA countdown</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Verified & Resolved</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{resolvedCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Gate Passed & Closed</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resolution Blocked</p>
            <p className="text-2xl font-black text-red-400 mt-1">{blockedCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Integrity Audit Failed</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
            <Lock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['ALL', 'ACTIVE', 'RESOLVED', 'BLOCKED'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filter === type
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {type === 'ALL' && 'All Grievances'}
              {type === 'ACTIVE' && 'Active SLA'}
              {type === 'RESOLVED' && 'Verified Closed'}
              {type === 'BLOCKED' && 'Blocked Evidence'}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Ward, Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Grievance Cards Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGrievances.map((g) => {
          const theme = getStatusTheme(g.status);
          const sla = getSlaRemainingTime(g.slaExpiresAt);

          return (
            <div
              key={g.id}
              className="glass-card rounded-2xl border border-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-xl group"
            >
              <div>
                {/* Header Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                    {g.id}
                  </span>
                  <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${theme.bg} ${theme.text} ${theme.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.dotBg}`}></span>
                    {theme.label}
                  </div>
                </div>

                {/* Grievance Title */}
                <h3 className="font-bold text-slate-100 text-sm line-clamp-2 group-hover:text-blue-300 transition-colors">
                  {g.title}
                </h3>

                {/* Location & Category */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{g.locationText}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Category: <strong className="text-slate-300">{g.categoryName}</strong></span>
                    <span>Ward: <strong className="text-slate-300">{g.wardName}</strong></span>
                  </div>
                </div>

                {/* SLA Countdown Timer */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> SLA Target:
                    </span>
                    <span className={`font-mono font-bold text-xs ${sla.isBreached ? 'text-red-400' : 'text-amber-400'}`}>
                      {sla.formattedStr}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        sla.isBreached ? 'bg-red-500' : sla.percentRemaining < 25 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${sla.isBreached ? 100 : sla.percentRemaining}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Integrity Score & Inspect Action */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Integrity Score</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-emerald-400">{g.integrityScore}/100</span>
                    <span className="text-[10px] text-slate-400">Verified EXIF</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedGrievanceId(g.id);
                      setCurrentTab('evidence-checker');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5 text-blue-400" />
                    Inspect Packet
                  </button>

                  {g.status === 'RESOLUTION_SUBMITTED' && (
                    <button
                      onClick={() => {
                        setSelectedGrievanceId(g.id);
                        setCurrentTab('closure-gate');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow"
                    >
                      Gate Audit
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
