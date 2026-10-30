'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Layers, 
  FileText, 
  Trash2, 
  Download,
  Filter
} from 'lucide-react';
import { SensitivityLevel, AuditRecord } from '@/types';
import { 
  getAuditLogs, 
  saveAuditLog, 
  getUserPreferences, 
  saveUserPreferences, 
  UserPreferences 
} from '@/lib/storage';
import { ONLINE_PROVIDERS } from '@/data/providersData';

export const SovereigntyCenter: React.FC = () => {
  const [logs, setLogs] = useState<AuditRecord[]>([]);
  const [prefs, setPrefs] = useState<UserPreferences>(getUserPreferences());
  const [selectedSensitivityFilter, setSelectedSensitivityFilter] = useState<string>('All');

  useEffect(() => {
    setLogs(getAuditLogs());
    setPrefs(getUserPreferences());
  }, []);

  const handleToggleLocalOnly = () => {
    const updated: UserPreferences = {
      ...prefs,
      localOnlyMode: !prefs.localOnlyMode,
      allowCloudProviders: prefs.localOnlyMode, // inverse
    };
    setPrefs(updated);
    saveUserPreferences(updated);
  };

  const handleToggleProviderBlock = (providerId: string) => {
    const isBlocked = prefs.blockedProviders.includes(providerId);
    const updatedBlocked = isBlocked
      ? prefs.blockedProviders.filter((p) => p !== providerId)
      : [...prefs.blockedProviders, providerId];

    const updated: UserPreferences = {
      ...prefs,
      blockedProviders: updatedBlocked,
    };
    setPrefs(updated);
    saveUserPreferences(updated);
  };

  const handleClearAuditLogs = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aquaroute_audit_records');
      setLogs([]);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (selectedSensitivityFilter === 'All') return true;
    return log.sensitivity === selectedSensitivityFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>Governance & Air-Gap Perimeter Controls</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
          Sovereignty Center
        </h1>
        <p className="text-xs sm:text-sm text-[#717784] max-w-2xl leading-relaxed">
          Enforce immutable privacy gates, manage enterprise allowlists, and inspect cryptographic execution records. Models can never override your data policy.
        </p>
      </div>

      {/* Grid: Master Mode Switch & Provider Gate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy Gate Configuration */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F8]">
            <div>
              <h2 className="text-sm font-bold text-[#111318]">Data Sovereignty Gateways</h2>
              <p className="text-xs text-[#717784]">Enforce strict air-gap compliance</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              prefs.localOnlyMode ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {prefs.localOnlyMode ? 'AIR-GAPPED LOCAL' : 'HYBRID PERMITTED'}
            </span>
          </div>

          {/* Master Air-Gap Toggle */}
          <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0] flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <span className="text-xs font-bold text-[#111318] block">
                Strict Local-Only Air-Gap Mode
              </span>
              <p className="text-[11px] text-[#717784] leading-relaxed">
                Blocks all external cloud API egress across the entire application. All tasks force local or on-prem execution.
              </p>
            </div>

            <button
              onClick={handleToggleLocalOnly}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                prefs.localOnlyMode ? 'bg-[#0D9488]' : 'bg-slate-300'
              }`}
              aria-label="Toggle Air Gap Mode"
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  prefs.localOnlyMode ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Data Sensitivity Tier Definitions */}
          <div className="space-y-2 text-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717784] block">
              Sovereignty Classification Matrix
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">PUBLIC</span>
                <span className="text-[11px] text-[#717784]">Cloud & local permitted without restriction.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                <span className="font-bold text-blue-900 block">INTERNAL</span>
                <span className="text-[11px] text-blue-800">Approved cloud providers or local execution.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-950 block">CONFIDENTIAL</span>
                <span className="text-[11px] text-amber-800">Strict local/on-premise only. Cloud blocked.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
                <span className="font-bold text-red-950 block">HIGHLY SENSITIVE</span>
                <span className="text-[11px] text-red-800">100% Air-gapped local memory execution.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Provider Allowlist / Blocklist */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F8]">
            <div>
              <h2 className="text-sm font-bold text-[#111318]">External Provider Governance</h2>
              <p className="text-xs text-[#717784]">Manage approved third-party AI destinations</p>
            </div>
          </div>

          <div className="space-y-2">
            {ONLINE_PROVIDERS.map((provider) => {
              const isBlocked = prefs.blockedProviders.includes(provider.id);

              return (
                <div
                  key={provider.id}
                  className="p-3 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#111318]">{provider.name}</span>
                    <span className="text-[11px] text-[#717784] block mt-0.5">{provider.product}</span>
                  </div>

                  <button
                    onClick={() => handleToggleProviderBlock(provider.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isBlocked
                        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {isBlocked ? 'Blocked' : 'Approved'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Immutable Audit Trail */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#F1F4F8]">
          <div>
            <h2 className="text-sm font-bold text-[#111318]">Immutable Routing Audit Logs</h2>
            <p className="text-xs text-[#717784]">Cryptographic record of policy decisions (Zero confidential prompt leakage)</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter by Sensitivity */}
            <select
              value={selectedSensitivityFilter}
              onChange={(e) => setSelectedSensitivityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] text-xs font-semibold text-[#111318]"
            >
              <option value="All">All Tiers</option>
              <option value="PUBLIC">PUBLIC</option>
              <option value="INTERNAL">INTERNAL</option>
              <option value="CONFIDENTIAL">CONFIDENTIAL</option>
              <option value="HIGHLY_SENSITIVE">HIGHLY SENSITIVE</option>
            </select>

            <button
              onClick={handleClearAuditLogs}
              className="p-1.5 rounded-xl text-[#717784] hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Clear Local Audit Logs"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#334155] border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#717784]">
                <th className="py-2.5 font-semibold">Request ID</th>
                <th className="py-2.5 font-semibold">Sensitivity</th>
                <th className="py-2.5 font-semibold">Selected Model</th>
                <th className="py-2.5 font-semibold">Execution Location</th>
                <th className="py-2.5 font-semibold">Decision Reason</th>
                <th className="py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F4F8]">
              {filteredLogs.map((log) => (
                <tr key={log.requestId} className="hover:bg-[#F8F9FB]">
                  <td className="py-3 font-mono text-[11px] text-[#717784]">{log.requestId}</td>
                  <td className="py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      log.sensitivity === 'CONFIDENTIAL' || log.sensitivity === 'HIGHLY_SENSITIVE'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {log.sensitivity}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-900">{log.selectedModel}</td>
                  <td className="py-3 font-medium text-slate-700">{log.executionLocation}</td>
                  <td className="py-3 text-[11px] text-[#475569] max-w-xs truncate" title={log.decisionReason}>
                    {log.decisionReason}
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {log.executionStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
