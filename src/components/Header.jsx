import React from 'react';
import { 
  ShieldCheck, 
  User, 
  ShieldAlert, 
  Map, 
  Search, 
  FileText, 
  Activity, 
  Database, 
  CheckCircle2,
  Lock,
  Layers,
  BarChart3
} from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  roleMode, 
  setRoleMode, 
  grievancesCount = 0,
  auditBlockHeight = 1042 
}) {
  const citizenTabs = [
    { id: 'dashboard', label: 'Grievance Dashboard', icon: Activity },
    { id: 'file-complaint', label: '+ File Grievance', icon: FileText, highlight: true },
    { id: 'duplicate-radar', label: 'Duplicate Radar & Map', icon: Map },
    { id: 'evidence-checker', label: 'Packet Inspector', icon: Search },
    { id: 'audit-trail', label: 'Audit Trail Ledger', icon: Database },
  ];

  const officerTabs = [
    { id: 'officer-dashboard', label: 'Officer Workload Queue', icon: ShieldAlert },
    { id: 'closure-gate', label: 'Closure Integrity Gate', icon: Lock, alert: true },
    { id: 'duplicate-radar', label: 'Ward Duplicate Map', icon: Map },
    { id: 'evidence-checker', label: 'Packet Inspector', icon: Search },
    { id: 'ward-analytics', label: 'Ward Integrity Metrics', icon: BarChart3 },
    { id: 'audit-trail', label: 'Audit Trail Ledger', icon: Database },
  ];

  const activeTabs = roleMode === 'CITIZEN' ? citizenTabs : officerTabs;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Banner - System Integrity Status */}
      <div className="bg-slate-900/80 border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Merkle Ledger Live
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline font-mono text-slate-400">
            Block Height: <span className="text-blue-400">#{auditBlockHeight}</span>
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Zero-Knowledge SHA-256 Verification Enabled
          </span>
        </div>

        {/* Role Mode Switcher (Citizen vs Officer) */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider hidden sm:inline">
            Active Role:
          </span>
          <div className="bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80 flex items-center">
            <button
              onClick={() => {
                setRoleMode('CITIZEN');
                if (!citizenTabs.some(t => t.id === currentTab)) {
                  setCurrentTab('dashboard');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                roleMode === 'CITIZEN'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Citizen Portal
            </button>
            <button
              onClick={() => {
                setRoleMode('OFFICER');
                if (!officerTabs.some(t => t.id === currentTab)) {
                  setCurrentTab('officer-dashboard');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                roleMode === 'OFFICER'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Officer Interface
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab(roleMode === 'CITIZEN' ? 'dashboard' : 'officer-dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">SatyaCase</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Integrity v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Civic Grievance Evidence Integrity System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {activeTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? tab.highlight
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-800 text-blue-400 border border-slate-700'
                      : tab.highlight
                      ? 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-current' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.alert && (
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden border-t border-slate-800 px-2 py-2 overflow-x-auto flex gap-1 scrollbar-none">
        {activeTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
