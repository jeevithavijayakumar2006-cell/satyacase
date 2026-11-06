import React from 'react';
import { BarChart3, ShieldCheck, TrendingUp, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';
import { INITIAL_WARDS } from '../data/mockData';

export default function WardAnalytics({ grievances }) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Municipal Ward Scorecards
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ward Integrity & SLA Performance
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Live administrative ward integrity scores, SLA compliance metrics, and officer resolution efficiency rankings.
          </p>
        </div>
      </div>

      {/* Ward Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INITIAL_WARDS.map((ward) => (
          <div key={ward.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-400">{ward.id}</span>
                <h3 className="font-bold text-slate-100 text-base">{ward.name}</h3>
                <p className="text-[11px] text-slate-400">{ward.zone}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Integrity Score</span>
                <span className="font-black text-emerald-400 text-lg">{ward.integrityScore}/100</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Assigned Officer:</span>
                <strong className="text-slate-200">{ward.officer}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SLA Compliance Rate:</span>
                <strong className="text-emerald-400">{ward.slaCompliance}%</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Active Grievances:</span>
                <strong className="text-amber-400">{ward.openCount} Open</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Resolved & Closed:</span>
                <strong className="text-blue-400">{ward.resolvedCount} Closed</strong>
              </div>
            </div>

            {/* Score progress bar */}
            <div className="pt-2 border-t border-slate-800">
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${ward.integrityScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
