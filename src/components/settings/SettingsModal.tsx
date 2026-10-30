'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  HardDrive, 
  Cpu, 
  Trash2, 
  Check, 
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { HardwareProfile, SensitivityLevel } from '@/types';
import { 
  getUserPreferences, 
  saveUserPreferences, 
  UserPreferences 
} from '@/lib/storage';
import { getOllamaEndpoint, setOllamaEndpoint } from '@/lib/ollamaClient';

interface SettingsModalProps {
  hardware: HardwareProfile;
  onResetHardware: () => void;
  onRefreshOllama: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  hardware,
  onResetHardware,
  onRefreshOllama,
}) => {
  const [prefs, setPrefs] = useState<UserPreferences>(getUserPreferences());
  const [endpointInput, setEndpointInput] = useState(getOllamaEndpoint());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setPrefs(getUserPreferences());
    setEndpointInput(getOllamaEndpoint());
  }, []);

  const handleSave = () => {
    setOllamaEndpoint(endpointInput);
    saveUserPreferences(prefs);
    onRefreshOllama();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearAllData = () => {
    if (typeof window !== 'undefined' && confirm('Are you sure you want to clear all locally cached sessions and audit logs?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
          <SettingsIcon size={13} className="text-slate-600" />
          <span>System Configurations & Environment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#717784] max-w-xl leading-relaxed">
          Manage local runtime endpoints, default governance gates, and device hardware overrides.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-6">
        {/* Ollama Local Endpoint */}
        <div className="space-y-2 pb-5 border-b border-[#F1F4F8]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111318] flex items-center gap-2">
              <HardDrive size={15} className="text-teal-600" />
              Local Ollama API Endpoint
            </span>
            <span className="text-[11px] text-[#717784]">Default: http://localhost:11434</span>
          </div>
          <p className="text-xs text-[#717784]">
            Specify the network URL where your local Ollama inference service is listening.
          </p>
          <input
            type="text"
            value={endpointInput}
            onChange={(e) => setEndpointInput(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] text-xs font-mono font-medium text-[#111318] focus:bg-white focus:outline-hidden focus:border-[#0D9488]"
          />
        </div>

        {/* Default Data Sensitivity Policy */}
        <div className="space-y-2 pb-5 border-b border-[#F1F4F8]">
          <span className="text-xs font-bold text-[#111318] flex items-center gap-2">
            <ShieldCheck size={15} className="text-teal-600" />
            Default Data Sensitivity Policy
          </span>
          <p className="text-xs text-[#717784]">
            New workloads will default to this classification unless specified otherwise.
          </p>
          <select
            value={prefs.defaultSensitivity}
            onChange={(e) => setPrefs({ ...prefs, defaultSensitivity: e.target.value as SensitivityLevel })}
            className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] text-xs font-semibold text-[#111318]"
          >
            <option value="PUBLIC">PUBLIC — Open domain</option>
            <option value="INTERNAL">INTERNAL — Company approved</option>
            <option value="CONFIDENTIAL">CONFIDENTIAL — Local only</option>
            <option value="HIGHLY_SENSITIVE">HIGHLY SENSITIVE — Air-gapped only</option>
          </select>
        </div>

        {/* Device Profile Actions */}
        <div className="space-y-2 pb-5 border-b border-[#F1F4F8]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111318] flex items-center gap-2">
              <Cpu size={15} className="text-teal-600" />
              Hardware Detection Cache
            </span>
            <button
              onClick={onResetHardware}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F1F4F8] hover:bg-slate-200 text-[#475569] flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              Re-Detect Browser Hardware
            </button>
          </div>
          <p className="text-xs text-[#717784]">
            Currently using: <strong className="text-slate-800">{hardware.os}</strong> with <strong className="text-slate-800">{hardware.ramGB} GB RAM</strong>.
          </p>
        </div>

        {/* Clear Data */}
        <div className="space-y-2 pb-2">
          <span className="text-xs font-bold text-red-600 flex items-center gap-2">
            <Trash2 size={15} />
            Data & Privacy Reset
          </span>
          <p className="text-xs text-[#717784]">
            Purge all conversations, recent routing records, and custom settings stored in browser storage.
          </p>
          <button
            onClick={handleClearAllData}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
          >
            Clear Browser Storage
          </button>
        </div>

        {/* Save Settings Button */}
        <div className="pt-3 border-t border-[#F1F4F8] flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <Check size={14} /> Preferences Saved!
            </span>
          ) : (
            <span />
          )}

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-2xs"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
