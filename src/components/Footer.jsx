import React from 'react';
import { ShieldCheck, Lock, Cpu, Globe } from 'lucide-react';

export default function Footer({ setCurrentTab }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center gap-2 text-slate-200 font-bold text-sm mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            SatyaCase Evidence Integrity System
          </div>
          <p className="text-slate-400 leading-relaxed">
            Tamper-evident, zero-trust civic grievance evidence pipeline with automated SLA countdowns, duplicate detection radar, and cryptographic Closure Integrity Gates.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-2 uppercase text-[11px] tracking-wider">Integrity Standards</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> SHA-256 Merkle Ledger
            </li>
            <li className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" /> EXIF Hardware Telemetry
            </li>
            <li className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-400" /> Geofenced 150m Resolution Gate
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-2 uppercase text-[11px] tracking-wider">Quick Navigation</h4>
          <div className="space-y-1.5">
            <button onClick={() => setCurrentTab('dashboard')} className="block hover:text-blue-400 text-left">Citizen Dashboard</button>
            <button onClick={() => setCurrentTab('file-complaint')} className="block hover:text-blue-400 text-left">File New Grievance</button>
            <button onClick={() => setCurrentTab('closure-gate')} className="block hover:text-blue-400 text-left">Officer Closure Gate</button>
            <button onClick={() => setCurrentTab('audit-trail')} className="block hover:text-blue-400 text-left">Audit Ledger</button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-2 uppercase text-[11px] tracking-wider">Prototype Status</h4>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Fully Functional Client Prototype
            </div>
            <p className="text-[11px] text-slate-500">
              Interactive mock data active. All verification algorithms, duplicate radar, and gate states working.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-slate-900 text-center text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© 2026 SatyaCase System • Civic Grievance Evidence Integrity Protocol.</p>
        <p className="font-mono text-[10px]">HASH: 0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b</p>
      </div>
    </footer>
  );
}
