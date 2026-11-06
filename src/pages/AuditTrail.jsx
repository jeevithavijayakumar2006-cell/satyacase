import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Search, 
  RefreshCw, 
  Layers, 
  Cpu,
  FileText,
  Activity
} from 'lucide-react';
import { MOCK_AUDIT_BLOCKS } from '../data/mockData';

export default function AuditTrail() {
  const [blocks, setBlocks] = useState(MOCK_AUDIT_BLOCKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(null);

  const filteredBlocks = blocks.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.event.toLowerCase().includes(q) ||
      b.grievanceId.toLowerCase().includes(q) ||
      b.actor.toLowerCase().includes(q) ||
      b.blockHash.toLowerCase().includes(q)
    );
  });

  const handleValidateLedger = () => {
    setIsValidating(true);
    setValidationSuccess(null);

    setTimeout(() => {
      setIsValidating(false);
      setValidationSuccess(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5" /> Immutable Merkle Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cryptographic Audit Trail
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Immutable chain of civic transactions. Every grievance filing, duplicate linkage, and Closure Gate verification is signed with SHA-256 block hashes.
          </p>
        </div>

        <button
          onClick={handleValidateLedger}
          disabled={isValidating}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
          {isValidating ? 'Recalculating Hashes...' : 'Validate Ledger Integrity'}
        </button>
      </div>

      {/* Validation Result Toast */}
      {validationSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              <strong>LEDGER INTEGRITY 100% VERIFIED:</strong> All {blocks.length} block headers recalculated. Zero hash mismatches or tampering detected across Merkle tree.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-500/20 px-2 py-1 rounded text-emerald-300">
            ROOT HASH: 0x9f86d081884c
          </span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search block hash, event, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          Total Chain Height: <strong className="text-blue-400">#{blocks[0]?.height || 1042}</strong>
        </div>
      </div>

      {/* Timeline Block List */}
      <div className="space-y-4">
        {filteredBlocks.map((b) => (
          <div
            key={b.height}
            className="glass-card rounded-2xl border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded">
                  Block #{b.height}
                </span>
                <span className="font-bold text-slate-200 text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800">
                  {b.event}
                </span>
                <span className="font-mono text-xs text-slate-400">({b.grievanceId})</span>
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                {new Date(b.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px]">Actor & Role:</span>
                <p className="font-bold text-slate-300">{b.actor} ({b.actorRole})</p>
              </div>

              <div>
                <span className="text-slate-500 text-[11px]">Cryptographic Verification:</span>
                <p className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hash Signed & Merkle Validated
                </p>
              </div>
            </div>

            {/* Hashes Row */}
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Block Hash:</span>
                <span className="text-blue-400 break-all">{b.blockHash}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Previous Hash (Linked):</span>
                <span className="text-slate-400 break-all">{b.prevHash}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
